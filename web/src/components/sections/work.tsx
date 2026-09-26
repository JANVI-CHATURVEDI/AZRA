"use client";

import Image from "next/image";
import { useState } from "react";

import { motion } from "framer-motion";

import { Reveal } from "@/components/effects/reveal";
import { projects } from "@/content/work";
import { cn } from "@/lib/cn";
import { SectionHeading } from "./section-heading";

const itemClassName =
  "flex shrink-0 items-baseline gap-3 border-r border-line px-6 py-2 font-display text-3xl font-semibold uppercase tracking-tight transition-colors duration-200 sm:gap-5 sm:px-10 sm:text-6xl";

export function Work() {
  const [activeCode, setActiveCode] = useState(projects[0].code);
  const project = projects.find((item) => item.code === activeCode) ?? projects[0];

  const select = (code: string) => setActiveCode(code);

  return (
    <section id="work" className="border-t border-line py-20">
      <div className="px-5 sm:px-10 lg:px-16">
        <SectionHeading kicker="Selected work" title="Things I built and shipped." />
        <Reveal className="mt-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <p className="max-w-xl text-base leading-relaxed text-muted">
            Real screens from real launches — no mockups, no staging.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
            Hover to pause · click a name
          </p>
        </Reveal>
      </div>

      <div className="project-line mt-10 overflow-hidden border-y border-line" data-cursor-hover>
        <div className="project-line-track">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex" aria-hidden={pass === 1 || undefined}>
              {projects.map((item) =>
                pass === 0 ? (
                  <button
                    key={item.code}
                    type="button"
                    data-code={item.code}
                    aria-pressed={activeCode === item.code}
                    onClick={() => select(item.code)}
                    className={cn(
                      itemClassName,
                      activeCode === item.code
                        ? "text-fg"
                        : "text-fg/40 hover:border-line-strong hover:text-fg",
                    )}
                  >
                    <span className="font-mono text-[11px] tracking-[0.2em] text-muted">
                      {item.code}
                    </span>
                    {item.name}
                  </button>
                ) : (
                  <span
                    key={item.code}
                    data-code={item.code}
                    aria-hidden="true"
                    className={cn(
                      itemClassName,
                      activeCode === item.code ? "text-fg" : "text-fg/40",
                    )}
                  >
                    <span className="font-mono text-[11px] tracking-[0.2em] text-muted">
                      {item.code}
                    </span>
                    {item.name}
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 sm:px-10 lg:px-16" data-project-detail>
        {}
        <motion.div
          key={project.code}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="project-detail mt-12 grid gap-8 lg:grid-cols-[1.5fr_1fr]"
        >
          <div className="relative aspect-[21/10] overflow-hidden border border-line">
            <Image
              src={project.image}
              alt={project.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover object-top"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              <span>{project.code}</span>
              <span>{project.kind}</span>
            </div>

            <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {project.name}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-muted">{project.summary}</p>

            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
              Click another name on the line to switch
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
