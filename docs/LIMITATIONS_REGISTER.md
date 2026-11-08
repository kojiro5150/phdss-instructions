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

## L-14 — Composite-pin instruction provenance misattribution

**Classification:** Verification / provenance integrity  
**Status:** OPEN  
**Component:** `src/runtime/instruction-loader.js`; Governance and Advisory provenance capture; `scripts/verify-governance-provenance-v2.mjs`; `scripts/verify-advisory-provenance-v4.mjs`  
**Discovered:** Read-only Gate A provenance independence trace at `5a7e4c9`, 20 October 2026  
**Evidence:**

- `src/runtime/instruction-loader.js:3-6,41`: composite pins. `lived.md` resolves at `INSTRUCTION_COMMIT` (`94c5851`); the other 20 instruction files resolve at `BASELINE_INSTRUCTION_COMMIT` (`22b6629`). Introduced by `612148e`.
- `App_FINAL.jsx:2059` (Advisory v4 records, any Director) and `src/pipeline.js:327,477,517,847,873` (Governance records): `instruction_commit` is populated from `INSTRUCTION_COMMIT` for every instruction file.
- `src/runtime/governance-provenance.js:32-41,56`: per-stage hashes of the runtime instruction bytes are recorded alongside that single `instruction_commit`.
- `scripts/verify-governance-provenance-v2.mjs:47-49,98` and `scripts/verify-advisory-provenance-v4.mjs:45-53`: the verifiers fetch each file at the recorded `instruction_commit` from `raw.githubusercontent.com` and compare hashes.
- `git diff 22b6629 94c5851` over instruction files: only `lived.md` differs.

**Limitation:** Provenance records identify `INSTRUCTION_COMMIT` as the source of instruction files that the runtime actually resolves from `BASELINE_INSTRUCTION_COMMIT`. Instruction hashes exist and are verified. Verification currently passes for the 20 affected files only because their bytes are identical at both commits. The verifier therefore establishes that the recorded bytes correspond to content available at the declared commit. It does not establish that the declared commit was the source the runtime used. Verification also fetches from `raw.githubusercontent.com`, while the runtime loads from jsDelivr; equivalence of those sources has not been tested.

- **Content integrity:** supported by hash comparison.
- **Source attribution:** incorrect for the composite-pin configuration.
- **Runtime provenance:** not fully established for a build from current main.
- **Behavioural correctness:** not determined by this limitation.

**Affected configurations:** Builds that contain `612148e`, including current main. The deployed `gh-pages` build (`29606ca`, built from `4fcec9a`) predates the composite pins and embeds only `22b6629`; its single-pin provenance path is not affected by this limitation, subject to its own evidence review. Historical deployment artefacts are not modified by this entry.

**Containment:** For any affected candidate, treat `instruction_commit` as a declared label, not as proof of the source the runtime used. A provenance claim that depends on source attribution must be resolved or explicitly qualified before acceptance. A qualification does not convert to PASS.

**Closure evidence:** Per-file source-commit attribution in provenance records; hashes of the evaluated instruction bytes; verification against the composite pin configuration actually used; a regression test in which the two pins contain **different** bytes for an affected file and the verifier correctly attributes or rejects; and a test of jsDelivr versus raw GitHub source equivalence. A passing test in which both pins hold identical bytes is not sufficient closure evidence.

**Implementation:** Separate PR. Not authorised by this register change.

**Relationship to L-13:** Shared root (a single commit label applied to a composite instruction set), separate mechanism. L-13 concerns `scripts/replay-stage.mjs` and records no content hashes; L-14 concerns Governance and Advisory provenance, which do record and verify content hashes. The 20 October trace found no execution or evidence path by which L-13 enters Gate A provenance.

**Transfer implication:** A verified provenance record establishes that recorded bytes exist at the declared commit. For a composite-pin build, it does not by itself establish which commit the runtime loaded them from.

---

## L-15 — Analytical reproducibility: consequential-field stability unmeasured

