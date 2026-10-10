# Pre-Gate Negative-Scope Behavioural Tranche — Closure Record

**Status:** CLOSED — explicit Protocol Authority decision, short of preregistered stopping rule  
**Date:** 10 October 2026  
**Decision authority:** Sam Hayward, Protocol Authority  
**Preregistration document:** `docs/V3_NEGATIVE_SCOPE_BEHAVIOURAL_CHARACTERISATION_PREREGISTRATION.md`

---

## 1. Preregistered scope

The preregistered protocol required 5–8 eligible prospective probes before characterisation results could be used to inform gate decisions.

No probe result was to be used to edit the protocol retrospectively. No instruction, prompt-builder, classifier, or scoring-rule change was permitted between eligible probes. An empty warning set was not to be treated as assurance.

---

## 2. Actual outcome

**One eligible prospective probe was completed (F01).**

The preregistered stopping rule of 5–8 probes was not satisfied.

### F01 finding

The negative-scope scanner produced no warning on F01 despite an identified candidate unsupported-absence assertion in the Lived Experience Director output. The candidate assertion was identified through model-assisted exploratory review and accepted by the Protocol Authority; it was not independently adjudicated against the frozen A-D rubric.

The candidate assertion converted absence of documentation in the supplied record into an implied real-world non-occurrence without a supply-record qualifier. The scanner did not flag it. This is recorded as a candidate scanner miss relative to the exploratory adjudication, not as an established detection failure with independent confirmation.

**This candidate miss establishes that an empty warning set cannot be treated as assurance of negative-scope compliance.**

### Post-F01 repair

Following F01, a clause-suppression fix was applied (`fix: scope negative-claim suppression to containing clause`, PR #74). This fix correctly tightened suppression to the containing clause rather than the containing paragraph. It does not establish that the F01 candidate assertion would have been flagged under the repaired logic.

The fix is preserved in main. Its effect on F01 was not prospectively tested under the preregistered protocol before the tranche was closed.

---

## 3. Deviation from preregistered protocol

| Requirement | Preregistered | Actual |
|---|---|---|
| Probe count | 5–8 eligible prospective probes | 1 (F01) |
| Stopping rule | Predeclared recurrence rule | Protocol Authority decision to stop at F01 |
| Scanner miss recorded | N/A | Yes — F01 miss documented |
| Post-hoc repair tested prospectively | Not applicable | No — repair applied but not re-probed |
| Independent human adjudication | Required for scoring | Not performed |

This is a deliberate protocol deviation, not a data-collection failure. The deviation was decided by the Protocol Authority on the grounds that the full research-grade evaluation apparatus is disproportionate to the current development stage of PHDSS.

The preregistered protocol is preserved in full in the repository. It is not amended or superseded by this record.

---

## 4. Evidence preserved

The following is preserved and must not be retroactively altered:

- Preregistration document: `docs/V3_NEGATIVE_SCOPE_BEHAVIOURAL_CHARACTERISATION_PREREGISTRATION.md`
- Advisory participation calibration close-out: `docs/V3_ADVISORY_PARTICIPATION_CALIBRATION_CLOSEOUT.md`
- Negative-scope guardrail implementation: `src/runtime/lived-negative-scope-guardrail.js`, `test/verify-lived-negative-scope-guardrail.js`
- Guardrail limitations documentation: `docs/LIVED_NEGATIVE_SCOPE_GUARDRAIL.md`
- PR #69 ten-case retrospective replay record (now in main via PR #75)
- Clause-suppression fix: PR #74

---

## 5. Retained scanner status

The negative-scope scanner remains in the codebase as an **experimental diagnostic, warning-only**.

Its status is governed by the following constraints, unchanged by this closure:

- It is a regression detector for known syntactic forms, not a validated safeguard.
- An empty warning set is not assurance of negative-scope compliance.
- A warning is neither a confirmed Category B failure nor an adjudicated rubric finding.
- The scanner does not rewrite, suppress, or gate Director outputs.
- No production blocking is implemented or planned based on scanner output.
- Historical V2 cases (V2-01, V2-04, V2-05) are candidate development regression targets, not prospective validation evidence.

---

## 6. Full V3 research track

The V3 research architecture — v0.5 technical design, calibration-readiness package v1.0, six-role separation-of-duties model, evidence-state registry, claim-and-warrant contract, coverage-query contract — is preserved as a documented deferred research track.

It is not required for the next PHDSS release and is not part of the Gate A transfer-readiness scope.

It may be resumed when a concrete external pilot, publication requirement, or safety decision requires validated scanner performance.

---

## 7. What this record establishes

This record establishes:

- One prospective case completed (F01), with a scanner miss on a candidate unsupported-absence assertion.
- No independent human-gold adjudication performed.
- The full 12-case study was not completed and must not be described as completed.
- The prospective evaluation is closed at F01 by Protocol Authority decision.
- The scanner is retained as experimental and warning-only with known limited coverage.

This record does not establish:

- That the scanner detects all or most negative-scope failures.
- That the post-F01 repair addresses the F01 miss.
- That the system is free of negative-scope leakage.
- That the pre-Gate behavioural characterisation met its preregistered requirements.

---

## 8. Approved deviation rationale (Protocol Authority)

> PHDSS is intended to support human decision stewardship, not to become an endlessly self-validating governance laboratory. The full prospective evaluation belongs to a longer-term research programme. The stopping point is F01. The evidence is disclosed accurately. The scanner remains experimental. Development resumes toward Gate A transfer readiness.
