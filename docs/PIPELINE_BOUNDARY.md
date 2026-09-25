# PHDSS v2 — Governance Pipeline Boundary

Status: modularisation contract  
Scope: pipeline extraction

## Purpose

This slice moves consequential governance execution out of the React monolith while preserving the recovered execution semantics.

The execution engine is:

`src/pipeline.js`

It owns:

- Director activation and sequential Director execution;
- 3-second inter-Director spacing;
- additional 10-second / 15-second retries for Director 500/server errors;
- truncated-signal rescue;
- Director Governance Brief compression/fallback integration;
- Surface Map, Epistemic, META, Reality Anchor and Adversarial Probe sequencing;
- conditional Stress Test triggering;
- Chair execution plus compatibility authority repair;
- Comparator invocation and signal-tally correction;
- synthesis Governance Brief storage in pipeline-local state;
- Decision Ledger record assembly;
- fatal-run partial-ledger construction when Director outputs exist.

## React adapter

`App_FINAL.jsx` retains a deliberately thin `runBoard()` adapter.

The adapter:

- resets UI state before execution;
- passes the current decision/session configuration to the engine;
- translates pipeline events into existing React setters and refs;
- displays partial/fatal errors;
- performs final loading cleanup.

The adapter does not decide stage order, stress triggering, authority repair, signal counts, Comparator behavior, or Ledger structure.

## Authority

The shared semantic authority contract remains in `src/authority-contract.js`.

`src/pipeline.js` now owns the runtime enforcement path:

`callGovernedSynthesis → enforceSynthesisAuthority`

Chair retains the historical compatibility repair pass after governed synthesis. Regression tests explicitly preserve this two-layer behavior.

## Ledger

Ledger **assembly** is now in `buildLedgerRecord()` inside the pipeline module. React only appends an emitted record to UI state.

The existing rescue-session path also calls the same builder, eliminating duplicate Ledger assembly logic.

## Pre-extraction sequence contract

`test/fixtures/pipeline-sequence.js` was committed before extraction and records:

- Director sequencing and retry delays;
- synthesis stage order;
- stage-progress values 1–8;
- conditional Stress behavior;
- Chair Probe-response/repair behavior;
- Comparator correction;
- Ledger append behavior and schema/runtime versions.

## Deliberately deferred

This PR does not move:

- `parseDashboard`;
- dashboard rendering/export;
- advisory execution (`runAdvisory`);
- document-entry UI state;
- general React presentation state.

The core acceptance condition is: **same execution inputs and external responses produce the same governance-stage sequence, authority behavior, structured records, and Ledger semantics.**
