# PHDSS v2 — Prompt Builder Boundary

Status: modularisation contract  
Scope: prompt-builder extraction

## Purpose

This slice extracts deterministic prompt construction before the synthesis pipeline is modularised.

The primary module is:

`src/prompt-builders.js`

It owns deterministic construction of Director, synthesis, Chair, advisory and comparator prompts. It performs no network calls, state mutation, clock access or random generation.

## Coverage dependency

`buildCoveragePreamble` depends on `buildCoverageNote`.

That helper is **not** registry data and is also consumed outside prompt construction by the dashboard and Decision Ledger. It therefore lives in the shared pure module:

`src/coverage.js`

Both `App_FINAL.jsx` and `src/prompt-builders.js` import it. This avoids making dashboard/ledger code depend on prompt construction and keeps `src/registry.js` data-focused.

## Shared constants

`RUNTIME_CONTRACT` and `LEDGER_SCHEMA` are static cross-cutting values and now live in `src/constants.js`. This allows comparator prompt construction and ledger assembly to consume one definition without duplicating schema values.

## Equivalence gate

Before extraction, 19 representative prompt outputs were fingerprinted using output length plus FNV-1a over the exact string.

The fixture covers:

- embedded documents and session evidence;
- trusted and public web notes;
- decision context blocks;
- CORE coverage preamble;
- output calibration;
- Director prompt using a fetched instruction;
- META, Surface, Reality, Stress and Chair prompts;
- Chair dialogue;
- Epistemic and Adversarial prompts;
- advisory Director and dual-lens prompts;
- Comparator JSON prompt.

The verifier preserves exact fingerprints for stable prompt builders. When an intentional constitutional or schema change modifies a prompt, only that prompt's fingerprint is advanced in the same PR with a dedicated behavioural contract explaining why the change is intentional.

PR #15 intentionally advances the Dual Lens Comparator and Governance Comparator fingerprints:
- Dual Lens Advisory no longer consumes the governance Comparator instruction file.
- Governance Comparator emits the Decision Ledger 3.0.0-alpha.2 contract with monitoring triggers rather than sequenced institutional actions.

## Deliberately deferred

This PR does not move:

- synthesis execution or stage ordering;
- authority repair/enforcement;
- React state or refs;
- signal rescue;
- `storeSynthesisBrief`;
- ledger assembly;
- `parseDashboard`.

Those remain the boundary for the later pipeline extraction.
