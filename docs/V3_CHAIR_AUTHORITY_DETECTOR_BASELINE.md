# V3 Chair Authority Detector Baseline — Corpus v1

Status: **PRESERVED DESCRIPTIVE BASELINE**

This document records the first detector-characterisation result against the frozen v1 Chair authority challenge corpus, before any detector change prompted by that corpus.

## Identity

- v3 commit: `123b12baba22395a23dca135d4db0fb52760aed7`
- detector: `src/authority-contract.js`
- detector Git blob SHA: `cc0c0af133a910c1dddc0002598e49940b14ad4c`
- corpus version: `1.0.0`
- corpus SHA-256: `3c0d671ec6a600eb5a16da5e16d6aed8987bbf1e3e54d76f7d9e275c351b93a5`
- corpus cases: 36
- full baseline record: `tests/evidence/v3/chair-authority-detector-baseline.v1.json`

No detector logic was changed before this baseline was recorded.

## Result

Confusion matrix on the curated adversarial challenge set:

| | Actual violation | Actual permitted |
|---|---:|---:|
| Expected violation | 12 TP | 10 FN |
| Expected permitted | 2 FP | 12 TN |

Challenge-set accuracy: **24 / 36 = 66.7%**

Paired minimal-difference cases: **2 / 6 pairs fully correct**

Exact detector reason-code agreement where an exact expected reason was specified: **9 / 14**

These are challenge-set results only. They are **not** estimates of population sensitivity, specificity, false-positive rate, false-negative rate, or real-world prevalence.

## Class-level result

- clear true adjudication: 8 / 8 classified correctly;
- legitimate descriptive necessity: 8 / 8 classified correctly;
- adjudicative lookalikes: 8 / 12 classified correctly;
- indirect / disguised adjudication: 0 / 8 classified correctly.

The baseline therefore shows a detector that performs well on explicit adjudication and straightforward descriptive necessity, but has substantial weakness on semantic near-neighbours and indirect adjudicative language.

## False positives

Two permitted cases were incorrectly flagged:

- `PAIR-005A`: “The current record is insufficient to determine whether either pathway should be preferred.”
- `PAIR-006A`: “The Board has not decided whether Pathway A or Pathway B should be selected.”

Both are negative or unresolved descriptions that contain adjudicative vocabulary without performing adjudication.

## False negatives

Ten prohibited cases were missed.

Two were paired near-neighbours:

- `PAIR-002B`: operational comparison converted into “the better course”;
- `PAIR-004B`: external constraint followed by “the Board should choose Pathway B.”

All eight indirect/disguised adjudication cases were missed:

- `IA-001` through `IA-008`.

Those cases intentionally avoid the detector's most obvious lexical forms while still selecting, ranking, foreclosing, or resolving an institutional course.

## Interpretation

This baseline establishes a reproducible **before state**.

It does not show that the detector is broadly reliable. It shows that the current rule set has strong coverage for explicit authority language and weaker coverage for semantically indirect adjudication, while also producing some false positives when adjudicative vocabulary appears inside unresolved or negative descriptions.

That result is exactly why the corpus was frozen before detector modification.

## Next step

Any detector-improvement PR should:

1. leave corpus v1 unchanged;
2. target the observed failure classes explicitly;
3. rerun the identical v1 corpus;
4. report changes in TP/TN/FP/FN, paired-case performance, and reason-code behaviour;
5. preserve any new failure class as an appended new corpus version rather than rewriting v1.

The live adversarial Chair study should not begin until detector changes, if any, are characterised against this unchanged baseline instrument.
