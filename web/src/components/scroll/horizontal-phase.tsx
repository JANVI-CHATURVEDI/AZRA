"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { gsap } from "@/lib/gsap";

export function HorizontalPhase({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const phase = ref.current;
    if (!phase) return;
    const track = phase.querySelector<HTMLElement>("[data-h-track]");
    if (!track) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      phase.classList.add("is-active");

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: phase,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        phase.classList.remove("is-active");
        gsap.set(track, { x: 0 });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} data-horizontal className="horizontal-phase relative">
      <div data-h-track className="h-track">
        {children}
      </div>
    </div>
  );
}
