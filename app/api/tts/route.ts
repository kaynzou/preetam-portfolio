export async function POST(req: Request) {
  const { text } = await req.json();

  if (!process.env.ELEVENLABS_API_KEY || !process.env.ELEVENLABS_VOICE_ID) {
    return new Response("ElevenLabs is not configured", { status: 500 });
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    return new Response("ElevenLabs request failed", { status: response.status });
  }

  const audioBuffer = await response.arrayBuffer();
  return new Response(audioBuffer, { headers: { "Content-Type": "audio/mpeg" } });
}
