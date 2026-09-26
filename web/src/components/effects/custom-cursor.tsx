"use client";

import { useEffect, useRef } from "react";

const HOVER_SELECTOR = "a, button, [role='button'], input, textarea, [data-cursor-hover]";

export function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduceMotion.matches) return;

    const wrap = wrapRef.current;
    const dotLayer = wrap?.querySelector<HTMLElement>("#cursor-dot-layer");
    const ringLayer = wrap?.querySelector<HTMLElement>("#cursor-ring-layer");
    if (!wrap || !dotLayer || !ringLayer) return;

    document.documentElement.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let visible = false;
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!visible) {
        visible = true;
        ringX = mouseX;
        ringY = mouseY;
        wrap.style.opacity = "1";
      }
    };

    const onPointerOver = (event: Event) => {
      const target = event.target as Element | null;
      if (!target?.closest) return;
      const state = target.closest("input, textarea")
        ? "text"
        : target.closest(HOVER_SELECTOR)
          ? "hover"
          : "default";
      wrap.dataset.cursorState = state;
    };

    const onPointerLeave = () => {
      visible = false;
      wrap.style.opacity = "0";
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      dotLayer.style.transform = `translate3d(${Math.round(mouseX)}px, ${Math.round(mouseY)}px, 0)`;
      ringLayer.style.transform = `translate3d(${Math.round(ringX)}px, ${Math.round(ringY)}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      id="cursor"
      data-cursor-state="default"
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden opacity-0 transition-opacity motion-reduce:hidden [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      <div id="cursor-dot-layer" className="absolute left-0 top-0 will-change-transform">
        <span id="cursor-dot" className="absolute block" />
      </div>
      <div id="cursor-ring-layer" className="absolute left-0 top-0 will-change-transform">
        <span id="cursor-ring" className="absolute block" />
      </div>
      <div id="cursor-beam-layer" className="absolute left-0 top-0 will-change-transform">
        <span id="cursor-beam" className="absolute block" />
      </div>
    </div>
  );
}
