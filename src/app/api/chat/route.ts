import Anthropic from "@anthropic-ai/sdk";
import { achievements, experience, extraChatContext, profile, projects, sideQuests, socials } from "@/data/profile";

const client = new Anthropic();

const name = `${profile.firstName} ${profile.lastName}`;

const SYSTEM_PROMPT = `You are ${name}'s personal assistant on their adventure-themed portfolio website.
Answer visitors' questions about ${profile.firstName}'s background, projects, and experience.
Keep answers short (2–4 sentences), warm, and conversational — this is a chat bubble, so no markdown headings or long lists.
A light touch of adventure flavour is welcome, but clarity comes first.
If you don't know something, say so and suggest emailing ${profile.email} — never make things up.

About: ${profile.bio.map((b) => b.text).join("")}
Education: ${profile.education.replace("🎓 ", "")}
Hobbies: ${profile.hobbies.join(", ")}
Skills: ${profile.skills.join(", ")}

Experience (oldest to newest):
${experience.map((e) => `- ${e.role} at ${e.company} (${e.start} – ${e.end}): ${e.description} [${e.tags.join(", ")}]`).join("\n")}

Projects:
${projects.map((p) => `- ${p.name}: ${p.description} [${p.tags.join(", ")}]${p.link ? ` ${p.link}` : ""}`).join("\n")}
${sideQuests.map((p) => `- ${p.name} (side project): ${p.description}`).join("\n")}

Achievements:
${achievements.map((a) => `- ${a.rank}: ${a.title}`).join("\n")}

Contact: ${profile.email}
${Object.entries(socials)
  .filter(([k, v]) => v && k !== "email")
  .map(([k, v]) => `${k}: ${v}`)
  .join("\n")}
${extraChatContext}`;

// Simple in-memory rate limiter — resets when the server restarts
const requestCounts = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (record.count >= 20) return false;
  record.count++;
  return true;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("The chat assistant isn't configured yet.", { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return new Response("Rate limit exceeded", { status: 429 });
  }

  const { messages } = (await req.json()) as { messages: Anthropic.MessageParam[] };
  // only accept plain text turns, and cap the history we forward
  const history = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-20)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));

  const stream = client.beta.messages.stream({
    model: "claude-opus-5",
    max_tokens: 1024,
    output_config: { effort: "low" },
    system: SYSTEM_PROMPT,
    messages: history,
    // If Opus declines on policy grounds, the API retries on a fallback model in the same call
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
          }
        }
      } catch (err) {
        console.error("chat stream failed", err);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: "\n\n(The campfire flickered out — please try again.)" })}\n\n`));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}
