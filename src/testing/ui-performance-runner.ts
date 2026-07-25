// @ts-nocheck

/**
 * UI Performance Profiler
 * -----------------------
 * 这个模块只在 config 中的 ENABLE_UI_PERFORMANCE_TEST = true 时动态加载。
 * 正常使用路径不会 import 本文件，也不会创建测试页面或绑定测试逻辑。
 */
const TEST_PROFILE = "standard";
const SLOW_ACTION_MS = 200;
const RESTORE_STATE_AFTER_TEST = true;
const ACTION_TIMEOUT_MS = 6000;
const STATUS_PASS = "PASS";
const STATUS_SLOW = "SLOW";
const STATUS_FAILED = "FAILED";
const STATUS_INCOMPLETE = "INCOMPLETE";
const STATUS_PASS_WITH_WARNINGS = "PASS_WITH_WARNINGS";

function now() {
  return performance.now();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitFrames(count = 2) {
  for (let i = 0; i < count; i += 1) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
}

async function waitForUiStable(harness, extraMs = 90) {
  if (harness && typeof harness.waitForStable === "function") {
    await harness.waitForStable(2);
  } else {
    await waitFrames(2);
  }
  if (extraMs > 0) await sleep(extraMs);
  if (harness && typeof harness.waitForStable === "function") {
    await harness.waitForStable(1);
  } else {
    await waitFrames(1);
  }
}

function $(id) {
  return document.getElementById(id);
}

function optionValues(selectId) {
  const el = $(selectId);
  if (!el) return [];
  return Array.from(el.querySelectorAll("option"))
    .map((option) => option.value)
    .filter(Boolean);
}

function dispatchInput(el) {
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

function dispatchChange(el) {
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

function clickElement(id) {
  const el = $(id);
  if (!el || el.disabled) throw new Error(`DOM element not available: #${id}`);
  el.click();
  return { kind: "click", id };
}

function setSelectValue(id, value) {
  const el = $(id);
  if (!el || el.disabled) throw new Error(`select not available: #${id}`);
  const before = el.value;
  el.value = value;
  dispatchChange(el);
  return { kind: "select", id, before, expected: String(value) };
}

function toggleCheckbox(id) {
  const el = $(id);
  if (!el || el.disabled) throw new Error(`checkbox not available: #${id}`);
  const before = Boolean(el.checked);
  const expected = !before;
  el.checked = expected;
  dispatchChange(el);
  return { kind: "checkbox", id, before, expected };
}

function setRangeValue(id, value) {
  const el = $(id);
  if (!el || el.disabled) throw new Error(`range not available: #${id}`);
  const before = el.value;
  el.value = String(value);
  dispatchInput(el);
  dispatchChange(el);
  return { kind: "range", id, before, expected: String(value) };
}

async function typeSearch(inputId, suggestionsId, query) {
  const input = $(inputId);
  if (!input) throw new Error(`search input not available: #${inputId}`);
  input.focus();
  input.value = query;
  dispatchInput(input);
  await waitFrames(2);
  const first = $(`${suggestionsId}`)?.querySelector("button, [role='option']");
  if (first) first.click();
  else {
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
  }
  return {
    kind: "search",
    inputId,
    suggestionsId,
    query,
    usedSuggestion: Boolean(first),
  };
}

async function keyboardPanSample(key = "ArrowRight") {
  document.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  await sleep(260);
  document.dispatchEvent(new KeyboardEvent("keyup", { key, bubbles: true }));
  return { kind: "keyboard", key };
}

function closeTransientUi() {
  $("tech-modal")?.classList.remove("open");
  $("guide-page-menu")?.classList.remove("open");
  $("object-suggestions")?.classList.remove("open");
  $("city-suggestions")?.classList.remove("open");
}

function withTimeout(promise, ms, label) {
  let timer = null;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timeout after ${ms}ms: ${label}`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function validateActionOutcome(action, outcome) {
  // 成功/失败不能只看是否抛错：每类交互都要在执行后做最小状态断言。
  // 这些断言只在性能测试模块运行时启用，不进入正常星图路径。
  if (action && typeof action.verify === "function") {
    action.verify(outcome);
    return;
  }
  if (!outcome || typeof outcome !== "object") return;
  if (outcome.kind === "checkbox") {
    const el = $(outcome.id);
    if (!el) throw new Error(`post-check failed: checkbox #${outcome.id} disappeared`);
    if (Boolean(el.checked) !== Boolean(outcome.expected)) {
      throw new Error(`post-check failed: #${outcome.id} expected checked=${outcome.expected}, got ${el.checked}`);
    }
  }
  if (outcome.kind === "select") {
    const el = $(outcome.id);
    if (!el) throw new Error(`post-check failed: select #${outcome.id} disappeared`);
    if (String(el.value) !== String(outcome.expected)) {
      throw new Error(`post-check failed: #${outcome.id} expected value=${outcome.expected}, got ${el.value}`);
    }
  }
  if (outcome.kind === "range") {
    const el = $(outcome.id);
    if (!el) throw new Error(`post-check failed: range #${outcome.id} disappeared`);
    if (String(el.value) !== String(outcome.expected)) {
      throw new Error(`post-check failed: #${outcome.id} expected value=${outcome.expected}, got ${el.value}`);
    }
  }
  if (outcome.kind === "search") {
    const input = $(outcome.inputId);
    if (!input) throw new Error(`post-check failed: search input #${outcome.inputId} disappeared`);
    // 搜索样本允许没有候选时走 Enter fallback；这里仅确认输入链路未被清空或移除。
    if (!String(input.value || "").trim() && !outcome.usedSuggestion) {
      throw new Error(`post-check failed: search query ${outcome.query} was cleared without selecting a suggestion`);
    }
  }
}

function classifyResult(totalMs, failed) {
  if (failed) return STATUS_FAILED;
  if (totalMs >= SLOW_ACTION_MS) return STATUS_SLOW;
  return STATUS_PASS;
}

function createRecorder() {
  const actionResults = [];
  const allSteps = [];
  let currentAction = null;
  return {
    startAction(action) {
      currentAction = {
        id: action.id,
        label: action.label,
        category: action.category || "other",
        startedAt: now(),
        steps: [],
      };
    },
    recordStep(step) {
      const item = {
        actionId: currentAction ? currentAction.id : "outside-action",
        actionLabel: currentAction ? currentAction.label : "Outside action",
        actionCategory: currentAction ? currentAction.category : "outside",
        name: step.name || "unknown",
        ms: Number(step.ms) || 0,
        at: Number(step.at) || now(),
        reason: step.reason || step.details?.reason || "-",
        details: step,
      };
      allSteps.push(item);
      if (currentAction) currentAction.steps.push(item);
    },
    endAction(totalMs, status, error = null) {
      if (!currentAction) return null;
      const result = {
        ...currentAction,
        totalMs,
        status,
        error: error ? String(error.message || error) : "",
        slow: status === STATUS_SLOW || totalMs >= SLOW_ACTION_MS,
        passed: status === STATUS_PASS || status === STATUS_SLOW,
      };
      actionResults.push(result);
      currentAction = null;
      return result;
    },
    results() {
      return actionResults.slice();
    },
    steps() {
      return allSteps.slice();
    },
  };
}

function ensureElement(id, label = id) {
  const el = $(id);
  if (!el || el.disabled) throw new Error(`DOM element not available for ${label}: #${id}`);
  return el;
}

function setCheckboxValue(id, expected) {
  const el = ensureElement(id, id);
  if (Boolean(el.checked) === Boolean(expected)) {
    return { kind: "checkbox", id, before: Boolean(el.checked), expected: Boolean(expected), unchanged: true };
  }
  const before = Boolean(el.checked);
  el.checked = Boolean(expected);
  dispatchChange(el);
  return { kind: "checkbox", id, before, expected: Boolean(expected) };
}

function maybeSetSelectValue(id, value) {
  const el = $(id);
  if (!el || el.disabled) return { skipped: true, reason: `select not available: #${id}` };
  const values = optionValues(id);
  if (!values.includes(String(value))) return { skipped: true, reason: `option not available: #${id}=${value}` };
  const before = el.value;
  if (String(before) === String(value)) return { kind: "select", id, before, expected: String(value), unchanged: true };
  el.value = String(value);
  dispatchChange(el);
  return { kind: "select", id, before, expected: String(value) };
}

function maybeClick(id) {
  const el = $(id);
  if (!el || el.disabled) return { skipped: true, reason: `button not available: #${id}` };
  el.click();
  return { kind: "click", id };
}

async function runComboSteps(harness, steps) {
  const outcomes = [];
  for (const step of steps) {
    const result = await step();
    if (Array.isArray(result)) outcomes.push(...result);
    else if (result) outcomes.push(result);
    await waitForUiStable(harness, 35);
  }
  return { kind: "combo", outcomes };
}

function buildActions(harness = {}) {
  const actions = [];
  const add = (category, label, run, id = null, verify = null) =>
    actions.push({ id: id || `${category}-${actions.length + 1}`, category, label, run, verify });
  const addBaseline = (category, label, run, id = null, verify = null) =>
    add(category, `基线：${label}`, run, id, verify);
  const addCombo = (label, steps, id = null, verify = null) =>
    add("combo", `组合：${label}`, () => runComboSteps(harness, steps), id, verify);

  // 基线测试只保留少量关键动作，用来给组合测试提供对照。
  // 不再遍历所有按钮/所有 option，避免测试本身过长，也避免把单项 UI 约束误判成主问题。
  [
    ["view", "Panel 展开/收起", () => clickElement("panel-toggle")],
    ["view", "缩放 +", () => clickElement("zoom-in")],
    ["view", "缩放 -", () => clickElement("zoom-out")],
    ["view", "重置当前视图", () => clickElement("reset-view")],
    ["time", "回到现在", () => clickElement("observer-now")],
    ["time", "任意步长 +", () => clickElement("time-step-plus")],
    ["guide", "打开帮助文档", () => clickElement("explain-btn")],
  ].forEach(([category, label, run]) => addBaseline(category, label, run));

  ["horizontal", "equatorial", "ecliptic", "galactic"].filter((value) => optionValues("coordinate-select").includes(value)).forEach((value) =>
    addBaseline("coordinate", `坐标视角：${value}`, () => setSelectValue("coordinate-select", value)),
  );

  ["orthographic", "hammer", "winkel3", "healpix", "equirectangular"].filter((value) => optionValues("projection-select").includes(value)).forEach((value) =>
    addBaseline("projection", `投影：${value}`, () => setSelectValue("projection-select", value)),
  );

  ["pole-axis-constraint", "milky-way", "deep-sky", "star-names", "horizontal-grid", "grid"].forEach((id) => {
    if ($(id)) addBaseline("toggle", `开关：${id}`, () => toggleCheckbox(id), id);
  });

  addBaseline("search", "天体搜索：Sirius", () => typeSearch("object-search", "object-suggestions", "Sirius"));
  addBaseline("search", "天体搜索：M31", () => typeSearch("object-search", "object-suggestions", "M31"));
  addBaseline("keyboard", "方向键长按：ArrowRight", () => keyboardPanSample("ArrowRight"));

  // 真实使用场景组合。组合动作把连续 UI 操作归到同一个 action 下，报告能看出“按钮组合链路”总耗时。
  addCombo("本地观测：地平视角 + 地平网 + 时间跳转", [
    () => maybeSetSelectValue("coordinate-select", "horizontal"),
    () => maybeSetSelectValue("projection-select", "orthographic"),
    () => setCheckboxValue("horizon", true),
    () => setCheckboxValue("horizontal-grid", true),
    () => setCheckboxValue("planets", true),
    () => maybeClick("observer-now"),
    () => maybeClick("time-step-plus"),
  ], "combo-local-observing");

  addCombo("固定坐标框架：赤道 → 黄道 → 银河 + 全天投影", [
    () => maybeSetSelectValue("coordinate-select", "equatorial"),
    () => maybeSetSelectValue("projection-select", "hammer"),
    () => setCheckboxValue("grid", true),
    () => setCheckboxValue("ecliptic", true),
    () => maybeSetSelectValue("coordinate-select", "ecliptic"),
    () => maybeSetSelectValue("projection-select", "winkel3"),
    () => maybeSetSelectValue("coordinate-select", "galactic"),
  ], "combo-coordinate-frame-sweep");

  addCombo("中西文化图层：两套体系 + 星官 + 传统天区", [
    () => maybeSetSelectValue("culture-select", "both"),
    () => setCheckboxValue("culture-lines", true),
    () => setCheckboxValue("culture-names", true),
    () => setCheckboxValue("region-boundaries", true),
    () => maybeSetSelectValue("traditional-detail", "major"),
    () => maybeSetSelectValue("traditional-detail", "battlefields"),
    () => maybeSetSelectValue("traditional-detail", "mansions"),
  ], "combo-culture-layers");

  addCombo("银河压力场景：银河 + 黄道/赤道参考线 + 全天投影", [
    () => setCheckboxValue("milky-way", true),
    () => setCheckboxValue("ecliptic", true),
    () => setCheckboxValue("equator", true),
    () => maybeSetSelectValue("projection-select", "hammer"),
    () => maybeSetSelectValue("coordinate-select", "ecliptic"),
    () => maybeSetSelectValue("coordinate-select", "galactic"),
  ], "combo-milky-way-stress");

  addCombo("深空查找：DSO 图层 + 星名 + 代表目标搜索", [
    () => setCheckboxValue("deep-sky", true),
    () => setCheckboxValue("star-names", true),
    () => maybeSetSelectValue("projection-select", "stereographic"),
    () => typeSearch("object-search", "object-suggestions", "M31"),
    () => typeSearch("object-search", "object-suggestions", "M42"),
    () => typeSearch("object-search", "object-suggestions", "M13"),
  ], "combo-deep-sky-search");

  addCombo("视图排版：字体缩放 + 地图缩放 + 重置", [
    () => maybeClick("font-increase"),
    () => maybeClick("zoom-in"),
    () => maybeClick("reset-view"),
    () => maybeClick("font-decrease"),
    () => maybeClick("zoom-out"),
  ], "combo-view-layout");

  addCombo("时间连续操作：回到现在 + 前后跳转", [
    () => maybeSetSelectValue("coordinate-select", "horizontal"),
    () => maybeClick("observer-now"),
    () => maybeClick("time-step-plus"),
    () => maybeClick("time-step-plus"),
    () => maybeClick("time-step-minus"),
  ], "combo-time-sequence");

  addCombo("键盘巡航：四方向连续平移", [
    () => keyboardPanSample("ArrowLeft"),
    () => keyboardPanSample("ArrowRight"),
    () => keyboardPanSample("ArrowUp"),
    () => keyboardPanSample("ArrowDown"),
  ], "combo-keyboard-cruise");

  return actions;
}

function summarizeSteps(steps) {
  const byName = new Map();
  steps.forEach((step) => {
    const row = byName.get(step.name) || {
      name: step.name,
      count: 0,
      totalMs: 0,
      maxMs: 0,
      samples: [],
    };
    row.count += 1;
    row.totalMs += step.ms;
    row.maxMs = Math.max(row.maxMs, step.ms);
    row.samples.push(step);
    byName.set(step.name, row);
  });
  return Array.from(byName.values())
    .map((row) => ({
      ...row,
      avgMs: row.count ? row.totalMs / row.count : 0,
    }))
    .sort((a, b) => b.totalMs - a.totalMs);
}

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx];
}

