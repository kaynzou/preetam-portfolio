"use client";

import { useRef } from "react";

export function MouseGlow({
  children,
  className,
  innerClassName,
  glowColor = "232,130,58", // ember, as an "r,g,b" string
  radius = 350,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  glowColor?: string;
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    el.style.setProperty("--glow-opacity", "1");
  }

  function handleMouseLeave() {
    ref.current?.style.setProperty("--glow-opacity", "0");
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl p-px overflow-hidden ${className ?? ""}`}
      style={
        {
          "--mx": "50%",
          "--my": "50%",
          "--glow-opacity": "0",
          background: `radial-gradient(${radius}px circle at var(--mx) var(--my), rgba(${glowColor}, calc(0.65 * var(--glow-opacity))), rgba(255,255,255,0.06) 45%, transparent 65%)`,
        } as React.CSSProperties
      }
    >
      <div className={`relative rounded-2xl ${innerClassName ?? ""}`}>
        {children}
      </div>
    </div>
  );
}
