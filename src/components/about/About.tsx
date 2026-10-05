"use client";

import { motion } from "framer-motion";
import { achievements, profile, socials, type SocialKey } from "@/data/profile";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { icons } from "@/components/ui/Icons";
import { ImageReveal } from "./ImageReveal";

const socialOrder: SocialKey[] = ["linkedin", "email", "github", "youtube", "x", "instagram"];

function Lantern({ side }: { side: "left" | "right" }) {
  return (
    <div className={`pointer-events-none absolute top-0 hidden md:block ${side === "left" ? "left-6" : "right-6 -scale-x-100"}`} aria-hidden>
      <svg width="90" height="170" viewBox="0 0 90 170" className="overflow-visible">
        {/* vine */}
        <path d="M20 0 C 30 30 10 50 25 80 C 35 100 50 95 55 110" stroke="#2f4a22" strokeWidth="2.5" fill="none" />
        <path d="M25 30 q 10 -4 14 4 q -10 4 -14 -4z M18 58 q -10 -2 -12 6 q 9 2 12 -6z M32 88 q 9 -6 15 0 q -8 6 -15 0z" fill="#3d6b2a" />
      </svg>
      <div className="lantern absolute left-[44px] top-[108px]">
        <div className="mx-auto h-4 w-px bg-[#6b5236]" />
        <div className="relative h-8 w-6 rounded-md border border-[#6b5236] bg-[#f0884a]/30 shadow-[0_0_30px_12px_rgba(240,136,74,0.35)]">
          <div className="absolute inset-1.5 rounded-sm bg-[#ffc15e]/80 blur-[2px]" />
        </div>
      </div>
    </div>
  );
}

export function About() {
  const socialLinks = socialOrder.filter((k) => socials[k]);

  return (
    <section id="about" className="relative overflow-hidden bg-[#2a2218] px-4 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(240,136,74,0.08),transparent_60%)]" />
      <Lantern side="left" />
      <Lantern side="right" />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading eyebrow="About" title="Character Sheet" />

        <div className="mt-12 grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <ScrollReveal direction="left">
            <TiltCard className="relative overflow-hidden rounded-2xl border border-[#f6ecd9]/10 shadow-2xl shadow-black/50">
              <ImageReveal
                baseSrc={profile.photo}
                revealSrc={profile.photoReveal}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="aspect-[4/5] w-full"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 pt-16">
                <div>
                  <p className="font-display text-2xl font-bold text-white">
                    {profile.firstName} {profile.lastName}
                  </p>
                  <p className="text-[10px] font-semibold tracking-[0.3em] text-white/60">{profile.title}</p>
                </div>
                {profile.level > 0 && <p className="font-display text-xl font-bold text-white">Lv. {profile.level}</p>}
              </div>
              <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] tracking-wide text-white/70 backdrop-blur">
                hover to reveal ✦
              </span>
            </TiltCard>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1}>
            <div className="flex h-full flex-col gap-6 rounded-2xl border border-[#f6ecd9]/10 bg-[#1f1912]/80 p-6 md:p-8">
              <div>
                <p className="leading-relaxed text-[#f6ecd9]/80">
                  {profile.bio.map((part, i) =>
                    part.highlight ? (
                      <strong key={i} className="font-semibold text-ember">
                        {part.text}
                      </strong>
                    ) : (
                      <span key={i}>{part.text}</span>
                    ),
                  )}
                </p>
                {profile.education && (
                  <span className="mt-4 inline-block rounded-md border border-ember/30 bg-ember/10 px-3 py-1 text-xs text-[#f6ecd9]/80">
                    {profile.education}
                  </span>
                )}
              </div>

              <div>
                <p className="text-[11px] font-semibold tracking-[0.3em] text-ember/80">SKILLS</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.skills.map((s, i) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, scale: 0.7, y: 8 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 + i * 0.04 }}
                      whileHover={{ y: -3, borderColor: "rgba(240,136,74,0.6)", color: "#f0884a" }}
                      className="cursor-default rounded-md border border-[#f6ecd9]/10 bg-[#f6ecd9]/5 px-2.5 py-1 text-xs text-[#f6ecd9]/80"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>

              {(socialLinks.length > 0 || profile.resume) && (
              <div>
                <p className="text-[11px] font-semibold tracking-[0.3em] text-ember/80">CONNECT</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {socialLinks.map((k) => {
                    const Icon = icons[k];
                    return (
                      <motion.a
                        key={k}
                        href={socials[k]}
                        target={k === "email" ? undefined : "_blank"}
                        rel="noreferrer"
                        aria-label={k}
                        whileHover={{ y: -4, rotate: -6 }}
                        whileTap={{ scale: 0.9 }}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-[#f6ecd9]/10 bg-[#f6ecd9]/5 text-[#f6ecd9]/70 transition hover:border-ember/50 hover:text-ember"
                      >
                        <Icon className="h-4 w-4" />
                      </motion.a>
                    );
                  })}
                  {profile.resume && (
                    <motion.a
                      href={profile.resume}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-9 items-center gap-1.5 rounded-lg border border-ember/40 bg-ember/10 px-3 text-xs font-medium text-ember transition hover:bg-ember/20"
                    >
                      <icons.resume className="h-3.5 w-3.5" /> Resume
                    </motion.a>
                  )}
                </div>
              </div>
              )}

              {profile.hobbies.length > 0 && (
                <p className="mt-auto border-t border-[#f6ecd9]/10 pt-4 text-center text-xs text-[#f6ecd9]/45">
                  {profile.hobbies.join(" · ")}
                </p>
              )}
            </div>
          </ScrollReveal>
        </div>

        {achievements.length > 0 && (
          <div className="mt-16">
            <ScrollReveal>
              <p className="text-[11px] font-semibold tracking-[0.3em] text-ember/80">ACHIEVEMENTS UNLOCKED</p>
            </ScrollReveal>
            <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
              {achievements.map((a, i) => (
                <div key={a.title} className="flex flex-col items-center text-center">
                  {/* "achievement unlocked" pop: spins in, then hover for a wobble */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -120 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ type: "spring", stiffness: 260, damping: 14, delay: i * 0.1 }}
                    whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0], transition: { duration: 0.5 } }}
                    className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-gold/60 bg-gradient-to-b from-[#3a2d1c] to-[#1f1912] shadow-[0_0_20px_rgba(232,176,75,0.15)]"
                  >
                    <motion.span
                      aria-hidden
                      className="absolute -inset-1 rounded-full border border-dashed border-gold/30"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="px-1 font-display text-[11px] font-bold leading-tight text-gold">{a.rank}</span>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: 0.25 + i * 0.1 }}
                    className="mt-3 text-xs leading-snug text-[#f6ecd9]/60"
                  >
                    {a.title}
                  </motion.p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
