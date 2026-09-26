export interface BriefDraft {
  name: string;
  email: string;
  brief: string;
}

export function buildMailtoUrl(to: string, draft: BriefDraft): string {
  const name = draft.name.trim();
  const email = draft.email.trim();
  const brief = draft.brief.trim();

  const subject = `Brief from ${name}`;
  const body = [brief, "", `— ${name}`, email].join("\n");

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildBriefText(to: string, draft: BriefDraft): string {
  const { name, email, brief } = {
    name: draft.name.trim(),
    email: draft.email.trim(),
    brief: draft.brief.trim(),
  };

  return [`To: ${to}`, `Subject: Brief from ${name}`, "", brief, "", `— ${name} (${email})`].join(
    "\n",
  );
}
