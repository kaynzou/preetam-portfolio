"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import type { Stop } from "@/data/profile";

const isCurrent = (s: Stop) => s.end?.toLowerCase() === "present";
const dates = (s: Stop) => (s.end ? `${s.start} — ${s.end}` : s.start);
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const W = 400;
const H = 800;

// Evenly spread the stops bottom → top in a gentle zig-zag; the last point is "What's next?"
function layout(count: number) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    pts.push({ x: i % 2 === 0 ? 120 + (i % 3) * 12 : 280 - (i % 3) * 12, y: 730 - t * 640 });
  }
  let d = `M ${pts[0].x} ${pts[0].y}`;
  let toLastStop = d;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const my = (a.y + b.y) / 2;
    if (i === pts.length - 1) toLastStop = d;
    d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
  }
  return { pts, d, toLastStop };
}

function Ship() {
  return (
    <svg viewBox="0 0 40 40" className="h-12 w-12 drop-shadow-[0_0_14px_rgba(255,184,150,0.45)]">
      <ellipse cx="20" cy="27" rx="9" ry="3.2" fill="#0F2A3A" opacity="0.7" />
      <path d="M10 23 C12 27 15 30 20 30 C25 30 28 27 30 23 Z" fill="#5C4A3A" />
      <path d="M11 23.5 C13 26 16 27.5 20 27.5 C24 27.5 27 26 29 23.5" stroke="#D4B896" strokeWidth="0.7" fill="none" opacity="0.7" />
      <rect x="19" y="11.5" width="2" height="11.5" rx="0.7" fill="#3A2A1A" />
      <path d="M21 13 L28 17 L21 19 Z" fill="#F5E6D0" />
      <path d="M19 11.5 L15 11 L19 9.3 Z" fill="#C0392B" />
    </svg>
  );
}

