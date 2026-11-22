# PHDSS Repository Handover

**Date:** 22 November 2026
**Scope:** Orientation for a new primary engineering agent. Introduces no new development scope.
**State at handover:** main `91202fa`; Gate A OPEN; candidate `7649eb4` frozen (`docs/GATE_A_CANDIDATE_RECORD.md`)

---

## 1. What PHDSS is

A structured multi-Director AI reasoning system for institutional decisions. It produces a governance record. It does not make decisions. Read first: `README.md`, `docs/NORTH_STAR.md`, `docs/V3_DEVELOPMENT_CONTRACT.md`.

**Authority chain (constitutional):** AI enlarge and interrogate; Code constrain, validate and preserve; Chair organise and expose; Human judge and decide.

**Governing principle:** do not weaken a boundary to make a feature easier to build. Change the feature or the architecture explicitly.

---

## 2. Architecture

| Layer | Location |
|---|---|
| App shell (single large component, about 2,800 lines) | `App_FINAL.jsx`, `src/main.jsx` |
| Pipeline and stage orchestration | `src/pipeline.js`, `src/registry.js`, `src/prompt-builders.js` |
| Contracts | `src/authority-contract.js`, `src/governance-record-contract.js`, `src/governance-rules.js`, `src/orientation.js` |
| Signal tally and parsing | `src/signal-tally.js`, `src/parsers.js`, `src/coverage.js` |
| Runtime | `src/runtime/` (Anthropic client, instruction loader, governance provenance, compression, lived negative-scope guardrail) |
| Instruction files (21 loaded) | Repo root `*.md` (`systems.md` … `comparator.md`), fetched at runtime from jsDelivr at immutable pins |
| Calibration | `src/calibration/`, `scripts/score-participation-calibration*.mjs` |
| Provenance verifiers (CLI) | `scripts/verify-governance-provenance-v2.mjs`, `scripts/verify-advisory-provenance-v4.mjs` |
| Build with provenance | `scripts/build-with-provenance.mjs` |

**Pipeline:** Directors (independent) → Surface Map → Epistemic Audit → Cross-Domain Tension → Reality Anchor → Adversarial Probe → Stress Test → Chair → Comparator → Decision Ledger → human.

**Instruction pins** (`src/runtime/instruction-loader.js`): `BASELINE_INSTRUCTION_COMMIT` `22b6629` for 20 files; `INSTRUCTION_COMMIT` `94c5851` for `lived.md` only. Provenance mislabels this (L-14).

**Deployment:** GitHub Pages via `gh-pages`. Live build is `29606ca` (from `4fcec9a`). It is older than the candidate and is not the candidate.

---

## 3. Baselines and tags

| Ref | Meaning |
|---|---|
| `v2.0.0` | Sealed constitutional baseline (`docs/V2_RELEASE.md`) |
| `eval-baseline-2026-11-03` → `7649eb4` | Evaluation baseline and frozen Gate A candidate. Preserve |
| `91202fa` (main) | Candidate plus limitation-characterisation docs, tests and fixtures; no runtime change |
| `v3.0.0-gateA-rc1` | Conditionally authorised but deferred by Protocol Authority until live Governance export testing, UI disclosure inspection, and review are completed; not created |

---

## 4. Commands

```bash
npm ci
npm run validate   # full deterministic suite; CI runs the same command
npm run build      # Vite build with embedded provenance
npm run dev
```

CI: `.github/workflows/v2-recovery-validate.yml`. It runs on pushes to `main` and `v2.0` and on PRs to `main` touching listed paths. Most `docs/*.md` changes do **not** trigger it. It has no tag or manual trigger.

---

## 5. Governance authorities

| Role | Holder | Holds |
|---|---|---|
| Protocol Authority | Sam Hayward | Strategic direction, risk acceptance, gate approvals, limitation dispositions, final authorisation. The only assigned governance role |
| Primary engineering | ChatGPT (from handover) | Code, tests, docs, evidence, draft PRs |
| Independent assurance | Claude (from handover) | Review of actual code, tests and evidence; adversarial tests; failure analysis |
| System of record | GitHub | Branches, CI, evidence, reviews, decision history |

**Standing rules**

