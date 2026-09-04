import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B1420",
        night: "#080E1C",
        forest: "#0E1A16",
        parchment: "#D9C39F",
        parchmentDark: "#BFA06E",
        ember: "#E8823A",
        emberBright: "#FFB800",
        moss: "#3F5B45",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};
export default config;
