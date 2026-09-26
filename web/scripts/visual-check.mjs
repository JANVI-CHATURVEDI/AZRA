import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const BASE_URL = process.env.CHECK_URL ?? "http://127.0.0.1:3000";
const OUT_DIR = new URL("../screenshots/", import.meta.url);

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, fullPage: true },
  { name: "mobile", width: 390, height: 844, fullPage: false },
];

await mkdir(OUT_DIR, { recursive: true });

const outPath = (name) => fileURLToPath(new URL(name, OUT_DIR));

const browser = await chromium.launch({ channel: "chrome" });
const report = [];
let failed = false;

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(String(error)));

  const response = await page.goto(BASE_URL, { waitUntil: "networkidle" });

  if (
    await page
      .locator('[role="dialog"]')
      .first()
      .isVisible()
      .catch(() => false)
  ) {
    await page.screenshot({ path: outPath(`arrival-${viewport.name}.png`) });
  }

  await page.waitForTimeout(5000);

  const arrivalStuck = (await page.locator('[role="dialog"]').count()) > 0;

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const arrivalReplayed = (await page.locator('[role="dialog"]').count()) > 0;

  let menuWorks = true;
  if (viewport.width < 768) {
    const toggle = page.locator('button[aria-controls="mobile-nav"]');
    if ((await toggle.count()) === 0) {
      menuWorks = false;
    } else {
      await toggle.click();
      menuWorks = await page.locator("#mobile-nav").isVisible();
      await page.screenshot({ path: outPath("mobile-menu.png") });
      await page.keyboard.press("Escape");
      menuWorks = menuWorks && !(await page.locator("#mobile-nav").isVisible());
    }
  }

  let hoverMenu = true;
  let linkPop = true;
  if (viewport.width >= 1024) {
    const trigger = page.locator('button[aria-controls="desktop-nav"]');
    if ((await trigger.count()) === 0) {
      hoverMenu = false;
    } else {
      const readPop = () =>
        page.evaluate(() => {
          const link = document.querySelectorAll("#desktop-nav a")[1];
          if (!link) return null;
          const style = getComputedStyle(link);
          if (style.scale && style.scale !== "none") return Number.parseFloat(style.scale);
          const match = style.transform?.match(/matrix\(([^)]+)\)/);
          return match ? Math.abs(Number.parseFloat(match[1].split(",")[0])) : 1;
        });

      const popBefore = await readPop();
      await trigger.hover();
      await page.waitForTimeout(1000);
      hoverMenu = await page.evaluate(() => {
        const panel = document.getElementById("desktop-nav");
        const links = [...document.querySelectorAll("#desktop-nav a")];
        return Boolean(
          panel &&
          panel.getBoundingClientRect().width > 60 &&
          links.length === 4 &&
          links.every((link) => {
            const box = link.getBoundingClientRect();
            return box.width > 0 && getComputedStyle(link).visibility === "visible";
          }),
        );
      });
      await page.locator("#desktop-nav a").nth(1).hover();
      await page.waitForTimeout(450);
      const popAfter = await readPop();
      linkPop = Boolean(popBefore !== null && popAfter !== null) && popAfter > popBefore + 0.02;
      await page.screenshot({ path: outPath("desktop-menu.png") });

      await page.mouse.move(viewport.width - 6, viewport.height - 6);
      await page.waitForTimeout(1100);
      hoverMenu =
        hoverMenu &&
        (await page.evaluate(() => {
          const panel = document.getElementById("desktop-nav");
          return !panel || panel.getBoundingClientRect().width < 4;
        }));
    }
  }

  const revealState = await page.evaluate(async () => {
    const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    const scrollToY = (y) => {
      const lenis = window.__lenis;
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    };

    const step = Math.round(window.innerHeight * 0.5);
    const max = root.scrollHeight - root.clientHeight;
    for (let y = 0; y <= max; y += step) {
      scrollToY(y);
      await pause(120);
    }

    scrollToY(root.scrollHeight);
    await pause(700);
    scrollToY(root.scrollHeight);
    await pause(400);

    const bar = document.querySelector("header > div[aria-hidden='true']");
    const progressAtBottom = bar ? bar.style.transform : null;

    scrollToY(0);
    await pause(500);
    root.style.scrollBehavior = previousBehavior;

    const all = [...document.querySelectorAll(".reveal")];
    return {
      total: all.length,
      stuck: all.filter((el) => !el.classList.contains("is-visible")).length,
      progressAtBottom,
    };
  });

  await page.mouse.move(Math.round(viewport.width / 2), Math.round(viewport.height / 2));
  await page.waitForTimeout(400);
  const cursorIdle = await page.evaluate(() => {
    const wrap = document.getElementById("cursor");
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    const beam = document.getElementById("cursor-beam");
    const width = (el) => (el ? Math.round(el.getBoundingClientRect().width) : 0);
    return {
      state: wrap?.dataset.cursorState ?? null,
      dotSize: width(dot),
      ringSize: width(ring),
      blend: dot ? getComputedStyle(dot).mixBlendMode : null,
      beamOpacity: beam ? getComputedStyle(beam).opacity : null,
      ringTransform: ring ? getComputedStyle(ring).transform : null,
    };
  });

  const cta = page
    .locator("header a")
    .filter({ hasText: /start a brief/i })
    .first();
  await cta.hover();
  await page.waitForTimeout(450);
  const cursorHover = await page.evaluate(() => {
    const wrap = document.getElementById("cursor");
    const ring = document.getElementById("cursor-ring");
    return {
      state: wrap?.dataset.cursorState ?? null,
      ringTransform: ring ? getComputedStyle(ring).transform : null,
    };
  });

  await page.mouse.move(viewport.width - 6, viewport.height - 6);
  await page.waitForTimeout(400);
  const cursorReset = await page.evaluate(
    () => document.getElementById("cursor")?.dataset.cursorState ?? null,
  );

  const wave = await page.evaluate(() => {
    const host = document.querySelector("[data-wave-bg]");
    const canvas = host?.querySelector("canvas");
    const hostStyle = host ? getComputedStyle(host) : null;
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    return {
      present: Boolean(host),
      canvas: canvas ? `${canvas.width}x${canvas.height}` : null,
      position: hostStyle?.position ?? null,
      z: hostStyle?.zIndex ?? null,
      opacity: hostStyle ? Number(hostStyle.opacity) : null,
      alpha:
        host instanceof HTMLElement && host.dataset.waveAlpha
          ? Number(host.dataset.waveAlpha)
          : null,
      pointerEvents: hostStyle?.pointerEvents ?? null,
      mainZ: main ? getComputedStyle(main).zIndex : null,
      footerZ: footer ? getComputedStyle(footer).zIndex : null,
    };
  });

  await page.locator(".project-line").hover();
  await page.waitForTimeout(250);
  const lineOnHover = await page.evaluate(() => {
    const track = document.querySelector(".project-line-track");
    return track ? getComputedStyle(track).animationPlayState : null;
  });
  await page.mouse.move(6, 6);
  await page.waitForTimeout(250);
  const lineAfterHover = await page.evaluate(() => {
    const track = document.querySelector(".project-line-track");
    return track ? getComputedStyle(track).animationPlayState : null;
  });

  const detailName = await page.evaluate(async () => {
    document.querySelector('.project-line button[data-code="03"]')?.click();
    await new Promise((resolve) => setTimeout(resolve, 350));
    return document.querySelector("[data-project-detail] h3")?.textContent?.trim() ?? null;
  });

  const letterCount = await page.evaluate(() => document.querySelectorAll(".bloat-letter").length);

  const metrics = await page.evaluate(async () => {
    await document.fonts.ready;
    const loadedFamilies = [...document.fonts].map((font) => font.family);
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      h1: document.querySelector("h1")?.innerText ?? null,
      h1Family: getComputedStyle(document.querySelector("h1") ?? document.body).fontFamily,
      monoFamily: getComputedStyle(document.querySelector("header nav a") ?? document.body)
        .fontFamily,
      loadedFamilies,
      sections: document.querySelectorAll("main section").length,
      textLength: document.body.innerText.trim().length,
    };
  });

  await page.evaluate(() => {
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  });

  await page.screenshot({
    path: outPath(`${viewport.name}-hero.png`),
  });

  if (viewport.fullPage) {
    await page.screenshot({
      path: outPath(`${viewport.name}-full.png`),
      fullPage: true,
    });
  }

  const overflow = metrics.scrollWidth > metrics.clientWidth + 1;
  const hasDisplayFont = metrics.loadedFamilies.some((family) => /syne/i.test(family));
  const hasMonoFont = metrics.loadedFamilies.some((family) => /plex/i.test(family));
  const problems = [
    ...(consoleErrors.length ? [`console errors: ${consoleErrors.join(" | ")}`] : []),
    ...(overflow ? [`horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`] : []),
    ...(!metrics.h1 ? ["no <h1> on the page"] : []),
    ...(arrivalStuck ? ["arrival overlay never dismissed"] : []),
    ...(arrivalReplayed ? ["arrival overlay replayed after reload"] : []),
    ...(!menuWorks ? ["mobile menu did not open/close"] : []),
    ...(!hoverMenu ? ["hover menu did not open/close"] : []),
    ...(viewport.width >= 1024 && !linkPop ? ["menu link does not pop out on hover"] : []),
    ...(!hasDisplayFont ? ["display font (Syne) never loaded"] : []),
    ...(!hasMonoFont ? ["mono font (IBM Plex Mono) never loaded"] : []),
    ...(revealState.stuck > 0
      ? [`${revealState.stuck}/${revealState.total} reveal blocks never animated in`]
      : []),
    ...(!revealState.progressAtBottom || revealState.progressAtBottom === "scaleX(0)"
      ? ["scroll progress bar never moved"]
      : []),
    ...(cursorIdle.dotSize < 3 ? ["cursor dot missing"] : []),
    ...(cursorIdle.ringSize <= cursorIdle.dotSize ? ["trailing cursor ring missing"] : []),
    ...(cursorIdle.blend !== "difference"
      ? [`cursor does not invert what it covers (mix-blend-mode: ${cursorIdle.blend})`]
      : []),
    ...(cursorIdle.state !== "default" ? [`cursor wrong state at rest (${cursorIdle.state})`] : []),
    ...(cursorHover.state !== "hover"
      ? [`cursor does not change state over interactive elements (${cursorHover.state})`]
      : []),
    ...(cursorHover.ringTransform === cursorIdle.ringTransform
      ? ["cursor ring does not react to hover"]
      : []),
    ...(cursorReset !== "default" ? [`cursor state never resets (${cursorReset})`] : []),
    ...(lineOnHover !== "paused" ? ["work line does not stop on hover"] : []),
    ...(lineAfterHover !== "running" ? ["work line never resumes after hover"] : []),
    ...(detailName !== "DLT"
      ? [`clicking a project does not open it (showed: ${detailName})`]
      : []),
    ...(letterCount < 500 ? [`letter bloat not applied site-wide (${letterCount} letters)`] : []),
    ...(!wave.present ? ["wave backdrop missing"] : []),
    ...(wave.present && !wave.canvas ? ["wave canvas missing (WebGL failed?)"] : []),
    ...(wave.position !== "fixed" || wave.z !== "0"
      ? [`wave backdrop is not fixed behind the page (${wave.position}/${wave.z})`]
      : []),
    ...(wave.pointerEvents !== "none" ? ["wave backdrop swallows pointer events"] : []),
    ...(wave.opacity === null || wave.opacity < 0.5 || wave.opacity > 0.95
      ? [`wave backdrop opacity out of the premium range (${wave.opacity})`]
      : []),
    ...(wave.alpha === null || wave.alpha < 0.5 || wave.alpha > 1
      ? [`wave backdrop shader alpha out of range (${wave.alpha})`]
      : []),
    ...(wave.mainZ !== "1" || wave.footerZ !== "1"
      ? [`content not stacked above the wave (main ${wave.mainZ}, footer ${wave.footerZ})`]
      : []),
    ...(metrics.textLength < 500 ? ["page body looks empty"] : []),
  ];

  if (problems.length) failed = true;

  report.push({
    viewport: `${viewport.width}x${viewport.height}`,
    status: response?.status(),
    h1: metrics.h1,
    h1Family: metrics.h1Family,
    monoFamily: metrics.monoFamily,
    arrivalStuck,
    arrivalReplayed,
    menuWorks,
    hoverMenu,
    linkPop,
    reveals: `${revealState.total - revealState.stuck}/${revealState.total}`,
    progressAtBottom: revealState.progressAtBottom,
    cursor: `dot r${cursorIdle.dotSize} / ring ${cursorIdle.ringSize} / ${cursorIdle.blend} / ${cursorIdle.state} -> ${cursorHover.state} -> ${cursorReset}`,
    workLine: `${lineOnHover} -> ${lineAfterHover}`,
    detailName,
    lettersWrapped: letterCount,
    wave: `fixed z${wave.z} @${wave.opacity}/α${wave.alpha} canvas ${wave.canvas ?? "none"} — main z${wave.mainZ} / footer z${wave.footerZ}`,
    sections: metrics.sections,
    textLength: metrics.textLength,
    problems,
  });

  await context.close();
}

await browser.close();

console.log(JSON.stringify(report, null, 2));
if (failed) {
  console.error("VISUAL CHECK FAILED");
  process.exit(1);
}
console.log("VISUAL CHECK PASSED");
