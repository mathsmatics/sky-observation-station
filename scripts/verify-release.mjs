import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = path.join(rootDir, "assets");
const expectedAssetFiles = ["app.css", "app.js"];

if (!fs.existsSync(path.join(rootDir, "index.html"))) {
  throw new Error("Root index.html does not exist.");
}
if (!fs.existsSync(assetsDir)) {
  throw new Error("Root assets/ does not exist. Run npm run build first.");
}

const actualAssetFiles = fs
  .readdirSync(assetsDir, { withFileTypes: true })
  .flatMap((entry) => (entry.isFile() ? [entry.name] : [`${entry.name}/`]))
  .sort();

if (JSON.stringify(actualAssetFiles) !== JSON.stringify(expectedAssetFiles)) {
  throw new Error(
    `assets/ must contain exactly app.js and app.css.\nActual:\n${actualAssetFiles.join("\n")}`,
  );
}

const indexHtml = fs.readFileSync(path.join(rootDir, "index.html"), "utf8");
const appJs = fs.readFileSync(path.join(assetsDir, "app.js"), "utf8");
const appCss = fs.readFileSync(path.join(assetsDir, "app.css"), "utf8");

for (const forbidden of ["vendor/", "src/data/", "src/main", "src/app", "dist/"]) {
  if (indexHtml.includes(forbidden)) {
    throw new Error(`index.html contains forbidden runtime reference: ${forbidden}`);
  }
}

const scripts = [...indexHtml.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(
  (match) => match[1],
);
if (scripts.length !== 1 || scripts[0] !== "assets/app.js") {
  throw new Error(`Unexpected runtime scripts: ${scripts.join(", ")}`);
}

const stylesheets = [
  ...indexHtml.matchAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["']/gi),
  ...indexHtml.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']stylesheet["']/gi),
].map((match) => match[1]);
if (stylesheets.length !== 1 || stylesheets[0] !== "assets/app.css") {
  throw new Error(`Unexpected runtime stylesheets: ${stylesheets.join(", ")}`);
}

for (const marker of [
  "registerSkyData",
  "__RSO_LOCAL_DATA__",
  "Celestial",
  "luxon",
  "tzlookup",
  "__RSO_RELEASE_BUILD__",
]) {
  if (!appJs.includes(marker)) {
    throw new Error(`assets/app.js is missing marker: ${marker}`);
  }
}

if (!appCss.includes("#celestial-map") || !appCss.includes(":root")) {
  throw new Error("assets/app.css does not contain both vendor and project styles.");
}
if (/url\((?!["']?data:)/i.test(appCss)) {
  throw new Error("assets/app.css still references an external file.");
}

console.log("Runtime verification passed.");
console.log("Required runtime files: index.html + assets/app.js + assets/app.css.");