function Decorations() {
  return (
    <g opacity="0.55">
      {/* Compass rose */}
      <g transform="translate(330 710)" stroke="#6b5236" fill="none">
        <circle r="30" strokeWidth="1" />
        <circle r="22" strokeWidth="0.6" strokeDasharray="2 3" />
        <motion.path
          d="M0 -34 L6 0 L0 34 L-6 0 Z"
          fill="#8b6b45"
          stroke="none"
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <path d="M-34 0 L0 5 L34 0 L0 -5 Z" fill="#a8875c" stroke="none" />
        <text y="-38" textAnchor="middle" fontSize="10" fill="#6b5236" stroke="none" fontWeight="700">N</text>
        <text y="48" textAnchor="middle" fontSize="10" fill="#6b5236" stroke="none" fontWeight="700">S</text>
        <text x="-44" y="4" textAnchor="middle" fontSize="10" fill="#6b5236" stroke="none" fontWeight="700">W</text>
        <text x="44" y="4" textAnchor="middle" fontSize="10" fill="#6b5236" stroke="none" fontWeight="700">E</text>
      </g>
      {/* Waves */}
      {[[40, 620], [300, 420], [60, 300], [320, 180], [200, 560]].map(([x, y], i) => (
        <motion.path
          key={i}
          d={`M${x} ${y} q 6 -6 12 0 t 12 0 t 12 0`}
          stroke="#7a8f9a"
          strokeWidth="1.5"
          fill="none"
          animate={{ x: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* Mountains */}
      {[[40, 470], [70, 480], [340, 290], [360, 300]].map(([x, y], i) => (
        <path key={i} d={`M${x - 16} ${y} L${x} ${y - 26} L${x + 16} ${y} Z`} fill="#a08560" />
      ))}
      {/* Palm trees */}
      {[[350, 540], [45, 150]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`} stroke="#5d6b3a" strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M0 0 Q 3 -14 0 -26" stroke="#7a5c3a" />
          <path d="M0 -26 q -10 -4 -16 2 M0 -26 q 10 -4 16 2 M0 -26 q -4 -10 -12 -10 M0 -26 q 4 -10 12 -10" />
        </g>
      ))}
      <text x="200" y="40" textAnchor="middle" fontSize="13" fontStyle="italic" fill="#6b5236" letterSpacing="3">
        Terra Incognita
      </text>
    </g>
  );
}

export function TreasureMap({ stops }: { stops: Stop[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const sailRef = useRef<SVGPathElement>(null);
  const { pts, d, toLastStop } = useMemo(() => layout(stops.length), [stops.length]);
  const [ship, setShip] = useState({ x: pts[0].x, y: pts[0].y, angle: -90, sailed: 0 });
  const [reached, setReached] = useState(1); // how many stops the ship has arrived at
  const stopLengths = useRef<number[] | null>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 0.2", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    // the ship stops at the latest role, just short of "What's next?"
    const maxP = (sailRef.current?.getTotalLength() ?? total) / total;
    const p = Math.min(Math.max(latest, 0), 1) * maxP;
    const point = path.getPointAtLength(p * total);
    const ahead = path.getPointAtLength(Math.min(p + 0.01, 1) * total);
    setShip({ x: point.x, y: point.y, angle: (Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180) / Math.PI, sailed: p * total });

    // where along the path each stop sits (sampled once, lazily)
    if (!stopLengths.current) {
      stopLengths.current = pts.slice(0, stops.length).map((pt) => {
        let best = 0, bestDist = Infinity;
        for (let l = 0; l <= total; l += total / 400) {
          const q = path.getPointAtLength(l);
          const dist = (q.x - pt.x) ** 2 + (q.y - pt.y) ** 2;
          if (dist < bestDist) [best, bestDist] = [l, dist];
        }
        return best;
      });
    }
    setReached(stopLengths.current.filter((l) => l <= p * total + 4).length);
  });

  const scrollToCard = (i: number) =>
    document.getElementById(`stop-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative px-4 py-24 md:py-32"
      style={{
        background: "linear-gradient(145deg, #D4B896, #C4A77D 30%, #D4B896 50%, #BFA06E 75%, #D4B896)",
      }}
    >
      {/* aged-paper vignette */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_160px_rgba(80,50,20,0.45)]" />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading eyebrow="Journey so far" title="Experience" subtitle="Every stop, a story. Every role, a relic." tone="dark" />
        <p className="mt-2 text-xs italic text-[#6b5236]/70 md:hidden">tap a stop to explore</p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {/* Map */}
          <div className="md:sticky md:top-20 md:h-[calc(100vh-7rem)] h-[520px]">
            <div className="relative mx-auto aspect-[1/2] h-full max-w-full">
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
                <Decorations />
                <path ref={sailRef} d={toLastStop} fill="none" stroke="none" />
                <path ref={pathRef} d={d} fill="none" stroke="#8b6b45" strokeWidth="2.5" strokeDasharray="6 8" strokeLinecap="round" opacity="0.6" />
                {/* the trail already sailed, drawn in solid behind the ship */}
                <path
                  d={d}
                  fill="none"
                  stroke="#7a3b1c"
                  strokeWidth="3"
                  strokeLinecap="round"
                  // a gap far longer than the path, so only the sailed part is ever drawn
                  strokeDasharray={`${ship.sailed} 100000`}
                  opacity="0.75"
                />
                {/* X marks the spot */}
                <g transform={`translate(${pts[pts.length - 1].x} ${pts[pts.length - 1].y})`} stroke="#c0392b" strokeWidth="5" strokeLinecap="round">
                  <motion.path
                    d="M-11 -11 L11 11 M11 -11 L-11 11"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                </g>
              </svg>

              {stops.map((s, i) => {
                const p = pts[i];
                const current = isCurrent(s);
                const arrived = i < reached;
                return (
                  <motion.button
                    key={i}
                    onClick={() => scrollToCard(i)}
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, delay: i * 0.12 }}
                    className="group absolute flex flex-col items-center"
                    style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%`, x: "-50%", y: "-50%" }}
                  >
                    {s.level ? (
                      <span className="mb-1 rounded-full bg-[#3a2a1a] px-2 py-0.5 text-[9px] font-bold text-[#f5e6d0]">Lv. {s.level}</span>
                    ) : (
                      <span className="mb-1 h-[17px]" />
                    )}
                    <motion.span
                      // pops when the ship arrives at this stop
                      animate={arrived ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.15 }}
                      className={`relative grid h-9 w-9 place-items-center rounded-full border-2 font-display text-sm font-bold transition-colors duration-500 ${
                        current && arrived
                          ? "border-[#2e6b5a] bg-[#3f8a74] text-white shadow-[0_0_0_6px_rgba(63,138,116,0.25)]"
                          : arrived
                            ? "border-[#f5e6d0] bg-[#5c4a3a] text-[#f5e6d0]"
                            : "border-[#8b6b45]/50 bg-[#c4a77d] text-[#6b5236]"
                      }`}
                    >
                      {current && arrived && (
                        <motion.span
                          aria-hidden
                          className="absolute inset-0 rounded-full border-2 border-[#3f8a74]"
                          animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                        />
                      )}
                      {s.company[0]}
                    </motion.span>
                    <span className="mt-1 whitespace-nowrap text-[10px] font-semibold text-[#3a2a1a]">{s.company}</span>
                    <span className="whitespace-nowrap text-[9px] text-[#6b5236]">
                      {dates(s)}
                    </span>
                    {current && <span className="text-[9px] font-bold text-[#2e6b5a]">You are here</span>}
                  </motion.button>
                );
              })}
              <div
                className="absolute -translate-x-1/2 translate-y-3 text-center text-[10px] font-semibold text-[#6b5236]"
                style={{ left: `${(pts[pts.length - 1].x / W) * 100}%`, top: `${(pts[pts.length - 1].y / H) * 100}%` }}
              >
                What&apos;s next?
              </div>

              <div
                className="pointer-events-none absolute"
                style={{
                  left: `${(ship.x / W) * 100}%`,
                  top: `${(ship.y / H) * 100}%`,
                  // sits just beside the trail so it never covers a stop marker
                  transform: `translate(-50%, -50%) translateX(26px) rotate(${ship.angle + 90}deg)`,
                  transition: "left 0.1s linear, top 0.1s linear",
                }}
              >
                {/* wake ripples */}
                <motion.span
                  aria-hidden
                  className="absolute left-1/2 top-[70%] h-4 w-8 -translate-x-1/2 rounded-full border border-[#f5e6d0]/70"
                  animate={{ scale: [0.6, 1.6], opacity: [0.8, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                />
                {/* gentle rocking on the waves */}
                <motion.div animate={{ rotate: [-5, 5, -5], y: [0, -2, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
                  <Ship />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Cards, newest first */}
          <div className="flex flex-col gap-5">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-[#6b5236]">CAMPSITES ALONG THE TRAIL</p>
            {stops
              .map((s, i) => ({ s, i }))
              .reverse()
              .map(({ s, i }) => (
                <ScrollReveal key={i} direction="right">
                  <article id={`stop-${i}`} className="scroll-mt-24 rounded-xl border border-[#8b6b45]/30 bg-[#f5ead6]/85 p-5 shadow-lg shadow-[#6b5236]/15">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#5c4a3a] text-[10px] font-bold text-[#f5e6d0]">{s.company[0]}</span>
                        <h3 className="font-bold text-[#3a2a1a]">{s.company}</h3>
                        {isCurrent(s) && <span className="text-[10px] italic text-[#2e6b5a]">current</span>}
                      </div>
                      {s.level ? <span className="rounded bg-[#d4b896]/60 px-1.5 py-0.5 text-[9px] font-bold text-[#6b5236]">Lv. {s.level}</span> : null}
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[#5c4a3a]">{s.role}</p>
                    <p className="text-[11px] text-[#8b6b45]">
                      {dates(s)}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[#4a3a2a]/90">{s.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.tags.map((t) => (
                        <span key={t} className="rounded-full border border-[#8b6b45]/40 bg-[#e8d9bd] px-2 py-0.5 text-[10px] font-medium text-[#5c4a3a]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </article>
                </ScrollReveal>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
