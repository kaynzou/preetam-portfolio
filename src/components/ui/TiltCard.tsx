"use client";

import { useRef, useState } from "react";

export function TiltCard({
  children,
  className,
  intensity = 10,
  glare = false,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // max tilt in degrees
  glare?: boolean; // soft light that follows the cursor
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50, active: false });

  function handleMouseMove(e: React.MouseEvent) {
    const rect = cardRef.current!.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setTilt({ x: x * -intensity, y: y * intensity, gx: (y + 0.5) * 100, gy: (x + 0.5) * 100, active: true });
  }

  const s = tilt.active ? 1.02 : 1;
  return (
    <div
      ref={cardRef}
      className={`relative ${className ?? ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0, gx: 50, gy: 50, active: false })}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${s}, ${s}, 1)`,
        transition: tilt.active ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
      }}
    >
      {children}
      {glare && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: tilt.active ? 1 : 0,
            background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,240,220,0.12), transparent 55%)`,
          }}
        />
      )}
    </div>
  );
}
