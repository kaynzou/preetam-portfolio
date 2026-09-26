const configured = () => Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID);

// Lets the chat widget know whether to show the voice toggle
export async function GET() {
  return Response.json({ enabled: configured() });
}

export async function POST(req: Request) {
  if (!configured()) return new Response("Voice isn't configured.", { status: 503 });

  const { text } = (await req.json()) as { text: string };
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: String(text).slice(0, 1000),
      model_id: "eleven_turbo_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!response.ok) return new Response("Voice generation failed.", { status: 502 });
  return new Response(await response.arrayBuffer(), { headers: { "Content-Type": "audio/mpeg" } });
}
