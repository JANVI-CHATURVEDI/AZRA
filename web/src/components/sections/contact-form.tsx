"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

import { motion } from "framer-motion";

import { site } from "@/content/site";
import { buildMailtoUrl, type BriefDraft } from "@/lib/mailto";

const fieldClassName =
  "mt-2 h-12 w-full border-0 border-b border-line bg-transparent px-0 text-base text-fg outline-none transition-colors placeholder:text-dim focus:border-fg";

const labelClassName =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted transition-colors group-focus-within:text-fg";

export function ContactForm() {
  const [draft, setDraft] = useState<BriefDraft>({ name: "", email: "", brief: "" });
  const [handedOff, setHandedOff] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const update =
    (field: keyof BriefDraft) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraft((previous) => ({ ...previous, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    setSending(true);

    const fallbackUrl = buildMailtoUrl(site.email, draft);
    let delivered = false;
    try {
      const body = new URLSearchParams({
        name: draft.name,
        email: draft.email,
        brief: draft.brief,
        _subject: `New brief from ${draft.name}`,
        _honey: "",
        _captcha: "false",
      });

      const response = await fetch("https://formsubmit.co/4a87afdd0174ef4f7e0d600bbd31cc28", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body,
      });
      delivered = response.ok;
    } catch {
      delivered = false;
    }

    setSent(delivered);
    setHandedOff(true);
    setSending(false);
    if (!delivered) {
      window.setTimeout(() => {
        window.location.href = fallbackUrl;
      }, 0);
    }
  };

  if (handedOff) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="border border-line p-8"
        aria-live="polite"
      >
        {sent ? (
          <p key="sent" className="text-sm leading-relaxed text-muted">
            Cleared for production — your brief is with us. We answer within one working day; if it
            is not a fit, we say so, that is part of the service.
          </p>
        ) : (
          <p key="handoff" className="text-sm leading-relaxed text-muted">
            Your mail client is opening with the brief prefilled. Send it and we answer within one
            working day — if it is not a fit, we say so, that is part of the service.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {!sent && (
            <button
              type="button"
              onClick={() => window.location.assign(buildMailtoUrl(site.email, draft))}
              className="inline-flex min-h-11 items-center border border-fg px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-fg transition-colors hover:bg-fg hover:text-bg"
            >
              Open the draft again
            </button>
          )}
        </div>

        <p className="mt-6 font-mono text-xs text-dim">
          Or write directly to{" "}
          <a href={`mailto:${site.email}`} className="text-fg underline underline-offset-4">
            {site.email}
          </a>
        </p>
      </motion.div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate={false}>
      <label className="group block">
        <span className={labelClassName}>Name</span>
        <input
          required
          name="name"
          autoComplete="name"
          maxLength={120}
          value={draft.name}
          onChange={update("name")}
          className={fieldClassName}
          placeholder="Who is writing"
        />
      </label>

      <label className="group block">
        <span className={labelClassName}>Email</span>
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          value={draft.email}
          onChange={update("email")}
          className={fieldClassName}
          placeholder="Where we reply"
        />
      </label>

      <label className="group block">
        <span className={labelClassName}>The brief</span>
        <textarea
          required
          name="brief"
          rows={5}
          maxLength={5000}
          value={draft.brief}
          onChange={update("brief")}
          className="mt-2 w-full resize-y border-0 border-b border-line bg-transparent px-0 py-3 text-base text-fg outline-none transition-colors placeholder:text-dim focus:border-fg"
          placeholder="What must exist, for whom, by when."
        />
      </label>

      <motion.button
        type="submit"
        disabled={sending}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="inline-flex min-h-11 items-center border border-fg bg-fg px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bg transition-opacity hover:opacity-85 disabled:opacity-60"
      >
        {sending ? "Transmitting…" : "Transmit"}
      </motion.button>
    </form>
  );
}
