import { Reveal } from "@/components/effects/reveal";
import { manifestoClose, principles } from "@/content/principles";
import { SectionHeading } from "./section-heading";

export function Manifesto() {
  return (
    <section id="manifesto" className="border-y border-line px-5 py-20 sm:px-10 lg:px-16">
      <SectionHeading kicker="00 — Manifesto" title="No bloat. Just work that lands." />

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        {principles.map((principle, index) => (
          <Reveal key={principle.title} delay={index * 90}>
            <article>
              <h3 className="font-display text-xl font-semibold">{principle.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">{principle.copy}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="mt-16 max-w-3xl text-base leading-relaxed text-fg/90">{manifestoClose}</p>
      </Reveal>
    </section>
  );
}
