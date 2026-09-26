// ─────────────────────────────────────────────────────────────
//  Everything personal lives in this file.
//  Edit the values below and the whole site updates.
//  Anything marked TODO is placeholder text waiting for real info.
// ─────────────────────────────────────────────────────────────

export const profile = {
  firstName: "Preetam",
  lastName: "Kumar", // TODO: your last name
  title: "EXPLORER", // shown under your name on the character card
  level: 22, // TODO: your age
  photo: "/me.jpg",
  // Alternate "fantasy" photo for the hover paint-reveal. Must be the same size
  // and framing as `photo`. Until you add one, a stylised version is generated.
  photoReveal: "/me-alt.jpg",
  bio: [
    { text: "Hi, I'm " },
    { text: "Preetam", highlight: true },
    { text: ", a " },
    { text: "Computer Science", highlight: true },
    { text: " student who loves building things and exploring new ideas. I'm a " },
    { text: "generalist", highlight: true },
    { text: " who enjoys turning problems into products and experimenting with new technologies." },
  ], // TODO: rewrite in your own words
  education: "🎓 Your College 2022–2026", // TODO
  hobbies: ["Loves photography", "Loves travelling", "Loves playing sports"], // TODO
  skills: [
    "TypeScript", "React", "Next.js", "Python", "Node.js", "Java",
    "PostgreSQL", "MongoDB", "Docker", "AWS", "Git", "Tailwind CSS",
  ], // TODO
  email: "you@example.com", // TODO
  resume: "", // TODO: e.g. "/resume.pdf" (drop the PDF into /public)
};

export type SocialKey = "linkedin" | "github" | "email" | "x" | "instagram" | "youtube";

// Leave a link empty ("") to hide it everywhere.
export const socials: Record<SocialKey, string> = {
  linkedin: "", // TODO
  github: "https://github.com/kaynzou",
  email: `mailto:${profile.email}`,
  x: "",
  instagram: "",
  youtube: "",
};

export const achievements: { rank: string; title: string }[] = [
  // TODO: replace with your own
  { rank: "1st", title: "College Hackathon" },
  { rank: "Finalist", title: "Smart India Hackathon" },
  { rank: "Lead", title: "Coding Club" },
  { rank: "Top 5%", title: "LeetCode Contest" },
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
  // TODO: replace with your real experience
  {
    company: "Open Source",
    role: "Contributor",
    start: "Jan 2023",
    end: "Dec 2023",
    level: 19,
    description: "Contributed features and bug fixes to open-source projects. Learned to navigate large codebases and collaborate through code review.",
    tags: ["Git", "TypeScript"],
  },
  {
    company: "Startup",
    role: "Software Engineering Intern",
    start: "May 2024",
    end: "Jul 2024",
    level: 20,
    description: "Built and shipped product features end to end, from API design to UI. Improved page load times and wrote tests for critical flows.",
    tags: ["React", "Node.js", "PostgreSQL"],
  },
  {
    company: "Company",
    role: "Software Engineer",
    start: "Jun 2025",
    end: "Present",
    level: 21,
    description: "Working on backend services and internal tools. Owning features from idea to production.",
    tags: ["Python", "AWS", "Docker"],
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
  // TODO: replace with your real projects
  {
    name: "Project One",
    description: "A short, punchy description of what this project does, who it's for, and why it's interesting. One or two sentences is perfect.",
    tags: ["Next.js", "TypeScript", "AI"],
    github: "https://github.com/kaynzou",
  },
  {
    name: "Project Two",
    description: "Another project you're proud of. Mention real usage or impact if you have it — numbers make it memorable.",
    tags: ["Python", "FastAPI", "React"],
    github: "https://github.com/kaynzou",
  },
  {
    name: "This Portfolio",
    description: "An adventure-themed portfolio with a WebGL night sky, a paint-reveal portrait, a scroll-driven treasure map, and an AI chatbot that answers questions about me.",
    tags: ["Next.js", "WebGL", "Framer Motion", "Claude"],
    github: "https://github.com/kaynzou/preetam-portfolio",
  },
];

export const sideQuests: { name: string; description: string; tags: string[]; link?: string }[] = [
  // TODO: smaller projects (or delete them all to hide the section)
  { name: "Chrome Extension", description: "A small browser extension that automates something annoying.", tags: ["JavaScript"] },
  { name: "CLI Tool", description: "A command-line tool that saves a few minutes every day.", tags: ["Python"] },
  { name: "Discord Bot", description: "A bot for a community server with games and moderation.", tags: ["Node.js"] },
];

// Used by the AI chatbot. Built from the data above, plus anything extra you add here.
export const extraChatContext = ``;
