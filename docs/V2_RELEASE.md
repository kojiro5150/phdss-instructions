# PHDSS v2.0.0 Release Manifest

Status: **SEALED BASELINE**

Release identifier: `v2.0.0`

The Git tag `v2.0.0` is the authoritative commit identifier for this release. This manifest records the contracts and evidence that define the sealed v2 baseline.

## Release identity

| Item | Value |
|---|---|
| Product version | `2.0.0` |
| Package | `phdss-v2` |
| Runtime contract | `2.0-recovery` |
| Decision Ledger schema | `3.0.0-alpha.2` |
| Final v2 instruction pin | `b6792cb5e69b4dbe3c5db438063ef4255b76d56e` |
| Seal base before release PR | `afed0b048ee13f5f553ef0751fba18ec9c1b3d2a` |
| Constitutional calibration | `DR-20260926-204324-a2e644` |
| Release tag | `v2.0.0` |

## Constitutional source of truth

The release is governed by:

- `docs/NORTH_STAR.md` — canonical North Star, three constitutional invariants and authority model;
- `docs/ORIENTATION_CONTRACT.md` — normative source for product orientation and explanatory UI copy;
- `docs/AUTHORITY_LAYER_CONTRACTS.md` and authority runtime contracts — layer termini;
- `docs/GOVERNANCE_COMPRESSION_BOUNDARY.md` — compression / provenance boundary;
- `docs/DECISION_LEDGER_SCHEMA.md` — ledger semantics;
- `docs/STAGE_REPLAY_HARNESS.md` — targeted replay contract.

The canonical North Star is:

> PHDSS is designed to make the decision space larger and more legible before humans decide — surfacing assumptions, tensions, missing evidence, affected perspectives, operational constraints and plausible alternatives that may otherwise remain hidden.

## Fixed v2 constitutional invariants

1. **Decision-space expansion** — later layers must not prematurely collapse alternatives, uncertainty, tensions or affected perspectives.
2. **Non-substitution** — AI may improve human judgment but may not silently substitute its own judgment for the authorised human one.
3. **Epistemic provenance** — synthesis may organise evidence but cannot strengthen evidentiary status through repetition, convergence or compression.

Authority chain:

```text
AI: enlarge + interrogate
  ↓
Code: constrain + validate + preserve
  ↓
Chair: organise + expose
  ↓
Human: judge + decide
```

These invariants are release infrastructure, not v3 feature targets.

## Chair architecture

The v2 Chair is a deliberative interface, not a higher-order judgment layer.

The rewrite was necessary because a stochastic meta-reasoner sitting above the Directors reproduced the same authority-substitution problem PHDSS was designed to constrain. The final invariant is that removing the Chair may reduce legibility but must not change substantive upstream findings, signals, evidentiary states, conditions, tensions or institutional disposition.

## Calibration evidence

Frozen fixture:

`tests/fixtures/calibration/DR-20260926-204324-a2e644/`

Original run:

- FULL mode;
- 13/13 Director coverage;
- mandatory reasoning chain complete;
- Chair constitutional behaviour passed;
- synthesis provenance monotonicity materially improved / passed;
- live compression absence-promotion detected and bounded;
- original Comparator call failed because of billing;
- source session preserved as `COMPLETE_DEGRADED`.

Closure replay:

`tests/fixtures/calibration/DR-20260926-204324-a2e644/replay-closure/comparator-2026-09-26T13-54-41-458Z/`

The replay held the Chair frozen and executed Comparator only. Comparator completed successfully after one visible `GOVERNANCE_ACT_OBLIGATION` repair, cleared on attempt 1. The original Ledger was not rewritten.

## Validation contract

The release validation suite covers, among other things:

- recovered JSX / runtime contract;
- synthetic authority regression;
- Chair non-substitution;
- Reality Anchor instruction contract;
- modularisation equivalence;
- Governance Record contract;
- runtime orchestration;
- governance compression and provenance monotonicity;
- Comparator contract;
- prompt-builder equivalence;
- governance pipeline;
- stage replay;
- orientation contract.

The release should be treated as invalid if these checks fail against the sealed source state.

## Known deliberate deferral

### Workforce & Operational Practice Director

A fourteenth Workforce & Operational Practice Director is planned but intentionally absent from v2.

It was deferred because adding it during constitutional repair would have changed CORE selection logic, the FULL coverage denominator, dashboard expectations, fixtures and calibration comparability. This is an explicit inherited v3 migration item, not an accidental omission.

v3 must introduce the Director deliberately, including coverage / fixture / selection migrations, rather than silently changing the v2 registry.

## External validation status

The v2 constitutional engine is sealed after internal calibration and contract validation. External cold-start orientation and institutional usability evaluation remain to be performed. Those findings belong to the v3 product layer and must not retroactively rewrite the v2 calibration record.

## v3 inheritance rule

v3 may build above this release baseline, but should treat the following as fixed infrastructure unless a new constitutional migration is explicitly opened and calibrated:

- North Star and constitutional invariants;
- human adjudication boundary;
- Chair non-substitution;
- layer authority termini;
- epistemic provenance monotonicity;
- deterministic validation / repair;
- visible degraded-state semantics;
- frozen v2 calibration evidence.
