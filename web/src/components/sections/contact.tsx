import { Reveal } from "@/components/effects/reveal";
import { site } from "@/content/site";
import { ContactForm } from "./contact-form";
import { SectionHeading } from "./section-heading";

export function Contact() {
  return (
    <section id="contact" className="border-t border-line px-5 py-20 sm:px-10 lg:px-16">
      <SectionHeading
        kicker="03 — Contact"
        title="Send a brief. Get a reply."
        className="sm:text-4xl"
      />

      <div className="mt-12 grid gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="max-w-md text-base leading-relaxed text-muted">
            A paragraph is enough: what you want, who it is for, when it has to be live.
          </p>

          <p className="mt-8 font-mono text-sm break-all text-fg">
            <a href={`mailto:${site.email}`} className="hover:underline">
              {site.email}
            </a>
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {site.location}
          </p>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
            Replies within a working day
          </p>
        </Reveal>

        <Reveal delay={120}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
