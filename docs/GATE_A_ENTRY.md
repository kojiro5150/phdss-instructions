# Gate A — Transfer-Readiness Entry Record

**Status:** OPEN — entry conditions partially met; outstanding requirements listed  
**Date opened:** 10 October 2026  
**Gate A question:** Is the technical and evidentiary baseline stable enough to hand over?  
**Required result:** Frozen build, provenance, validation, limitations, data policy

This document records the conditions under which PHDSS has entered Gate A, the outstanding requirements before Gate A can be closed, and the exit criteria. Writing this document does not establish that Gate A exit conditions are met.

---

## 1. Entry conditions

Gate A is entered under the following conditions:

### 1.1 Approved deviation

The pre-Gate behavioural characterisation closed at F01, short of the preregistered 5–8-probe stopping rule. See `docs/PRE_GATE_TRANCHE_CLOSURE.md` for the full deviation record.

The project enters Gate A under this approved deviation. The deviation is disclosed in the limitations register (`docs/LIMITATIONS_REGISTER.md`) and must remain visible through any transfer artefact.

### 1.2 Constitutional baseline sealed

The v2.0.0 constitutional baseline is sealed (`docs/V2_RELEASE.md`). Its invariants — decision-space expansion, non-substitution, epistemic provenance — are inherited infrastructure for Gate A and beyond. No Gate A work redefines these.

### 1.3 Instruction pin confirmed

The runtime instruction loader is pinned to a single immutable commit:

```
INSTRUCTION_COMMIT = 22b662999e01462fc4008446885a38df2cf735ad
```

Source: `src/runtime/instruction-loader.js`.

All 21 instruction files are loaded from this commit via the jsDelivr CDN. The pin is verified by the test suite.

### 1.4 Validation suite passing

The `npm run validate` suite covers: authority regression, Chair non-substitution, Reality Anchor contract, runtime orchestration, governance compression, Comparator contract, prompt builders, pipeline, stage replay, orientation, Chair authority detector corpus, participation non-substitution, advisory request provenance, lived participation structure, participation disclosure UI, participation calibration request integrity, participation status classifiers (v2 through v3), calibration scorers (v2 through v3), governance provenance, deployment provenance, and the negative-scope guardrail regression.

Gate A exit requires this suite to pass on a clean frozen build.

### 1.5 Advisory and deployment provenance hardened

Deployment provenance verification (`verify-deployment-provenance.mjs`) and Advisory provenance v4 (`verify-advisory-provenance-v4.mjs`) are in the test suite and passing. The Advisory provenance sidecar schema is `phdss.advisory-request.v4`.

Advisory provenance tests do not on their own establish Governance-mode provenance parity. Governance-mode provenance parity is listed as an outstanding Gate A requirement below and requires specific verification before Gate A can close.

---

## 2. Outstanding Gate A requirements

**Gate A requirements** (required before Gate A closes):

| Requirement | Status | Notes |
|---|---|---|
| Frozen build (tagged release) | NOT YET | v2.0.0 tag exists; no post-v2 release tag |
| Limitations register complete | IN PROGRESS | `docs/LIMITATIONS_REGISTER.md` opened with this PR |
| Synthetic-only test-data policy documented | NOT YET | Policy must be written and explicit |
| Transfer-candidate validation run | NOT YET | Clean `npm run validate` on frozen tagged build |
| Known limitations disclosed in UI | PARTIAL | Scanner warning semantics disclosed; participation status interim disclosure in place |
| `npm run validate` passing on frozen build | NOT VERIFIED | Must be verified at the tagged commit |
| Governance-mode provenance parity | NOT VERIFIED | Advisory provenance tests do not establish Governance parity; requires specific verification |

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
6. The known limitations (including the pre-Gate deviation and scanner limitations) are disclosed in a form that would be intelligible to a competent person who did not build PHDSS.

Operator Guide v1 and Evaluator Protocol v1 are Gate B requirements. They are not required to close Gate A, but they should be drafted before Gate B is opened.

---

## 5. Decision Ledger and v3 surface work

The persistent governed Decision Ledger is the stated next v3 implementation priority after Gate A closes.

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
