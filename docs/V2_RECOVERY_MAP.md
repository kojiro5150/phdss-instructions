# PHDSS v2.0 — Recovery Map

Status: **SEALED for v2.0.0**. This document records the recovery and constitutional repair path that produced the v2 release baseline. It is historical architecture provenance, not an active backlog.

## 1. Release state

- Release: `v2.0.0`
- Seal base before the release PR: `afed0b048ee13f5f553ef0751fba18ec9c1b3d2a`
- Runtime contract: `2.0-recovery`
- Decision Ledger schema: `3.0.0-alpha.2`
- Final v2 instruction pin: `b6792cb5e69b4dbe3c5db438063ef4255b76d56e`
- Constitutional calibration: `DR-20260926-204324-a2e644`
- Orientation contract: `docs/ORIENTATION_CONTRACT.md`
- Constitutional source: `docs/NORTH_STAR.md`

The release tag `v2.0.0` is the authoritative immutable identifier for the sealed source state.

## 2. Source-of-truth history

The recovery began because the readable source on `main` lagged the deployed 29 June 2026 application.

Historical references:

- 29 June live deployment instruction bundle: `56ad2305ca62ed7409c3e89723f9bd1ca914d935`
- historical readable recovery baseline: `eec6db99f941ceffc2b5fe055ce2313fb6ae05d6`
- final v2 instruction pin: `b6792cb5e69b4dbe3c5db438063ef4255b76d56e`

The runtime remains intentionally commit-pinned. Instruction changes are not live merely because they merge; activation requires an explicit pin advance.

## 3. Chair constitutional rewrite — rationale and final contract

The most important architectural learning in v2 was that the Chair could not remain a stochastic meta-reasoner that formed a higher-order judgment over the Directors and synthesis outputs.

That design reproduced the authority problem PHDSS exists to prevent: a model without institutional authority was being placed above other model outputs and asked to resolve tensions, re-weigh signals, convert analysis into requirements, or otherwise form a new governance judgment. The authority detector was correctly rejecting some of those acts. Weakening the detector would have hidden the contradiction rather than repaired it.

PR #17 therefore rewrote the Chair as a **deliberative interface**:

> The Chair does not add a further judgment layer. It convenes and presents the reasoning already generated, preserving material disagreement, uncertainty, conditions and adversarial challenge so that the responsible human governance body can decide.

The resulting non-substitution invariant is falsifiable:

**Removing the Chair may reduce legibility, but must not alter any substantive finding, signal, evidentiary state, condition, tension, or institutional disposition produced upstream.**

The Chair may surface, frame, organise, compress, preserve and expose. It may not re-decide, re-rank, re-weigh, recommend, resolve, approve, reject, defer, select a pathway, invent a substantive finding, strengthen evidence, or turn an analytical proposal into an institutional requirement.

This rewrite is not a UX preference. It is the constitutional separation between analytical assistance and human adjudication.

## 4. Three constitutional invariants

The sealed v2 architecture is governed by the invariants in `docs/NORTH_STAR.md`:

1. **Decision-space expansion** — later layers must not prematurely collapse alternatives, uncertainty, tensions or affected perspectives.
2. **Non-substitution** — AI may improve human judgment but may not silently substitute its own judgment for the authorised human one.
3. **Epistemic provenance** — synthesis may organise evidence but cannot strengthen evidentiary status through repetition, convergence or compression.

These are fixed infrastructure inherited by v3.

## 5. Dynamic governance records and presentation

v2 recovered the generic board-readable record layer so Governance and Technical views derive from the same underlying analysis rather than static scenario-specific content.

Director Governance Records expose structured signal, discovery, rationale, tension, discussion questions, affected groups, conditions and governance implications.

Synthesis Governance Records expose module-specific status plus the same board-readable reasoning structure.

The Chair output is presented as a **Decision Brief**, not a preferred course of action.

## 6. Authority boundaries by layer

The v2 runtime makes analytical termini explicit:

- Decision Surface Map — landscape legibility
- Epistemic Audit — confidence in the reasoning record
- META / Cross-Domain Tension Analysis — unresolved cross-domain tension
- Reality Anchor — operational availability and feasibility characterisation
- Adversarial Probe — mandatory adversarial challenge
- Stress Test — failure visibility under stress
- Chair — faithful integrated Decision Brief presentation
- Comparator — difference visibility, monitoring conditions and structured comparison without institutional selection

Legitimate external constraints may be reported. Institutional approval, rejection, deferral, pathway selection and adjudication remain human acts.

## 7. Epistemic provenance monotonicity

PR #19 established the monotonicity rule:

**Synthesis may organise evidence but cannot strengthen its evidentiary status through repetition, convergence or compression.**

Examples of prohibited promotion include:

