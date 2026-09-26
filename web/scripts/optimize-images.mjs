import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.resolve(here, "../assets/work-source");
const outputDir = path.resolve(here, "../public/work");

const sources = (await readdir(sourceDir)).filter((file) => file.toLowerCase().endsWith(".png"));

if (sources.length === 0) {
  console.log("No source PNGs found.");
  process.exit(0);
}

for (const file of sources) {
  const output = path.join(outputDir, file.replace(/\.png$/i, ".webp"));

  const info = await sharp(path.join(sourceDir, file))
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(output);

  console.log(`${file} -> ${path.basename(output)} (${Math.round(info.size / 1024)} KB)`);
}
