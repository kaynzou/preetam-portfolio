import { projects, sideQuests } from "@/data/profile";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { icons } from "@/components/ui/Icons";

const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 text-[#c9803f]/70" aria-hidden>
      <span className="h-px w-10 bg-current opacity-40" />
      <span className="text-[10px] font-bold tracking-[0.2em]">{label}</span>
      <span className="h-px w-10 bg-current opacity-40" />
    </div>
  );
}

function Placeholder({ name }: { name: string }) {
  return (
    <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_30%_20%,#4a2418,#1a0a0a)]">
      <span className="font-display text-5xl font-bold text-ember/70">{name[0]}</span>
    </div>
  );
}

export function Projects() {
  return (
    <section
      id="projects"
      className="relative overflow-hidden px-4 py-24 md:py-32"
      style={{ background: "linear-gradient(#1a0a0a 0%, #0d0808 50%, #1a0a0a 100%)" }}
    >
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading eyebrow="Quest Log" title="Projects" subtitle="legendary encounters conquered, each worth remembering." />

        <div className="mt-14 flex flex-col gap-8">
          {projects.map((p, i) => (
            <ScrollReveal key={p.name}>
              <div className="mb-6">
                <Divider label={numerals[i] ?? String(i + 1)} />
              </div>
              <article className="group grid gap-6 rounded-2xl border border-[#c9803f]/20 bg-[#1c0e0b]/80 p-5 shadow-[0_0_40px_rgba(201,128,63,0.05)] transition hover:border-[#c9803f]/40 hover:shadow-[0_0_60px_rgba(201,128,63,0.12)] md:grid-cols-[240px_1fr] md:p-7">
                <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/5">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <Placeholder name={p.name} />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#f6ecd9] md:text-3xl">{p.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#f6ecd9]/65">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-md bg-[#5a1f1a]/60 px-2.5 py-1 text-[11px] text-[#f0b89a]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.link && <ProjectButton href={p.link} icon="link" label="Link" />}
                    {p.demo && <ProjectButton href={p.demo} icon="play" label="Demo Video" />}
                    {p.github && <ProjectButton href={p.github} icon="github" label="Code" />}
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {sideQuests.length > 0 && (
          <div className="mt-20">
            <div className="mb-8 border-t border-[#c9803f]/15 pt-8">
              <p className="text-center text-[11px] font-semibold tracking-[0.3em] text-ember/70">SIDE QUESTS</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {sideQuests.map((q, i) => {
                const Card = q.link ? "a" : "div";
                return (
                  <ScrollReveal key={q.name} delay={i * 0.06}>
                    <Card
                      {...(q.link ? { href: q.link, target: "_blank", rel: "noreferrer" } : {})}
                      className="block h-full rounded-xl border border-[#c9803f]/15 bg-[#1c0e0b]/70 p-4 transition hover:-translate-y-1 hover:border-[#c9803f]/40"
                    >
                      <p className="text-[9px] font-bold tracking-[0.2em] text-ember/70">SIDE QUEST</p>
                      <h4 className="mt-1 font-bold text-[#f6ecd9]">{q.name}</h4>
                      <p className="mt-2 text-xs leading-relaxed text-[#f6ecd9]/55">{q.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {q.tags.map((t) => (
                          <span key={t} className="rounded bg-[#5a1f1a]/50 px-2 py-0.5 text-[10px] text-[#f0b89a]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </Card>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectButton({ href, icon, label }: { href: string; icon: "link" | "play" | "github"; label: string }) {
  const Icon = icons[icon];
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-1.5 rounded-lg border border-[#f6ecd9]/15 px-3 py-1.5 text-xs text-[#f6ecd9]/80 transition hover:border-ember/60 hover:text-ember"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}