- unverified → verified;
- unconfirmed → confirmed;
- not demonstrated → absent / does not exist;
- inferred → established without stronger supplied evidence.

Convergence is not corroboration. Repetition is not verification. Missing evidence is not evidence of absence.

Runtime governance compression enforces this boundary and can fall back deterministically when stochastic compression promotes provenance.

## 8. Authority repair and detector precision

The runtime preserves visible authority-repair telemetry rather than silently normalising violations.

PR #23 tightened governance-obligation detection so an actor must occur in a subject-like position before an obligation modal. This removed the false positive found during calibration without creating a carve-out for genuine institutional directives.

A repair event is evidence about system behaviour and remains part of the governance record.

## 9. Decision Ledger and degraded-state semantics

Ledger schema `3.0.0-alpha.2` records:

- `decision_brief_status` rather than a Chair recommendation;
- instruction provenance separately from runtime provenance;
- synthesis-stage status and failures;
- monitoring triggers rather than prescribed 30/60/90-day institutional actions;
- historical session state without retroactive rewriting.

Mandatory and degradable synthesis stages are distinguished. A degradable failure can yield `COMPLETE_DEGRADED`; a mandatory synthesis failure cannot be presented as complete.

## 10. Calibration and replay evidence

The constitutional calibration `DR-20260926-204324-a2e644` is preserved as empirical evidence, not a golden-output fixture.

Original run:

- mode: FULL;
- coverage: 13/13;
- Chair constitutional behaviour: PASS;
- provenance monotonicity in synthesis: PASS / materially improved;
- compression provenance enforcement: PASS;
- decision-space expansion: PASS;
- mandatory reasoning chain: PASS;
- Comparator: not tested because the Anthropic credit balance was exhausted;
- session: `COMPLETE_DEGRADED`.

The original status remains historically accurate.

A later targeted Comparator replay used the frozen Chair and upstream outputs and completed successfully. It required one bounded authority repair for the directive pattern:

> Establish verified transfer times and confirmed receiving protocols for each geographic zone before enrolment in that zone

The violation was repaired on attempt 1 and the final Comparator output passed the authority boundary. The replay evidence and hashes are preserved alongside the calibration fixture.

## 11. Orientation layer

PR #25 added a static, contract-backed orientation layer. It explains:

- the North Star;
- the authority chain: AI → Code → Chair → Human;
- the product flow: Inputs → Directors → Synthesis → Decision Brief → Transparency → Decision Ledger;
- the distinction between Governance and Advisory runs;
- CORE / FULL / CHAIR SPECIFIED coverage and cost implications;
- that PHDSS does not confer institutional legitimacy.

`docs/ORIENTATION_CONTRACT.md` is normative for all orientation and explanatory UI copy. JSX implements the contract and must not redefine it independently.

External cold-start orientation validation is intentionally deferred to post-seal evaluation so observed user findings inform v3 rather than mutate the v2 constitutional baseline.

## 12. Deliberately deferred: Workforce & Operational Practice Director

A fourteenth **Workforce & Operational Practice Director** is planned but not implemented in v2.

This was a deliberate deferral, not an oversight. Adding a Director during active constitutional repair would have changed:

- CORE adaptive-selection behaviour;
- FULL coverage from 13/13 to 14/14;
- coverage denominators and dashboard expectations;
- fixtures and parity tests;
- calibration comparability.

The planned Director is therefore an explicit inherited v3 product gap. v3 must introduce it through a deliberate schema / coverage / fixture migration rather than silently appending it to the v2 Director registry.

## 13. Recovery sequence completed

The v2 recovery and repair sequence completed the following work:

1. recovered instruction loading, Chair semantics and readable source;
2. recovered generic board-readable Governance Records;
3. recovered dashboard parsing and Ledger behaviour;
4. modularised runtime, prompt-builder, parser, coverage and governance boundaries;
5. made authority termini explicit and added runtime repair telemetry;
6. rewrote the Chair as a non-adjudicative deliberative interface;
7. enforced epistemic provenance monotonicity;
8. aligned Probe injection and tightened obligation detection;
9. froze a calibration fixture and added targeted stage replay;
10. added the contract-backed product orientation layer;
11. established `NORTH_STAR.md` and normative orientation documentation;
12. sealed the v2 architecture for release.

## 14. v3 boundary

v3 inherits the v2 constitutional layer as fixed infrastructure:

- North Star;
- constitutional invariants;
- authority contracts;
- provenance monotonicity;
- deterministic validation and repair boundaries;
- stage failure / degraded-state semantics;
- frozen calibration baseline.

The v3 development surface sits above that layer: institutional workflow, facilitation, evidence handling, persistent / longitudinal Decision Ledger capabilities, deployment, controlled integrations, external usability findings, and the deferred Workforce Director migration.
