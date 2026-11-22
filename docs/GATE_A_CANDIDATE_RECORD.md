# Gate A: Candidate Freeze, Evidence and Exception Record

**Status:** FINAL for independent review (draft PR; not merged)
**Gate A status:** OPEN (closure route C)
**Decision date:** 22 November 2026
**Protocol Authority:** Sam Hayward
**Prepared by:** Claude (engineering support); evidence gathered 22 November 2026, 00:25 to 00:30 UTC

This record freezes a transfer candidate and sets out the evidence against each Gate A exit criterion (`docs/GATE_A_ENTRY.md` §4). It does not close Gate A, does not mark any criterion PASS that has not been demonstrated, and does not authorise transfer or deployment.

---

## 1. Protocol Authority decisions (22 November 2026)

| # | Decision | Disposition |
|---|---|---|
| 1 | Freeze `7649eb4ed5f07072a29a7c5758040d2f9ecd9828` as the Gate A transfer candidate | APPROVED |
| 2 | L-14 compensating controls (§5) | ACCEPTED with amendments (now incorporated) |
| 3 | Gate A closure route | **C: remain OPEN.** No exception-based closure authorised |
| 4 | Release-candidate tag `v3.0.0-gateA-rc1` | AUTHORISED conditionally, **DEFERRED** by Protocol Authority until live Governance export testing, UI disclosure inspection, and review are completed (§9); exact target commit must be verified before tagging |
| 5 | CI validation and controlled live Governance export testing | AUTHORISED as verification activities, not deployment approval |
| 6 | L-18 and L-21 | PENDING evidence-based disposition |
| 7 | Transfer or deployment | NOT AUTHORISED |

**Rationale for the candidate.** Preserve identity between the evaluated build and the transfer candidate. No application code or instruction pin is changed to convert L-14 from QUALIFIED to PASS. Rejected alternatives: (a) a narrow L-14 fix and re-tag, which creates an unevaluated build; (b) freezing main `91202fa`, which has no runtime difference and so no assurance gain.

**Three separate states.** Freezing a candidate, closing Gate A, and authorising transfer are distinct decisions. Only the first has been made.

---

## 2. Candidate identity (manifest)

Fields follow `docs/GATE_A_TRANSFER_CANDIDATE_VALIDATION_PROTOCOL.md` §1.

| Field | Recorded value |
|---|---|
| Candidate | `7649eb4ed5f07072a29a7c5758040d2f9ecd9828` (tag `eval-baseline-2026-11-03`; no release tag yet) |
| Clean checkout | Fresh worktree at the full SHA; `git status --porcelain` empty before and after validation and build |
| Instruction pins (loader) | `BASELINE_INSTRUCTION_COMMIT` `22b662999e01462fc4008446885a38df2cf735ad` (20 files); `INSTRUCTION_COMMIT` `94c5851146d849957af9610935a85f674c6ab05d` (`lived.md`). Confirmed in `src/runtime/instruction-loader.js` and embedded in the built bundle |
| Package lock | `package-lock.json` tracked; git blob `b487b49c4482`; SHA-256 `0d905a67662da0a207a58f70c73fc2560b27bc0e3b9f26a5b7dea7a0b77b0fac`; installed with `npm ci` |
| Environment | Node 22.23.5, npm 10.9.9, Ubuntu 24.04.5 LTS, Linux 6.18 x86_64 (Claude workspace, not CI) |
| Build | `npm run build` exit 0; bundle `dist/assets/index-BzFf1mEt.js` embeds deployment commit `7649eb4ed5f0…` and both pins |
| Deployment | Not deployed. Live `gh-pages` (`29606ca`, from `4fcec9a`) is **not** the candidate |
| Model and provider configuration | Not recorded here. To be captured from the live run (§4.3) |

---

## 3. Candidate relationship to current main

Verified by `git diff 7649eb4 91202fa`.

