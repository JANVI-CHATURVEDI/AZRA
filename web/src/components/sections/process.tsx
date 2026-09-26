import { Reveal } from "@/components/effects/reveal";
import { process } from "@/content/process";
import { SectionHeading } from "./section-heading";

export function Process() {
  return (
    <section id="process" className="border-t border-line px-5 py-20 sm:px-10 lg:px-16">
      <SectionHeading
        kicker="02 — Process"
        title="Three steps. No mystery."
        className="sm:text-4xl"
      />

      <div className="mt-12 divide-y divide-line border-y border-line">
        {process.map((step, index) => (
          <Reveal key={step.n} delay={index * 90}>
            <div className="grid gap-4 py-10 sm:grid-cols-[88px_1fr] sm:gap-12">
              <p className="font-mono text-sm tabular-nums text-muted">{step.n}</p>
              <div>
                <h3 className="font-display text-2xl font-semibold">{step.title}</h3>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">{step.copy}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
