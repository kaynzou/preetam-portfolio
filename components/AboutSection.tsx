import { ImageReveal } from "./ImageReveal";
import { ScrollReveal } from "./ScrollReveal";
import { MouseGlow } from "./MouseGlow";
import { profile, skills, achievements, connect } from "@/lib/content";

export function AboutSection() {
  return (
    <section id="about" className="relative bg-[#0E0A08] py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-xs tracking-[0.3em] text-[#E8823A] mb-3">about</p>
          <h2 className="font-display text-5xl text-[#F3ECDD] mb-14">
            Character Sheet
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <ScrollReveal direction="left">
            <MouseGlow innerClassName="border border-[#F3ECDD]/10 bg-[#0E0A08] overflow-hidden">
              <div className="relative">
                <ImageReveal
                  baseSrc="/images/me-base.jpg"
                  revealSrc="/images/me-alt.jpg"
                  alt={profile.name}
                  className="w-full aspect-[3/4]"
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-between pointer-events-none">
                  <div>
                    <p className="font-display text-2xl text-[#F3ECDD]">
                      {profile.name}
                    </p>
                    <p className="text-sm text-[#D9C39F]/80 tracking-widest">
                      {profile.archetype.toUpperCase()}
                    </p>
                  </div>
                  <p className="text-[#D9C39F] text-sm">Lv. {profile.level}</p>
                </div>
              </div>
            </MouseGlow>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1}>
            <MouseGlow innerClassName="border border-[#F3ECDD]/10 bg-[#0E0A08] p-8 h-full">
              <div className="text-[#D9C39F] space-y-4 leading-relaxed">
                {profile.bio.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              <div className="mt-8">
                <p className="text-xs tracking-[0.3em] text-[#E8823A] mb-3">
                  skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full border border-[#F3ECDD]/15 text-[#F3ECDD] text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#F3ECDD]/10 flex flex-wrap gap-3 items-center">
                <p className="text-xs tracking-[0.3em] text-[#E8823A]">
                  connect
                </p>
                <div className="flex gap-3">
                  <ConnectIcon href={`mailto:${connect.email}`} label="Email" />
                  <ConnectIcon href={connect.linkedin} label="LinkedIn" />
                  <ConnectIcon href={connect.github} label="GitHub" />
                  {connect.resumeUrl && (
                    <ConnectIcon href={connect.resumeUrl} label="Resume" />
                  )}
                </div>
              </div>

              <p className="mt-6 text-sm text-[#D9C39F]/60">
                {profile.facts.join(" · ")}
              </p>
            </MouseGlow>
          </ScrollReveal>
        </div>

        {achievements.length > 0 && (
          <ScrollReveal delay={0.15} className="mt-20">
            <p className="text-xs tracking-[0.3em] text-[#E8823A] mb-6">
              achievements unlocked
            </p>
            <div className="flex flex-wrap gap-8">
              {achievements.map((a) => (
                <div key={a.id} className="text-center">
                  <div className="w-16 h-16 rounded-full border border-[#E8823A]/50 flex items-center justify-center text-[#E8823A] text-sm font-medium mb-2">
                    {a.place}
                  </div>
                  <p className="text-[#D9C39F] text-sm max-w-[110px]">
                    {a.label}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

function ConnectIcon({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      aria-label={label}
      className="focus-ring w-10 h-10 rounded-full bg-[#F3ECDD]/10 hover:bg-[#F3ECDD]/20 flex items-center justify-center text-[#F3ECDD] text-xs transition-colors"
    >
      {label.slice(0, 2)}
    </a>
  );
}
