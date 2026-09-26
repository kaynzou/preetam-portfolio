const embers = [
  { left: 30, dx: "-14px", delay: "0s" },
  { left: 42, dx: "10px", delay: "0.8s" },
  { left: 50, dx: "-6px", delay: "1.6s" },
  { left: 58, dx: "16px", delay: "0.4s" },
  { left: 66, dx: "-10px", delay: "2.2s" },
];

export function Campfire({ size = 90 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }} aria-hidden>
      {embers.map((e, i) => (
        <span
          key={i}
          className="ember absolute h-[3px] w-[3px] rounded-full bg-[#ffb347]"
          style={{ left: `${e.left}%`, bottom: "45%", animationDelay: e.delay, ["--dx" as string]: e.dx }}
        />
      ))}
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
        {/* logs */}
        <rect x="18" y="82" width="64" height="8" rx="4" fill="#4a2f1c" transform="rotate(-12 50 86)" />
        <rect x="18" y="82" width="64" height="8" rx="4" fill="#5c3a22" transform="rotate(12 50 86)" />
        {/* flames */}
        <path className="flame flame-1" d="M50 18 C 64 38 74 52 70 68 C 67 80 58 86 50 86 C 42 86 33 80 30 68 C 26 52 36 38 50 18 Z" fill="#e8552b" opacity="0.9" />
        <path className="flame flame-2" d="M50 32 C 60 46 66 56 63 68 C 61 78 56 84 50 84 C 44 84 39 78 37 68 C 34 56 40 46 50 32 Z" fill="#f78a3a" />
        <path className="flame flame-3" d="M50 46 C 57 56 60 62 58 71 C 57 78 54 83 50 83 C 46 83 43 78 42 71 C 40 62 43 56 50 46 Z" fill="#ffc15e" />
        <path className="flame flame-4" d="M50 60 C 54 66 55 70 54 75 C 53 79 52 82 50 82 C 48 82 47 79 46 75 C 45 70 46 66 50 60 Z" fill="#fff1c1" />
      </svg>
    </div>
  );
}
