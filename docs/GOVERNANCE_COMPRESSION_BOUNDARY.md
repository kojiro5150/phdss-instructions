# PHDSS v2 — Governance Brief Compression Boundary

Status: modularisation contract  
Scope: orchestration PR 2

## Purpose

This slice moves Governance Brief compression/extraction out of `App_FINAL.jsx` while preserving the recovered runtime behavior.

The extracted module is:

`src/runtime/governance-compression.js`

It owns:

- Director compression prompt construction;
- deterministic Director fallback extraction;
- Director compression retry behavior;
- synthesis Governance Brief prompt construction;
- synthesis module-to-authority-layer mapping used only by Governance Brief extraction;
- deterministic synthesis fallback extraction;
- synthesis compression retry behavior;
- board-pipeline Director brief formatting.

## Authority boundary

The semantic authority rules are **not reimplemented** here. The compression runtime imports the existing `authorityBoundaryPrompt` and `assessAuthorityBoundary` functions from `src/authority-contract.js`.

This preserves an important existing behavior: if a synthesis Governance Brief is structurally valid but crosses the authority boundary, that attempt is rejected inside the same two-attempt extraction loop. A second violation leads to the same deterministic fallback path as before.

The main synthesis authority path remains in `App_FINAL.jsx`:

- `enforceSynthesisAuthority`;
- `callGovernedSynthesis`;
- Chair compatibility repair.

## Compatibility invariants

Regression tests preserve:

- two extraction attempts for Director briefs;
- two extraction attempts for synthesis briefs;
- the second-attempt corrective suffix;
- deterministic fallback after both attempts fail;
- failed Director short-circuit without an API call;
- exact synthesis verdict-label mapping from the Governance Record contract;
- authority-boundary violations consuming synthesis extraction attempts;
- empty synthesis output using deterministic fallback without an API call;
- existing technical brief formatting for downstream synthesis.

## Deliberately deferred

This PR does not move:

- synthesis execution order;
- synthesis authority repair;
- React state or refs;
- `storeSynthesisBrief`;
- ledger assembly;
- signal rescue;
- `parseDashboard`;
- board-facing Governance Record adapters.

Those remain separately reviewable orchestration boundaries.
