import { Reveal } from "@/components/effects/reveal";
import { capabilities, marqueeServices } from "@/content/services";
import { SectionHeading } from "./section-heading";

export function Services() {
  return (
    <section id="services" className="py-20">
      <div className="px-5 sm:px-10 lg:px-16">
        <SectionHeading
          kicker="01 — Services"
          title="What I actually do."
          className="max-w-2xl sm:text-4xl"
        />
      </div>

      <Reveal className="mt-10">
        <div className="overflow-hidden border-y border-line">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex" aria-hidden={copy === 1}>
                {marqueeServices.map((service) => (
                  <span
                    key={`${copy}-${service}`}
                    className="shrink-0 border-r border-line px-8 py-5 font-display text-2xl font-medium uppercase tracking-tight text-fg/80 sm:text-4xl"
                  >
                    {service}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-px bg-line px-5 sm:grid-cols-2 sm:px-10 lg:grid-cols-3 lg:px-16">
        {capabilities.map((capability, index) => (
          <Reveal key={capability.title} delay={index * 90} className="bg-bg p-8">
            <h3 className="font-display text-xl font-semibold">{capability.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">{capability.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
