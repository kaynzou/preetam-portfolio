"use client";

import { motion } from "framer-motion";
import { TiltCard } from "@/components/ui/TiltCard";
import { profile, socials, type SocialKey } from "@/data/profile";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { icons } from "@/components/ui/Icons";
import { Campfire } from "@/components/hero/Campfire";

type Card = { key: SocialKey | "resume"; label: string; blurb: string; cta: string; href: string; color: string };

export function Connect() {
  const cards: Card[] = (
    [
      { key: "resume", label: "Resume", blurb: "Full adventure log", cta: "LOOT", href: profile.resume, color: "#d99a2b" },
      { key: "linkedin", label: "LinkedIn", blurb: "Join the party", cta: "CONNECT", href: socials.linkedin, color: "#0a66c2" },
      { key: "email", label: "Email", blurb: "Send a raven", cta: "MESSAGE", href: socials.email, color: "#e0662c" },
      { key: "github", label: "GitHub", blurb: "Inspect the forge", cta: "EXPLORE", href: socials.github, color: "#24292f" },
      { key: "youtube", label: "YouTube", blurb: "Watch the journey", cta: "WATCH", href: socials.youtube, color: "#e62117" },
      { key: "instagram", label: "Instagram", blurb: "Snapshots from the road", cta: "FOLLOW", href: socials.instagram, color: "#d6246e" },
      { key: "x", label: "X", blurb: "Tales from the tavern", cta: "FOLLOW", href: socials.x, color: "#111111" },
    ] satisfies Card[]
  ).filter((c) => c.href);

  return (
    <section id="connect" className="bg-[#f0f7e4] px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Treasure found" title="Let's Connect" subtitle="take what you need, adventurer." tone="dark" align="center" />
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {cards.map((c, i) => {
            const Icon = icons[c.key];
            return (
              <ScrollReveal key={c.key} delay={i * 0.08}>
                <TiltCard intensity={14} className="rounded-2xl">
                <motion.a
                  href={c.href}
                  target={c.key === "email" ? undefined : "_blank"}
                  rel="noreferrer"
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.96 }}
                  variants={{ rest: { y: 0 }, hover: { y: -6 } }}
                  className="flex w-40 flex-col items-center rounded-2xl border border-[#2f4a22]/10 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-xl"
                >
                  <motion.span
                    style={{ color: c.color }}
                    variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: [0, -12, 12, -6, 0], scale: 1.15 } }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="h-8 w-8" />
                  </motion.span>
                  <span className="mt-3 font-display font-bold text-[#1f2d17]">{c.label}</span>
                  <span className="mt-1 text-[11px] text-[#1f2d17]/50">{c.blurb}</span>
                  <span className="mt-4 flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold tracking-wide" style={{ color: c.color, background: `${c.color}18` }}>
                    {c.cta}
                    <motion.span variants={{ rest: { x: 0 }, hover: { x: 4 } }}>→</motion.span>
                  </span>
                </motion.a>
                </TiltCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const keys: SocialKey[] = ["linkedin", "email", "github", "youtube", "x", "instagram"];
  return (
    <footer className="relative overflow-hidden bg-[#10200f] px-4 py-16 text-center">
      {[12, 28, 45, 63, 78, 90].map((l, i) => (
        <span
          key={i}
          className="firefly absolute h-1 w-1 rounded-full bg-[#ffd36b] shadow-[0_0_8px_2px_rgba(255,211,107,0.6)]"
          style={{ left: `${l}%`, top: `${20 + ((i * 37) % 60)}%`, animationDelay: `${i * 0.9}s` }}
        />
      ))}
      <div className="mx-auto w-fit">
        <Campfire size={44} />
      </div>
      <div className="mt-6 flex justify-center gap-3">
        {keys
          .filter((k) => socials[k])
          .map((k) => {
            const Icon = icons[k];
            return (
              <motion.a
                key={k}
                href={socials[k]}
                target={k === "email" ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={k}
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/60 transition hover:border-ember/60 hover:text-ember"
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            );
          })}
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-6 text-xs text-white/40"
      >
        the adventure never ends.
      </motion.p>
      <p className="mt-1 text-[10px] text-white/25">
        © {new Date().getFullYear()} {profile.firstName} {profile.lastName}
      </p>
    </footer>
  );
}
