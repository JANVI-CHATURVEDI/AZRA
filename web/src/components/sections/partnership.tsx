import { Reveal } from "@/components/effects/reveal";
import { partnershipClose, partnershipItems, partnershipLead } from "@/content/partnership";
import { SectionHeading } from "./section-heading";

export function Partnership() {
  return (
    <section id="partnership" className="border-t border-line px-5 py-20 sm:px-10 lg:px-16">
      <SectionHeading kicker="Partnership" title="One developer. The whole stack." />

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <Reveal>
          <p className="text-base leading-relaxed text-muted">{partnershipLead}</p>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-base leading-relaxed text-muted">{partnershipClose}</p>
        </Reveal>
      </div>

      <ul className="mt-10 grid gap-3 font-mono text-[12px] uppercase tracking-[0.16em] text-fg sm:grid-cols-2 lg:grid-cols-3">
        {partnershipItems.map((item, index) => (
          <li key={item}>
            <Reveal delay={index * 60} className="h-full border-t border-line pt-3">
              {item}
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
