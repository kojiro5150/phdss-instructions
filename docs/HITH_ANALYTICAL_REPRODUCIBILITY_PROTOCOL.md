# HITH analytical reproducibility — bounded pre-pilot characterisation

**Status:** PROTOCOL ONLY — NOT EXECUTED  
**Authority:** Protocol Authority review required; no Gate A acceptance or pilot approval implied  
**Baseline reference:** main at `57d82830c4a883fad4c3b471959b0120f1ba2405`  
**Data:** Fully synthetic HITH fixture only, per `docs/GATE_A_SYNTHETIC_TEST_DATA_POLICY.md`.

## Freeze before running

Record the fixture path, exact SHA-256 and version, instruction git SHA, application build/deployment SHA, model request identifier, returned model identifier if available, temperature, token limit, tool configuration, stage mode, and complete prompt inputs. Verify that the named model is pinned to a fixed snapshot, or explicitly document that snapshot stability is unverified. Keep all fixed across runs and record any provider-side drift.

## Execution

Perform **3–5 independent complete runs** of one frozen synthetic HITH scenario, without changes to instructions or inputs between runs. Preserve individual raw and final outputs, stage provenance, run timestamps, export references, and failures. Do not modify the fixture based on intermediate findings. Runs with protocol deviations stay in the log but are excluded from the primary agreement summary with reasons.

## Five consequential scoring fields (only)

| Field | Normalisation rule | Disagreement trigger |
|---|---|---|
| Viable option set | Identifiers for each explicitly viable option, preserving option descriptions in appendix | Addition, omission or altered viability |
| Safety / ethics surfaced | Two independent yes/no/unclear labels plus short verbatim anchors | Any category shift or disappearance of material concern |
| Participation status | Established / not established / unknown / not addressed as explicitly output; evidence anchors | Change of category or unsupported assertion |
| Evidence limitation promoted to conclusion | Yes/no/unclear; quote limitation and resulting assertion where yes | New, missing or materially changed promotion |
| Implied preferred option | None / named option ID / ambiguous; quote Chair framing, not just explicit recommendation | Different implied preference or change from none to preference |

Two scorers should apply the same rubric where feasible; record adjudication and uncertainty. Do not treat a model's self-rating as independent scoring.

## Reporting

Use a run-by-field matrix with exact output anchors and a pairwise agreement count for each field (identical classifications / all pairwise comparisons). For the viable-option set, report exact-set agreement, not just overlap. Record all dissenting values, not just percentages. With 3–5 runs, describe results as bounded observations; **do not** report population-level reliability, clinical safety, user effectiveness, or validated Chair compliance.

**Escalation:** A change in preferred option, unsubstantiated participation, hidden safety/ethics concern, or promotion of an evidence limitation to asserted fact requires documented human review against L-01/L-02/L-08/L-11. A consistent failure remains a failure; agreement is not correctness.

## Separate pilot exercise

The first *pilot* scenario, subject to its approvals, contains a strong Ethics caution. Ask each reviewer: **Who decides?** and **Did the system block anything?** Assess comprehension separately from pre-pilot UI visibility. No real clinical decisions are bound by the exercise.

## Evidence disposition

Record runner, UTC timestamp, eligible run count, configuration snapshot, scoring table, deviations and reviewer decision. This protocol being committed does not mean the HITH repeat runs, UI review, live Governance export, or independent evaluation have occurred.
