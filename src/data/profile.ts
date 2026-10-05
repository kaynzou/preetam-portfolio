// ─────────────────────────────────────────────────────────────
//  Everything personal lives in this file.
//  Edit the values below and the whole site updates.
//  Anything marked TODO is placeholder text waiting for real info.
// ─────────────────────────────────────────────────────────────

export const profile = {
  firstName: "Preetam",
  lastName: "Kumar",
  title: "3RD-YEAR STUDENT", // shown under your name on the character card
  level: 0, // TODO: your age, shown as "Lv. N" (0 hides it)
  photo: "/me.jpg",
  // Alternate "fantasy" photo for the hover paint-reveal. Must be the same size
  // and framing as `photo`. Until you add one, a stylised version is generated.
  photoReveal: "/me-alt.jpg",
  bio: [
    { text: "Hi, I'm " },
    { text: "Preetam", highlight: true },
    { text: ", a " },
    { text: "3rd-year student", highlight: true },
    { text: " who likes building AI systems from the ground up. Lately that's meant " },
    { text: "retrieval-augmented generation", highlight: true },
    { text: " and " },
    { text: "voice interfaces", highlight: true },
    { text: ": writing the core pipeline myself instead of reaching for end-to-end frameworks, so I understand every piece." },
  ],
  education: "", // TODO: e.g. "🎓 College Name 2024–2028" (empty hides it)
  hobbies: [] as string[], // TODO: e.g. ["Loves photography", "Loves travelling"] (empty hides it)
  // Taken from your RAG project — add the languages and tools you use too
  skills: ["RAG", "Embeddings", "Vector Search", "BM25", "Hybrid Search", "LLMs", "Speech-to-Text", "Chunking Strategies", "Guardrails"],
  email: "", // TODO
  resume: "", // TODO: e.g. "/resume.pdf" (drop the PDF into /public)
};

export type SocialKey = "linkedin" | "github" | "email" | "x" | "instagram" | "youtube";

// Leave a link empty ("") to hide it everywhere.
export const socials: Record<SocialKey, string> = {
  linkedin: "", // TODO
  github: "https://github.com/kaynzou",
  email: profile.email ? `mailto:${profile.email}` : "",
  x: "",
  instagram: "",
  youtube: "",
};

export const achievements: { rank: string; title: string }[] = [
  // TODO: e.g. { rank: "1st", title: "College Hackathon" } — empty hides the section
];

export type Stop = {
  company: string;
  role: string;
  start: string;
  end: string; // use "Present" for your current role
  level: number; // your age at the time — shown as "Lv. N"
  description: string;
  tags: string[];
};

// Oldest first. The ship sails from the first stop to the last.
export const experience: Stop[] = [
  // TODO: internships, jobs, clubs, research — oldest first. Empty hides the treasure map.
  // { company: "Company", role: "Intern", start: "May 2025", end: "Jul 2025", level: 20,
  //   description: "What you did and the impact.", tags: ["Python"] },
];

export type Project = {
  name: string;
  description: string;
  tags: string[];
  image?: string; // e.g. "/projects/foo.png" in /public
  link?: string;
  demo?: string;
  github?: string;
};

export const projects: Project[] = [
  {
    name: "Voice-Enabled RAG System", // TODO: the project's real name, if it has one
    description:
      "A retrieval-augmented generation pipeline built from scratch, with no end-to-end RAG frameworks. It covers custom document processing, multi-strategy chunking, embeddings, BM25 + vector retrieval fused into hybrid search, and grounded LLM answer generation. Speech-to-text makes it conversational, with latency analytics, orchestration and safety guardrails wrapped in a polished interface.",
    tags: ["RAG", "Hybrid Search", "BM25", "Embeddings", "Speech-to-Text", "LLMs"],
    // TODO: github: "https://github.com/kaynzou/...", demo: "...", image: "/projects/rag.png"
  },
  {
    name: "This Portfolio",
    description: "An adventure-themed portfolio with a WebGL night sky, a paint-reveal portrait, a scroll-driven treasure map, and an AI chatbot that answers questions about me.",
    tags: ["Next.js", "WebGL", "Framer Motion", "Claude"],
    github: "https://github.com/kaynzou/preetam-portfolio",
  },
];

export const sideQuests: { name: string; description: string; tags: string[]; link?: string }[] = [
  // TODO: smaller projects — empty hides the section
];

// Used by the AI chatbot. Built from the data above, plus anything extra you add here.
export const extraChatContext = ``;
