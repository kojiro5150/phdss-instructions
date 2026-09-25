# PHDSS v2 — Authority Ranking Regression and Repair Telemetry

Status: runtime integrity contract  
Scope: authority-boundary detection and observable repair

## Origin

Live governance run `DR-20260925-174431-9815e4` completed successfully at the runtime level but exposed a semantic authority escape in the Chair output:

`The governance record supports the first pathway over the second ...`

The existing authority detector recognised explicit forms such as "best option", "preferred pathway", and "should be preferred", but did not recognise comparative support language that still ranked one institutional pathway over another.

This contract closes that gap without treating ordinary pathway description as adjudication.

## Pathway ranking

`PATHWAY_RANKING` includes comparative institutional ranking expressed through language such as:

- supporting one pathway over another;
- preferring or favouring one pathway over another;
- stating that one pathway or option is preferable, better, safer, or stronger than another;
- stating that the safer, stronger, better, or preferred course is a named pathway.

The detector continues to permit non-ranked comparison. For example:

`Pathway A limits simultaneous exposure relative to Pathway B, while Pathway B reaches all sites sooner.`

describes different properties without selecting which pathway should govern.

## Pilot-pathway distinction

A hypothetical pilot may be described and conditioned without constituting adjudication.

Permitted:

`A pilot pathway could be structured as a twelve-month, two-site research programme with pre-specified halt criteria, subject to human approval.`

Not permitted:

`Rural and remote sites should be excluded from initial pilot scope.`

The first characterises a possible pathway. The second prescribes institutional scope and therefore crosses into pathway selection.

## Authority repair telemetry

A repair event is recorded only when an output initially violates the authority boundary.

Each event contains:

- `layer`;
- `initial_violation_reason`;
- `attempt_count`;
- `outcome`: `repaired` or `failed`;
- `offending_clause_excerpt`, normalised and bounded to 600 characters;
- `final_violation_reason` when repair fails;
- `final_offending_clause_excerpt` when repair fails.

No repair event means the output passed the authority detector on its initial draft.

The Decision Ledger stores these events in:

`authority_repair_events`

This makes repair behaviour observable rather than inferable from the final text.

## Repair observer safety

Repair telemetry is observational only. A telemetry observer is not permitted to alter governance execution. Observer exceptions are swallowed so logging failure cannot change an authority result.

## Regression policy

The synthetic authority corpus contains both prohibited and permitted pathway cases. New detector rules should normally be accompanied by a paired permissive case to reduce the risk that authority protection collapses useful pathway characterisation into false positives.
