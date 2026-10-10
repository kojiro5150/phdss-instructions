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

/*
 * Post-hoc regression constructions transcribed from frozen V2 Markdown lines.
 * These are NON-FROZEN development fixtures, not independent human gold.
 * The preserved originals remain outside this repository.
 */
const historicalLines = [
  ["V2-01 line 68", "- **Silence as apparent adequacy:** A telehealth orientation with clear access instructions may appear ready to proceed from a logistical standpoint while carrying unexamined accessibility and trust risks. The absence of complaints or visible resistance at this stage does not indicate the design is experientially sound — it indicates that the people most likely to struggle have not yet been reached or asked.", "NS_TEMPORAL_ABSENCE"],
  ["V2-04 line 19", "The accessibility failure documented in the supplied record is not a minor administrative incident. A consumer who could not open the feedback form using a screen reader was effectively excluded from the formal consultation mechanism for this decision. The record does not establish whether this was corrected, whether an alternative channel was offered, or whether other people encountered the same barrier.", "NS_EXCLUSION"],
  ["V2-05 line 37", "- **Actual participation status:** The supplied record establishes that four consumers made proposals. It does not establish whether those consumers participated in drafting, reviewing, or endorsing the revised text; whether they received any response about the two unincorporated proposals; or what role, if any, they had beyond initial proposal submission.", "NS_UNINCORPORATED"],
  ["V2-05 line 43", "1. **Unresolved proposals.** The supplied record is silent on the two unincorporated changes. If those consumers were not informed of the outcome and the reasoning, the experience of the process may undermine rather than build trust.", "NS_UNINCORPORATED"],
];
for (const [name, line, rule] of historicalLines) {
  const result = scan(status + line);
  assert.ok(result.flags.some(flag => flag.rule_id === rule), name + " should suggest review");
}
const historicalConditional = "If the two unincorporated proposals were not actively declined or deferred with explanation, that silence cannot be read as acceptance.";
assert.equal(scan(status + historicalConditional).flags.length, 0, "V2-05 line 67 conditional should not flag");

console.log("Lived negative-scope warning-only development fixtures passed (including post-hoc V2 line regressions; not full historical replay).");
