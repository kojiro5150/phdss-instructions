# PHDSS v2 — Runtime Authority Repair Contract

Status: runtime integrity contract  
Scope: synthesis authority repair, downstream dependency handling, and execution-status visibility

## Origin

Live UI run `DR-20260925-165634-0e8b48` exposed two distinct authority-repair failures:

- Reality Anchor failed after repair with `RETIRED_DECISION_VOCABULARY`.
- Chair failed after repair with `PATHWAY_RANKING`.

The fail-closed stage-status repair correctly classified the run as `INCOMPLETE_MANDATORY_SYNTHESIS_FAILURE`, but the runtime retained only the reason code and still executed Comparator without a valid Chair.

## Authority detector

This repair does **not** weaken `src/authority-contract.js`.

The semantic detector remains the authoritative boundary test. Runtime repair must adapt to the detector; the detector is not relaxed merely because a model generated a violating clause twice.

## Bounded repair

`enforceSynthesisAuthority()` now permits at most two repair attempts.

Each attempt receives:

- the authority-layer contract;
- the detected reason code;
- the exact offending clause;
- the prior output;
- an instruction to preserve analytical substance while removing institutional adjudication.

The second pass is therefore targeted at the clause that survived the first repair rather than repeating a generic rewrite request.

If the second repair still violates the contract, execution fails closed.

## Failure diagnostics

Persistent authority failure messages retain:

- layer;
- reason code;
- number of repair attempts;
- offending clause, whitespace-normalised and bounded in length.

Example shape:

`chair authority boundary violation persisted after 2 repair attempts: PATHWAY_RANKING | Offending clause: ...`

This diagnostic is propagated into stage status, stage errors and the Decision Ledger.

## Comparator dependency

Governance Comparator requires a successful Chair stage.

If Chair is not `success`:

- Comparator is not invoked;
- `comparatorData` remains null;
- Comparator stage status is `skipped`;
- stage reason is `required upstream stage chair failed`.

This prevents a downstream module from being presented as successfully completed when its intended upstream governance artefact does not exist.

## Transparency Dashboard

The Dashboard now receives execution-state data directly from the pipeline/Decision Ledger and exposes:

- Session Status;
- failed synthesis stages;
- failed mandatory synthesis stages;
- synthesis execution states and diagnostics.

The exported Transparency Dashboard includes a dedicated `SYNTHESIS EXECUTION` section.

Execution status is evidence about the run. It is not inferred from generated prose.

## UI consistency

When the Ledger classifies a session as incomplete, the issue banner says `Session incomplete` rather than `Completed with partial failures`.

A degradable synthesis failure reports `Completed with degraded synthesis`.

This keeps the Board view, Transparency Dashboard and Decision Ledger semantically aligned.
