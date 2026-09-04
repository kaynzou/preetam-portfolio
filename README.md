# Preetam Kumar — Portfolio

Adventure-themed portfolio: night-sky hero with a WebGL-style paint-reveal
profile photo, a "character sheet" about section, a learning-journey
timeline, projects, and a floating AI chatbot that can answer questions in
your own cloned voice.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion ·
Canvas2D (stars + photo reveal) · Anthropic Claude API · ElevenLabs

## 1. Install

```bash
npm install
```

## 2. Add your API keys

```bash
cp .env.local.example .env.local
```

Then fill in `.env.local`:

- `ANTHROPIC_API_KEY` — from console.anthropic.com → API Keys. **You don't
  have this yet** — the chatbot's text replies won't work until you add one.
  Has a free trial.
- `ELEVENLABS_API_KEY` — from elevenlabs.io → profile icon (top right) → API
  Keys. You already have this.
- `ELEVENLABS_VOICE_ID` — clone your voice first: ElevenLabs → Voices → Add
  a new voice → Voice Clone → upload 2–3+ minutes of clean audio of yourself
  talking → once created, open its settings and copy the Voice ID.

Never commit `.env.local` — it's already gitignored.

## 3. Run it locally

```bash
npm run dev
```

Open http://localhost:3000.

## 4. Edit your content

Everything personal — your name, bio, skills, journey stops, projects,
achievements, and social links — lives in **`lib/content.ts`**. Edit that
one file; no component code needs to change.

Things worth filling in there:
- `profile.title` — pick something you like, currently a placeholder
- `journey` — add real dates once you have them
- `achievements` — currently empty; add entries once you have some
- `connect.resumeUrl` / `youtube` / `x` / `instagram` — add if/when you have
  them; empty ones are hidden automatically

## 5. Swap or update your photos

Your two photos are at `public/images/me-base.jpg` (normal photo) and
`public/images/me-alt.jpg` (the AI-generated adventure version). Hover over
the photo in the About section to see the paint-reveal effect blend between
them. Replace either file (same filename) to update — same aspect ratio
works best.

## 6. Deploy

Easiest option is Vercel (free for personal projects):

```bash
npm install -g vercel
vercel
```

Add the same three environment variables in the Vercel project settings
before deploying, or the chatbot/voice features won't work in production.

## Notes on implementation choices

- The star field and the photo paint-reveal effect are built with Canvas2D
  rather than raw WebGL shaders. Same visual result (twinkling stars,
  shooting-star trails, mouse-driven reveal with idle demo animation), just
  a more robust implementation to hand off untested.
- The chatbot caps sessions at 10 user messages and rate-limits the API
  route to 20 requests/hour per IP to protect your API budget.
