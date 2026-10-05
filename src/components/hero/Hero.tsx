"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { profile } from "@/data/profile";
import { StarField } from "./StarField";
import { Campfire } from "./Campfire";

const fireflies = [
  { left: "12%", bottom: "30%", fx: "25px", fy: "-18px", delay: "0s" },
  { left: "22%", bottom: "18%", fx: "-15px", fy: "-25px", delay: "1.2s" },
  { left: "35%", bottom: "26%", fx: "20px", fy: "12px", delay: "2.4s" },
  { left: "63%", bottom: "22%", fx: "-22px", fy: "-10px", delay: "0.6s" },
  { left: "76%", bottom: "32%", fx: "18px", fy: "-20px", delay: "3s" },
  { left: "88%", bottom: "15%", fx: "-12px", fy: "-16px", delay: "1.8s" },
  { left: "48%", bottom: "12%", fx: "14px", fy: "-22px", delay: "4s" },
];

// Deterministic pseudo-random so server and client render the same forest
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

type Layer = { base: number; amp: number; freq: number; phase: number; color: string; trees: number; treeH: [number, number]; seed: number };

const layers: Layer[] = [
  { base: 150, amp: 28, freq: 0.0042, phase: 0.6, color: "#14241a", trees: 26, treeH: [26, 46], seed: 7 },
  { base: 215, amp: 22, freq: 0.0055, phase: 2.1, color: "#11201a", trees: 18, treeH: [40, 70], seed: 21 },
  { base: 290, amp: 16, freq: 0.0048, phase: 4.0, color: "#0b1711", trees: 12, treeH: [60, 100], seed: 42 },
];

const hillY = (l: Layer, x: number) => l.base + l.amp * Math.sin(x * l.freq + l.phase) + l.amp * 0.4 * Math.sin(x * l.freq * 2.7 + l.phase * 1.3);

const r = (n: number) => Math.round(n * 10) / 10;

function pine(x: number, y: number, h: number) {
  const w = h * 0.42;
  // three stacked tiers + trunk
  return [0, 1, 2]
    .map((i) => {
      const top = y - h + i * h * 0.24;
      const bottom = y - h * 0.18 + i * h * 0.06 - (2 - i) * h * 0.16;
      const half = (w / 2) * (0.6 + i * 0.25);
      return `M${r(x)} ${r(top)} L${r(x + half)} ${r(bottom)} L${r(x - half)} ${r(bottom)} Z`;
    })
    .concat(`M${r(x - h * 0.04)} ${r(y - h * 0.25)} h${r(h * 0.08)} v${r(h * 0.3)} h${r(-h * 0.08)} Z`)
    .join(" ");
}

function HillLayer({ layer, y }: { layer: Layer; y: MotionValue<number> | number }) {
  let d = `M0 400 L0 ${r(hillY(layer, 0))}`;
  for (let x = 20; x <= 1440; x += 20) d += ` L${x} ${r(hillY(layer, x))}`;
  d += " L1440 400 Z";

  const rand = seeded(layer.seed);
  const trees: string[] = [];
  for (let i = 0; i < layer.trees; i++) {
    const x = (i + rand()) * (1440 / layer.trees);
    // leave a clearing in the middle for the campfire
    if (Math.abs(x - 720) < 140 && layer.base > 200) continue;
    const h = layer.treeH[0] + rand() * (layer.treeH[1] - layer.treeH[0]);
    trees.push(pine(x, hillY(layer, x) + 6, h));
  }

  return (
    <motion.svg
      style={{ y }}
      className="absolute bottom-0 left-0 h-[48%] w-full"
      viewBox="0 0 1440 400"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
    >
      <path d={trees.join(" ")} fill={layer.color} />
      <path d={d} fill={layer.color} />
    </motion.svg>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = (to: number) => (reduce ? 0 : to);

  // Parallax: distant things move slower than near things
  const starsY = useTransform(scrollYProgress, [0, 1], [0, p(220)]);
  const moonY = useTransform(scrollYProgress, [0, 1], [0, p(260)]);
  const farY = useTransform(scrollYProgress, [0, 1], [0, p(140)]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, p(80)]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, p(-160)]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0]);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[#080E1C]">
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080E1C] via-[#0B1420] to-[#0E1A16]" />
      <motion.div style={{ y: starsY }} className="absolute inset-0">
        <StarField className="h-full w-full" />
      </motion.div>

      {/* Moon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute rounded-full"
        style={{
          y: moonY,
          top: "9%",
          right: "12%",
          width: 50,
          height: 50,
          background: "#FFF8E8",
          boxShadow: "0 0 40px 10px rgba(255,248,232,0.2), 0 0 80px 30px rgba(255,248,232,0.08)",
        }}
      />

      {/* Forest on rolling hills */}
      <HillLayer layer={layers[0]} y={farY} />
      <HillLayer layer={layers[1]} y={midY} />
      <HillLayer layer={layers[2]} y={0} />

      {/* Campfire glow */}
      <motion.div
        className="pointer-events-none absolute"
        animate={{ opacity: [0.85, 1, 0.9, 1, 0.85] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          left: "50%",
          bottom: "-5%",
          x: "-50%",
          width: "700px",
          height: "450px",
          background: "radial-gradient(ellipse at 50% 70%, rgba(255,130,54,0.2) 0%, rgba(255,184,0,0.07) 38%, transparent 68%)",
        }}
      />

      {fireflies.map((f, i) => (
        <span
          key={i}
          className="firefly absolute h-1 w-1 rounded-full bg-[#ffd36b] shadow-[0_0_8px_2px_rgba(255,211,107,0.6)]"
          style={{ left: f.left, bottom: f.bottom, animationDelay: f.delay, ["--fx" as string]: f.fx, ["--fy" as string]: f.fy }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.9, type: "spring", bounce: 0.4 }}
        className="absolute bottom-[5%] left-1/2 -translate-x-1/2"
      >
        <Campfire />
      </motion.div>

      {/* Title */}
      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-4 pb-[12vh] text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.5em" }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="mb-4 text-[10px] font-semibold text-[#f6ecd9]/45 md:text-xs"
        >
          A NEW QUEST BEGINS
        </motion.p>
        <h1 className="font-bold leading-[0.9] tracking-tight">
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
            className="block text-[18vw] text-ember drop-shadow-[0_0_30px_rgba(240,136,74,0.25)] md:text-[9.5rem]"
          >
            {profile.firstName}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
            className="block text-[18vw] text-[#f8f1e4] md:text-[9.5rem]"
          >
            {profile.lastName}
          </motion.span>
        </h1>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-6 left-6 z-10 flex flex-col items-center gap-1 text-[10px] font-semibold tracking-[0.3em] text-[#f6ecd9]/40 transition-colors hover:text-[#f6ecd9]/80 md:left-10"
      >
        VENTURE FORTH
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </motion.a>
    </section>
  );
}
