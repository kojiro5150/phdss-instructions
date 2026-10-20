# PHDSS Limitations Register

**Status:** REVIEW CANDIDATE — consolidated for Protocol Authority review; not yet accepted as Gate A-complete  
**Date opened:** 10 October 2026  
**Scope:** Known limitations of the PHDSS v2.0.0 constitutional baseline and current v3 development state  
**Purpose:** Gate A transfer-readiness requirement. A competent person who did not build PHDSS must be able to understand these limitations from this register without developer assistance.

This register records known limitations. It does not record features, aspirations, or deferred capabilities. A limitation is in this register because it is a gap in the current system's ability to do what it claims, or a boundary on what the evidence supports.

This is a transfer-facing consolidation of currently documented limitations, not proof that all possible limitations have been discovered. Protocol Authority acceptance and the transfer-candidate validation findings are outstanding. No Gate A exit claim follows from this document alone.

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

- F01 produced no scanner warning despite an identified candidate unsupported-absence assertion. The assertion was identified through model-assisted exploratory review and accepted by the Protocol Authority; it was not independently adjudicated against the frozen A-D rubric. This is recorded as a candidate miss relative to that exploratory adjudication, not as an established detection failure.
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

**Transfer implication:** CORE mode governance artefacts should be reviewed to confirm that Director outputs are consistent with the selected Director set. CORE contains globally mandatory Systems and Safety, CORE-fixed Equity and Lived Experience, and one adaptive fifth Director; these roles must not be conflated. See `docs/CORE_ACTIVATION_POLICY.md`.

---

## L-07 — Pre-Gate characterisation: stopped short of preregistered stopping rule

**Component:** Pre-Gate negative-scope behavioural characterisation  
**Evidence:** `docs/PRE_GATE_TRANCHE_CLOSURE.md`

**Limitation:** The preregistered behavioural characterisation protocol required 5–8 eligible prospective probes. One probe (F01) was completed. The stopping rule was not met. The tranche was closed by Protocol Authority decision.

This is a deliberate deviation, not a data-collection failure. The deviation is recorded accurately. The characterisation must not be described as completed.

**Transfer implication:** The transfer candidate has not been characterised under a completed prospective protocol. Gate A is entered under an approved deviation. This limitation must be disclosed in any external transfer artefact.

---

## L-08 — Refusal enforcement: instruction-level claims are not a runtime veto channel

**Component:** Ethics and Behaviour Directors (`ethics.md`, `behaviour.md`), runtime  
**Status:** Architectural boundary

**Limitation:** The Ethics and Behaviour Directors may identify risks, ethical concerns, or conditions under which a pathway should not proceed. These outputs are analytical findings within the governance record. They are not a verified, non-aggregable runtime veto channel.

Instruction-level refusal language in Director outputs — statements that a proposal should not, must not, or ought not proceed — expresses a reasoned analytical position. It does not constitute a technical enforcement action. The human decision-maker retains adjudication authority. A Director finding against a pathway does not prevent that pathway from being selected by the authorised human.

This distinction must not be confused in any external transfer artefact. A governance record that contains a strong Ethics Director caution is not evidence that the system blocked the proposal.

**Transfer implication:** Facilitators, evaluators, and any operator guide must make clear that Director outputs are inputs to human decision-making, not runtime enforcement. An Ethics or Behaviour Director finding does not substitute for institutional governance authority over the decision. The instruction corpus also contains an unresolved inconsistency: Ethics describes its active refusal obligation as unique while Behaviour describes the same structural feature; neither is a separately verified runtime veto. See `docs/CORE_ACTIVATION_POLICY.md` §5.

---

## L-09 — Governance provenance: transformation-integrity boundary

**Component:** `src/runtime/governance-provenance.js`, `scripts/verify-governance-provenance-v2.mjs`  
**Discovered:** Gate A.1 — Governance-mode provenance parity repair, October 2026  
**Evidence:** PR #80 Protocol Authority review

**Limitation:** The v2 Governance stage provenance schema captures `raw_output` (the initial model response), `raw_output_sha256`, `output_transform` (named transform sequence), and `output_capture_stage`. The verifier confirms that `raw_output_sha256` and `output_sha256` are each internally consistent with the text they hash. It does not and cannot prove that applying the declared `output_transform` to `raw_output` would reproduce `output`. The relationship between raw and final output is asserted by the pipeline, not independently verified.

Two sub-boundaries are documented in code but not mechanically enforced:

- Epistemic audit retries: `raw_output` records the initial model response only. If the retry loop ran, subsequent raw responses are not individually preserved. `output_transform` records the attempt count for audit purposes.
- Chair's second authority-repair pass (`repairChair`): `raw_output` is the initial model response from the first governed call. Replacement responses generated inside the `repairChair` authority-repair loop — if triggered — are internal to the authority contract layer and are not separately captured in the stage record.

