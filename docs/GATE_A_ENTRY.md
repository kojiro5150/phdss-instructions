# Gate A — Transfer-Readiness Entry Record

**Status:** RC1 ATTEMPT CLOSED — NOT PASSED (Protocol Authority, 22 November 2026); RC2 Phase A repairs merged in PR #96 and independently accepted for engineering, but no RC2 release candidate frozen/tagged or eligible live Gate A validation completed  
**Date opened:** 10 October 2026  
**Gate A question:** Is the technical and evidentiary baseline stable enough to hand over?  
**Required result:** Frozen build, provenance, validation, limitations, data policy

This document records the original Gate A entry conditions, unchanged exit criteria and the RC1 closeout. RC1 did not meet Gate A exit; RC2 is separately authorised for preparation only. No transfer, deployment, merge or tag is authorised. See `docs/GATE_A_CANDIDATE_RECORD.md` §10 for RC1's criterion-by-criterion disposition.

---

## 1. Entry conditions

Gate A is entered under the following conditions:

### 1.1 Approved deviation

The pre-Gate behavioural characterisation closed at F01, short of the preregistered 5–8-probe stopping rule. See `docs/PRE_GATE_TRANCHE_CLOSURE.md` for the full deviation record.

The project enters Gate A under this approved deviation. The deviation is disclosed in the limitations register (`docs/LIMITATIONS_REGISTER.md`) and must remain visible through any transfer artefact.

### 1.2 Constitutional baseline sealed

The v2.0.0 constitutional baseline is sealed (`docs/V2_RELEASE.md`). Its invariants — decision-space expansion, non-substitution, epistemic provenance — are inherited infrastructure for Gate A and beyond. No Gate A work redefines these.

### 1.3 Instruction pins

> **Correction (20 October 2026):** This section previously stated that all 21 instruction files load from a single pin. That was accurate when written (`4d5953f`) but became stale when `612148e` introduced composite pins on main. See L-14 in `docs/LIMITATIONS_REGISTER.md`.

**Historical deployment.** The deployed `gh-pages` build (`29606ca`, built from `4fcec9a`) predates the composite pins. It loads all 21 instruction files from a single immutable commit via the jsDelivr CDN:

```
INSTRUCTION_COMMIT = 22b662999e01462fc4008446885a38df2cf735ad
```

**Current main.** The runtime instruction loader uses two immutable pins:

```
INSTRUCTION_COMMIT          = 94c5851146d849957af9610935a85f674c6ab05d   (lived.md only)
BASELINE_INSTRUCTION_COMMIT = 22b662999e01462fc4008446885a38df2cf735ad   (the other 20 files)
```

Source: `src/runtime/instruction-loader.js:3-6,41`. Both pin values and the per-file routing are asserted by `test/verify-runtime-orchestration.js:29-35,64-65`.

Provenance records on current main label every instruction file with `INSTRUCTION_COMMIT`, so source attribution is incorrect for the 20 baseline files (L-14). This section describes the pin configuration only; it does not change the Gate A exit criteria or status.

### 1.4 Validation suite passing

The `npm run validate` suite covers: authority regression, Chair non-substitution, Reality Anchor contract, runtime orchestration, governance compression, Comparator contract, prompt builders, pipeline, stage replay, orientation, Chair authority detector corpus, participation non-substitution, advisory request provenance, lived participation structure, participation disclosure UI, participation calibration request integrity, participation status classifiers (v2 through v3), calibration scorers (v2 through v3), governance provenance, deployment provenance, and the negative-scope guardrail regression.

Gate A exit requires this suite to pass on a clean frozen build.

### 1.5 Advisory and deployment provenance hardened

Deployment provenance verification (`verify-deployment-provenance.mjs`) and Advisory provenance v4 (`verify-advisory-provenance-v4.mjs`) are in the test suite and passing. The Advisory provenance sidecar schema is `phdss.advisory-request.v4`.

Advisory provenance tests do not on their own establish Governance-mode provenance parity. Governance-mode provenance parity is listed as an outstanding Gate A requirement below and requires specific verification before Gate A can close.

---

## 2. RC1 Gate A closeout assessment (22 November 2026)

**Gate A requirements** (unchanged exit criteria; this table records the RC1 outcome, not future RC2 results):

| Requirement | Status | Notes |
|---|---|---|
| Frozen build (tagged release) | **NOT MET** | Candidate `7649eb4` frozen, but no release tag created. Historical conditional tag approval superseded by PA-01: **do not create an RC1 tag**. See `docs/GATE_A_CANDIDATE_RECORD.md` §10. |
| Limitations register complete | **NOT MET** | Register remains review candidate. L-24 and F-5–F-9 require registration or linked disposition; existing limitations (including L-14) remain. |
| Synthetic-only test-data policy documented | **NOT MET — PA-11 purposive interpretation** | Literal requirement (documented and explicit) is satisfied, but the policy file remains `PROPOSED — Protocol Authority review required` and approval is not evidenced. Earlier MET was recorded without checking that status (reviewer omission); PA-11 supersedes it without changing §4 criterion wording. Separately, RC1's live test was **ineligible** because pre-run policy §4 checks were not completed. PA-12 review authorised; PA-12a approval still pending. |
| Transfer-candidate validation run | **PARTIAL; not acceptance evidence** | Live CORE run `DR-20261122-115931-4417e9` performed. 13-stage provenance export verified and independently reproduced after L-24 recovery deviation; run **ineligible** for synthetic transfer study. UI inspection **partial** (exports and two screenshots); full §2.6 walkthrough not completed. |
| Known limitations disclosed in UI | **NOT MET** | Previously recorded scanner disclosure; participation-verification banner observed in the reviewed screenshot. However, F-6 (silent Chair truncation), F-7 (incorrect counts) and F-8 (instruction comment displacing an absent perspective) demonstrate material representation defects. Full UI walkthrough not completed. |
| `npm run validate` passing on frozen build | **MET at candidate commit only** | CI success on `7649eb4` (2 Nov 2026) and clean local run (22 Nov 2026). No RC1 release tag exists; re-verification at an RC1 tag is not applicable. |
| Governance-mode provenance parity | **NOT MET** | Independent verifier reproduced VALID for all 13 captured stages; however model-mediated Governance Brief compression calls are not provenance-captured (F-5), and L-14 instruction-source attribution remains qualified. |

