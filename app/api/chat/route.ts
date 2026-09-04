import Anthropic from "@anthropic-ai/sdk";
import { chatbotSystemPrompt } from "@/lib/content";

const client = new Anthropic();

// Simple in-memory rate limiter — resets when the server restarts.
// Fine for a personal portfolio; swap for Redis/Upstash if you deploy at scale.
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1hr window
    return true;
  }
  if (record.count >= 20) return false; // max 20 requests per IP per hour
  record.count++;
  return true;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return new Response("Rate limit exceeded", { status: 429 });
  }

  const { messages } = await req.json();

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: chatbotSystemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
          );
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}