- Neither agent merges, tags, deploys or authorises transfer without Protocol Authority approval.
- Neither agent changes evaluation criteria, protected fixtures (`tests/fixtures/`, frozen calibration fixtures), acceptance thresholds or gate criteria without express Protocol Authority authorisation.
- No code or pin change to obtain an administrative PASS. QUALIFIED never converts to PASS.
- Only synthetic or approved de-identified data (`docs/GATE_A_SYNTHETIC_TEST_DATA_POLICY.md`).
- Assurance results are scoped to the exact configuration, evidence and execution path tested.
- Reviews examine the repository, not the author's summary of it.

**Independence caveat.** Claude did much of the pre-handover engineering and documentation, including this file. Claude's review of artefacts it authored is not independent. A second model is not an independent assurance authority on its own. L-16 (single-developer assurance) is not resolved by this change of roles.

---

## 6. Open limitations

Canonical source: `docs/LIMITATIONS_REGISTER.md` at `91202fa` (SHA-256 `56b86295…339f`). Review Candidate; not accepted as Gate A-complete.

| ID | Summary | Status |
|---|---|---|
| L-01 to L-12 | Detector blind spots, participation inference, negative-scope leakage and scanner coverage, transform neutrality, CORE enforcement, pre-Gate deviation, refusal enforcement, provenance transform boundary, Equity/Lived rationale, stochastic synthesis, transfer reproducibility | Accepted boundaries or open; see register |
| L-13 | Replay instruction provenance misattribution | OPEN; fix not authorised |
| L-14 | Composite-pin provenance misattribution | OPEN, QUALIFIED; fix not authorised |
| L-15 | Consequential-field stability unmeasured | Verification gap (no status field) |
| L-16 | Single-developer assurance | Assurance risk (no status field) |
| L-17 | Temporal layer is proposal only | Claims boundary (no status field) |
| L-18 | Dominant signal divergent rules | Partially remediated (PR #90); disposition pending |
| L-19 | Authority detector exempts question-mark clauses | OPEN |
| L-20 | Stress-trigger negation and extraction | OPEN |
| L-21 | Dominant signal can conceal disagreement | OPEN; Protocol Authority decision required |
| L-22 | Probe challenge direction not enforced | OPEN |
| L-23 | 58-run corpus incomplete stage text | OPEN (documentation) |

---

## 7. Outstanding decisions (Protocol Authority)

1. Release tag timing decided 22 November 2026: DEFERRED. Outstanding execution prerequisites are live Governance export testing, UI disclosure inspection, and review; verify exact candidate SHA before creating the tag.
2. L-18 and L-21 dispositions (L-21 closes on a representation decision, with no numerical split threshold).
3. Acceptance of the limitations register as Gate A-complete.
4. Gate A exit, as a separate explicit decision once all seven criteria are demonstrably met.

---

## 8. Next priorities (already agreed; not new scope)

In order:

1. **Complete Gate A verification** on `7649eb4`: live Governance export test (`docs/GATE_A_TRANSFER_CANDIDATE_VALIDATION_PROTOCOL.md` §3), jsDelivr source-equivalence check, UI disclosure inspection, branch protection requiring CI, tag.
2. **Evaluation plan** (agreed 3 Nov 2026; recorded outside the repo): keep implementation and governance-policy decisions separate; freeze baseline and fixtures; run a seeded-defect challenge, then a four-arm comparison (single model, lighter governed workflow, full PHDSS, PHDSS without Probe); decide runtime changes only on that evidence.
3. **Live replay gate**: design merged (`docs/LIVE_REPLAY_GATE_CI_DESIGN.md`, PR #86). Implementation not authorised. Kept separate from Gate A.
4. **Persistent Decision Ledger**: next v3 implementation priority after Gate A closes (`docs/GATE_A_ENTRY.md` §5; boundary in `docs/V3_DEVELOPMENT_CONTRACT.md` §4).
5. **Decomposition** of `App_FINAL.jsx` into a multi-file app: long-standing goal (first planned for v2.0); needs its own scope decision.

Not authorised: L-13 and L-14 fixes, CI workflow changes, changes to the temporal layer (Bluegum case stays sealed), RAG.
