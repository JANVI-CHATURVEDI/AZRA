"use client";

import { useEffect } from "react";

const SKIP_SELECTOR = "[data-no-bloat], [role='dialog']";

const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TITLE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION",
  "SVG",
  "G",
  "PATH",
  "CIRCLE",
  "RECT",
  "DEFS",
  "FILTER",
]);

const MAX_WORD = 20;

function acceptText(node: Node): boolean {
  const value = node.nodeValue;
  if (!value || !/\S/.test(value)) return false;

  const parent = node.parentElement;
  if (!parent) return false;
  if (SKIP_TAGS.has(parent.tagName)) return false;
  if (parent.closest(SKIP_SELECTOR)) return false;

  if (parent.closest(".bw, .bloat-letter")) return false;
  return true;
}

function collectText(root: Node): Text[] {
  const found: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => (acceptText(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });

  let node = walker.nextNode();
  while (node) {
    found.push(node as Text);
    node = walker.nextNode();
  }
  return found;
}

function wrapText(text: Text) {
  const value = text.nodeValue;
  const parent = text.parentNode;
  if (!value || !parent) return;

  const parts = value.split(/(\s+)/).filter(Boolean);
  const wordCount = parts.filter((part) => !/^\s+$/.test(part)).length;

  if (parts.every((part) => /^\s+$/.test(part) || part.length > MAX_WORD)) return;

  let wrapInRun = false;
  if (wordCount > 1 && parent.nodeType === Node.ELEMENT_NODE) {
    const display = getComputedStyle(parent as Element).display;
    wrapInRun =
      display.includes("flex") || display.includes("grid") || display.includes("contents");
  }

  const fragment = document.createDocumentFragment();

  for (const part of parts) {
    if (!part) continue;
    if (/^\s+$/.test(part) || part.length > MAX_WORD) {
      fragment.appendChild(document.createTextNode(part));
      continue;
    }

    const word = document.createElement("span");
    word.className = "bw";
    for (const character of Array.from(part)) {
      const letter = document.createElement("span");
      letter.className = "bloat-letter";
      letter.textContent = character;
      word.appendChild(letter);
    }
    fragment.appendChild(word);
  }

  if (wrapInRun) {
    const run = document.createElement("span");
    run.className = "bw-run";
    run.appendChild(fragment);
    parent.replaceChild(run, text);
  } else {
    parent.replaceChild(fragment, text);
  }
}

export function CharBloat() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduceMotion.matches) return;

    for (const text of collectText(document.body)) wrapText(text);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const added of record.addedNodes) {
          if (added.nodeType === Node.TEXT_NODE) {
            if (acceptText(added)) wrapText(added as Text);
          } else if (added.nodeType === Node.ELEMENT_NODE && !added.parentElement?.closest(".bw")) {
            for (const text of collectText(added)) wrapText(text);
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
