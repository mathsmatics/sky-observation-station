import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const assetsDir = path.join(rootDir, "assets");
const tempDir = path.join(rootDir, ".build");
const mainBundlePath = path.join(tempDir, "app-main.js");

const packageJson = JSON.parse(
  fs.readFileSync(path.join(rootDir, "package.json"), "utf8"),
);
const version = String(packageJson.version || "unknown");

const runtimeScripts = [
  "vendor/d3/d3.min.js",
  "vendor/d3/d3.geo.projection.min.js",
  "src/data/loader.js",
  "src/data/stars/stars-6.js",
  "src/data/stars/star-names.js",
  "src/data/western/constellations.js",
  "src/data/western/constellation-lines.js",
  "src/data/western/boundaries.js",
  "src/data/chinese/asterisms.js",
  "src/data/chinese/asterism-lines.js",
  "src/data/chinese/sky-regions.js",
  "src/data/chinese/sky-region-labels.js",
  "src/data/deep-sky/deep-sky-bright.js",
  "src/data/deep-sky/deep-sky-names.js",
  "src/data/milky-way/milky-way.js",
  "src/data/solar-system/planets.js",
  "vendor/d3-celestial/celestial.min.js",
  "vendor/luxon/luxon.min.js",
  "vendor/tz-lookup/tz.js",
];

const cssSources = [
  "vendor/d3-celestial/celestial.css",
  "src/styles.css",
];

function absolute(relativePath) {
  return path.join(rootDir, relativePath);
}

function requireFiles(relativePaths) {
  const missing = relativePaths.filter((item) => !fs.existsSync(absolute(item)));
  if (missing.length > 0) {
    throw new Error(`Build inputs are missing:\n${missing.join("\n")}`);
  }
}

function read(relativePath) {
  return fs.readFileSync(absolute(relativePath), "utf8");
}

function cleanDirectory(directory) {
  fs.rmSync(directory, { recursive: true, force: true });
  fs.mkdirSync(directory, { recursive: true });
}

function buildRuntimeBundle(mainBundle) {
  const banner = [
    `/*! Real Sky Observatory ${version} single-bundle runtime */`,
    `window.__RSO_RELEASE_BUILD__ = Object.freeze({ version: ${JSON.stringify(version)}, mode: "root-index-plus-assets", bundledAt: ${JSON.stringify(new Date().toISOString())} });`,
  ].join("\n");

  const parts = runtimeScripts.map((relativePath) => {
    return `\n/* ===== BEGIN ${relativePath} ===== */\n${read(relativePath)}\n/* ===== END ${relativePath} ===== */\n`;
  });

  parts.push(
    `\n/* ===== BEGIN compiled src/main.ts ===== */\n${mainBundle}\n/* ===== END compiled src/main.ts ===== */\n`,
  );

  return `${banner}\n${parts.join("\n;\n")}`;
}

function buildCssBundle() {
  return cssSources
    .map((relativePath) => {
      const content = read(relativePath).replace(
        /url\((['"]?)images\/dtpick\.png\1\)/g,
        "none",
      );
      return `/* ===== BEGIN ${relativePath} ===== */\n${content}\n/* ===== END ${relativePath} ===== */`;
    })
    .join("\n\n");
}

function verifyIndex(indexHtml) {
  const forbidden = ["vendor/", "src/data/", "src/main", "src/app"];
  for (const token of forbidden) {
    if (indexHtml.includes(token)) {
      throw new Error(`index.html still references development path: ${token}`);
    }
  }

  const scriptSources = [...indexHtml.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(
    (match) => match[1],
  );
  const stylesheetSources = [
    ...indexHtml.matchAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi),
    ...indexHtml.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']stylesheet["'][^>]*>/gi),
  ].map((match) => match[1]);

  if (scriptSources.length !== 1 || scriptSources[0] !== "assets/app.js") {
    throw new Error(`index.html must load only assets/app.js; found: ${scriptSources.join(", ")}`);
  }
  if (
    stylesheetSources.length !== 1 ||
    stylesheetSources[0] !== "assets/app.css"
  ) {
    throw new Error(
      `index.html must load only assets/app.css; found: ${stylesheetSources.join(", ")}`,
    );
  }
}

function verifyRuntimeBundle(bundle) {
  const requiredMarkers = [
    "registerSkyData",
    "__RSO_LOCAL_DATA__",
    "Celestial",
    "luxon",
    "tzlookup",
    "__RSO_RELEASE_BUILD__",
  ];
  for (const marker of requiredMarkers) {
    if (!bundle.includes(marker)) {
      throw new Error(`assets/app.js is missing runtime marker: ${marker}`);
    }
  }
}

requireFiles([
  "index.html",
  "src/main.ts",
  "src/styles.css",
  ...runtimeScripts,
  ...cssSources,
]);

cleanDirectory(tempDir);

await build({
  absWorkingDir: rootDir,
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "iife",
  target: "es2020",
  outfile: mainBundlePath,
  minify: true,
  legalComments: "none",
  logLevel: "info",
});

const mainBundle = fs.readFileSync(mainBundlePath, "utf8");
const runtimeBundle = buildRuntimeBundle(mainBundle);
const cssBundle = buildCssBundle();
const indexHtml = read("index.html");

verifyIndex(indexHtml);
verifyRuntimeBundle(runtimeBundle);

cleanDirectory(assetsDir);
fs.writeFileSync(path.join(assetsDir, "app.js"), runtimeBundle, "utf8");
fs.writeFileSync(path.join(assetsDir, "app.css"), cssBundle, "utf8");

fs.rmSync(tempDir, { recursive: true, force: true });

const outputFiles = ["index.html", "assets/app.js", "assets/app.css"];
console.log(`\nReal Sky Observatory ${version} build complete.`);
for (const relativePath of outputFiles) {
  const stat = fs.statSync(absolute(relativePath));
  console.log(`- ${relativePath}: ${stat.size.toLocaleString("en-US")} bytes`);
}
console.log("Runtime requirement: keep root index.html and the complete root assets/ directory.");