**Current status:** Documented structural boundary. The schema and verifier accurately represent what is and is not established. The transform name encodes the declared sequence and any known sub-boundaries; it is an audit record, not a cryptographic proof of transformation.

**Transfer implication:** A governance artefact's raw/final output pair establishes that two specific model responses were captured and hashed. It does not establish that the final output is a deterministic function of the raw output via the named transform. Audit of transformation integrity requires access to the pipeline source at the declared deployment commit.

---

## L-10 — CORE Equity/Lived necessary-condition rationale is not verified downstream enforcement

**Component:** CORE activation and downstream signal aggregation
**Evidence:** `docs/CORE_ACTIVATION_POLICY.md` §§1–4

**Limitation:** Equity and Lived Experience are intentionally CORE-fixed alongside globally mandatory Systems and Safety, with one adaptive fifth Director. Their inclusion reflects a domain-grounded design judgment: in intended public-health contexts, a materially adverse Equity or Lived finding undermines a proposal's soundness. However, existing runtime inspection has not established any Director-identity-specific downstream cap, veto, automatic disposition or non-aggregable enforcement of that necessary-condition rationale. Standard CAUTION/HALT signal aggregation is not the same mechanism.

Housing-policy and geopolitical runs were used to examine structural transfer of the reasoning architecture; they do not establish that the Equity/Lived necessary-condition rationale is universal across sectors.

**Current status:** Selection policy and rationale documented; special downstream enforcement unverified. No new enforcement is introduced by this register.

**Transfer implication:** Operators must distinguish **fixed inclusion**, **substantive rationale**, and **runtime enforcement**. Do not claim that an Equity or Lived CAUTION/HALT automatically blocks a proposal or determines a human decision.

---

## L-11 — Stochastic synthesis and evidence quality are not independently assured

**Component:** Model-generated Director and synthesis outputs
**Evidence:** `docs/NORTH_STAR.md` (epistemic provenance and non-substitution); `docs/V3_DEVELOPMENT_CONTRACT.md` §3; `docs/V3_TRANSFER_READINESS_AND_INDEPENDENT_EVALUATION_ROADMAP.md` §§3, 12

**Limitation:** Model outputs are probabilistic analyses of the material supplied, not independently authenticated facts. A plausible or repeated claim can still be wrong, omit relevant evidence, collapse uncertainty, or present an inferred perspective as if independently corroborated. Agreement between Directors or synthesis layers is not independent corroboration; the Chair's presentation does not create evidentiary authority. No general accuracy, completeness, clinical safety, institutional effectiveness or universal authority-compliance rate is established by the current deterministic tests.

**Current status:** Constitutional constraints, stage checks and provenance provide bounded safeguards and auditability, not comprehensive factual verification. Behavioural and external-transfer evidence remain limited.

**Transfer implication:** Evaluators must examine source grounding and unresolved uncertainty, distinguish model inference from supplied evidence and actual participation, and preserve human authority. Do not use PHDSS output as clinical, legal or institutional authorisation.

---

## L-12 — Transfer reproducibility and operator independence not yet demonstrated

**Component:** Build, deployment, provider configuration, exports and handoff
**Evidence:** `docs/GATE_A_ENTRY.md` §§2–4; `docs/V3_TRANSFER_READINESS_AND_INDEPENDENT_EVALUATION_ROADMAP.md` §§9–14; `docs/GATE_A_SYNTHETIC_TEST_DATA_POLICY.md`

**Limitation:** A tagged post-v2 transfer baseline and its clean validation evidence have not yet been recorded. Passing local tests on a development branch is not equivalent to validation at the exact frozen release, a live Governance capture/export integration test, or a stranger-operated run. Package-lock identity, deployed build identity, model/provider settings, instruction pin, export completeness, access arrangements and run-time failure recovery must be evidenced for the transfer candidate rather than inferred from repository documentation.

**Current status:** **Open transfer-evidence requirement**, not an established reproducibility defect. Gate A.1 Governance provenance was accepted as PARTIAL under L-09; the actual v2 capture/export path still requires an integration test. The synthetic-only policy is documented but does not establish technical input blocking or completed external-run handling arrangements.

**Transfer implication:** Do not claim the build is independently reproducible, Governance provenance is fully equivalent to Advisory v4, or an external operator can complete a run without developer assistance until the corresponding evidence exists. New defects discovered in candidate validation must be recorded here before Gate A exit.

---

## L-13 — Replay instruction provenance misattribution

