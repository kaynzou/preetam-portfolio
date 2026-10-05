// ─────────────────────────────────────────────────────────────
//  Everything personal lives in this file.
//  Edit the values below and the whole site updates.
//  Empty values / lists hide their section automatically.
// ─────────────────────────────────────────────────────────────

export const profile = {
  firstName: "Preetam",
  lastName: "Kumar",
  title: "EXPLORER", // shown under your name on the character card
  level: 20, // shown as "Lv. 20" — bump it whenever you like (0 hides it)
  photo: "/me.jpg",
  // Alternate "fantasy" photo for the hover paint-reveal (same size and framing as `photo`)
  photoReveal: "/me-alt.jpg",
  bio: [
    { text: "I'm Preetam, a " },
    { text: "third-year AI engineering student", highlight: true },
    { text: " who loves building things, from computer vision projects to generative AI experiments. I'm actively developing my skills in " },
    { text: "Python, machine learning, and RAG-based systems", highlight: true },
    { text: ", working toward a career in " },
    { text: "AI/ML or backend engineering", highlight: true },
    { text: "." },
  ],
  education: "🎓 AI Engineering · 3rd year", // add your college name and years if you like
  hobbies: ["Currently a student", "Building in public", "Loves shipping side projects"],
  skills: [
    "Python", "JavaScript", "LLMs", "RAG", "MCP", "Backend", "System Design", "MongoDB", "Node.js",
    "Pandas", "NumPy", "OpenCV", "MySQL", "FastAPI", "Uvicorn", "C++", "Docker", "Scikit-Learn",
    "NLP", "AI", "ML",
  ],
  email: "preetamk0069@gmail.com",
  resume: "", // e.g. "/resume.pdf" (drop the PDF into /public)
};

export type SocialKey = "linkedin" | "github" | "email" | "x" | "instagram" | "youtube";

// Leave a link empty ("") to hide it everywhere.
export const socials: Record<SocialKey, string> = {
  linkedin: "https://www.linkedin.com/in/preetamkumar17/",
  github: "https://github.com/kaynzou",
  email: profile.email ? `mailto:${profile.email}` : "",
  x: "",
  instagram: "",
  youtube: "",
};

// e.g. { rank: "1st", title: "College Hackathon" } — empty hides the section
export const achievements: { rank: string; title: string }[] = [];

export type Stop = {
  company: string;
  role: string;
  start: string;
  end?: string; // use "Present" for what you're doing now
  level?: number; // your age at the time — shown as "Lv. N"
  description: string;
  tags: string[];
};

// The learning journey, oldest first. The ship sails from the first stop to the last.
// Add internships, certifications and big milestones as you go.
export const experience: Stop[] = [
  {
    company: "Basecamp",
    role: "Started AI Engineering",
    start: "Year 1",
    description: "Began my AI engineering degree — first contact with Python, data structures, and the fundamentals of machine learning.",
    tags: ["Python", "ML Fundamentals"],
  },
  {
    company: "Current Quest",
    role: "Building a Voice-Enabled RAG Pipeline",
    start: "Year 3",
    end: "Present",
    level: 20,
    description:
      "Designing and building a retrieval-augmented generation pipeline from scratch, with voice input and output layered on top — covering chunking, embeddings, retrieval, and generation end to end.",
    tags: ["RAG", "LLMs", "Python", "FastAPI"],
  },
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
    name: "RAG Pipeline — Built From Scratch",
    description:
      "A voice-enabled, production-grade retrieval-augmented generation pipeline built from scratch in Python — no LangChain, no LlamaIndex. Custom chunking (fixed, semantic, paragraph, section-aware), BM25 + dense hybrid search fused with RRF, cross-encoder reranking, grounded generation with citations, guardrails against hallucination, and voice input via speech-to-text. 101 tests across the pipeline, served with FastAPI + Streamlit.",
    tags: ["Python", "RAG", "FastAPI", "Hybrid Search", "Voice"],
    github: "https://github.com/kaynzou/rag-pipeline",
  },
  {
    name: "Gesture Controller",
    description:
      "A webcam-based gesture controller for macOS built with OpenCV and MediaPipe. Pinch gestures adjust volume and brightness, a fist minimizes the active window, and an open palm switches between apps — all tracked live through hand landmark detection, no extra hardware needed.",
    tags: ["Python", "OpenCV", "MediaPipe", "Computer Vision"],
    github: "https://github.com/kaynzou/gesture-controller",
  },
  {
    name: "This Portfolio",
    description:
      "An adventure-themed portfolio with a WebGL night sky, a paint-reveal portrait, a scroll-driven treasure map, and an AI chatbot that answers questions about me.",
    tags: ["Next.js", "WebGL", "Framer Motion", "Claude"],
    github: "https://github.com/kaynzou/preetam-portfolio",
  },
];

// Smaller projects — empty hides the section
export const sideQuests: { name: string; description: string; tags: string[]; link?: string }[] = [
  {
    name: "Biased Dice Simulator",
    description:
      "A desktop app built with Python and Tkinter that rolls dice — normal or weighted. Pick a number, set it to any target probability, and watch the bias play out over repeated rolls.",
    tags: ["Python", "Tkinter"],
    link: "https://github.com/kaynzou/biased-dice",
  },
  {
    name: "Smart Travel Bot",
    description:
      "A Python bot that bundles useful travel info together — checks a location, pulls the weather, converts currency, and surfaces quick tips and travel requirements. Built mostly as a fun way to explore and tie together a handful of APIs.",
    tags: ["Python", "APIs"],
    link: "https://github.com/kaynzou/smart_travel_bot",
  },
];

// Anything extra the AI chatbot should know about you
export const extraChatContext = `Career goal: AI/ML or backend engineering.`;
