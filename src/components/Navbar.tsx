"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "connect", label: "Connect" },
];

export function Navbar({ hasExperience = true }: { hasExperience?: boolean }) {
  const shown = hasExperience ? links : links.filter((l) => l.id !== "experience");
  const [show, setShow] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // highlight whichever section crosses the middle of the screen
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          initial={{ y: -40, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          exit={{ y: -40, opacity: 0, x: "-50%" }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="fixed left-1/2 top-4 z-40 rounded-full border border-black/5 bg-white/90 px-1.5 py-1.5 shadow-lg backdrop-blur"
        >
          <ul className="flex gap-0.5">
            {shown.map((l) => (
              <li key={l.id} className="relative">
                {active === l.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-[#2a2218]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <a
                  href={`#${l.id}`}
                  className={`relative block rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                    active === l.id ? "text-[#f6ecd9]" : "text-neutral-700 hover:text-black"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
