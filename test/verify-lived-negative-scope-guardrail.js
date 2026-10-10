import assert from "node:assert/strict";
import { scanLivedNegativeScope as scan } from "../src/runtime/lived-negative-scope-guardrail.js";

const status = "**Participation & Representation Status**\nParticipation is unknown from the supplied record.\n\n**Domain Perspective**\n";
const cases = [
  ["V2-01 known construction", status + "The people most likely to struggle have not yet been reached or asked.", "NS_TEMPORAL_ABSENCE"],
  ["V2-04 known construction", status + "Consumers are effectively excluded from the formal consultation mechanism.", "NS_EXCLUSION"],
  ["V2-05 heading", status + "### Two unincorporated proposals\nThe record does not establish incorporation.", "NS_UNINCORPORATED"],
  ["reverse incorporation", status + "The proposals were not incorporated.", "NS_PROPOSALS_NOT_INCORPORATED"]
];
for (const [name, text, id] of cases) {
  const result = scan(text);
  assert.equal(result.status, "review_suggested", name);
  assert.ok(result.flags.some(f => f.rule_id === id), name);
  assert.ok(result.flags.some(f => f.cross_section_unknown), name + " cross-section marker");
}
const controls = [
  status + "The record does not establish whether consumers were consulted.",
  status + "If people are excluded from consultation, the design may fail.",
  status + "The supplied record says the proposals were not incorporated.",
  status + "Three consumers attended and endorsed the medication page, not the whole pack.",
  status + "There is a risk of exclusion from consultation."
];
for (const text of controls) assert.equal(scan(text).flags.length, 0, text);
assert.equal(scan("There is no participation heading.").coverage, "partial");
assert.equal(scan("No evidence is available.").status, "no_known_pattern_detected");
const example = scan(cases[0][1]);
assert.equal(example.flags[0].match, cases[0][1].slice(example.flags[0].start, example.flags[0].end));
assert.equal(scan(cases[0][1]).flags.length, example.flags.length);
console.log("Lived negative-scope warning-only development fixtures passed (not historical replay).");
