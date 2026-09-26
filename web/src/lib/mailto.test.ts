import { describe, expect, it } from "vitest";

import { buildBriefText, buildMailtoUrl } from "./mailto";

const draft = {
  name: "  Ada Lovelace  ",
  email: "  ada@example.com ",
  brief: "  We need a ledger that posts money.\nSecond line.  ",
};

describe("buildMailtoUrl", () => {
  it("addresses the studio and encodes the subject", () => {
    const url = buildMailtoUrl("hello@azra.studio", draft);

    expect(url.startsWith("mailto:hello@azra.studio?subject=")).toBe(true);
    expect(url).toContain(encodeURIComponent("Brief from Ada Lovelace"));
  });

  it("keeps the brief intact and appends the sender signature", () => {
    const url = buildMailtoUrl("hello@azra.studio", draft);

    expect(url).toContain(encodeURIComponent("We need a ledger that posts money."));
    expect(url).toContain(encodeURIComponent("ada@example.com"));
    expect(url).not.toContain("  ");
  });
});

describe("buildBriefText", () => {
  it("renders a copyable message with recipient, subject and signature", () => {
    const text = buildBriefText("hello@azra.studio", draft);

    expect(text).toContain("To: hello@azra.studio");
    expect(text).toContain("Subject: Brief from Ada Lovelace");
    expect(text).toContain("We need a ledger that posts money.");
    expect(text).toContain("— Ada Lovelace (ada@example.com)");
  });
});
