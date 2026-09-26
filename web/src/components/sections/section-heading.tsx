import { Reveal } from "@/components/effects/reveal";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  kicker: string;
  title: string;

  className?: string;
}

export function SectionHeading({ kicker, title, className }: SectionHeadingProps) {
  return (
    <Reveal>
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">{kicker}</p>
      <h2
        className={cn(
          "mt-4 font-display text-3xl font-semibold tracking-tight",
          className ?? "max-w-3xl sm:text-5xl",
        )}
      >
        {title}
      </h2>
    </Reveal>
  );
}
