# PHDSS Limitations Register

**Status:** IN PROGRESS — opened at Gate A entry  
**Date opened:** 10 October 2026  
**Scope:** Known limitations of the PHDSS v2.0.0 constitutional baseline and current v3 development state  
**Purpose:** Gate A transfer-readiness requirement. A competent person who did not build PHDSS must be able to understand these limitations from this register without developer assistance.

This register records known limitations. It does not record features, aspirations, or deferred capabilities. A limitation is in this register because it is a gap in the current system's ability to do what it claims, or a boundary on what the evidence supports.

The register will be updated as Gate A work proceeds. Its current status is initial, not complete.

---

## L-01 — Chair authority detector: indirect adjudication blind spot

**Component:** `src/authority-contract.js`  
**Discovered:** V3 Chair authority detector baseline, September 2026  
**Evidence:** `docs/V3_CHAIR_AUTHORITY_DETECTOR_BASELINE.md`, `tests/evidence/v3/chair-authority-detector-baseline.v1.json`

**Limitation:** The Chair authority detector performs well on explicit adjudication (8/8) and straightforward descriptive necessity (8/8), but has substantial weakness on indirect and disguised adjudicative language: 0/8 classified correctly in the indirect/disguised category on the adversarial corpus.

Challenge-set accuracy: 24/36 (66.7%). This is a challenge-set result only. It is not a population prevalence estimate.

**False negative pattern:** The detector misses language that performs adjudication through implication, framing, selective emphasis, or structural positioning without using explicit adjudicative vocabulary.

**Current status:** Baseline is preserved and disclosed. No repair to indirect detection has been calibrated. Detector remains in service with this known limitation.

**Transfer implication:** A facilitator or reviewer relying on the authority detector for assurance of Chair compliance must understand that indirect adjudicative language may pass undetected.

---

## L-02 — Participation status: runtime inference, not independent verification

**Component:** Lived Experience Director, participation status section  
**Discovered:** V3 Advisory participation calibration, September 2026  
**Evidence:** `docs/V3_ADVISORY_PARTICIPATION_CALIBRATION_CLOSEOUT.md`

**Limitation:** Participation status in the Lived Experience Director output is inferred by the model from the supplied evidence record. It is not independently verified against an actual engagement record at runtime.

The two error directions are not institutionally equivalent:

- A false "not established" claim may under-credit real engagement and can be corrected when the engagement record is checked.
- A false "established" claim manufactures evidentiary standing for participation that may not have occurred.

**A false claim of established participation is treated as the more serious failure mode.**

**Current status:** The interim external-use disclosure in `docs/V3_DEVELOPMENT_CONTRACT.md` (Section 2.1) requires that before any externally used governance artefact states or relies on participation having occurred, a human reviewer must verify that claim against the documented engagement record. This is a compensating control. It is not evidence that runtime participation-status enforcement exists.

**Transfer implication:** Any governance artefact produced by PHDSS that references participation status requires human verification before institutional reliance.

---

## L-03 — Negative-scope leakage: persistent behavioural pattern

**Component:** Lived Experience Director (`lived.md` at instruction commit `22b662999e01462fc4008446885a38df2cf735ad`)  
**Discovered:** V3 Advisory participation calibration and pre-Gate characterisation, September–October 2026  
**Evidence:** `docs/V3_ADVISORY_PARTICIPATION_CALIBRATION_CLOSEOUT.md`, `docs/PRE_GATE_TRANCHE_CLOSURE.md`

**Limitation:** The Lived Experience Director has a persistent tendency to convert absence of documentation in the supplied record into implied real-world non-occurrence. This pattern appeared across multiple Advisory calibration generations and survived repeated prompt clarification.

Specific forms include:
- Temporal ("not yet reached", "has not yet been conducted")
- Stage entailment ("initial attempt" converted to implication about whole consultation)
- Population claims (characteristics of who was absent inferred without a supply-record basis)
- Unqualified absence assertions in downstream sections after correct UNKNOWN classification in the Participation & Representation Status section

**Current status:** The document-wide negative-scope discipline in `lived.md` was introduced to address this pattern. Its effectiveness has not been prospectively validated beyond F01.

**Transfer implication:** Lived Experience Director outputs require human review for negative-scope assertions, particularly in sections downstream of the Participation & Representation Status section. An absence claim in Director output is not verified evidence that the absence occurred.