**Component:** HITH synthetic scenario; Director and Chair synthesis outputs  
**Evidence:** 20 October 2026 transfer-readiness reconciliation (reviewer-reported); L-01 and L-11  
**Classification:** Verification gap, not an established failure rate

**Limitation:** No repeated-run evidence establishes how consistently the same frozen input and settings preserve consequential governance conclusions. Textual similarity alone is not the relevant criterion. The reported configuration uses `claude-sonnet-4-6` at temperature 0.8; the provider identifier's snapshot/pinning semantics must be verified and recorded rather than assumed.

**Required bounded characterisation:** Run the same frozen synthetic HITH fixture three to five times, holding the fixture, instruction commit, configuration and execution pathway constant. Score ONLY (1) set of viable options, (2) whether safety or ethics concerns are surfaced, (3) participation status, (4) any evidence limitation promoted to a conclusion and (5) any implied preferred option. Record actual model identifier/version metadata when exposed, raw/final output and provenance references. Do not infer agreement from narrative similarity. A shifting implied preference is a possible practical manifestation of the L-01 Chair-authority concern; adjudicate it against the Chair's non-recommendation mandate.

**Current status:** OPEN — protocol specified; repeats not run; no stability or failure-rate claim.

**Transfer implication:** A deterministic-suite pass does not establish analytical stability or reproducibility of live model behaviour. Record disagreement by field, including an explicit none/not-assessable category, and disclose the observed bounded results without extrapolation.

---

## L-16 — Single-developer assurance and independent review pending

**Component:** Code, runtime assertions, assurance process and transfer evaluation  
**Evidence:** 20 October 2026 transfer-readiness reconciliation (reviewer-reported); L-12  
**Classification:** Assurance and operational risk

**Limitation:** Development and much of the present verification have been performed under a single-developer assurance arrangement. A locally passing suite is not equivalent to independent code review, stranger operation or independent evaluation.

**Current status:** OPEN — RMIT review and an independent tester are intended assurance routes, not completed evidence unless dated scope, personnel, artefacts, findings and dispositions are recorded. This entry alone does not block a supervised synthetic advisory pilot; it remains relevant to transfer claims.

**Transfer implication:** Explicitly disclose current review independence. Neither planned review nor an independent tester's future involvement may be reported as assurance already obtained.

---

## L-17 — Temporal layer is a proposed extension, not a v3 capability

**Component:** Proposed temporal decision-stewardship architecture  
**Evidence:** 20 October 2026 repository inspection reported no implemented temporal layer  
**Classification:** Permanent current-version claims boundary, not a defect requiring remediation for this pilot

**Limitation:** The current v3 repository does not implement a general temporal layer for commitments, option closure, branching futures or temporal agency. Incidental use of the term temporal in negative-scope controls does not establish such a capability.

**Current status:** OUT OF V3 PILOT SCOPE — research/design extension only, unless a future version explicitly implements and validates it.

**Transfer implication:** Do not claim temporal decision analysis as a verified v3 feature or make implementation a pre-pilot requirement.

---

## L-18 — Dominant signal computed by divergent rules across synthesis stages

