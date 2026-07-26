import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const buildDir = path.join(root, ".build");
const tsOut = path.join(buildDir, "ts");
const assets = path.join(root, "assets");
const VERSION = "5.5.7";

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}
function ensureFile(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing build input: ${rel}`);
  return full;
}
function listFiles(dir, suffix) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full, suffix));
    else if (entry.isFile() && entry.name.endsWith(suffix)) out.push(full);
  }
  return out.sort();
}

fs.rmSync(buildDir, { recursive: true, force: true });
fs.mkdirSync(tsOut, { recursive: true });
fs.mkdirSync(assets, { recursive: true });

const localTsc = path.join(root, "node_modules", ".bin", process.platform === "win32" ? "tsc.cmd" : "tsc");
const tsc = fs.existsSync(localTsc) ? localTsc : "tsc";
const compile = spawnSync(tsc, ["-p", path.join(root, "tsconfig.json")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (compile.status !== 0) process.exit(compile.status ?? 1);

const moduleFiles = listFiles(path.join(tsOut, "src"), ".js");
const moduleRecords = moduleFiles.map((file) => ({
  id: path.relative(tsOut, file).replaceAll(path.sep, "/").replace(/\.js$/, ""),
  code: fs.readFileSync(file, "utf8"),
}));
const moduleIds = new Set(moduleRecords.map((record) => record.id));

function normalizeModuleId(id) {
  return id.replace(/\.js$/, "");
}
function resolveBuildModuleId(from, request) {
  const requested = request.startsWith(".")
    ? path.posix.normalize(path.posix.join(path.posix.dirname(from), request))
    : request;
  const normalized = normalizeModuleId(requested);
  if (moduleIds.has(normalized)) return normalized;
  const indexId = `${normalized}/index`;
  if (moduleIds.has(indexId)) return indexId;
  return null;
}

let requireCount = 0;
let directoryIndexFallbackCount = 0;
for (const record of moduleRecords) {
  const requirePattern = /\brequire\(\s*["']([^"']+)["']\s*\)/g;
  for (const match of record.code.matchAll(requirePattern)) {
    requireCount += 1;
    const request = match[1];
    const resolved = resolveBuildModuleId(record.id, request);
    if (!resolved) {
      throw new Error(`Unresolved bundled import: ${record.id} -> ${request}`);
    }
    if (resolved.endsWith("/index") && !normalizeModuleId(request).endsWith("/index")) {
      directoryIndexFallbackCount += 1;
    }
  }
}

const moduleEntries = moduleRecords.map(({ id, code }) =>
  `${JSON.stringify(id)}: function(module, exports, require) {\n${code}\n}`
);

const dataScripts = [
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
];
const jsInputs = [
  "vendor/d3/d3.min.js",
  "vendor/d3/d3.geo.projection.min.js",
  ...dataScripts,
  "vendor/d3-celestial/celestial.min.js",
  "vendor/luxon/luxon.min.js",
  "vendor/tz-lookup/tz.js",
];
jsInputs.forEach(ensureFile);

const runtime = `\n;(() => {\n  const modules = {\n${moduleEntries.join(",\n")}\n  };\n  const cache = Object.create(null);\n  function normalize(parts) {\n    const out = [];\n    for (const part of parts) {\n      if (!part || part === ".") continue;\n      if (part === "..") out.pop(); else out.push(part);\n    }\n    return out.join("/");\n  }\n  function resolve(from, request) {\n    if (!request.startsWith(".")) return request.replace(/\\.js$/, "");\n    const base = from.split("/");\n    base.pop();\n    return normalize(base.concat(request.split("/"))).replace(/\\.js$/, "");\n  }\n  function findModuleId(id) {\n    const normalized = id.replace(/\\.js$/, "");\n    if (Object.prototype.hasOwnProperty.call(modules, normalized)) return normalized;\n    const indexId = normalized + "/index";\n    if (Object.prototype.hasOwnProperty.call(modules, indexId)) return indexId;\n    return null;\n  }\n  function load(id) {\n    const resolvedId = findModuleId(id);\n    if (!resolvedId) {\n      const normalized = id.replace(/\\.js$/, "");\n      throw new Error("Bundled module not found: " + id + " (tried " + normalized + " and " + normalized + "/index)");\n    }\n    if (cache[resolvedId]) return cache[resolvedId].exports;\n    const factory = modules[resolvedId];\n    const module = { exports: {} };\n    cache[resolvedId] = module;\n    factory(module, module.exports, (request) => load(resolve(resolvedId, request)));\n    return module.exports;\n  }\n  window.__RSO_BUILD_VERSION__ = ${JSON.stringify(VERSION)};\n  load("src/main");\n})();\n`;

const banner = `/*! Real Sky Observatory ${VERSION} | generated assets/app.js | edit src/, not this file */\n`;
const mergedJs = banner + jsInputs.map((rel) => `\n/* ---- ${rel} ---- */\n${read(rel)}\n`).join("") + runtime;
fs.writeFileSync(path.join(assets, "app.js"), mergedJs, "utf8");

const celestialCss = read("vendor/d3-celestial/celestial.css")
  .replace(/url\([^)]*(?:\.png|\.gif|\.jpg|\.jpeg)[^)]*\)/gi, "none");
const projectCss = read("src/styles.css");
const mergedCss = `/*! Real Sky Observatory ${VERSION} | generated assets/app.css */\n/* ---- vendor/d3-celestial/celestial.css ---- */\n${celestialCss}\n/* ---- src/styles.css ---- */\n${projectCss}\n`;
fs.writeFileSync(path.join(assets, "app.css"), mergedCss, "utf8");

fs.rmSync(buildDir, { recursive: true, force: true });
console.log(`Validated ${requireCount} bundled imports (${directoryIndexFallbackCount} directory index fallbacks)`);
console.log(`Built assets/app.js (${(mergedJs.length / 1024 / 1024).toFixed(2)} MiB)`);
console.log(`Built assets/app.css (${(mergedCss.length / 1024).toFixed(1)} KiB)`);
