# PHDSS v2 — Synthesis Execution Status Contract

Status: runtime integrity contract  
Scope: synthesis-stage observability and session completion

## Purpose

A generated Chair artefact is not proof that the governance reasoning chain completed.

PHDSS must distinguish between:

- a stage that succeeded;
- a stage that failed;
- a conditional stage that was legitimately skipped.

A downstream module may still produce plausible prose after an upstream failure. The runtime must therefore preserve execution state independently of output fluency.

## Stage status values

Final synthesis-stage execution state is one of:

- `success`
- `failed`
- `skipped`

Failure records preserve the original caught value as text using:

`error.message || String(error)`

This prevents non-`Error` thrown values from becoming diagnostically empty.

## Mandatory stages

The following stages are mandatory for a `COMPLETE` governance run:

1. Decision Surface Map (`surface_map`)
2. Epistemic Audit (`epistemic_audit`)
3. Cross-Domain Tension Analysis / META (`meta`)
4. Adversarial Probe (`probe`)
5. Chair (`chair`)

Failure or absence of any mandatory stage yields:

`INCOMPLETE_MANDATORY_SYNTHESIS_FAILURE`

The Chair output may still be retained for audit, but it must be labelled as generated from an incomplete reasoning chain.

## Degradable stages

The following stages may fail without converting the run to mandatory-chain incomplete:

- Reality Anchor (`reality_anchor`)
- Stress Test (`stress`) when triggered
- Governance Comparator (`comparator`)

A failure in one or more of these stages, with every mandatory stage successful, yields:

`COMPLETE_DEGRADED`

A Stress Test that is not triggered is `skipped`, not failed, and does not degrade the session.

## Existing Director partiality

Director failures remain independently visible. If all mandatory synthesis stages succeed, no degradable stage fails, and one or more Directors failed, the existing:

`COMPLETE_PARTIAL_EVIDENCE`

classification is preserved.

## Ledger chain of custody

Each governance Ledger record now stores:

- `synthesis_stage_status`
- `failed_synthesis_stages`
- `failed_mandatory_synthesis_stages`
- `stage_errors`

These fields are execution evidence. They must not be reconstructed from generated prose.

## UI behavior

A failed synthesis stage must never render as completed.

The stage strip shows:

- blue for `success`;
- red with `✕` for `failed`;
- grey with `—` for `skipped`.

The run-level status renders:

- `COMPLETE`
- `DEGRADED`
- `PARTIAL`
- `INCOMPLETE`

When a Chair artefact exists after a synthesis failure, the Decision Brief panel displays an explicit reasoning-chain warning naming the failed stages.

## Regression origin

The contract was added after live UI run `DR-20260925-155752-a300ae` completed with:

- Surface Map absent;
- Reality Anchor absent;
- downstream Epistemic, META, Probe, Stress and Chair artefacts present;
- the pre-repair Ledger incorrectly reporting `COMPLETE`.

The structural regression fixture intentionally retains only execution-chain facts, not generated scenario prose.