---

## L-04 — Negative-scope scanner: limited and unvalidated coverage

**Component:** `src/runtime/lived-negative-scope-guardrail.js`  
**Discovered:** F01 prospective probe, October 2026  
**Evidence:** `docs/PRE_GATE_TRANCHE_CLOSURE.md`, `docs/LIVED_NEGATIVE_SCOPE_GUARDRAIL.md`

**Limitation:** The negative-scope scanner is a regression detector for a limited set of known syntactic forms. Its coverage is demonstrably incomplete.

- F01 produced no scanner warning despite an identified candidate unsupported-absence assertion. The miss was not borderline.
- The scanner does not detect novel paraphrases of the same underlying failure.
- No prospective sensitivity or specificity estimates exist. The pre-Gate tranche closed at F01, short of the preregistered 5–8-probe characterisation requirement.
- An empty warning set must not be treated as assurance of negative-scope compliance.
- A warning is neither a confirmed Category B failure nor an adjudicated rubric finding.

**Current status:** Experimental diagnostic, warning-only. No production blocking. Historical regression cases (V2-01, V2-04, V2-05) serve as development regression targets only.

**Transfer implication:** The scanner provides an additional signal for known forms. It does not provide assurance of compliance for any output on which it produces no warning.

---

## L-05 — Output transform: `stripCalibrationBleed_v1` semantic neutrality not guaranteed

**Component:** Advisory output pipeline (`App_FINAL.jsx`)  
**Discovered:** Advisory participation calibration provenance work, September 2026  
**Evidence:** `docs/V3_NEGATIVE_SCOPE_BEHAVIOURAL_CHARACTERISATION_PREREGISTRATION.md` (Section 2)

**Limitation:** `stripCalibrationBleed_v1` is a deterministic truncation transform that removes calibration-artifact markers from model output. It is not a semantic filter. However, because it truncates everything after a matched marker, it may remove substantive text if the model emits a calibration marker before later substantive content.

Both the raw model output and the post-transform output are captured and hashed in the Advisory provenance sidecar. Their identity or divergence is chain-of-custody evidence.

**Current status:** Transform is documented and both forms are preserved. The test suite verifies raw and transformed output provenance.

**Transfer implication:** Governance artefacts reflect post-transform output. Where raw and transformed outputs differ, the difference must be reviewed as part of the audit trail.

---

## L-06 — CORE enforcement: selection logic not deterministically enforced at the prompt layer

**Component:** Director selection / CORE mode  
**Status:** Known architectural boundary

**Limitation:** CORE mode adaptive Director selection is implemented in the runtime orchestration layer but is not deterministically enforced within the prompt itself. The model may produce analysis referencing Directors not selected for the current mode.

**Current status:** Runtime orchestration contract covers this. See `docs/RUNTIME_ORCHESTRATION_BOUNDARY.md`.

**Transfer implication:** CORE mode governance artefacts should be reviewed to confirm that Director outputs are consistent with the selected Director set.

---

## L-07 — Pre-Gate characterisation: stopped short of preregistered stopping rule

**Component:** Pre-Gate negative-scope behavioural characterisation  
**Evidence:** `docs/PRE_GATE_TRANCHE_CLOSURE.md`

**Limitation:** The preregistered behavioural characterisation protocol required 5–8 eligible prospective probes. One probe (F01) was completed. The stopping rule was not met. The tranche was closed by Protocol Authority decision.

This is a deliberate deviation, not a data-collection failure. The deviation is recorded accurately. The characterisation must not be described as completed.

**Transfer implication:** The transfer candidate has not been characterised under a completed prospective protocol. Gate A is entered under an approved deviation. This limitation must be disclosed in any external transfer artefact.

---

## Register maintenance

This register is a living document through Gate A. Known limitations not yet listed must be added before Gate A can close.

Limitations are not removed when they are mitigated; they are updated to reflect the current status of the limitation and any compensating controls. A compensating control is not evidence that the limitation is resolved.

Outstanding items to be added before Gate A close:

- Reality Anchor instruction contract limitations (if any)
- Known model behaviour limitations beyond lived/negative-scope
- Any deployment or build reproducibility limitations identified during Gate A validation run
- Tribal knowledge gaps identified during Operator Guide v1 drafting
