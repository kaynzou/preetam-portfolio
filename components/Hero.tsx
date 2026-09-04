"use client";

import { motion } from "framer-motion";
import { StarField } from "./StarField";
import { profile } from "@/lib/content";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080E1C] via-[#0B1420] to-[#0E1A16]" />

      {/* Moon */}
      <div
        className="absolute rounded-full"
        style={{
          top: "8%",
          right: "12%",
          width: 50,
          height: 50,
          background: "#FFF8E8",
          boxShadow:
            "0 0 40px 10px rgba(255,248,232,0.2), 0 0 80px 30px rgba(255,248,232,0.08)",
        }}
      />

      {/* Stars + shooting stars */}
      <StarField className="absolute inset-0" />

      {/* Campfire warm glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          bottom: "-5%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "500px",
          background:
            "radial-gradient(ellipse at 50% 70%, rgba(255,130,54,0.2) 0%, rgba(255,184,0,0.08) 38%, transparent 68%)",
        }}
      />

      {/* Hero copy */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-xs tracking-[0.3em] text-[#D9C39F]/70 mb-4"
        >
          a new quest begins
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="font-body font-black tracking-tight text-6xl sm:text-8xl leading-[0.95]"
        >
          <span className="text-[#E8823A]">{profile.name.split(" ")[0]}</span>
          <br />
          <span className="text-[#F3ECDD]">
            {profile.name.split(" ").slice(1).join(" ")}
          </span>
        </motion.h1>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-xs tracking-[0.3em] text-[#D9C39F]/60">
          venture forth
        </span>
        <span className="bounce-arrow text-[#E8823A]">↓</span>
      </div>

      {/* Campfire — big */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
        <svg viewBox="0 0 60 60" className="w-32 h-32 sm:w-40 sm:h-40">
          <path
            className="flame-1"
            d="M30 44 C22 40 20 32 26 22 C24 30 28 32 30 26 C32 32 36 30 34 22 C40 32 38 40 30 44 Z"
            fill="#E8823A"
          />
          <path
            className="flame-2"
            d="M30 42 C25 39 24 34 28 27 C27 32 29 33 30 29 C31 33 33 32 32 27 C36 34 35 39 30 42 Z"
            fill="#FFB800"
            opacity="0.85"
          />
          <path
            className="flame-3"
            d="M30 40 C27 38 27 35 29 31 C28.5 34 29.5 34.5 30 32.5 C30.5 34.5 31.5 34 31 31 C33 35 33 38 30 40 Z"
            fill="#FFE9B8"
            opacity="0.9"
          />
        </svg>
      </div>
    </section>
  );
}
