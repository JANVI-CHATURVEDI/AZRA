"use client";

import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";

import { nav, site } from "@/content/site";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const groupRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const menuOpen = (hovered && !dismissed) || pinned;

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setCanHover(fine.matches);
      setReduceMotion(reduce.matches);
    };
    sync();
    fine.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const clip = clipRef.current;
    const row = rowRef.current;
    if (!clip || !row) return;
    if (!menuOpen) {
      clip.style.removeProperty("width");
      return;
    }
    let alive = true;
    const expand = () => {
      if (alive) clip.style.width = `${row.scrollWidth}px`;
    };
    expand();
    document.fonts?.ready.then(expand);
    window.addEventListener("resize", expand);
    return () => {
      alive = false;
      window.removeEventListener("resize", expand);
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setPanelOpen(false);
      setPinned(false);
      setHovered(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!groupRef.current?.contains(event.target as Node)) setPinned(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [pinned]);

  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? doc.scrollTop / scrollable : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/70 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/60">
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-10">
        <a
          href="#top"
          className="font-display text-sm font-semibold tracking-[0.35em]"
          onClick={() => setPanelOpen(false)}
        >
          {site.name}
        </a>

        {}
        <div
          ref={groupRef}
          className="hidden items-center gap-2 lg:flex"
          onMouseEnter={() => {
            if (!canHover) return;
            setDismissed(false);
            setHovered(true);
          }}
          onMouseLeave={() => {
            if (canHover) setHovered(false);
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setPinned(false);
          }}
        >
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="desktop-nav"
            className="inline-flex min-h-9 items-center gap-1.5 whitespace-nowrap border border-line bg-elevated/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fg backdrop-blur-md transition-colors hover:border-fg motion-reduce:transition-none"
            onClick={() => {
              setDismissed(false);
              setPinned((previous) => !previous);
            }}
          >
            <span aria-hidden="true" className="text-muted">
              [
            </span>
            menu
            <span aria-hidden="true" className="text-muted">
              ]
            </span>
          </button>

          <div
            ref={clipRef}
            id="desktop-nav"
            style={{
              visibility: menuOpen ? "visible" : "hidden",
              transition: reduceMotion
                ? undefined
                : menuOpen
                  ? "width 700ms cubic-bezier(.25, 1, .5, 1), visibility 0s"
                  : "width 700ms cubic-bezier(.25, 1, .5, 1), visibility 0s linear 700ms",
            }}
            className="w-0 overflow-hidden"
          >
            <nav
              ref={rowRef}
              aria-label="Primary"
              className="flex w-max items-center gap-6 border border-line bg-elevated/70 px-5 py-2 backdrop-blur-md"
            >
              {nav.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setPinned(false);
                    setDismissed(true);
                  }}
                  className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-muted transition-[scale,color] duration-300 [transition-timing-function:cubic-bezier(.34,1.56,.64,1)] hover:scale-[1.14] hover:text-fg motion-reduce:transition-none"
                >
                  {}
                  <span
                    style={{ transitionDelay: menuOpen ? `${90 + index * 55}ms` : "0ms" }}
                    className={cn(
                      "inline-block transition-all duration-300 motion-reduce:transition-none",
                      menuOpen ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0",
                    )}
                  >
                    {item.label}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted lg:flex">
            <span className="pulse-dot inline-block size-2 rounded-full bg-fg" aria-hidden="true" />
            Available
          </span>

          <motion.a
            href="#contact"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="inline-flex min-h-9 items-center border border-fg bg-fg px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bg transition-opacity hover:opacity-85"
          >
            Start a Brief
          </motion.a>

          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-1.5 border border-line px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fg transition-colors hover:border-fg motion-reduce:transition-none lg:hidden"
            aria-expanded={panelOpen}
            aria-controls="mobile-nav"
            aria-label={panelOpen ? "Close menu" : "Open menu"}
            onClick={() => setPanelOpen((previous) => !previous)}
          >
            <span aria-hidden="true" className="text-muted">
              [
            </span>
            {panelOpen ? "close" : "menu"}
            <span aria-hidden="true" className="text-muted">
              ]
            </span>
          </button>
        </div>
      </div>

      {}
      <div
        ref={progressRef}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-fg"
      />

      <nav
        id="mobile-nav"
        aria-label="Primary mobile"
        className={cn("border-t border-line lg:hidden", panelOpen ? "block" : "hidden")}
      >
        <ul className="grid font-mono text-[12px] uppercase tracking-[0.2em]">
          {nav.map((item) => (
            <li key={item.href} className="border-b border-line last:border-b-0">
              <a
                href={item.href}
                className="block px-5 py-4 text-muted hover:bg-elevated hover:text-fg sm:px-10"
                onClick={() => setPanelOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
