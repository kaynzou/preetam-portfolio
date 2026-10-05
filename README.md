# Preetam's Portfolio

An adventure-themed portfolio: a WebGL night sky with shooting stars and a campfire, a character-sheet "About" card with a paint-reveal portrait, a treasure-map experience timeline with a scroll-driven ship, a quest-log of projects, and an AI chatbot that answers questions about me.

Built with Next.js, TypeScript, Tailwind CSS v4, Framer Motion, raw WebGL and the Claude API.

## Editing content

Everything personal lives in **`src/data/profile.ts`**: name, bio, skills, achievements, experience, projects, and links. Edit it and the whole site (including the chatbot's knowledge) updates.

Images go in `public/`:

- `me.jpg` — portrait photo (4:5, e.g. 600×750)
- `me-alt.jpg` — optional alternate "fantasy" version with the same framing, revealed on hover. Without it, a golden-hour stylised version is generated automatically.
- `resume.pdf` — then set `resume: "/resume.pdf"` in the profile
- project screenshots — set `image: "/projects/name.png"` on a project

## Running locally

```bash
npm install
npm run dev
```

## AI chatbot (optional)

Copy `.env.example` to `.env.local` and fill in the keys:

- `ANTHROPIC_API_KEY` — enables the chat assistant (console.anthropic.com)
- `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID` — enables voice replies in a cloned voice (elevenlabs.io)

Without keys the site works normally and the chat politely says it's not set up yet. The chat is rate-limited to 20 requests per IP per hour and 10 questions per session.

## Live Demo

https://preetam-portfolio-wheat.vercel.app/