- Four commits separate them: `523d4d8`, `53a6345`, `830910f`, `91202fa` (PRs #91, #92).
- **Runtime:** zero changed lines in `src/` and `App_FINAL.jsx`. Pins identical.
- **Not documentation-only.** The delta adds two tests to `npm run validate` (`test/verify-limitation-fixtures.js`, `test/verify-probe-direction-characterisation.js`), one synthetic fixture (`tests/fixtures/synthetic/limitations-l18-l21.json`) and `package.json` script entries. These characterise limitations; they do not alter runtime behaviour.
- **Disclosure dependency.** The candidate tree's register predates L-19 to L-23. The authoritative register is fixed in §6.

---

## 4. Validation evidence: two assurance claims, held separately

Evidence files: `tests/evidence/gate-a/rc1-2026-11-22/`.

### 4.1 Claim A: candidate under its own suite

| Run | Result | Evidence |
|---|---|---|
| GitHub Actions `validate-recovery-contract` on `7649eb4` | success, 2026-11-02T12:53:31Z | [run 41448296747](https://github.com/kojiro5150/phdss-instructions/actions/runs/41448296747/job/125286833140) |
| Local `npm run validate`, clean worktree | exit 0, 2026-11-22 | `validate-7649eb4.log` (SHA-256 `3c0152b8…0c50`) |

### 4.2 Claim B: expanded suite (as at `91202fa`)

| Run | Result | Evidence |
|---|---|---|
| GitHub Actions on `91202fa` | success, 2026-11-08T05:12:15Z | [run 42449818685](https://github.com/kojiro5150/phdss-instructions/actions/runs/42449818685/job/128636422566) |
| Local `npm run validate` at `91202fa` | exit 0, 2026-11-22T00:25:39Z | `validate-expanded-91202fa.log` (SHA-256 `a83f4933…c043`) |
| The two added tests run against the candidate tree (files copied in, tree restored to clean afterwards) | both PASS | L-18 to L-21 characterisation (12 cases); L-22 probe-direction characterisation |

**Interpretation.** Claim A says the candidate passes the suite it was evaluated under. Claim B says the unchanged runtime also passes the later characterisation tests. Claim B does not retrospectively change what was evaluated at the baseline. Neither claim establishes Governance provenance parity, behavioural reliability or Gate A exit.

### 4.3 Not yet run

| Protocol step | Status |
|---|---|
| Governance end-to-end export test (protocol §3) | NOT RUN. Needs the Protocol Authority to operate the live app with model access |
| UI disclosure inspection (protocol §2.6) | NOT RUN |
| Build verification after deployment | NOT RUN: candidate not deployed |

---

## 5. L-14 exception: OPEN and QUALIFIED

**Limitation.** The candidate contains `612148e` (composite pins). Provenance records label all 21 instruction files with `INSTRUCTION_COMMIT` (`94c5851`). The runtime resolves 20 of them from `BASELINE_INSTRUCTION_COMMIT` (`22b6629`). Content hashes verify only because those 20 files are byte-identical at both commits.

| Dimension | Position |
|---|---|
| Content integrity | Supported: hash comparison passes |
| Source attribution | **Not verified.** Incorrect for the composite-pin configuration |
| Runtime provenance | Not fully established |
| Behavioural correctness | Not affected |

**Residual risk.** A reviewer could read `instruction_commit` as proof of source. If the pins ever diverge for one of the 20 files, current verification could pass while naming the wrong source. At the candidate the bytes are identical, so the risk is to the claim, not to the evaluated behaviour.

### 5.1 Accepted compensating controls

1. Both pins frozen for the life of the candidate. Any pin change voids this record.
2. `instruction_commit` is a declared label, never proof of source, in every transfer artefact and evaluator brief.
3. Pin difference evidence attached (§5.2).
4. Source-equivalence check with byte hashes, URLs, timestamps and discrepancies recorded (§5.3).
5. L-14 stays OPEN. QUALIFIED never converts to PASS.

### 5.2 Pin difference

Across the 21 instruction files, `git diff 22b6629 94c5851` shows only `lived.md` differs. All other instruction files are byte-identical at both pins.

### 5.3 Source equivalence (control 4)

Method: for each of the 21 files at each pin, SHA-256 of the git object compared with SHA-256 of a `curl` retrieval. Full table with per-file URLs, HTTP codes, hashes and UTC timestamps: `l14-source-equivalence.tsv` (SHA-256 `171b4c68…d946`).

| Source | URL pattern | Result |
|---|---|---|
| Raw GitHub (verifier source) | `https://raw.githubusercontent.com/kojiro5150/phdss-instructions/<pin>/<file>.md` | 42/42 HTTP 200, 42/42 MATCH, 2026-11-22T00:2x UTC |
| jsDelivr (runtime source) | `https://cdn.jsdelivr.net/gh/kojiro5150/phdss-instructions@<pin>/<file>.md` | **PERFORMED by operator; output verified.** 42/42 HTTP 200 and MATCH, 0 FAIL, 2026-11-22T00:44:41Z–00:45:18Z. Operator: Protocol Authority (Sam Hayward); environment: macOS (Darwin 25.6.0 arm64). Evidence: `tests/evidence/gate-a/rc1-2026-11-22/l14-jsdelivr-report-20261122T004441Z.tsv` (SHA-256 `6f3b2f9f07d45c3b4ec56d945ed24d646f6c89bef4dd253c4a577452478b1d72`). Report contents and SHA-256 checked by ChatGPT; Claude independently compared all 42 reported response hashes directly against git objects at the pinned commits. Neither AI repeated the jsDelivr retrieval. Claude authored the retrieval script and later reviewed its output; ChatGPT inspected the script only after the operator had run it. |

**Boundary.** The jsDelivr comparison is now documented as completed at the recorded retrieval times. A match shows byte equivalence at retrieval time only; it does not show permanent equivalence, CDN behaviour at other times, or correct source attribution. L-14 remains OPEN and QUALIFIED; Governance-mode provenance parity remains unverified.

---

## 6. Authoritative transfer documentation

Fixed at commit `91202fa`. Hashes: git blob (12 chars) and SHA-256 of file bytes. These files are not modified by this PR.

| File | Blob | SHA-256 |
|---|---|---|
| `docs/LIMITATIONS_REGISTER.md` (last changed `830910f`) | `11487d0830da` | `56b86295ac7d7ba5d56e6348f9726d611a803cdb889e96568b602ecdc656339f` |
| `docs/GATE_A_SYNTHETIC_TEST_DATA_POLICY.md` | `06328f266432` | `9e9d329349e488aea6654cad2b67c3675836bc973654562dbe818359eb3ca108` |
| `docs/V3_TRANSFER_READINESS_AND_INDEPENDENT_EVALUATION_ROADMAP.md` | `98e86c8faa20` | `7e2c902f52b6025d03c1c992c2fcdb0d3e04d40b97f84e0f2b0cd7e56c586f88` |
| `docs/PRE_GATE_TRANCHE_CLOSURE.md` | `5e3fbd5972b6` | `655f838f5678c8b654b595e626df75dc777eaeead893ccc5cb0779a6402c8398` |
| `docs/V2_RELEASE.md` | `9be2e42b4e95` | `0a6b9443bd3b15e002d6c41de8190f95f39c914c6cba31735ac5fc37deefc2cd` |
| `docs/LIVE_REPLAY_GATE_CI_DESIGN.md` | `19618ca8c092` | `193632d762e1dec82a80331365efba3daf56a0cfb83ec02dca2f58190b2c331b` |

The register is in Review Candidate status and is not accepted as Gate A-complete. All known limitations, including L-19 to L-23, are preserved unchanged. `docs/GATE_A_ENTRY.md` and this record change in this PR. Their hashes are fixed by the merge commit.

---

## 7. Evidence against Gate A exit criteria

| # | Criterion | Status | Basis |
|---|---|---|---|
| 1 | Clean, versioned, tagged release build | NOT MET | Candidate frozen; release tag deferred by Protocol Authority pending live export testing, UI inspection, and review (§9) |
| 2 | `npm run validate` passes unmodified | MET at candidate commit; re-verify at tag | §4.1 (CI and local) |
| 3 | Limitations register complete and accurate | NOT MET | Not accepted; L-13, L-14, L-19, L-20, L-22, L-23 OPEN; L-18, L-21 pending disposition |
| 4 | Synthetic-only test-data policy | MET | §6 |
| 5 | Deployment provenance and instruction-pin verification on tagged build | PARTIAL | Build and pins verified locally; no tag; not deployed; L-14 |
| 6 | Governance-mode provenance parity | NOT VERIFIED; L-14 QUALIFIED | Live export test not run |
| 7 | Limitations intelligible to a non-builder | PARTIAL | UI inspection not run; no independent reader |

**Does QUALIFIED satisfy Gate A?** No. `GATE_A_ENTRY.md` §4 requires every criterion to be "demonstrably met" and defines no qualified closure. Route C was selected accordingly.

**Release tag deferred.** Decision 4 authorises the tag. `GATE_A_TRANSFER_CANDIDATE_VALIDATION_PROTOCOL.md` §2.8 says to tag only after the full validation sequence (including the Governance export test and UI inspection) and Protocol Authority review, and not in a documentation PR. That protocol is still marked DRAFT. The Protocol Authority confirmed on 22 November 2026 that tagging is deferred until the live Governance export test, UI disclosure inspection, and review are completed (§9); this is an explicit decision, not an approval of the draft protocol. Target verified: `7649eb4ed5f07072a29a7c5758040d2f9ecd9828`.

**CI on a tag.** The workflow triggers on pushes to `main` and `v2.0` and on pull requests to `main`. It has no tag or manual trigger. A tag push will not run CI unless the workflow is changed, which this PR does not do.

**Branch protection.** Not verifiable with the access used: classic protection API returned 403; no rulesets on `main`.

---

## 8. Remaining actions

| Action | Owner | Status |
|---|---|---|
| Create release-candidate tag only after live Governance export testing, UI disclosure inspection, and review are completed, with exact target verified | Engineering, subject to Protocol Authority decision in §9 | DEFERRED; prerequisites outstanding |
| Governance end-to-end export test per protocol §3 | Protocol Authority (operator) | Authorised, not run |
| jsDelivr half of control 4 | Protocol Authority (Mac operator); ChatGPT (report and post-run script inspection); Claude (git cross-check and script author) | COMPLETED for sampled retrieval times; report integrity and all 42 reported hashes independently cross-checked against git. Independence qualified: Claude authored the script, and ChatGPT reviewed it after execution; neither AI independently repeated CDN retrieval (§5.3). |
| UI disclosure inspection | Protocol Authority or reviewer | Not run |
| L-18 and L-21 dispositions | Protocol Authority | Pending evidence |
| Confirm branch protection requires CI | Protocol Authority (repo admin) | Not verified |
| Independent review of this record | Reviewer | Requested via draft PR |

---

## 9. Sign-off

| Decision | Disposition | Date |
|---|---|---|
| Candidate freeze at `7649eb4` | Approved | 2026-11-22 |
| L-14 compensating controls | Accepted with amendments | 2026-11-22 |
| Closure route | C (remain OPEN) | 2026-11-22 |
| Release tag timing | **DEFERRED by Protocol Authority** until the live Governance export test, UI disclosure inspection, and review are completed; no tag creation authorised before these conditions | 2026-11-22 |
| Independent review | | |
