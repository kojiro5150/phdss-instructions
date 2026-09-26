# Calibration Fixture — DR-20260926-204324-a2e644

This directory preserves the first live FULL-mode PHDSS calibration after the Chair constitutional rewrite and epistemic provenance monotonicity repair.

## Calibration record

- Mode: FULL
- Coverage: 13/13
- Source main commit: `3b2d6c805f1fa4eaa56b157434877c7ee94a9347`
- Instruction pin: `b6792cb5e69b4dbe3c5db438063ef4255b76d56e`
- Ledger schema: `3.0.0-alpha.2`
- Session: `COMPLETE_DEGRADED`

| Constitutional / execution check | Result |
| --- | --- |
| Chair constitutional behaviour | PASS |
| Chair zero-repair criterion | NOT CLEAN — 1 repaired event |
| Provenance monotonicity in synthesis | PASS / materially improved |
| Compression provenance enforcement | PASS — live absence promotion caught |
| Decision-space expansion | PASS |
| Mandatory reasoning chain | PASS |
| Comparator | NOT TESTED — billing failure |
| Overall session | COMPLETE_DEGRADED |

The architecture's response to billing failure — preserving all completed mandatory artefacts, labelling the session COMPLETE_DEGRADED rather than COMPLETE or FAILED, and identifying the exact stage and cause — is itself a demonstration of the fault-tolerance properties the constitutional repairs were designed to enforce.

## Why this fixture is preserved

This is an empirical Governance Engineering calibration case, not a golden-output fixture. The stochastic prose is historical evidence and MUST NOT be edited to make later tests pass.

The preserved artefacts include all 13 Director technical outputs and Governance Records, all completed synthesis outputs and Governance Records, the Chair Decision and Governance Record, the Transparency Dashboard, and the Decision Ledger.

The failures are part of the fixture:
- Safety compression exposed an `ABSENCE_PROMOTION` and fell back deterministically.
- Cross-Domain Tension Analysis structured extraction failed and was reconstructed deterministically.
- Chair triggered one authority repair event and then passed.
- Comparator failed because the Anthropic credit balance was exhausted.

## Replay contract

The stage-replay harness may consume the frozen Ledger and re-enter at:
- `comparator`: reuse the frozen Chair and Director outputs; execute Comparator only.
- `chair`: reuse all frozen upstream synthesis artefacts; execute Chair, then Comparator.

Replay output is written outside this immutable fixture by default. The fixture's source instruction pin remains historical provenance; a replay records the current instruction pin separately.

Do not silently replace the historical artefacts with newer outputs.
