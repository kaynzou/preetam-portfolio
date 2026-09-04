import { ScrollReveal } from "./ScrollReveal";
import { TiltCard } from "./TiltCard";
import { MouseGlow } from "./MouseGlow";
import { projects, sideQuests } from "@/lib/content";

function CornerBrackets() {
  return (
    <>
      <span className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#E8823A]/50" />
      <span className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#E8823A]/50" />
      <span className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#E8823A]/50" />
      <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#E8823A]/50" />
    </>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="relative bg-[#0E1A16] py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <p className="text-xs tracking-[0.3em] text-[#E8823A] mb-3">
            builds
          </p>
          <h2 className="font-display text-5xl text-[#F3ECDD] mb-14">
            Projects
          </h2>
        </ScrollReveal>

        <div className="space-y-8">
          {projects.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 0.08}>
              <MouseGlow innerClassName="border border-[#F3ECDD]/12 bg-[#0E0A08]/60">
                <TiltCard className="relative p-8">
                  <CornerBrackets />
                  <h3 className="font-display text-3xl text-[#F3ECDD] mb-3">
                    {project.name}
                  </h3>
                  <p className="text-[#D9C39F] leading-relaxed mb-5">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-[#E8823A]/10 border border-[#E8823A]/20 text-[#F3ECDD] text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#F3ECDD]/15 text-[#F3ECDD] text-sm hover:bg-[#F3ECDD]/5 transition-colors"
                    >
                      ↗ View on GitHub
                    </a>
                  )}
                </TiltCard>
              </MouseGlow>
            </ScrollReveal>
          ))}
        </div>

        {sideQuests.length > 0 && (
          <div className="mt-20">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-8">
                <span className="h-px flex-1 bg-[#F3ECDD]/15" />
                <p className="text-xs tracking-[0.3em] text-[#E8823A]">
                  side quests
                </p>
                <span className="h-px flex-1 bg-[#F3ECDD]/15" />
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 gap-5">
              {sideQuests.map((quest, i) => (
                <ScrollReveal key={quest.id} delay={i * 0.06}>
                  <MouseGlow
                    radius={220}
                    innerClassName="border border-[#F3ECDD]/10 bg-[#F3ECDD]/[0.03] h-full"
                  >
                    <TiltCard className="relative h-full p-6">
                      <p className="text-[10px] tracking-[0.25em] text-[#E8823A] mb-2">
                        SIDE QUEST
                      </p>
                      <h4 className="font-display text-xl text-[#F3ECDD] mb-2">
                        {quest.name}
                      </h4>
                      <p className="text-[#D9C39F]/80 text-sm leading-relaxed mb-4">
                        {quest.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {quest.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full bg-[#F3ECDD]/8 text-[#F3ECDD]/90 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {quest.url && (
                        <a
                          href={quest.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring text-[#E8823A] text-sm font-medium"
                        >
                          View on GitHub →
                        </a>
                      )}
                    </TiltCard>
                  </MouseGlow>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
