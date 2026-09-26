import Link from "next/link";

import { LetterBloat } from "@/components/effects/letter-bloat";
import { WaveBackground } from "@/components/effects/wave-background";
import { site } from "@/content/site";

export default function NotFound() {
  return (
    <main
      id="top"
      className="relative flex min-h-screen flex-col justify-between bg-bg px-5 py-12 text-fg sm:px-10 lg:px-16"
    >
      <WaveBackground />

      <div className="relative z-1 flex flex-1 flex-col justify-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
          404 — Off course
        </p>

        <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.2rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.035em]">
          This coordinate is not on the flight plan.
        </h1>

        <p className="mt-8 max-w-xl text-base leading-relaxed text-muted">
          The page you asked for does not exist — it may have been moved, or the brief was never
          written. The studio is one click away.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center border border-fg bg-fg px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bg transition-opacity hover:opacity-80"
          >
            Return to the studio
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-11 items-center border border-line px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            Open a brief
          </a>
        </div>
      </div>

      <div className="relative z-1 flex items-end justify-between gap-6 border-t border-line pt-8">
        <LetterBloat
          as="p"
          text={site.name}
          className="font-display text-4xl font-semibold tracking-[0.2em] sm:text-6xl"
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
          {site.legalLine}
        </p>
      </div>
    </main>
  );
}
