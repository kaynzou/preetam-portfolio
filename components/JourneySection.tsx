"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { journey } from "@/lib/content";

const VIEW_W = 400;
const VIEW_H = 900;

function buildPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [boat, setBoat] = useState({ x: 0, y: 0, angle: 0 });

  // One point per journey stop, plus a final "what's next" point, in a
  // gentle left-right zigzag down the column — same technique as a
  // scroll-linked map: convert scroll progress to a point along an SVG path.
  const stopCount = journey.length + 1;
  const points = Array.from({ length: stopCount }, (_, i) => {
    const t = stopCount === 1 ? 0 : i / (stopCount - 1);
    const x = VIEW_W * (i % 2 === 0 ? 0.32 : 0.68);
    const y = 60 + t * (VIEW_H - 120);
    return { x, y };
  });
  const pathD = buildPath(points);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    const progress = Math.min(Math.max(latest, 0), 1);
    const point = path.getPointAtLength(progress * total);
    const ahead = path.getPointAtLength(Math.min(progress + 0.01, 1) * total);
    setBoat({
      x: point.x,
      y: point.y,
      angle: Math.atan2(ahead.y - point.y, ahead.x - point.x) * (180 / Math.PI),
    });
  });

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative"
      style={{
        background:
          "linear-gradient(160deg, #D9C39F 0%, #C4A77D 45%, #BFA06E 100%)",
        minHeight: `${100 + journey.length * 60}vh`,
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="max-w-6xl mx-auto h-full grid md:grid-cols-[1fr_1.1fr] gap-10 px-6 pt-32 pb-10">
          {/* Left: map with scroll-linked boat */}
          <div className="relative hidden md:block">
            <p className="text-xs tracking-[0.3em] text-[#7A5A32] mb-2">
              journey so far
            </p>
            <h2 className="font-display text-5xl text-[#3A2A1A] mb-8">
              Journey
            </h2>

            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="absolute inset-x-0 top-24 bottom-0 w-full h-[calc(100%-6rem)]"
              preserveAspectRatio="xMidYMin meet"
            >
              <path
                ref={pathRef}
                d={pathD}
                fill="none"
                stroke="#7A5A32"
                strokeOpacity={0.4}
                strokeWidth={2}
                strokeDasharray="6 8"
              />
              {points.slice(0, -1).map((p, i) => (
                <g key={journey[i].id}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={10}
                    fill={journey[i].current ? "#E8823A" : "#D9C39F"}
                    stroke="#3A2A1A"
                    strokeWidth={2}
                  />
                </g>
              ))}
              {/* "What's next" marker at the end */}
              <text
                x={points[points.length - 1].x}
                y={points[points.length - 1].y - 16}
                textAnchor="middle"
                fill="#7A5A32"
                fontSize={13}
                fontStyle="italic"
              >
                What&apos;s next?
              </text>
              <text
                x={points[points.length - 1].x}
                y={points[points.length - 1].y}
                textAnchor="middle"
                fill="#C0392B"
                fontSize={18}
              >
                ×
              </text>
            </svg>

            {/* Boat, positioned by scroll progress along the path */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${(boat.x / VIEW_W) * 100}%`,
                top: `calc(6rem + ${(boat.y / VIEW_H) * 100}%)`,
                transform: `translate(-50%, -50%) rotate(${boat.angle}deg)`,
              }}
            >
              <svg viewBox="0 0 40 40" className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,184,150,0.5)]">
                <ellipse cx="20" cy="27" rx="9" ry="3.2" fill="#0F2A3A" opacity="0.5" />
                <path d="M10 23 C12 27 15 30 20 30 C25 30 28 27 30 23 Z" fill="#5C4A3A" />
                <rect x="19" y="11.5" width="2" height="11.5" rx="0.7" fill="#3A2A1A" />
                <path d="M21 13 L28 17 L21 19 Z" fill="#F5E6D0" />
                <path d="M19 11.5 L15 11 L19 9.3 Z" fill="#C0392B" />
              </svg>
            </div>
          </div>

          {/* Right: stop cards (also the mobile-only view) */}
          <div className="overflow-y-auto pr-1 h-full">
            <div className="md:hidden mb-6">
              <p className="text-xs tracking-[0.3em] text-[#7A5A32] mb-2">
                journey so far
              </p>
              <h2 className="font-display text-4xl text-[#3A2A1A]">Journey</h2>
            </div>
            <p className="text-xs tracking-[0.3em] text-[#7A5A32] mb-4">
              stops along the trail
            </p>
            <div className="space-y-5">
              {journey.map((stop) => (
                <div
                  key={stop.id}
                  className="bg-[#F3ECDD]/80 backdrop-blur-sm rounded-xl p-6 border border-[#7A5A32]/15"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-xs tracking-widest text-[#7A5A32] mb-1">
                        {stop.label.toUpperCase()}
                        {stop.current && (
                          <span className="ml-2 text-[#E8823A]">
                            · you are here
                          </span>
                        )}
                      </p>
                      <h3 className="font-display text-2xl text-[#3A2A1A]">
                        {stop.title}
                      </h3>
                    </div>
                    <p className="text-sm text-[#5C4A3A]">{stop.dates}</p>
                  </div>
                  <p className="mt-3 text-[#5C4A3A] leading-relaxed">
                    {stop.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {stop.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-[#3A2A1A]/8 text-[#3A2A1A] text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-[#7A5A32] italic pl-1">What&apos;s next?</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
