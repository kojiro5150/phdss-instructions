import assert from "node:assert/strict";
import fs from "node:fs";

import {
  safeMatch,
  extractFirstJsonObject,
  extractBulletLines,
  extractSection,
  findSignal,
  normItem,
  dedupItems,
} from "../src/parsers.js";
import {
  stripCalibrationBleed,
  stripInstructionArtifacts,
  deduplicateSections,
} from "../src/text-utils.js";
import {
  detectAdaptiveFifth,
  resolveCoreDirectors,
  resolveChairDirectors,
  resolveActiveDirectors,
} from "../src/governance-rules.js";
import { equivalenceFixtures, fixtureContract } from "./fixtures/equivalence.js";
import { dashboardReferenceStates } from "./fixtures/dashboard-states.js";

const functions = {
  stripCalibrationBleed,
  stripInstructionArtifacts,
  deduplicateSections,
  safeMatch,
  extractFirstJsonObject,
  extractBulletLines,
  extractSection,
  findSignal,
  normItem,
  dedupItems,
  detectAdaptiveFifth,
  resolveCoreDirectorsIds: (...args) => resolveCoreDirectors(...args).map(d => d.id),
  resolveChairDirectorsIds: (...args) => resolveChairDirectors(...args).map(d => d.id),
  resolveActiveDirectorsIds: (...args) => resolveActiveDirectors(...args).map(d => d.id),
};

const failures = [];

for (const fixture of equivalenceFixtures) {
  const fn = functions[fixture.fn];
  if (!fn) {
    failures.push(fixture.label + ": unknown function " + fixture.fn);
    continue;
  }
  try {
    const actual = fn(...fixture.args);
    assert.deepStrictEqual(actual, fixture.expected);
  } catch (error) {
    failures.push(fixture.label + ": " + error.message);
  }
}

if (fixtureContract.invariant !== "same inputs -> byte/structure-equivalent outputs") {
  failures.push("fixture contract invariant changed");
}
if (fixtureContract.capturedBeforeExtraction !== true) {
  failures.push("fixtures are not marked as captured before extraction");
}

const requiredDashboardLabels = [
  "complete synthesis run",
  "partial synthesis run",
  "HALT signal distribution",
  "META under-extraction diagnostic",
];
for (const label of requiredDashboardLabels) {
  if (!dashboardReferenceStates.some(state => state.label === label)) {
    failures.push("missing dashboard reference state: " + label);
  }
}
const metaDiagnostic = dashboardReferenceStates.find(
  state => state.label === "META under-extraction diagnostic"
);
if (!metaDiagnostic?.expectedDiagnostics?.some(
  d => d.code === "META_UNDER_EXTRACTION" && d.preserveWhenSplit === true
)) {
  failures.push("META under-extraction diagnostic preservation contract missing");
}

// PR-1 purity gate: these modules must remain deterministic and side-effect free.
// This is intentionally conservative; orchestration/runtime code belongs elsewhere.
const pureModules = [
  "src/constants.js",
  "src/registry.js",
  "src/governance-rules.js",
  "src/parsers.js",
  "src/text-utils.js",
];
const forbiddenPatterns = [
  ["fetch(", /\bfetch\s*\(/],
  ["React state", /\buse(?:State|Ref|Effect|Memo|Callback)\b/],
  ["clock", /\bnew\s+Date\s*\(|\bDate\.now\s*\(/],
  ["randomness", /\bMath\.random\s*\(|\bcrypto\./],
  ["diagnostic side effect", /\bconsole\.(?:warn|error|log)\s*\(/],
  ["browser mutation", /\b(?:window|document)\./],
  ["API orchestration", /\b(?:apiCall|callClaude_synthesis|compressDirectorOutput|storeSynthesisBrief)\b/],
];
for (const path of pureModules) {
  const source = fs.readFileSync(path, "utf8");
  for (const [label, pattern] of forbiddenPatterns) {
    if (pattern.test(source)) failures.push(path + " contains forbidden " + label);
  }
}

// Guard the explicit non-extraction decisions made for PR 1.
const appSource = fs.readFileSync("App_FINAL.jsx", "utf8");
if (!/function\s+parseDashboard\s*\(/.test(appSource)) {
  failures.push("parseDashboard moved during PR 1");
}
if (!/function\s+makeDecisionId\s*\(/.test(appSource)) {
  failures.push("makeDecisionId moved during PR 1");
}
if (!/function\s+govHeader\s*\(/.test(appSource)) {
  failures.push("govHeader moved during PR 1");
}
if (!/PHDSS extraction: META has/.test(appSource)) {
  failures.push("META under-extraction diagnostic was dropped");
}

if (failures.length) {
  console.error("PHDSS modularisation equivalence verification failed:");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}

console.log("PHDSS modularisation equivalence verification passed.");
console.log("Equivalence fixtures: " + equivalenceFixtures.length + " PASS");
console.log("Dashboard reference states: " + dashboardReferenceStates.length + " PRESENT");
console.log("Pure-module side-effect scan: PASS");
console.log("PR-1 non-extraction guards: PASS");
