"use client";

import { motion } from "framer-motion";
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

export function Hero() {
  return (
    <section id="top" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[#080E1C]">
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080E1C] via-[#0B1420] to-[#0E1A16]" />
      <StarField className="absolute inset-0 h-full w-full" />

      {/* Moon */}
      <div
        className="absolute rounded-full"
        style={{
          top: "9%",
          right: "12%",
          width: 50,
          height: 50,
          background: "#FFF8E8",
          boxShadow: "0 0 40px 10px rgba(255,248,232,0.2), 0 0 80px 30px rgba(255,248,232,0.08)",
        }}
      />

      {/* Rolling hills */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[48%]"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0 150 C 200 90 380 170 560 120 C 760 60 940 150 1120 110 C 1280 80 1380 120 1440 110 L1440 400 L0 400 Z" fill="#14241a" />
        <path d="M0 220 C 180 170 340 240 540 200 C 720 160 900 230 1080 190 C 1240 160 1360 200 1440 190 L1440 400 L0 400 Z" fill="#11201a" />
        <path d="M0 290 C 220 250 420 310 640 280 C 860 250 1040 310 1240 280 C 1340 265 1400 280 1440 275 L1440 400 L0 400 Z" fill="#0d1a13" />
      </svg>

      {/* Campfire glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          bottom: "-5%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "450px",
          background:
            "radial-gradient(ellipse at 50% 70%, rgba(255,130,54,0.2) 0%, rgba(255,184,0,0.07) 38%, transparent 68%)",
        }}
      />

      {fireflies.map((f, i) => (
        <span
          key={i}
          className="firefly absolute h-1 w-1 rounded-full bg-[#ffd36b] shadow-[0_0_8px_2px_rgba(255,211,107,0.6)]"
          style={{ left: f.left, bottom: f.bottom, animationDelay: f.delay, ["--fx" as string]: f.fx, ["--fy" as string]: f.fy }}
        />
      ))}

      <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2">
        <Campfire />
      </div>

      {/* Title */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pb-[12vh] text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 text-[10px] md:text-xs font-semibold tracking-[0.5em] text-[#f6ecd9]/45"
        >
          A NEW QUEST BEGINS
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="font-bold leading-[0.9] tracking-tight"
        >
          <span className="block text-[18vw] md:text-[9.5rem] text-ember drop-shadow-[0_0_30px_rgba(240,136,74,0.25)]">
            {profile.firstName}
          </span>
          <span className="block text-[18vw] md:text-[9.5rem] text-[#f8f1e4]">{profile.lastName}</span>
        </motion.h1>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-6 left-6 md:left-10 z-10 flex flex-col items-center gap-1 text-[10px] font-semibold tracking-[0.3em] text-[#f6ecd9]/40 hover:text-[#f6ecd9]/80 transition-colors"
      >
        VENTURE FORTH
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "bob 1.6s ease-in-out infinite" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
