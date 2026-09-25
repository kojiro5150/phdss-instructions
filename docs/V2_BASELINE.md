# PHDSS v2.0 — Recovery Baseline

Status: recovery workspace established before refactor.

## Source of truth hierarchy

1. **Behavioural baseline:** live GitHub Pages deployment from branch `gh-pages`.
2. **Deployment commit:** `830d3226e7f4a884fdba40fdd73d93776d1547bf` — "Update build - signal calibration fixes" (29 June 2026).
3. **Deployed bundle:** `assets/index-Bw38JQm-.js`.
4. **Instruction bundle used by deployed app:** `56ad2305ca62ed7409c3e89723f9bd1ca914d935`.
5. **Readable source on `main`:** `App_FINAL.jsx`, blob `abd57fe41dba329b61bd4e8d64f1277feda2dad1`.
6. **Important limitation:** the readable source on `main` predates the deployed application and must not be treated as the v2.0 behavioural baseline.

## Confirmed deployed behaviours to preserve

- Chair uses **Decision Brief Status**, not a preferred decision recommendation.
- Human decision authority remains outside PHDSS.
- Dashboard reports **Director Signal Distribution** rather than Chair-versus-consensus departure.
- Board-readable Governance Record views are generated dynamically from actual module output.
- No hardcoded gender-diverse scenario content exists in the deployed Governance Record path.
- Director and synthesis outputs retain technical views alongside board-readable views.
- CORE / FULL / CHAIR_SPECIFIED modes remain available.
- Current Director set is 13 until an explicit v2.0 migration changes the contract.
- Instruction loading is pinned to the tested 29 June instruction commit.

## Known deployed technical debt

- Some legacy wording still refers to "Chair recommendation" in dialogue/help text.
- Some partial-coverage calculations still hardcode `13 directors`.
- The deployed application exists only as a compiled bundle in `gh-pages`; its later readable JSX source was not committed.
- Instruction/runtime compatibility is implicit rather than enforced through a release manifest.
- The application remains effectively monolithic from a source-maintenance perspective.

## v2.0 recovery rule

**Do not refactor behaviour that has not first been recovered and parity-checked against the live 29 June deployment.**

Recovery sequence:

1. Reconstruct the later source by using the readable `App_FINAL.jsx` as the structural skeleton and the deployed bundle as the behavioural reference.
2. Verify recovered source against the live CORE path before architecture changes.
3. Commit the recovered source as the explicit v2.0 baseline.
4. Only then modularise, introduce runtime/instruction contracts, add the Workforce & Operational Practice Director, and make terminology/usability changes.

## Initial parity checks

A recovered baseline must demonstrate at minimum:

- CORE run completes.
- Exactly the expected CORE Directors run.
- Technical and Governance/board-readable views render from the same underlying analysis.
- Chair output exposes `Decision Brief Status`.
- No Chair preferred course of action is generated.
- Director signal distribution is preserved.
- Probe, Reality Anchor, Stress Test, META and Epistemic outputs still render and export.
- No static scenario text appears unless present in the decision input or generated analysis.
- Decision Ledger/JSON remains generated without silently changing schema.
- Existing instruction SHA used for the parity run is recorded.

## Deployment rule during recovery

The `gh-pages` branch is frozen as the reference implementation while v2.0 recovery is underway. v2.0 development occurs on `v2.0` and is run locally until parity is established.
