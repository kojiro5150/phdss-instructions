# PHDSS Repository Handover

**Date:** 22 November 2026
**Scope:** Orientation for a new primary engineering agent. Introduces no new development scope.
**State at handover (updated 22 November 2026):** main `91202fa` (unchanged); **RC1 Gate A CLOSED — NOT PASSED** at frozen candidate `7649eb4`; RC2 separately authorised for preparation, **not yet built, tagged or approved**. Draft PR #93 carries documentation closeout, unmerged. See `docs/GATE_A_CANDIDATE_RECORD.md` §10 and `docs/GATE_A_ENTRY.md` §2. This state line supersedes the earlier OPEN / route C status.

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
| `v3.0.0-gateA-rc1` | **NOT CREATED; historical conditional authorisation SUPERSEDED by PA-01. Do not tag RC1.** |
| RC1 Gate A outcome (22 Nov 2026) | **CLOSED — NOT PASSED**; no transfer authorisation. A valid 13-stage verifier result does not establish complete Governance provenance or UI accuracy. |
| RC2 Gate A | Separate proposed remediation/evaluation attempt; **no RC2 build, fixture registration, live run, tag or gate determination** exists yet. |

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
- Gate A and first external transfer study use **fully synthetic** fixtures by default (`docs/GATE_A_SYNTHETIC_TEST_DATA_POLICY.md`). The policy is still **PROPOSED**; PA-12 authorises a version-specific review, not approval. PA-12a approval is **PENDING** and gates RC2 fixture registration/live evaluation. Deterministic engineering tests may proceed beforehand. No de-identified fixture is authorised without its own prospective eligibility determination and applicable separate protocol. RC1's historical live run is ineligible for the synthetic transfer study.
- Assurance results are scoped to the exact configuration, evidence and execution path tested.
- Reviews examine the repository, not the author's summary of it.

**Independence caveat.** Claude did much of the pre-handover engineering and documentation, including this file. Claude's review of artefacts it authored is not independent. A second model is not an independent assurance authority on its own. L-16 (single-developer assurance) is not resolved by this change of roles.

---

## 6. Open limitations

Canonical source: `docs/LIMITATIONS_REGISTER.md` on the **current PR #93 branch** (reviewed RC1 additions under PA-13; not accepted as Gate A-complete). The earlier register at main `91202fa` (previously recorded SHA-256 `56b86295…339f`) is a historical baseline and **does not contain L-24–L-28 or the F-9 case**. Never use its historical digest as a hash of the updated file.

