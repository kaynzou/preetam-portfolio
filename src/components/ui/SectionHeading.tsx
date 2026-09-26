import { ScrollReveal } from "./ScrollReveal";

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
  return (
    <ScrollReveal className={align === "center" ? "text-center" : ""}>
      <p className={`text-xs font-semibold tracking-[0.3em] uppercase ${dark ? "text-[#7a5c3a]" : "text-ember/80"}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-2 text-4xl md:text-6xl font-bold ${dark ? "text-[#3a2a1a]" : "text-[#f6ecd9]"}`}>{title}</h2>
      {subtitle && (
        <p className={`mt-3 text-sm md:text-base ${dark ? "text-[#6b5236]/80" : "text-[#f6ecd9]/50"}`}>{subtitle}</p>
      )}
    </ScrollReveal>
  );
}