**Classification:** Verification / provenance integrity  
**Status:** OPEN  
**Component:** `scripts/replay-stage.mjs`  
**Discovered:** Live replay gate design review, 20 October 2026  
**Evidence:** `docs/LIVE_REPLAY_GATE_CI_DESIGN.md` §2 and §6 (PR #86); `src/runtime/instruction-loader.js` (split pins)

**Limitation:** `replay-stage.mjs` loads `chair.md` and `comparator.md` from the working tree at execution time. It records `replay_instruction_commit` as `INSTRUCTION_COMMIT`, which is the runtime pin for `lived.md` only. The runtime resolves Chair and Comparator at `BASELINE_INSTRUCTION_COMMIT`. The recorded commit therefore may not identify the instruction bytes that produced the replayed behaviour, and no per-file content hash is recorded.

**Known affected record:** `tests/fixtures/calibration/DR-20260926-204324-a2e644/replay-closure/comparator-2026-09-26T13-54-41-458Z/replay-manifest.json`. This is a successful Comparator replay whose recorded `replay_instruction_commit` cannot by itself establish which `comparator.md` content was evaluated. The record is not rewritten by this entry.

**Consequence:** Replay evidence cannot independently establish which instruction version produced the recorded behaviour.

**Containment:** Qualify affected historical replay claims. Do not use the recorded `replay_instruction_commit` field alone as proof of the instruction version evaluated. An affected replay record may not serve as an established baseline without independent evidence of the evaluated bytes.

**Gate A cross-reference:** The Gate A evidence review must determine whether any Gate A provenance claim depends on `replay-stage.mjs` output or its `replay_instruction_commit` field. If it does, independent evidence must establish the instruction bytes actually evaluated before that claim is accepted. If Gate A relies on an independent provenance chain, the separation should be documented there. As of this entry, the Gate A protocol documents do not reference `replay-stage.mjs`; that observation is not a substitute for the evidence review. This entry does not modify Gate A acceptance criteria or status.

**Closure evidence:** Corrected source resolution (instructions resolved from the commit the runtime would use), per-file content hashes recorded with each replay, provenance validation, and regression tests demonstrating that a mismatch between evaluated bytes and recorded provenance is detected.

**Implementation:** Separate PR. Not authorised by this register change.

**Transfer implication:** A replay record's commit field identifies a pin, not necessarily the content evaluated. Do not cite historical replay results as evidence for a specific instruction version without independent confirmation of the evaluated bytes.

---

## Transfer-facing disclosure and acceptance checklist

A competent operator should be able to identify, without developer explanation:

- **Authority:** PHDSS organises analysis; a human decides. Chair and Director outputs are not adjudications or vetoes (L-01, L-08, L-10).
- **Participation:** Modelled perspectives and supplied lived-experience evidence are not proof of actual participation; human verification is required (L-02–L-04).
- **Evidence:** An absence of a scanner warning does not certify compliance; model convergence does not corroborate a claim (L-03, L-04, L-11).
- **Provenance:** Hash checks confirm captured strings, not a complete replayable transform chain; retries/repair responses can be absent (L-05, L-09).
- **Transfer:** The pre-Gate tranche ended by approved deviation; frozen-build and independent-use evidence is still pending (L-07, L-12).

**Acceptance rule:** This register may be accepted as the documented set of *currently known* limitations after independent review. Acceptance does not waive outstanding Gate A exit criteria, resolve unverified runtime claims, or certify completeness against defects not yet discovered.

---

## Register maintenance

This register is a living document through Gate A. Known limitations not yet listed must be added before Gate A can close.

Limitations are not removed when they are mitigated; they are updated to reflect the current status of the limitation and any compensating controls. A compensating control is not evidence that the limitation is resolved.

Outstanding verification and update triggers before Gate A exit:

- **Reality Anchor:** The existing instruction-contract regression coverage is listed in `docs/GATE_A_ENTRY.md`, but this review has not established a separate Reality Anchor-specific failure mode. Do not invent one; inspect any relevant evidence during transfer-candidate validation and add a specific entry if supported.
- **Governance provenance:** Run the actual v2 capture/export integration test and update L-09/L-12 if it reveals further gaps.
- **Build/deployment:** Record any reproducibility, instruction-pin, provider, export or environment defect found on the exact tagged candidate; update L-12 or add a new limitation with evidence.
- **Operator transfer:** Any missing operational knowledge discovered while drafting the Gate B Operator Guide or in the stranger test must be logged and assessed; Gate B findings must not be retrospectively described as Gate A validation.
- **UI disclosure:** Verify that the transfer-facing limitations are intelligible and accessible in the actual UI; this register alone does not establish UI disclosure.

**Protocol Authority review questions:** Are L-01–L-12 accurately characterised? Are there documented, evidenced omissions? Which open items are transfer blockers versus accepted limitations? Do not mark the register or Gate A exit COMPLETE before these questions are disposed of.
