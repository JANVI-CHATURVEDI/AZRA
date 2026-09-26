import { LetterBloat } from "@/components/effects/letter-bloat";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="relative z-1 border-t border-line px-5 pt-12 pb-32 sm:px-10 lg:px-16">
      <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
        <LetterBloat
          as="p"
          text={site.name}
          className="font-display text-5xl font-semibold tracking-[0.2em] sm:text-7xl"
        />
        <p className="max-w-xs text-right text-sm text-muted">{site.footerNote}</p>
      </div>

      <div className="mt-12 flex flex-col justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-dim sm:flex-row">
        <span>{site.legalLine}</span>
        <span>{site.signOff}</span>
      </div>
    </footer>
  );
}