**Gate B requirements** (not Gate A blockers; required before Gate B closes):

| Requirement | Status | Notes |
|---|---|---|
| Operator Guide v1 | NOT YET | Required before stranger test |
| Evaluator Protocol v1 | NOT YET | Required before stranger test |

---

## 3. What Gate A is not

Gate A is a technical and evidentiary transfer-readiness check. It is not:

- a claim that PHDSS is validated for institutional use;
- evidence that the negative-scope scanner performs reliably;
- evidence that participation status is independently verified at runtime;
- evidence that PHDSS improves governance decisions (institutional-effect evidence does not exist yet);
- Gate B (transfer-ready method) or Gate C (independent run demonstrated).

---

## 4. Gate A exit criteria

Gate A closes when all of the following are demonstrably met:

1. A clean, versioned, tagged release build exists.
2. `npm run validate` passes on the tagged build without modification.
3. The limitations register is complete and accurate.
4. The synthetic-only test-data policy is documented and explicit.
5. The deployment provenance and instruction-pin verification pass on the tagged build.
6. Governance-mode provenance parity is verified: the provenance chain for Governance-mode outputs meets the same standard as Advisory provenance, confirmed on the tagged build.
7. The known limitations (including the pre-Gate deviation and scanner limitations) are disclosed in a form that would be intelligible to a competent person who did not build PHDSS.

Operator Guide v1 and Evaluator Protocol v1 are Gate B requirements. They are not required to close Gate A, but they should be drafted before Gate B is opened.

---

## 5. Decision Ledger and v3 surface work

The persistent governed Decision Ledger is the stated next v3 implementation priority after Gate A is passed.

It must not delay Gate A unless the agreed Gate A scope explicitly requires persistence. The current Gate A scope does not require it.

Decision Ledger work may proceed in parallel with Gate A documentation completion, provided it does not change the gated artefacts (instruction files, runtime logic, constitutional contracts, validation suite) without a corresponding re-verification of Gate A requirements.

---

## 6. History

| Date | Event |
|---|---|
| 2026-09-26 | v2.0.0 sealed; calibration fixture `DR-20260926-204324-a2e644` frozen |
| 2026-09-27 onwards | Pre-Gate negative-scope behavioural characterisation, scanner development, advisory participation calibration close-out |
| 2026-10-10 | Pre-Gate tranche closed at F01 by Protocol Authority decision |
| 2026-10-10 | Branch tidy: 3 branches merged, 3 experiment branches closed without merge |
| 2026-10-10 | Gate A entry record opened (this document) |
| 2026-11-22 | Candidate `7649eb4` frozen; L-14 controls accepted; closure route C selected; §2 status table reconciled (exit criteria unchanged). See `docs/GATE_A_CANDIDATE_RECORD.md` |
| 2026-11-22 | Protocol Authority closed **RC1 Gate A — NOT PASSED** (PA-01) and authorised a **separate RC2** preparation (PA-02 onward). PA-09 includes L-14 and PA-10 includes L-24; PA-11 adopts purposive Criterion 4; PA-12 authorises policy review, but PA-12a policy approval remains pending. RC1 live Governance export test performed and independently reviewed; UI inspection partial; original RC1 run ineligible under synthetic-data policy. The seven exit criteria in §4 are unchanged. See `docs/GATE_A_CANDIDATE_RECORD.md` §10. |
| 2026-11-22 | PA-13 authorised **documentation commits to draft PR #93 only**; no merge, tag, deployment, transfer or RC2 engineering approved under PA-13. Amendments to this entry record prepared with ChatGPT assistance. |
| 2026-11-22 | **PA-12a** approved exact version of the fully synthetic policy, SHA-256 `d24baff959b852490a27499bc9482aa184c5496645b1a2e427eaacf79c773f2c`; the first fixture and first internal live run still require separate prospective approvals. Formal record proposed under **PA-26**. |
| 2026-11-22 | **PA-24** separately authorised bounded RC2 Phase A engineering. Independent RC1 replay review accepted all six remediation items. **PA-25** authorised exact-head merge of PR #96, resulting in `main` commit `81ac31ab1993690181d5ec2ddbddfc66d2153763` and passing CI run 44992548340. This **does not** establish tagged-build evidence, Phase B testing or Gate A passage. |
| 2026-11-22 | **PA-26** authorised one documentation-only reconciliation PR (independent review and separate merge reserved). L-29's five silent dashboard display caps registered as **OPEN — proposed** pending separate PA-27 decision. The unchanged seven Gate A exit criteria remain binding. |
