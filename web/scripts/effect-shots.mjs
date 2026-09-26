import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const BASE_URL = process.env.CHECK_URL ?? "http://127.0.0.1:3100";
await mkdir(new URL("../screenshots/", import.meta.url), { recursive: true });
const out = (name) =>
  new URL(`../screenshots/${name}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE_URL, { waitUntil: "networkidle" });
await page.waitForTimeout(5200);

await page.locator("#manifesto p.text-muted").first().hover();
await page.waitForTimeout(600);
await page.screenshot({ path: out("effect-cursor.png") });

const title = page.locator("#manifesto h2");
await title.hover();
await page.waitForTimeout(400);
const box = await title.boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.55);
  await page.waitForTimeout(450);
}
await page.screenshot({ path: out("effect-bloat.png") });

await page.locator(".project-line").hover();
await page.waitForTimeout(700);
await page.screenshot({ path: out("effect-workline.png") });

await browser.close();
console.log("effect shots written");
