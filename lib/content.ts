// ─────────────────────────────────────────────────────────────
// Everything about you lives in this one file.
// Edit freely — no component code needs to change.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Preetam Kumar",
  level: 20, // shown as "Lv. 20" on the character sheet — bump it whenever you like
  archetype: "Explorer",
  bio: [
    "I'm Preetam, a third-year AI engineering student who loves building things — from computer vision projects to generative AI experiments.",
    "I'm actively developing my skills in Python, machine learning, and RAG-based systems, working toward a career in AI/ML or backend engineering.",
  ],
  facts: ["Currently a student", "Building in public", "Loves shipping side projects"],
};

export const skills: string[] = [
  "Python",
  "JavaScript",
  "LLMs",
  "RAG",
  "MCP",
  "Backend",
  "System Design",
  "MongoDB",
  "Node.js",
  "Pandas",
  "NumPy",
  "OpenCV",
  "MySQL",
  "FastAPI",
  "Uvicorn",
  "C++",
  "Docker",
  "Scikit-Learn",
  "NLP",
  "AI",
  "ML",
];

// The learning-journey timeline. Each stop is a marker on the scroll-linked
// path in JourneySection. Add stops as you go — internships, certifications,
// big projects, whatever marks a milestone.
export type JourneyStop = {
  id: string;
  label: string;
  title: string;
  dates: string;
  description: string;
  tags: string[];
  current?: boolean;
};

export const journey: JourneyStop[] = [
  {
    id: "start",
    label: "Basecamp",
    title: "Started AI Engineering",
    // TODO: add your actual start year
    dates: "Year 1",
    description:
      "Began my AI engineering degree — first contact with Python, data structures, and the fundamentals of machine learning.",
    tags: ["Python", "ML Fundamentals"],
  },
  {
    id: "rag",
    label: "Current Quest",
    title: "Building a Voice-Enabled RAG Pipeline",
    dates: "Year 3 — Present",
    description:
      "Designing and building a retrieval-augmented generation pipeline from scratch, with voice input and output layered on top — covering chunking, embeddings, retrieval, and generation end to end.",
    tags: ["RAG", "LLMs", "Python", "FastAPI"],
    current: true,
  },
];

export type Project = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  url?: string;
};

// Main projects — shown as large cards.
export const projects: Project[] = [
  {
    id: "rag-pipeline",
    name: "RAG Pipeline — Built From Scratch",
    description:
      "A voice-enabled, production-grade retrieval-augmented generation pipeline built from scratch in Python — no LangChain, no LlamaIndex. Custom chunking (fixed, semantic, paragraph, section-aware), BM25 + dense hybrid search fused with RRF, cross-encoder reranking, grounded generation with citations, guardrails against hallucination, and voice input via speech-to-text. 101 tests across the pipeline, served with FastAPI + Streamlit.",
    tags: ["Python", "RAG", "FastAPI", "Hybrid Search", "Voice"],
    url: "https://github.com/kaynzou/rag-pipeline",
  },
  {
    id: "gesture-controller",
    name: "Gesture Controller",
    description:
      "A webcam-based gesture controller for macOS built with OpenCV and MediaPipe. Pinch gestures adjust volume and brightness, a fist minimizes the active window, and an open palm switches between apps — all tracked live through hand landmark detection, no extra hardware needed.",
    tags: ["Python", "OpenCV", "MediaPipe", "Computer Vision"],
    url: "https://github.com/kaynzou/gesture-controller",
  },
];

// Side quests — smaller, lighter projects shown in a compact grid.
export const sideQuests: Project[] = [
  {
    id: "biased-dice",
    name: "Biased Dice Simulator",
    description:
      "A desktop app built with Python and Tkinter that rolls dice — normal or weighted. Pick a number, set it to any target probability, and watch the bias play out over repeated rolls.",
    tags: ["Python", "Tkinter"],
    url: "https://github.com/kaynzou/biased-dice",
  },
  {
    id: "smart-travel-bot",
    name: "Smart Travel Bot",
    description:
      "A Python bot that bundles useful travel info together — checks a location, pulls the weather, converts currency, and surfaces quick tips and travel requirements. Built mostly as a fun way to explore and tie together a handful of APIs.",
    tags: ["Python", "APIs"],
    url: "https://github.com/kaynzou/smart_travel_bot",
  },
];

// Achievements: none yet — this array stays empty until you have some.
// The Achievements section only renders if this has entries.
export type Achievement = {
  id: string;
  place: string;
  label: string;
};
export const achievements: Achievement[] = [];

export const connect = {
  email: "preetamk0069@gmail.com",
  linkedin: "https://www.linkedin.com/in/preetamkumar17/",
  github: "https://github.com/kaynzou",
  // Add these if/when you have them — leave blank to hide the card
  youtube: "",
  x: "",
  instagram: "",
  resumeUrl: "", // add a link to a hosted PDF once you have one
};

// System prompt for the AI chatbot — edit this to control what it says about you.
export const chatbotSystemPrompt = `You are Preetam Kumar's personal assistant on his portfolio website.
Answer questions about his background, projects, and experience. Keep answers concise and friendly.

About Preetam:
- Currently: third-year AI engineering student
- Focus: Python, machine learning, and RAG-based systems, working toward a career in AI/ML or backend engineering
- Main projects: ${projects.map((p) => p.name).join(", ")}
- Side quests: ${sideQuests.map((p) => p.name).join(", ")}
- Skills: ${skills.join(", ")}
- Contact: ${connect.email}, LinkedIn: ${connect.linkedin}, GitHub: ${connect.github}

If you don't know something, say so — don't make things up.`;
