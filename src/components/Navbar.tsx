"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#connect", label: "Connect" },
];

export function Navbar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-1/2 top-4 z-40 -translate-x-1/2 rounded-full border border-black/5 bg-white/90 px-2 py-1.5 shadow-lg backdrop-blur transition-all duration-300 ${
        show ? "opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
      }`}
    >
      <ul className="flex gap-0.5">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="block rounded-full px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-black sm:text-sm">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