function fmt(ms) {
  if (!Number.isFinite(Number(ms))) return "-";
  return `${Number(ms).toFixed(1)} ms`;
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function rowsHtml(rows, columns) {
  return `<table><thead><tr>${columns
    .map((col) => `<th>${esc(col.label)}</th>`)
    .join("")}</tr></thead><tbody>${rows
    .map(
      (row) =>
        `<tr>${columns
          .map((col) => `<td>${esc(typeof col.value === "function" ? col.value(row) : row[col.value])}</td>`)
          .join("")}</tr>`,
    )
    .join("")}</tbody></table>`;
}

function suiteStatusFor({ failed, slow, restoreStatus, reportMode }) {
  if (reportMode === STATUS_INCOMPLETE) return STATUS_INCOMPLETE;
  if (failed.length > 0) return STATUS_FAILED;
  if (restoreStatus !== "ok" || slow.length > 0) return STATUS_PASS_WITH_WARNINGS;
  return STATUS_PASS;
}

function buildPlainTextReport({
  actionResults,
  steps,
  startedAt,
  finishedAt,
  restoreStatus,
  suiteStatus,
  topActions,
  topSteps,
  categoryRows,
  staticSyncActions,
  initialDebug,
}) {
  const lines = [];
  const totals = actionResults.map((item) => item.totalMs);
  const failed = actionResults.filter((item) => item.status === STATUS_FAILED);
  const slow = actionResults.filter((item) => item.status === STATUS_SLOW || item.slow);
  const comboRows = actionResults.filter((item) => item.category === "combo").sort((a, b) => b.totalMs - a.totalMs);
  lines.push("真实星空观测台 UI 性能测试报告");
  lines.push(`生成时间: ${new Date().toLocaleString()}`);
  lines.push(`Suite status: ${suiteStatus}`);
  lines.push(`Profile: ${TEST_PROFILE}`);
  lines.push(`慢操作阈值: ${SLOW_ACTION_MS} ms`);
  lines.push(`总耗时: ${fmt(finishedAt - startedAt)}`);
  lines.push(`动作数: ${actionResults.length}`);
  lines.push(`失败动作数: ${failed.length}`);
  lines.push(`慢操作数: ${slow.length}`);
  lines.push(`平均耗时: ${fmt(totals.reduce((a, b) => a + b, 0) / (totals.length || 1))}`);
  lines.push(`P95: ${fmt(percentile(totals, 95))}`);
  lines.push(`最大值: ${fmt(Math.max(0, ...totals))}`);
  lines.push(`恢复状态: ${restoreStatus}`);
  lines.push("");
  lines.push("== 耗时最高的动作 Top 15 ==");
  topActions.forEach((r, i) => {
    lines.push(`${i + 1}. [${r.status}] ${r.label} | ${r.category} | ${fmt(r.totalMs)} | steps=${r.steps.length}${r.error ? ` | error=${r.error}` : ""}`);
  });
  lines.push("");
  lines.push("== 组合测试场景 ==");
  if (comboRows.length) {
    comboRows.forEach((r, i) => {
      lines.push(`${i + 1}. [${r.status}] ${r.label} | ${fmt(r.totalMs)} | steps=${r.steps.length}${r.error ? ` | error=${r.error}` : ""}`);
    });
  } else {
    lines.push("未执行组合测试场景。");
  }
  lines.push("");
  lines.push("== 耗时最高的内部子过程 Top 15 ==");
  topSteps.forEach((r, i) => {
    lines.push(`${i + 1}. ${r.name} | count=${r.count} | total=${fmt(r.totalMs)} | avg=${fmt(r.avgMs)} | max=${fmt(r.maxMs)}`);
  });
  lines.push("");
  lines.push("== 按类别汇总 ==");
  categoryRows.forEach((r) => {
    lines.push(`${r.category}: count=${r.count}, total=${fmt(r.totalMs)}, avg=${fmt(r.avgMs)}, max=${fmt(r.maxMs)}`);
  });
  lines.push("");
  lines.push("== 触发固定图层同步的高耗时样本 ==");
  if (staticSyncActions.length) {
    staticSyncActions.forEach((r, i) => {
      lines.push(`${i + 1}. ${r.actionLabel} | ${r.name} | ${fmt(r.ms)} | reason=${r.reason}`);
    });
  } else {
    lines.push("无明显固定图层同步高耗时样本。");
  }
  lines.push("");
  lines.push("== 失败动作 ==");
  if (failed.length) {
    failed.forEach((r) => lines.push(`[FAILED] ${r.label} | ${fmt(r.totalMs)} | ${r.error}`));
  } else {
    lines.push("无失败动作。");
  }
  lines.push("");
  lines.push("== 慢操作 ==");
  if (slow.length) {
    slow.slice().sort((a, b) => b.totalMs - a.totalMs).forEach((r) => lines.push(`[SLOW] ${r.label} | ${fmt(r.totalMs)} | category=${r.category}`));
  } else {
    lines.push("无慢操作。");
  }
  lines.push("");
  lines.push("== 全部动作明细 ==");
  actionResults.forEach((r, i) => {
    lines.push(`${i + 1}. [${r.status}] ${r.label} | ${r.category} | ${fmt(r.totalMs)} | slow=${r.slow ? "yes" : "no"} | steps=${r.steps.length}${r.error ? ` | error=${r.error}` : ""}`);
    r.steps.forEach((step) => {
      lines.push(`   - ${step.name}: ${fmt(step.ms)} | reason=${step.reason}`);
    });
  });
  lines.push("");
  lines.push("== 原始 Debug 快照 ==");
  lines.push(JSON.stringify(initialDebug, null, 2));
  return lines.join("\n");
}

function buildReport({ actionResults, steps, startedAt, finishedAt, restoreStatus, harness, reportMode = "popup" }) {
  const totals = actionResults.map((item) => item.totalMs);
  const failed = actionResults.filter((item) => item.status === STATUS_FAILED);
  const slow = actionResults.filter((item) => item.status === STATUS_SLOW || item.slow).sort((a, b) => b.totalMs - a.totalMs);
  const topActions = actionResults.slice().sort((a, b) => b.totalMs - a.totalMs).slice(0, 15);
  const comboRows = actionResults.filter((item) => item.category === "combo").sort((a, b) => b.totalMs - a.totalMs);
  const stepSummary = summarizeSteps(steps);
  const topSteps = stepSummary.slice(0, 15);
  const categories = new Map();
  actionResults.forEach((item) => {
    const row = categories.get(item.category) || { category: item.category, count: 0, totalMs: 0, maxMs: 0 };
    row.count += 1;
    row.totalMs += item.totalMs;
    row.maxMs = Math.max(row.maxMs, item.totalMs);
    categories.set(item.category, row);
  });
  const categoryRows = Array.from(categories.values())
    .map((row) => ({ ...row, avgMs: row.count ? row.totalMs / row.count : 0 }))
    .sort((a, b) => b.totalMs - a.totalMs);
  const staticSyncActions = steps
    .filter((step) => /fixedLayerSync/i.test(step.name) && step.ms > 1)
    .sort((a, b) => b.ms - a.ms)
    .slice(0, 20);
  const initialDebug = harness && typeof harness.getDebugSnapshot === "function" ? harness.getDebugSnapshot() : null;
  const suiteStatus = suiteStatusFor({ failed, slow, restoreStatus, reportMode });
  const plainText = buildPlainTextReport({
    actionResults,
    steps,
    startedAt,
    finishedAt,
    restoreStatus,
    suiteStatus,
    topActions,
    topSteps,
    categoryRows,
    staticSyncActions,
    initialDebug,
  });
  const plainTextJson = JSON.stringify(plainText).replace(/</g, "\\u003c");

  const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8" />
<title>UI 性能测试报告</title>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#07101f;color:#eef7ff;margin:0;padding:24px;line-height:1.55}h1,h2{margin:0 0 12px}section{margin:22px 0;padding:18px;border:1px solid rgba(159,211,255,.22);border-radius:14px;background:rgba(255,255,255,.035)}table{border-collapse:collapse;width:100%;font-size:13px;margin-top:10px}th,td{border-bottom:1px solid rgba(159,211,255,.14);padding:7px 8px;text-align:left;vertical-align:top}th{color:#77dcff;background:rgba(119,220,255,.08)}button{appearance:none;border:1px solid rgba(119,220,255,.45);border-radius:10px;background:rgba(119,220,255,.12);color:#eef7ff;padding:9px 12px;cursor:pointer}button:hover{background:rgba(119,220,255,.2)}.bad{color:#ff9d9d}.warn{color:#ffd477}.ok{color:#92f7b5}.muted{color:#9db1c8}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.card{padding:12px;border-radius:10px;background:rgba(0,0,0,.18)}.toolbar{position:sticky;top:0;z-index:2;display:flex;gap:12px;align-items:center;margin:-24px -24px 18px;padding:14px 24px;background:rgba(7,16,31,.96);border-bottom:1px solid rgba(159,211,255,.18);backdrop-filter:blur(8px)}code,pre{background:rgba(0,0,0,.28);padding:2px 5px;border-radius:4px}pre{white-space:pre-wrap;padding:12px;overflow:auto}</style>
<script>window.__RSO_UI_PERF_PLAIN_TEXT__=${plainTextJson};
async function copyPlainReport(){
  var text=window.__RSO_UI_PERF_PLAIN_TEXT__||"";
  var status=document.getElementById("copy-status");
  try{
    if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(text);}else{
      var ta=document.createElement("textarea");ta.value=text;ta.setAttribute("readonly","");ta.style.position="fixed";ta.style.left="-9999px";document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();
    }
    if(status)status.textContent="已复制纯文本报告";
  }catch(err){
    if(status)status.textContent="复制失败，请手动选择底部纯文本报告";
    console.warn("copy report failed",err);
  }
}
</script>
</head><body>
<div class="toolbar"><button type="button" onclick="copyPlainReport()">复制纯文本报告</button><span id="copy-status" class="muted">复制后可直接粘贴给维护者分析</span></div>
<h1>UI 性能测试报告</h1>
<p class="muted">Profile: ${esc(TEST_PROFILE)} · 慢操作阈值: ${SLOW_ACTION_MS} ms · ${esc(new Date().toLocaleString())}</p>
<section><h2>总览</h2><div class="grid">
<div class="card">Suite status<br><b class="${suiteStatus === STATUS_FAILED || suiteStatus === STATUS_INCOMPLETE ? "bad" : suiteStatus === STATUS_PASS_WITH_WARNINGS ? "warn" : "ok"}">${esc(suiteStatus)}</b></div>
<div class="card">动作数<br><b>${actionResults.length}</b></div>
<div class="card">总耗时<br><b>${fmt(finishedAt - startedAt)}</b></div>
<div class="card">平均耗时<br><b>${fmt(totals.reduce((a,b)=>a+b,0)/(totals.length||1))}</b></div>
<div class="card">P95<br><b>${fmt(percentile(totals,95))}</b></div>
<div class="card">最大值<br><b>${fmt(Math.max(0,...totals))}</b></div>
<div class="card">失败动作<br><b class="${failed.length ? "bad" : "ok"}">${failed.length}</b></div>
<div class="card">慢操作<br><b class="${slow.length ? "warn" : "ok"}">${slow.length}</b></div>
<div class="card">组合场景<br><b>${comboRows.length}</b></div>
<div class="card">恢复状态<br><b class="${restoreStatus === "ok" ? "ok" : "warn"}">${esc(restoreStatus)}</b></div>
</div></section>
<section><h2>成功/失败判定规则</h2><p>每个动作会先检查控件是否存在、可见且可用；执行过程中捕获异常和超时；执行后对 checkbox、select、range、搜索等控件做最小状态断言。状态正确但超过 ${SLOW_ACTION_MS} ms 记为 <b class="warn">SLOW</b>，不算失败；控件缺失、超时、抛错或状态未变化记为 <b class="bad">FAILED</b>。</p></section>
<section><h2>耗时最高的动作 Top 15</h2>${rowsHtml(topActions, [
  { label: "动作", value: "label" },
  { label: "类别", value: "category" },
  { label: "总耗时", value: (r) => fmt(r.totalMs) },
  { label: "状态", value: "status" },
  { label: "错误", value: "error" },
])}</section>
<section><h2>组合测试场景</h2><p class="muted">组合测试不再机械遍历每个按钮，而是模拟真实使用链路：坐标+投影+图层、文化体系、时间跳转、深空搜索、键盘巡航等。这里的耗时更接近用户实际感受到的一次连续操作。</p>${comboRows.length ? rowsHtml(comboRows, [
  { label: "组合场景", value: "label" },
  { label: "总耗时", value: (r) => fmt(r.totalMs) },
  { label: "状态", value: "status" },
  { label: "子过程数", value: (r) => r.steps.length },
  { label: "错误", value: "error" },
]) : '<p class="muted">未执行组合测试场景。</p>'}</section>
<section><h2>耗时最高的内部子过程 Top 15</h2>${rowsHtml(topSteps, [
  { label: "子过程", value: "name" },
  { label: "次数", value: "count" },
  { label: "累计耗时", value: (r) => fmt(r.totalMs) },
  { label: "平均", value: (r) => fmt(r.avgMs) },
  { label: "最大", value: (r) => fmt(r.maxMs) },
])}</section>
<section><h2>按类别汇总</h2>${rowsHtml(categoryRows, [
  { label: "类别", value: "category" },
  { label: "动作数", value: "count" },
  { label: "累计耗时", value: (r) => fmt(r.totalMs) },
  { label: "平均", value: (r) => fmt(r.avgMs) },
  { label: "最大", value: (r) => fmt(r.maxMs) },
])}</section>
<section><h2>触发固定图层同步的高耗时样本</h2><p class="muted">如果时间变化、开关切换或普通 UI 操作频繁出现在这里，通常说明静态图层重投影过多。</p>${rowsHtml(staticSyncActions, [
  { label: "动作", value: "actionLabel" },
  { label: "子过程", value: "name" },
  { label: "耗时", value: (r) => fmt(r.ms) },
  { label: "reason", value: "reason" },
])}</section>
<section><h2>全部动作明细</h2>${rowsHtml(actionResults, [
  { label: "动作", value: "label" },
  { label: "类别", value: "category" },
  { label: "耗时", value: (r) => fmt(r.totalMs) },
  { label: "慢操作", value: (r) => (r.slow ? "是" : "否") },
  { label: "子过程数", value: (r) => r.steps.length },
  { label: "状态", value: "status" },
  { label: "错误", value: "error" },
])}</section>
<section><h2>失败动作</h2>${failed.length ? rowsHtml(failed, [
  { label: "动作", value: "label" },
  { label: "类别", value: "category" },
  { label: "耗时", value: (r) => fmt(r.totalMs) },
  { label: "错误", value: "error" },
]) : '<p class="ok">没有失败动作。</p>'}</section>
<section><h2>原始调试快照</h2><pre>${esc(JSON.stringify(initialDebug, null, 2))}</pre></section>
<section><h2>纯文本报告备份</h2><p class="muted">如果复制按钮不可用，可以手动复制下面文本。</p><pre>${esc(plainText)}</pre></section>
</body></html>`;
  return { html, plainText, suiteStatus };
}

function showReport(html, plainText = "") {
  const popup = window.open("", "_blank");
  if (popup && popup.document) {
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
    return "popup";
  }
  console.warn("UI performance report popup was blocked. Plain text report follows:\n", plainText);
  const holder = document.createElement("div");
  holder.style.position = "fixed";
  holder.style.inset = "20px";
  holder.style.zIndex = "999999";
  holder.style.background = "#07101f";
  holder.style.border = "1px solid rgba(159,211,255,.35)";
  holder.style.borderRadius = "14px";
  holder.style.overflow = "auto";
  holder.innerHTML = `<button style="position:sticky;top:8px;margin:8px;z-index:1" type="button">关闭报告</button><iframe style="width:100%;height:calc(100% - 48px);border:0"></iframe>`;
  document.body.appendChild(holder);
  holder.querySelector("button").addEventListener("click", () => holder.remove());
  const iframe = holder.querySelector("iframe");
  iframe.contentDocument.open();
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  return "inline-fallback";
}

async function runAction(action, recorder, harness) {
  closeTransientUi();
  await waitForUiStable(harness, 20);
  recorder.startAction(action);
  const started = now();
  let failed = false;
  let error = null;
  try {
    const outcome = await withTimeout(Promise.resolve(action.run()), ACTION_TIMEOUT_MS, action.label);
    await waitForUiStable(harness, 90);
    validateActionOutcome(action, outcome);
  } catch (err) {
    failed = true;
    error = err;
  }
  const totalMs = now() - started;
  return recorder.endAction(totalMs, classifyResult(totalMs, failed), error);
}

export async function runUiPerformanceSuite(harness = {}) {
  if (window.__RSO_UI_PERF_RUNNING__) return;
  window.__RSO_UI_PERF_RUNNING__ = true;
  const recorder = createRecorder();
  window.__RSO_UI_PERF_RECORDER__ = recorder;
  const startedAt = now();
  let restoreStatus = "skipped";
  let snapshot = null;
  try {
    if (typeof harness.getStateSnapshot === "function") snapshot = harness.getStateSnapshot();
    await waitForUiStable(harness, 160);
    const actions = buildActions(harness);
    for (const action of actions) {
      await runAction(action, recorder, harness);
    }
  } finally {
    if (RESTORE_STATE_AFTER_TEST && snapshot && typeof harness.restoreStateSnapshot === "function") {
      try {
        await harness.restoreStateSnapshot(snapshot);
        restoreStatus = "ok";
      } catch (err) {
        restoreStatus = `failed: ${String(err && err.message ? err.message : err)}`;
      }
    }
    const finishedAt = now();
    const report = buildReport({
      actionResults: recorder.results(),
      steps: recorder.steps(),
      startedAt,
      finishedAt,
      restoreStatus,
      harness,
    });
    const reportMode = showReport(report.html, report.plainText);
    if (reportMode !== "popup") {
      console.warn(`UI performance report used ${reportMode}. Suite status: ${report.suiteStatus}`);
    }
    delete window.__RSO_UI_PERF_RECORDER__;
    window.__RSO_UI_PERF_RUNNING__ = false;
  }
}
