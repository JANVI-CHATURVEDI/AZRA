"use client";

const CHANGE_EVENT = "azra:session-change";

export function readSessionFlag(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) === "1";
  } catch {
    return true;
  }
}

export function subscribeToSessionFlag(onStoreChange: () => void): () => void {
  const notify = () => onStoreChange();
  window.addEventListener(CHANGE_EVENT, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(CHANGE_EVENT, notify);
    window.removeEventListener("storage", notify);
  };
}

export function writeSessionFlag(key: string): void {
  try {
    window.sessionStorage.setItem(key, "1");
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
