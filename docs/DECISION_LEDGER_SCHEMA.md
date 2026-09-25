# PHDSS v2 — Decision Ledger Schema

Current schema: `3.0.0-alpha.2`

## Versioning rule

`schema_version` is the compatibility boundary for stored Decision Ledger records. A breaking field rename, removal, or semantic repurposing requires a schema increment in `src/constants.js`.

Historical records are not rewritten in place. Downstream readers must branch on `schema_version` when a field shape changed between versions.

## Instruction provenance

Every Ledger record carries:

- `instruction_source`
- `instruction_commit`

`instruction_source` records how instruction content was available to the run:

- `github` — all configured instruction files were loaded from the immutable GitHub commit pin;
- `github_partial` — only part of the configured instruction set loaded from GitHub and the run used fallback instruction content for one or more modules;
- `inline_fallback` — the configured GitHub instruction set was unavailable and runtime fallback instructions were used.

`instruction_commit` records the immutable commit configured by the runtime for that run. It is proof of the complete instruction source only when `instruction_source` is `github`. For `github_partial` or `inline_fallback`, it identifies the configured/attempted pin and must be interpreted together with `instruction_source`.

A pin advance is therefore a separate release event and should remain independently reviewable.

## Comparator schema — 3.0.0-alpha.2

The Comparator remains stored under the top-level `comparator` Ledger field as:

- `raw` — raw governed model output;
- `parsed` — validated Comparator JSON;
- `created_at` — runtime timestamp.

The `parsed` object uses the same `schema_version` as the Ledger.

### Breaking migration from 3.0.0-alpha.1

Two fields are retired:

- `chair_resolution.recommendation`
- `next_actions_30_60_90`

They are replaced by:

- `chair_resolution.decision_brief_status`
- `monitoring_triggers_30_60_90`

### Decision Brief Status content contract

`chair_resolution.decision_brief_status` records the deliberative state of the
Chair's Decision Brief, not a Chair determination or instruction to the human
decision-maker.

For a complete record, the content form is:

`Complete — [material tension remaining unresolved in the governance record]`

For a partial evidence base, the content form is:

`Complete — Partial Evidence Base — [material tension remaining unresolved in the governance record]`

The unresolved-tension clause describes the state of the governance record. It
must not state what the decision-maker "must weigh", prescribe a governance act,
rank or select a pathway, or convert synthesis into adjudication.

This is a tightening of the existing non-prescriptive field contract, not a
field-shape or semantic-purpose change, so it does not require a schema-version
increment.

`monitoring_triggers_30_60_90` contains three arrays:

- `days_0_30`
- `days_31_60`
- `days_61_90`

Each array contains observable evidence, conditions, or measurable thresholds relevant to that horizon. These fields do **not** define institutional actions, implementation sequencing, approvals, or governance obligations.

The runtime rejects Comparator output that claims schema `3.0.0-alpha.2` while still containing either retired field or omitting the required monitoring-trigger shape. This prevents a stale model response from being stored as if it conformed to the new schema.

## Human authority

Comparator data is descriptive and evidentiary. It may make agreement, dissensus, trade-offs, risk, uncertainty, conditions, and monitoring signals more legible. It does not select a pathway, resolve the institutional decision, or prescribe the next governance act.
