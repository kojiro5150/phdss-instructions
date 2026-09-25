# CORE Live Baseline — 25 Sep 2026

Purpose: preserve structural behaviour from the live 29 June GitHub Pages build while readable source is recovered for v2.0.

This file intentionally does **not** copy the uploaded governance-in-confidence artefacts into the public repository.

## Reference run

- Fixture id: `core-live-baseline-2026-09-25`
- Live deployment branch: `gh-pages`
- Deployment commit: `830d3226e7f4a884fdba40fdd73d93776d1547bf`
- Instruction commit used by the live bundle: `56ad2305ca62ed7409c3e89723f9bd1ca914d935`
- Mode: `CORE`
- Coverage: `5/13`
- Deterministic active Director set observed:
  - `systems`
  - `equity`
  - `lived`
  - `digital`
  - `safety`
- Stress gate: triggered by the emergency-domain decision text.
- Board-readable and technical views both exported successfully for synthesis modules.
- Chair output exposed `Decision Brief Status`.
- Dashboard exposed Director signal distribution rather than a Chair-vs-consensus departure.
- Ledger schema version observed: `2.5.0`.

## Parity assertions for recovered source

The recovered readable source must satisfy these structural assertions before refactor:

1. CORE resolves the same Director set for an equivalent synthetic AI + emergency scenario.
2. All active Directors complete independently or expose an explicit failed state.
3. Surface Map, Epistemic Audit, Cross-Domain Tension Analysis, Reality Anchor, Adversarial Probe, conditional Stress Test, Chair/Decision Brief and Comparator remain callable.
4. Technical and board-readable views are both derived from the same run content.
5. Board-readable records contain no static scenario text.
6. Chair exposes `Decision Brief Status`, not a selected proceed/defer/halt recommendation.
7. Human decision authority remains outside the Chair.
8. Stress execution remains deterministic from the stress trigger contract.
9. Ledger records the run mode, active/omitted Directors, Director signal counts, epistemic score, Probe verdict, fragility score and stress reason.
10. Export paths continue to work for technical analysis, board-readable record, dashboard and JSON ledger.

## Defects observed in the reference run

These are **not** parity behaviours to preserve.

### P0 — exact instruction version absent from ledger

The ledger records only `instruction_source: "github"`. It does not persist the exact instruction commit used by the run even though the deployed application is commit-pinned.

v2 target: persist exact instruction commit, runtime contract and release identifier with every decision record.

### P0 — non-decision Chair contract can still emit decision-like language

The Chair architecture is non-decisional, but the reference run still produced wording equivalent to the current proposal not proceeding as designed.

v2 target: validate Chair output against prohibited preferred-course language and fail/repair before display, export or ledger commit.

### P1 — Director board-readable compression can fail

The Digital & AI Governance Director completed, but its board-readable record fell back to `COMPRESSION_FAILED` / a first-300-character placeholder.

v2 target: make the structured record contract reliable and deterministic enough that a completed Director cannot silently degrade to a low-information board record.

### P1 — stale session semantics

The ledger uses `session_governance_status: "FULL_VERDICT"` even though the Chair no longer issues a verdict.

v2 target: migrate to non-decisional session status vocabulary such as `COMPLETE`, `COMPLETE_PARTIAL_EVIDENCE`, and `INCOMPLETE` under an explicit schema migration.

### P1 — incomplete ledger provenance

The ledger stores synthesis outputs but not the complete set of source Director outputs/structured records required to reconstruct every displayed artefact from the ledger alone.

v2 target: define provenance requirements before changing ledger schema.

### P2 — hardcoded Director-count assumptions

The reference build still contains partial-run messaging based on `13 directors`.

v2 target: derive all coverage denominators from the Director registry before a 14th Director is introduced.

## Acceptance rule

The first recovered-source build is accepted only when the live reference and local recovered build agree on architecture and contracts. Natural-language output is not required to be byte-identical.