| ID | Summary | Status |
|---|---|---|
| L-01 to L-12 | Detector blind spots, participation inference, negative-scope leakage and scanner coverage, transform neutrality, CORE enforcement, pre-Gate deviation, refusal enforcement, provenance transform boundary, Equity/Lived rationale, stochastic synthesis, transfer reproducibility | Accepted boundaries or open; see register |
| L-13 | Replay instruction provenance misattribution | OPEN; fix not authorised |
| L-14 | Composite-pin provenance misattribution | OPEN; **narrow RC2 remediation scope approved (PA-09), implementation not yet performed** |
| L-15 | Consequential-field stability unmeasured | Verification gap (no status field) |
| L-16 | Single-developer assurance | Assurance risk (no status field) |
| L-17 | Temporal layer is proposal only | Claims boundary (no status field) |
| L-18 | Dominant signal divergent rules | Partially remediated (PR #90); disposition pending |
| L-19 | Authority detector exempts question-mark clauses | OPEN |
| L-20 | Stress-trigger negation and extraction | OPEN |
| L-21 | Dominant signal can conceal disagreement | OPEN; Protocol Authority decision required |
| L-22 | Probe challenge direction not enforced | OPEN |
| L-23 | 58-run corpus incomplete stage text | OPEN (documentation) |
| L-24 | Four of fourteen Governance export files not ordinarily delivered in RC1 | OPEN; complete independently verifiable bundle in RC2 scope (PA-10) |
| L-25 (F-5) | Model-mediated Governance Brief compression calls omitted from provenance | OPEN; blocks Criterion 6 (PA-03) |
| L-26 (F-6) | Dashboard silently omits substantive Chair conditions/trade-offs | OPEN; blocks Criterion 7 (PA-04) |
| L-27 (F-7) | Dashboard doubles CDTA logical finding counts | OPEN; blocks Criterion 7 (PA-05) |
| L-28 (F-8) | Guard-comment residue displaces absent-perspective finding; deterministic parser mechanism reproduced | OPEN; blocks Criterion 7 (PA-06) |
| L-11 addendum (F-9) | Misattributed citation / unverified regulatory applicability | Qualified acceptance with documented evidence-verification control (PA-07); does **not** validate citations or resolve L-11 |

---

## 7. Current Protocol Authority decisions and open approvals

**RC1 is concluded, not waiting for a tag.** PA-01 closed RC1 Gate A **NOT PASSED**. The full CORE Governance run was performed; the provenance verifier returned VALID for captured stages and was independently reproduced, but F-5 and L-14 preclude Criterion 6 parity. UI inspection was **partial** (exports plus two screenshots), not the full §2.6 walkthrough; F-6–F-8 establish Criterion 7 NOT MET. RC1 is ineligible for the synthetic transfer study because prospective policy §4 checks were not completed. The earlier conditional RC1-tag decision is superseded.

**Approved RC2 preparation (not release authority).** PA-02 creates a **separate RC2 Gate A attempt**. Narrow remediation scope: F-5–F-8, L-14 (PA-09), L-24 (PA-10), with deterministic and negative-control tests before a separately governed live run. PA-11 adopts the purposive Criterion 4 assessment **NOT MET**, without changing the seven exit criteria. PA-12 authorises review of the exact synthetic-data policy version (SHA-256 `9e9d329349e488aea6654cad2b67c3675836bc973654562dbe818359eb3ca108` at main and the reviewed PR head), including the unresolved first-external-run handling procedure and de-identified-data protocol. **PA-12a policy approval is a separate, outstanding decision.** Before PA-12a, recheck the hash; its scope covers only the exact reviewed bytes.

**PA-13 documentation authority.** The Protocol Authority approved documentation-only amendments to **draft PR #93** in ChatGPT on 22 November 2026 (message: `Approve PA-13`). Each commit goes to independent diff review. PA-13 does **not** authorise PR merge, tag, runtime/pin/code change, deployment, transfer, or RC2 engineering implementation.

**Outstanding dispositions:** L-18 and L-21 still require explicit evidence-based Protocol Authority disposition; limitations-register acceptance and future RC2 Gate A exit likewise require separate determinations.


---

## 8. Next priorities (approved scope; implementation boundaries)

In order:

1. **Close the RC1 documentation and evidence record on draft PR #93.** Correct the Gate A entry, candidate record, limitations and this handover; add the authority record and distinct RC2 preparation record, following independent **commit-by-commit diff review**. Record publication screening of the **five existing public evidence files** in `tests/evidence/gate-a/rc1-2026-11-22/` before new public evaluation evidence. An independent reviewer's preliminary low-risk screen is not a completed publication-review record. Keep raw RC1 scenario exports/private bundle out of this public PR.
2. **RC2 deterministic engineering, only under separate approval.** Plan specific fixes for F-5–F-8, L-14 and L-24 with preserved original RC1 evidence, regression fixtures and negative controls. PA-13 alone authorises **no** engineering changes. RC1 must not be retagged, upgraded to PASS, or retrospectively made eligible.
3. **Policy governance.** Conduct PA-12 version-specific review of `docs/GATE_A_SYNTHETIC_TEST_DATA_POLICY.md`, including outstanding external-run handling and de-identified-data procedures. Seek **separate PA-12a approval before RC2 fixture registration or live evaluation**; approval is not required to run deterministic engineering tests. The first external run and any de-identified study remain separately gated.
4. **Independent RC2 technical evaluation and seven-criterion determination.** After authorisation and appropriate policy/fixture controls, freeze a **new** candidate, verify its source/deployment/compression chain and single-bundle export, conduct full UI inspection, test failures and run `npm run validate` at the exact candidate/tag. No present evidence claims that RC2 has passed.
5. **Other previously agreed, separately governed work.** Evaluation plan (seeded-defect challenge followed by four-arm study); live replay gate design (`docs/LIVE_REPLAY_GATE_CI_DESIGN.md`, PR #86; implementation not authorised); persistent Decision Ledger **after Gate A is passed** (`docs/GATE_A_ENTRY.md` §5), not merely after failed RC1 closure; potential `App_FINAL.jsx` decomposition only on its own scope decision.

**Still outside PA-13 and current PR #93:** RC2 runtime/code or instruction-pin fixes, L-13 fix, CI workflow changes, tag/merge/deployment/transfer, temporal-layer changes (sealed Bluegum case), RAG, and unapproved changes to Gate A exit criteria or test fixtures.

**Handover boundary:** This update records decisions already made; it does not approve an implementation, resolve an open limitation, or grant model-authored documents institutional authority. Claude authored the original handover; this state-and-priorities reconciliation was prepared by ChatGPT under PA-13 on 22 November 2026.
