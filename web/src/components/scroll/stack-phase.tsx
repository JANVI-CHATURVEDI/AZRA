"use client";

import { Children, useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function StackPhase({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const slots = gsap.utils.toArray<HTMLElement>(container.children);

      slots.forEach((slot, index) => {
        slot.style.zIndex = String(index + 1);
        const inner = slot.firstElementChild as HTMLElement | null;
        const next = slots[index + 1];

        if (next) {
          ScrollTrigger.create({
            trigger: slot,
            start: "top top",
            end: "bottom top",
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
          });
        }

        if (next && inner) {
          gsap.to(inner, {
            y: -80,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
          });
          gsap.to(inner, {
            opacity: 0.25,
            scale: 0.965,
            transformOrigin: "50% 30%",
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
          });
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className="stack-phase relative">
      {Children.map(children, (child, index) => (
        <div className={cn("stack-slot", index > 0 && "stack-sheet")} key={index}>
          {child}
        </div>
      ))}
    </div>
  );
}
