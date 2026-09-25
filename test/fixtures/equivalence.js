// Baseline equivalence fixtures captured before PR-1 extraction.
// These inputs/outputs describe existing App_FINAL.jsx behaviour.
// They contain no production or Governance-in-Confidence material.

export const equivalenceFixtures = [
  {
    label: "stripCalibrationBleed truncates calibration bleed",
    fn: "stripCalibrationBleed",
    args: ["Visible analysis\n## CALIBRATION NOTE\nInternal instruction"],
    expected: "Visible analysis",
  },
  {
    label: "stripInstructionArtifacts removes inline guard phrase",
    fn: "stripInstructionArtifacts",
    args: ["Keep (DO NOT REPRODUCE THIS LINE internal guard) Tail"],
    expected: "Keep  Tail",
  },
  {
    label: "deduplicateSections suppresses repeated heading/content block",
    fn: "deduplicateSections",
    args: ["Intro\n**Risk**\nSame body\n**Risk**\nSame body\n**Other**\nOther body"],
    expected: "Intro\n**Risk**\nSame body\n**Other**\nOther body",
  },
  {
    label: "safeMatch returns requested capture group",
    fn: "safeMatch",
    args: ["Signal: CAUTION", /(PROCEED|CAUTION|HALT)/, 1],
    expected: "CAUTION",
  },
  {
    label: "extractFirstJsonObject parses surrounding prose",
    fn: "extractFirstJsonObject",
    args: ["prefix {\"a\":1,\"b\":[2]} suffix"],
    expected: { a: 1, b: [2] },
  },
  {
    label: "extractBulletLines preserves bullet meaning",
    fn: "extractBulletLines",
    args: ["**Risks**\n- Alpha risk\n2. Beta risk\n**Next**\nDone", "Risks"],
    expected: ["Alpha risk", "Beta risk"],
  },
  {
    label: "extractSection combines inline and block content",
    fn: "extractSection",
    args: ["**Decision Conditions**: Inline condition\nBlock condition\n**Next**\nDone", "Decision Conditions"],
    expected: "Inline condition\nBlock condition",
  },
  {
    label: "findSignal returns first matching vocabulary item",
    fn: "findSignal",
    args: ["The Probe found SIGNIFICANT GAPS in the record.", ["BOARD REASONING SOUND", "SIGNIFICANT GAPS", "CONCLUSION CHALLENGED"]],
    expected: "SIGNIFICANT GAPS",
  },
  {
    label: "normItem normalises numbering emphasis and separators",
    fn: "normItem",
    args: ["1. **Clinical Safety** — \"High Risk\""],
    expected: "clinical safety high risk",
  },
  {
    label: "dedupItems removes normalised duplicates",
    fn: "dedupItems",
    args: [["1. **Safety** — high risk", "Safety: high risk", "Different item"]],
    expected: ["1. **Safety** — high risk", "Safety: high risk", "Different item"],
  },
  {
    label: "detectAdaptiveFifth keeps AI procurement in Digital",
    fn: "detectAdaptiveFifth",
    args: ["Procure an AI platform with a new funding model"],
    expected: "digital",
  },
  {
    label: "detectAdaptiveFifth routes non-AI digital procurement to Economics",
    fn: "detectAdaptiveFifth",
    args: ["Procure a digital workflow platform under budget pressure"],
    expected: "economics",
  },
  {
    label: "resolveCoreDirectors preserves current Director ordering",
    fn: "resolveCoreDirectorsIds",
    args: ["Deploy AI triage across emergency departments"],
    expected: ["systems", "equity", "lived", "digital", "safety"],
  },
  {
    label: "resolveChairDirectors adds mandatory Directors without reordering registry",
    fn: "resolveChairDirectorsIds",
    args: [["equity", "digital"]],
    expected: ["systems", "equity", "digital", "safety"],
  },
  {
    label: "resolveActiveDirectors FULL returns registry order",
    fn: "resolveActiveDirectorsIds",
    args: ["FULL", "anything", []],
    expected: ["systems", "economics", "behaviour", "policy", "equity", "lived", "digital", "ethics", "sovereignty", "safety", "physics", "measurement", "innovation"],
  },
];

export const fixtureContract = Object.freeze({
  invariant: "same inputs -> byte/structure-equivalent outputs",
  capturedBeforeExtraction: true,
});
