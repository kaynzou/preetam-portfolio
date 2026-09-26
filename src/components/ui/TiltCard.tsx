"use client";

import { useRef, useState } from "react";

export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  function handleMouseMove(e: React.MouseEvent) {
    const rect = cardRef.current!.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setTilt({ x: x * -10, y: y * 10, active: true });
  }

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0, active: false })}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${tilt.active ? 1.02 : 1}, ${tilt.active ? 1.02 : 1}, 1)`,
        transition: "transform 0.15s ease-out",
      }}
    >
      {children}
    </div>
  );
}
