# PHDSS v2.0 — Recovery Map

This map records behaviours confirmed in the 29 June 2026 GitHub Pages deployment that are missing or stale in the readable `App_FINAL.jsx` on `main`.

## 1. Instruction pin

**Historical 29 June live deployment:** `56ad2305ca62ed7409c3e89723f9bd1ca914d935`

**Historical readable recovery baseline:** `eec6db99f941ceffc2b5fe055ce2313fb6ae05d6`

**Current recovered runtime pin:** `e79f79378a9eba6f36c8d053a896ca00b3827c7b` (advanced after PR #13 Reality Anchor repair).

The runtime remains intentionally commit-pinned. Any merged instruction-source change must be activated by a dedicated pin-advance PR before it is treated as live behaviour.

## 2. Chair contract

Live behaviour:

- Chair is a governance reasoning steward.
- Chair does not select a preferred course of action.
- Output field is `Decision Brief Status`.
- Allowed status values are `Complete` or `Complete — Partial Evidence Base`, with an unresolved-tension clause.
- Dashboard reports `Director Signal Distribution`.
- Verification Phase and Pilot Pathway are presented as available pathways, not selected recommendations.

Stale source behaviour to remove:

- `Chair Recommendation` parsing.
- proceed/defer/pilot/conditional approval Chair vocabulary.
- Chair-versus-consensus departure logic.
- dialogue language such as "change your recommendation" or "shift your recommendation to PROCEED".

## 3. Dynamic board-readable record layer

Live deployment contains a generic extraction/rendering path for Directors and synthesis modules.

Director board-readable record includes:

- Recommendation Signal
- key discovery
- signal rationale
- primary tension
- questions the room should discuss
- most likely to benefit
- most exposed to failure
- non-negotiable conditions
- governance implication

Synthesis board-readable record includes:

- module-specific verdict label/value
- key discovery
- primary tension
- signal rationale
- questions the room should discuss
- most likely to benefit
- most exposed to failure
- non-negotiable conditions
- governance implication

Confirmed module verdict mappings in the live deployment:

- Decision Surface Map → Dominant Signal
- Epistemic Confidence Audit → Epistemic Health Score
- Cross-Domain Tension Analysis → Integration Signal
- Reality Anchor → Operational Confidence
- Adversarial Bias Probe → Probe Verdict
- Decision Stress Test → Fragility Score
- Chair → Decision Brief Status

Recovery requirement: remove the static scenario-specific Governance Record components and reconstruct the generic extractor + renderer from the deployed contract.

## 4. Governance/technical view behaviour

Live deployment presents Technical and Governance views from the same module result rather than swapping in unrelated static content.

Recovery requirement: preserve one underlying analysis result with two presentation layers.

## 5. Decision Ledger contract

Current recovered Ledger schema: `3.0.0-alpha.2`.

The Ledger records `chair_resolution.decision_brief_status` and explicitly prohibits storing a proceed/defer/halt Chair instruction in that field.

Schema 3.0.0-alpha.2 makes the Comparator migration explicit:
- the retired Chair recommendation field is no longer part of the Comparator schema;
- the sequenced action-horizon field is replaced by `monitoring_triggers_30_60_90`;
- monitoring horizons contain observable evidence, conditions, or thresholds rather than institutional next actions;
- historical Ledger records are not rewritten; downstream consumers must branch on `schema_version`.

Instruction provenance is recorded separately through `instruction_source` and `instruction_commit`; see `docs/DECISION_LEDGER_SCHEMA.md`.

## 6. Reality Anchor authority boundary

Recovered v2 authority contract:

- Reality Anchor terminates at operational availability and feasibility characterisation.
- Bidirectional falsification is preserved: it must state what verified findings would materially increase operational feasibility or confidence, and what verified findings would materially decrease feasibility or confidence or establish a stronger evidenced operational constraint.
- Falsification conditions test the reasoning record; they do not move an institutional recommendation toward approval, deferral, or rejection.
- Reality Anchor may report evidenced external constraints and operational infeasibility, but may not determine the institutional response.
- Implementation, rejection, deferral, approval, and pathway selection remain with the human decision-maker; they are not Chair functions.

Recovery status: source instruction repaired in PR #13. Runtime activation remains commit-pinned and therefore requires advancing the immutable instruction pin to the merged PR #13 commit before live calibration.


## 7. Comparator authority and schema boundary

Recovered v2 Comparator contract:

- Comparator terminates at **difference visibility**. It may record agreements, dissensus, trade-offs, risks, uncertainty, coverage gaps, and measurable monitoring conditions.
- It may not rank pathways, choose a winner, resolve institutional tensions, convert Director signal counts into a disposition, or prescribe institutional next acts.
- `chair_resolution` remains as a legacy container name for compatibility, but its status field is `decision_brief_status`; the container name does not grant adjudication authority to the Chair.
- `monitoring_triggers_30_60_90` preserves time-horizon value while restricting content to observable evidence, conditions, or thresholds.
- The authoritative JSON schema is injected once by `comparatorJsonSystem()`; `comparator.md` no longer embeds a second competing schema.
- The runtime rejects stale Comparator JSON shapes rather than silently storing them under the new schema version.
- Dual Lens Advisory no longer consumes the governance Comparator instruction source.

Activation note: after this PR merges, the immutable instruction pin must be advanced to the PR merge commit before the calibration run so the live Comparator uses the repaired source instruction.

## 8. Known stale remnants inside the live bundle

These are recovery targets, not behaviours to preserve:

- Chair dialogue still includes some legacy "initial recommendation" wording.
- Some warning/help copy still says "Chair recommendation".
- partial-mode AI-integrity notes still hardcode `/13 directors`.
- UI copy still uses "Governance Reasoning Record" in places where v2.0 may adopt "Decision Brief" / "Decision Record".
- current application has no Workforce & Operational Practice Director.

## Recovery order

1. Recover instruction pin + Chair contract.
2. Recover generic board-readable extraction/rendering.
3. Recover deployed dashboard parser/fields.
4. Recover deployed ledger schema and export behaviour.
5. Recover dialogue behaviour, then remove stale recommendation wording.
6. Establish a repeatable parity fixture from the live CORE test.
7. Commit recovered readable source.
8. Begin modular extraction without behaviour change.
9. Introduce explicit runtime/instruction release contract.
10. Add v2.0 product changes (terminology, usability, workforce director, flow/explanation layer).
