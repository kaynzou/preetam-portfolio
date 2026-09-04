import { ScrollReveal } from "./ScrollReveal";
import { StarField } from "./StarField";
import { connect, profile } from "@/lib/content";

const cards = [
  {
    key: "linkedin",
    label: "LinkedIn",
    sub: "Join the party.",
    cta: "CONNECT →",
    href: connect.linkedin,
  },
  {
    key: "email",
    label: "Email",
    sub: "Send a message.",
    cta: "MESSAGE →",
    href: `mailto:${connect.email}`,
  },
  {
    key: "github",
    label: "GitHub",
    sub: "See the code.",
    cta: "BROWSE →",
    href: connect.github,
  },
  connect.resumeUrl
    ? {
        key: "resume",
        label: "Resume",
        sub: "Full adventure log.",
        cta: "VIEW →",
        href: connect.resumeUrl,
      }
    : null,
  connect.youtube
    ? {
        key: "youtube",
        label: "YouTube",
        sub: "Watch the journey.",
        cta: "WATCH →",
        href: connect.youtube,
      }
    : null,
  connect.x
    ? { key: "x", label: "X", sub: "Follow along.", cta: "FOLLOW →", href: connect.x }
    : null,
  connect.instagram
    ? {
        key: "instagram",
        label: "Instagram",
        sub: "Building in public.",
        cta: "FOLLOW →",
        href: connect.instagram,
      }
    : null,
].filter(Boolean) as { key: string; label: string; sub: string; cta: string; href: string }[];

export function ConnectSection() {
  return (
    <section id="connect">
      <div className="bg-[#F3ECDD] py-24 px-6 text-center">
        <ScrollReveal>
          <p className="text-xs tracking-[0.3em] text-[#7A5A32] mb-3">
            treasure found
          </p>
          <h2 className="font-display text-5xl text-[#2A3B2C] mb-3">
            Let&apos;s Connect
          </h2>
          <p className="text-[#5C4A3A] mb-14">take what you need, adventurer.</p>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <ScrollReveal key={card.key} delay={i * 0.05}>
              <a
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="focus-ring block bg-white rounded-xl p-6 h-full hover:-translate-y-1 transition-transform shadow-sm"
              >
                <p className="font-display text-lg text-[#2A3B2C] mb-1">
                  {card.label}
                </p>
                <p className="text-sm text-[#5C4A3A]/70 mb-4">{card.sub}</p>
                <span className="text-sm font-medium text-[#E8823A]">
                  {card.cta}
                </span>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <div className="relative bg-[#0E1A16] pt-16 pb-10 px-6 text-center overflow-hidden">
        <StarField className="absolute inset-0 opacity-70" />
        <div className="relative z-10">
          <p className="text-[#D9C39F]/50 text-sm mb-6">
            the adventure never ends.
          </p>
          <p className="text-[#D9C39F]/30 text-xs">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </div>
    </section>
  );
}
