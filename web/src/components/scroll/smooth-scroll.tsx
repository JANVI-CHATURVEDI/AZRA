"use client";

import { useEffect } from "react";

import Lenis from "lenis";

import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1 });
    (window as typeof window & { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    document.documentElement.classList.add("has-lenis");

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      event.preventDefault();

      const yFor = () => {
        const horizontal = target.closest<HTMLElement>("[data-horizontal]");
        if (horizontal) {
          const track = horizontal.querySelector<HTMLElement>("[data-h-track]");
          const trigger = ScrollTrigger.getAll().find((t) => t.trigger === horizontal);
          if (track && trigger) {
            const maxOffset = track.scrollWidth - window.innerWidth;
            const offsetX =
              target.getBoundingClientRect().left - track.getBoundingClientRect().left;
            const progress = maxOffset > 0 ? Math.min(1, Math.max(0, offsetX / maxOffset)) : 0;
            return trigger.start + progress * (trigger.end - trigger.start);
          }
        }
        return target.getBoundingClientRect().top + window.scrollY;
      };

      let retried = false;
      const glide = () => {
        lenis.scrollTo(yFor(), {
          force: true,
          onComplete: () => {
            if (retried) return;
            const settled = yFor();
            if (Math.abs(settled - window.scrollY) > 2) {
              retried = true;
              glide();
            }
          },
        });
      };
      glide();
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      document.documentElement.classList.remove("has-lenis");
      lenis.destroy();
      delete (window as typeof window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
