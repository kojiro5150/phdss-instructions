# Static Chair Repair Inspection

Calibration: `DR-20260926-204324-a2e644`

## Finding

**Primary classification: C — over-broad detector rule.**

There is a contributing wording factor in the Stress-to-Chair representation, but the observed repair was not a genuine governance-act obligation.

## Source trace

The Stress Test stated:

> the model's safety architecture rests entirely on three mutually load-bearing structural prerequisites ... the first of which requires action outside the organisation's administrative control, and all of which must function simultaneously for the model to be safe in its highest-risk scenarios.

The Chair reproduced the same substantive construction. The Ledger recorded the offending clause as a `GOVERNANCE_ACT_OBLIGATION` and the first repair attempt succeeded.

The current detector rule in `src/authority-contract.js` treats an occurrence of an institutional actor token such as `organisation` followed anywhere within the same bounded clause by `must` / `should` / equivalent obligation language as a governance-act obligation.

In this sentence:
- `organisation` occurs inside the possessive phrase **"outside the organisation's administrative control"**;
- it is not the grammatical subject of `must`;
- the subject of **"must function simultaneously"** is the three structural prerequisites;
- the modal describes a system-safety dependency, not an action the organisation, Board, Chair, decision-maker, or reader is instructed to take.

The actor-window regex therefore linked two grammatically unrelated parts of the sentence.

## Interpretation

This is not evidence that the constitutional Chair reintroduced a higher-order judgment. The repaired Chair remained representational and non-adjudicative.

The safest future detector repair is not a broad carve-out for `must function`. A later targeted PR should distinguish:

**Permitted descriptive necessity**
> The model depends on three prerequisites outside the organisation's administrative control, all of which must function simultaneously for the model to be safe.

from:

**Prohibited governance obligation**
> The organisation must resolve all three prerequisites before proceeding.

That repair should be backed by paired regression cases and should leave genuine Board / institution / decision-maker obligations fail-closed.

## Scope decision for PR #21

No detector change is made here. This inspection is recorded as evidence so the replay harness can test a later detector change against frozen upstream artefacts without another FULL API run.

## Additional contract drift observed

The current pipeline's dynamic Probe injection still tells the Chair to either **ACCEPT** or **REBUT** the Probe finding, while the rewritten `chair.md` explicitly says the Chair must not ACCEPT or REBUT on its own authority. The live Chair followed the constitutional instruction and preserved the Probe challenge without resolving it, so this drift did not cause the observed repair. It should be corrected in a separate, narrowly scoped contract-alignment PR rather than folded into the replay-harness work.