**Classification:** Runtime integrity / deliberative-architecture consistency  
**Status:** PARTIALLY REMEDIATED — cross-stage consistency fix merged (PR #90, `7649eb4`) and verified by CI; Protocol Authority disposition outstanding on tie and no-signal semantics; stress-trigger extraction transferred to L-20  
**Component:** `src/pipeline.js` (`runGovernancePipeline`, `shouldRunStressTest`)  
**Discovered:** Architecture review of synthesis-stage inputs, 2 November 2026  
**Evidence:** `src/pipeline.js` at `main` `db2aded`: Surface Map tally (around lines 600–607), Adversarial Probe tally (around lines 713–717), Comparator counts (around lines 797–799), stress trigger patterns (around lines 98–112)

**Limitation:** The Board's dominant signal is computed twice within one run, by two different rules, and each result is supplied to a different stage.

- **Surface Map path.** Counts PROCEED / CAUTION / HALT from each Director's `**Recommendation Signal**`, then applies: HALT if strictly greater than both other counts; otherwise CAUTION if greater than or equal to both; otherwise PROCEED if any PROCEED; otherwise MIXED. The result is injected to the Surface Map as `AUTHORITATIVE SIGNAL COUNTS ... DOMINANT SIGNAL`.
- **Adversarial Probe path.** Recounts with an equivalent pattern, sorts the counts in descending order, and takes the first entry. Ties are resolved by the order in which signals first appear in Director result order, not by any governance rule. Where no signal is parsed, the Probe receives `UNKNOWN`, while the Surface Map path yields `CAUTION` (see the policy observation below).

On any tied count the two stages can be told different dominant signals. Example: two PROCEED and two CAUTION, with the first Director reporting PROCEED. The Surface Map is told CAUTION; the Probe is told PROCEED and directs its challenge against proceeding.

A related divergence: `shouldRunStressTest` extracts signals with a third, more permissive pattern set, including a bare `**HALT**` anywhere in a Director's output. Its HALT and CAUTION counts can therefore differ from the authoritative tally. This affects whether the Stress Test runs, not the dominant signal, and is recorded here rather than as a separate entry because it shares the same root cause: no single signal-extraction function.

**Policy observation (not a defect claim):** The Surface Map rule resolves a PROCEED–HALT tie with fewer CAUTION signals to PROCEED, for example four PROCEED, four HALT and one CAUTION. Whether this is the intended governance semantics is a Protocol Authority decision. Separately, because zero satisfies the CAUTION condition (0 ≥ 0), a run with no parsed Director signals is reported as CAUTION, and the rule's MIXED branch is unreachable. Both observations are recorded here so that a consistency fix is not mistaken for a decision on tie or no-signal semantics.

**Consequence:** In tied runs, the direction of the Adversarial Probe (the Deliberate Advocacy direction) can be set by Director execution order rather than by the Board's recorded tally, and the Governance Record can be internally inconsistent: the Surface Map reports one dominant signal while the Probe challenges another. Any claim that the Probe's direction is computed deterministically from the authoritative tally holds only for untied runs.

**Known affected records:** Four probable, in the external 58-run development corpus (`phdss-corpus-2026-03-30-v2`; see L-23): `DR-20260329-185438-a14b53`, `DR-20260329-202150-8b36b4`, `DR-20260329-225548-e43923` and `DR-20260330-174621-01585f`. Each records 0 PROCEED / 6 CAUTION / 6 HALT. Under the Surface Map rule the dominant signal is CAUTION; in each run the Probe's Strongest Counter-Argument explicitly challenges a HALT signal. The divergent rules are present in the earliest repository copy of the application (`0512e48`, 22 March 2026), which predates all four runs. Classification is *probable*, not confirmed: the corpus does not store Surface Map output, so the dominant signal the Surface Map actually received cannot be read from the record. Three of the four are among the 17 challenged-Probe / conditional-approval cases used as historical Chair evidence and must be analysed as a separate stratum.

Checked and not classified as affected: `DR-20260308-225832-9f3c90` (0 / 2 / 2) predates the earliest repository copy and its Probe challenges caution, consistent with the Surface Map rule; `DR-20260309-191131-1082b9` records 0 / 0 / 0 while its Probe refers to unanimous CAUTION/DEFER signals from fourteen Directors, which indicates a tally-parse failure (L-23), not a tie. The single complete run stored in this repository (`tests/fixtures/calibration/DR-20260926-204324-a2e644`, 11 CAUTION / 2 HALT) is untied and unaffected.

**Containment:** For any historical run with tied signal counts, qualify the Probe's challenge direction before citing it as evidence of the Deliberate Advocacy Principle. Do not describe the Probe direction as tally-derived in transfer or publication material until closure evidence exists.

**Closure evidence:** One shared signal-extraction and tally function used by the Surface Map, Adversarial Probe and Comparator (met by PR #90); regression tests demonstrating identical dominant signals across stages for tied and signal-free inputs (met by PR #90); and a recorded Protocol Authority disposition on tie and no-signal semantics, including whether MIXED should be reachable (outstanding). Stress-trigger extraction closes under L-20.

**Remediation (2 November 2026):** PR #90 added `src/signal-tally.js`. The Surface Map counts and dominant signal, Adversarial Probe direction, Comparator tally and Ledger counts now come from one shared tally (`tallyDirectorSignals`). The pre-existing Surface Map rule is preserved exactly. `test/verify-signal-tally.js` shows Surface Map and Probe agreement on tied and signal-free inputs; both checks fail on the pre-fix pipeline. CI passed on merge commit `7649eb4`.

**Residual:** (1) Tie and no-signal semantics are unchanged and await Protocol Authority disposition: 4 PROCEED / 1 CAUTION / 4 HALT resolves to PROCEED, and 0 / 0 / 0 resolves to CAUTION. (2) The stress trigger's separate extractor is not covered by the fix; it is now recorded as L-20. (3) Whether a single dominant signal should represent disagreement at all is a separate governance question, recorded as L-21.

**Fixture:** `tests/fixtures/synthetic/limitations-l18-l21.json` cases `L18-TIE-PROCEED-HALT` and `L18-NO-SIGNAL`, characterised by `test/verify-limitation-fixtures.js`.

**Transfer implication:** Surface Map and Probe now receive the same dominant signal in every run from `7649eb4`. Runs before that commit with tied counts remain subject to the containment above. The tie and no-signal outputs are policy-dependent and should be reported with the full signal counts.

---

## L-19 — Authority detector exempts clauses ending in a question mark

**Classification:** Authority-boundary defect  
**Status:** OPEN  
**Component:** `src/authority-contract.js` (`reasonForClause`, around line 84: `if(/\?$/.test(clause)) return null;`)  
**Discovered:** Independent source review and verification, 3 November 2026  
**Baseline:** `7649eb4`

**Limitation:** The authority detector returns no violation for any clause ending in `?`. The exemption is intended to allow questions that surface decision issues, but it also passes directives phrased as rhetorical questions. Verified at baseline: "Surely the Board should approve pathway B?" and "Should the Board not simply approve pathway B?" are not flagged in the Chair layer, while the declarative control "The Board should approve pathway B." is flagged as `INSTITUTIONAL_DIRECTIVE`.

This is distinct from L-01. L-01 concerns indirect adjudication without explicit directive vocabulary; L-19 is an explicit directive that escapes detection solely because of its punctuation.

**Consequence:** A synthesis layer can direct the human decision-maker without triggering repair or telemetry, and the stage is recorded as authority-compliant.

**Fixture:** `tests/fixtures/synthetic/limitations-l18-l21.json` cases `L19-RHETORICAL-DIRECTIVE`, `L19-NEGATED-RHETORICAL-DIRECTIVE` and control `L19-CONTROL-DECLARATIVE-DIRECTIVE`.

**Containment:** Do not cite repair telemetry or an absence of authority violations as evidence that outputs contain no directives phrased as questions.

**Closure evidence:** Detector behaviour that flags directive content irrespective of terminal punctuation, while still permitting genuine issue-surfacing questions; a calibrated challenge set covering both, with results recorded; the fixture cases updated in the same change.

**Implementation:** Separate PR. Not authorised by this register change.

**Transfer implication:** The authority detector's assurance does not extend to rhetorical-question directives.

---

## L-20 — Stress-trigger reliability: negation and divergent signal extraction

**Classification:** Runtime reliability defect (conditional-stage triggering)  
**Status:** OPEN  
**Component:** `src/pipeline.js` (`shouldRunStressTest`, around lines 91–130)  
**Discovered:** Independent source review and verification, 3 November 2026; extraction divergence first recorded under L-18  
**Baseline:** `7649eb4`

**Limitation:** Two independently identifiable problems.

1. **Negation.** Trigger expressions match vocabulary without reading polarity. Verified at baseline: an Epistemic Audit stating "The evidence is not weak." or "No compromised sources identified." triggers the Stress Test with the recorded reason "Epistemic Audit detected major uncertainty".
2. **Divergent extraction.** The trigger uses its own, more permissive signal patterns rather than the shared tally. Verified at baseline: a lowercase signal ("**Recommendation Signal**: halt"), an unbolded signal line ("Recommendation Signal (final): HALT") and a negated heading ("**HALT** conditions are not met in this analysis.") are each counted as a HALT by the trigger, while the shared tally counts none as HALT.

**Consequence:** The Stress Test can run when no qualifying condition exists, and the ledger can record a trigger reason that is false. Because the error tends towards running the stage, the immediate analytical risk is low; the provenance and evaluation risk is not, since trigger reasons and conditional-stage frequencies may be misreported.

**Fixture:** `tests/fixtures/synthetic/limitations-l18-l21.json` cases `L20-NEGATED-WEAK`, `L20-NEGATED-COMPROMISED`, `L20-EXTRACTOR-LOWERCASE`, `L20-EXTRACTOR-UNBOLDED` and `L20-EXTRACTOR-NEGATED-HEADING`.

**Containment:** Treat recorded stress-trigger reasons as provisional. Do not use Stress Test activation frequency as an evaluation measure until closure.

**Closure evidence:** A recorded disposition on whether the trigger adopts the shared extractor; trigger expressions that do not fire on negated vocabulary, or a documented decision to accept conservative over-triggering with accurate reason recording; the fixture cases updated in the same change.

**Implementation:** Separate PR. Not authorised by this register change.

**Transfer implication:** A Stress Test's presence does not establish that its recorded trigger condition was met.

---

## L-21 — Dominant-signal compression can conceal material disagreement

**Classification:** Governance interpretation risk (not a software defect)  
**Status:** OPEN — Protocol Authority decision required  
**Component:** `src/signal-tally.js` (`dominantSignalFromCounts`); the Surface Map instruction to report "exactly this single word" for Dominant Signal (`src/pipeline.js`, `signalCountNote`); Adversarial Probe direction  
**Discovered:** Independent source review, 3 November 2026  
**Baseline:** `7649eb4`

**Limitation:** The Board's signal distribution is reduced to one dominant word, which then labels the Surface Map and sets the Probe's challenge direction. The full counts are supplied to the Surface Map alongside it, but the single word is what the record foregrounds. Verified at baseline: 12 PROCEED and 1 HALT resolves to PROCEED; 4 PROCEED, 1 CAUTION and 4 HALT also resolves to PROCEED.

Two dimensions are conflated:

- **Signal distribution:** how much disagreement exists among Director perspectives.
- **Constraint status:** whether an objection exists that cannot legitimately be overridden by numerical agreement, such as an unresolved legal, safety or human-rights constraint.

The second is not a function of the first. A single HALT among thirteen Directors may carry a non-aggregable constraint; a near-even split may carry none. Directors are analytical perspectives, not independent voters or holders of delegated authority, so neither dimension should be read as a vote.

**Relationship to other entries:** L-08 and L-10 record that non-aggregable refusal and the CORE necessary-condition rationale have no runtime enforcement channel. L-21 records the complementary representational gap: even where such a constraint is identified analytically, the dominant signal does not show it.

**Consequence:** A Governance Record can present a contested Board, or a Board with an unresolved non-aggregable objection, under a single directional label. A human reader relying on that label may underweight dissent the architecture exists to preserve.

**Fixture:** `tests/fixtures/synthetic/limitations-l18-l21.json` cases `L21-SINGLE-HALT-COMPRESSED` and `L21-EVEN-SPLIT-COMPRESSED`.

**Containment:** Report the full signal distribution wherever the dominant signal is cited. Do not present the dominant signal as a Board position, a vote outcome or evidence that no blocking constraint exists.

**Closure evidence:** A documented Protocol Authority decision on how disagreement and non-aggregable constraints are represented in the Governance Record. Closure does not require a change to the dominant-signal algorithm, and no numerical threshold for a split state is prescribed by this entry. Any representation change that follows is a separate implementation PR with its own fixtures.

**Transfer implication:** The dominant signal summarises a distribution; it is not a decision, a vote or a constraint assessment.

---

## L-22 — Adversarial Probe challenge direction is instructed, not enforced

**Classification:** Deliberative-architecture defect (Deliberate Advocacy Principle)  
**Status:** OPEN  
**Component:** `probe.md` (The Strongest Counter-Argument; explicit direction rule present since `4d42ff8`, 15 March 2026); `src/prompt-builders.js` (`adversarialProbeSystem`, dominant signal appended as prompt text); `src/pipeline.js` (Probe stage records success whenever output is present)  
**Discovered:** Corpus case review, 3 November 2026; characterised 8 November 2026  
**Baseline:** `53a6345`

**Limitation:** The dominant signal is computed in code (L-18) and supplied to the Probe, and `probe.md` instructs the Probe to argue against it: "If HALT or CAUTION: make the strongest case for proceeding or piloting". Nothing checks that the Probe's output does so. A Probe that reinforces the dominant signal is recorded as a successful stage and its challenge is forwarded to the Chair as the adversarial challenge, with no flag.

**Evidence:** In the 17 historical challenged-Probe / conditional-approval cases (L-23 corpus), all run after the explicit rule was introduced, four Probes argue primarily in the same direction as a CAUTION or HALT Board rather than against it: `DR-20260321-161316-90e56d`, `DR-20260321-164745-682352`, `DR-20260321-172410-1bc651` and `DR-20260330-174621-01585f`. One, `DR-20260329-212134-6a05ce`, is mixed. Classification is a developer-assisted reading of each Strongest Counter-Argument opening, not independent adjudication, and the remaining 41 corpus runs were not assessed.

**Consequence:** The Deliberate Advocacy Principle holds as designed intent only. Its direction is code-derived, but compliance with that direction is model-dependent. A record can show a mandatory adversarial challenge that does not challenge the Board's direction, which weakens the anti-convergence function the Probe exists to provide. This is an instance of the instructed level of assurance in the control-assurance taxonomy.

**Fixture:** `test/verify-probe-direction-characterisation.js` runs the pipeline with a CAUTION Board and a synthetic Probe output that reinforces caution, and asserts the observed behaviour: the Probe was told CAUTION, the stage is recorded as `success`, the reinforcing challenge reaches the Chair, and no direction flag is recorded.

**Containment:** Do not cite a Probe's presence as evidence that the dominant direction was challenged. When using historical Probe outputs as evidence of Deliberate Advocacy, read the Strongest Counter-Argument for direction.

**Closure evidence:** A Protocol Authority decision on whether challenge direction is enforced, detected or accepted as instructed; if detected, a calibrated challenge set with recorded precision and misses; the characterisation test updated in the same change.

**Implementation:** Separate PR. Not authorised by this register change.

**Transfer implication:** The Probe's direction is reliable as an input, not as a property of its output.

---

## L-23 — Historical 58-run corpus: incomplete stage text and unreliable narrative figures

**Classification:** Evaluation-evidence limitation (historical corpus)  
**Status:** OPEN — documentation  
**Component:** External corpus `phdss-corpus-canonical-58runs.json`, `corpus_version` `phdss-corpus-2026-03-30-v2`, SHA-256 `6b89d7162858072e88f561e266aa3c00789a4552b01369ddfd1332ae1633e80b`. Not stored in this repository.  
**Discovered:** Corpus inspection, 3 and 8 November 2026

**Limitation:** The corpus is the historical baseline evidence for the Chair authority finding, but it has four properties that bound what it can show.

1. **Incomplete stage text.** Each record stores META, Epistemic Audit, Adversarial Probe, Stress Test, Chair and Comparator output. It does not store Director outputs, the Surface Map or the Reality Anchor (one record holds Director signals). The historical Chair's inputs therefore cannot be reconstructed, and a frozen replay of the historical Chair on its original inputs is not possible.
2. **Narrative figures can contradict recorded tallies.** Example: `DR-20260329-202150-8b36b4` records 0 / 6 / 6, while its Comparator narrative states that eight of twelve Directors issued HALT. At the time the Comparator did not receive authoritative counts. Figures in model-written narrative must be checked against stored counts before citation.
3. **Tally-parse failure.** `DR-20260309-191131-1082b9` records 0 / 0 / 0 while its Probe refers to unanimous CAUTION/DEFER signals.
4. **Repeated scenarios.** The 58 records contain 24 distinct question strings (22 after normalising case and whitespace), with further wording variants of the same underlying question. Records are not independent observations.

**Reconciliation of published figures:** The GE paper's 76% (no PROCEED) and 83% (at least one HALT) use all 58 records: 44/58 and 48/58. The BOA paper's 75% and 82%, and the 33/48 conditional-approval figure, use 57 records, excluding `DR-20260321-184441-3fd8e9` (index 39, Epistemic Audit COMPROMISED): 43/57 (75.4%), 47/57 (82.5%) and 33 of 48 non-null Chair recommendations. With all 58 records the Chair figure is 34/49. The difference is denominator and rounding, not error; any citation should state which denominator is used.

**Consequence:** The corpus supports descriptive claims about historical outputs. It does not support replay of historical stages, claims resting on narrative figures, or statistics that treat runs as independent.

**Fixture:** Not applicable; the evidence is the external corpus identified above by version and hash.

**Containment:** Cite corpus statistics with their denominator and the effective number of distinct scenarios. For the Chair before-and-after, re-run scenarios through the current pipeline to capture full upstream text, then compare Chair contracts on identical inputs.

**Closure evidence:** Not closable by implementation. The entry is maintained as a standing qualification on historical-corpus evidence.

**Transfer implication:** The corpus is baseline evidence of historical behaviour, not a replayable evaluation set.

---

## Pre-pilot verification versus pilot human-factors evaluation

**Pre-pilot technical checks:** (1) Track an npm-generated `package-lock.json`, use `npm ci` from a clean clone and record an unmodified-tree provenance build; (2) complete the actual synthetic Governance capture/export integration check and its CLI verification, acknowledging L-09; (3) demonstrate in the actual UI that L-01/L-02/L-08/L-11 disclosures are visible, unambiguous and readily accessible; and (4) update the canonical register and evidence record. These checks do **not** constitute Gate A acceptance.

**Pilot-only comprehension evaluation:** Make the strong-Ethics-caution synthetic case the first supervised pilot scenario; after use ask reviewers (a) **Who decides?** and (b) **Did the system block anything?** Record answers and approvals under the separately governed pilot protocol. Reviewer comprehension is not a pre-pilot entry requirement.

**Assurance separation:** Internal deterministic tests, candidate technical validation, human-factors pilot observations and independent stranger-operation evidence are distinct. RMIT review and an independent tester are planned controls, not grounds for claiming independent assurance until completed. Only authorised human governance can accept a gate or approve transfer.

## Transfer-facing disclosure and acceptance checklist

A competent operator should be able to identify, without developer explanation:

- **Authority:** PHDSS organises analysis; a human decides. Chair and Director outputs are not adjudications or vetoes (L-01, L-08, L-10).
- **Participation:** Modelled perspectives and supplied lived-experience evidence are not proof of actual participation; human verification is required (L-02–L-04).
- **Evidence:** An absence of a scanner warning does not certify compliance; model convergence does not corroborate a claim (L-03, L-04, L-11).
- **Provenance:** Hash checks confirm captured strings, not a complete replayable transform chain; retries/repair responses can be absent (L-05, L-09, L-13, L-14).
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

**Protocol Authority review questions:** Are L-01–L-23 accurately characterised? Are there documented, evidenced omissions? Which open items are transfer blockers versus accepted limitations? Do not mark the register or Gate A exit COMPLETE before these questions are disposed of.
