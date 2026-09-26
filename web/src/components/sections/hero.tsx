"use client";

import { motion } from "framer-motion";

import { LetterBloat } from "@/components/effects/letter-bloat";
import { site } from "@/content/site";

const promises = [
  "One developer, start to finish",
  "Fixed scope, fixed price",
  "Live in weeks, not quarters",
];

export function Hero() {
  return (
    <section className="px-5 pb-24 pt-28 sm:px-10 sm:pt-36 lg:px-16">
      <p className="hero-rise hero-rise-1 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
        <span className="pulse-dot inline-block size-2 rounded-full bg-fg" aria-hidden="true" />
        {site.tagline} — available for new work
      </p>

      <div className="hero-rise hero-rise-2 mt-6 max-w-5xl">
        <LetterBloat
          as="h1"
          text="Designed, built, shipped — by one."
          className="font-display text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
        />
      </div>

      <div className="hero-rise hero-rise-3 mt-8">
        <p className="max-w-xl text-lg leading-relaxed text-muted">
          Websites and web apps by AZRA — one pair of hands from first sketch to production. No
          handoffs, no agency layer, no bloat.
        </p>
      </div>

      <div className="hero-rise hero-rise-4 mt-10 flex flex-wrap gap-3">
        <motion.a
          href="#work"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="inline-flex min-h-11 items-center border border-fg bg-fg px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bg transition-opacity hover:opacity-85"
        >
          See the work
        </motion.a>
        <motion.a
          href="#contact"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="inline-flex min-h-11 items-center border border-line px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-fg transition-colors hover:border-fg"
        >
          Start a brief
        </motion.a>
      </div>

      <ul className="hero-rise hero-rise-4 mt-14 grid gap-px border-y border-line bg-line font-mono text-[11px] uppercase tracking-[0.16em] text-muted sm:grid-cols-3">
        {promises.map((promise) => (
          <li key={promise} className="bg-bg px-4 py-5">
            {promise}
          </li>
        ))}
      </ul>
    </section>
  );
}
