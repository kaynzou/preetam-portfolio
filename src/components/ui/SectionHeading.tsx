"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  tone = "light",
  align = "left",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
}) {
  const dark = tone === "dark";
  const center = align === "center";
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={center ? "text-center" : ""}
    >
      <motion.p variants={item} className={`text-xs font-semibold uppercase tracking-[0.3em] ${dark ? "text-[#7a5c3a]" : "text-ember/80"}`}>
        {eyebrow}
      </motion.p>
      <motion.h2 variants={item} className={`mt-2 text-4xl font-bold md:text-6xl ${dark ? "text-[#3a2a1a]" : "text-[#f6ecd9]"}`}>
        {title}
      </motion.h2>
      <motion.span
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } } }}
        className={`mt-3 block h-[3px] w-16 rounded-full ${center ? "mx-auto origin-center" : "origin-left"} ${dark ? "bg-[#8b6b45]" : "bg-ember"}`}
      />
      {subtitle && (
        <motion.p variants={item} className={`mt-3 text-sm md:text-base ${dark ? "text-[#6b5236]/80" : "text-[#f6ecd9]/50"}`}>
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
