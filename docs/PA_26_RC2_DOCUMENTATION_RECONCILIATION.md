# PA-26 — Consolidated documentation reconciliation (proposal for independent review)

**Recorded authority:** Protocol Authority approved PA-26 in conversation on 22 November 2026 for a documentation-only branch, commits and a single PR. **Merge remains reserved**; this document is not a merge authorisation, policy amendment, fixture authorisation, Gate A acceptance or release approval.

## PA-12a — prospective synthetic-only test-data policy approval

**Approval:** Protocol Authority approved the exact hash-identified policy in conversation on 22 November 2026, **before** PA-26. This record transcribes that earlier decision; PA-26 did not newly grant PA-12a.

| Identity | Exact value |
|---|---|
| Policy file | `docs/GATE_A_SYNTHETIC_TEST_DATA_POLICY.md` |
| Approved file SHA-256 | `d24baff959b852490a27499bc9482aa184c5496645b1a2e427eaacf79c773f2c` |
| Approved Git blob | `690def4d58128545b944d221031f8ce694d9ee67` |
| Approval authority | PA-12a, Protocol Authority, 22 November 2026 |
| Approved scope | Fully synthetic Gate A test-data policy, prospectively applied |
| Not approved | De-identified or real-case-derived fixtures; publication of restricted RC1 evidence; first fixture registration; internal/external live run; deployment; freeze/tag; Gate A PASS |

**First fixture:** The first actual fully synthetic RC2 fixture requires **separate, specific prospective Protocol Authority registration/sign-off** with exact bytes/identity and pre-run eligibility and controls. Nothing in PA-12a identifies, registers or approves a particular fixture.

**First internal live run:** Before the first internal live RC2 run, the Protocol Authority must **separately authorise that specific run**, in addition to PA-12a and first-fixture sign-off, after the prospective controls, adopted validation protocol and recorded candidate/configuration prerequisites are satisfied. Record the actual restricted evidence location, access controls, custodian, retention/deletion review date, private incident contact route, handling arrangements and applicable enabled provider configurations/terms. No run is authorised by this documentation record.

**External transfer:** Requires its own further prospective access, participant, provider, publication, retention and transfer arrangements. RC1 remains closed **NOT PASSED**, and its historical run remains **ineligible** for the synthetic evaluation even if useful as restricted defect-discovery evidence.

## PA-24 / PA-25 — completed engineering integration

PA-24 authorised strictly bounded Phase A engineering for F-5/F-6/F-7/F-8/L-14/L-24. Claude independently accepted the six items after three correction rounds and restricted local RC1 replay. PA-25 separately authorised merging exact head `7800c7ac5c1bea0a4499a555c3f618c95e9487a6` in PR #96; merged `main` commit `81ac31ab1993690181d5ec2ddbddfc66d2153763`. The merged tree matched the reviewed head; `main` CI run 44992548340 passed. **Engineering acceptance is not RC2 live validation or Gate A closure.**

## New L-29 — coordination and authority

The independent reviewer also identified **five distinct silent dashboard display caps**, including an RC1 Unresolved Tensions display that showed 3 of 4 and omitted the benefit-side tension. This is registered as L-29 in `docs/LIMITATIONS_REGISTER.md`. The limitation is outside PA-24. **As of the drafting of this PA-26 PR, PA-27 has been proposed but not approved or merged.** Its initial register status must therefore be **OPEN — remediation proposed; authorisation pending**.

**Merge-order reconciliation rule (binding to this documentation scope):**
- If PA-27 has been approved but its fix has not merged when this PR is reviewed/merged: **OPEN — remediation authorised (PA-27); implementation pending**.
- If the PA-27 fix has already merged: **Remediated in code (PR #…); pending RC2 validation**, citing the actual merged PR and verified CI.
- If PA-27 remains unapproved: **OPEN — remediation proposed; authorisation pending**.

Claude checks the final status against `main` before recommending this documentation PR for merge. No repository change under PA-26 may authorise PA-27 engineering or presume it has occurred.

## Open governance determinations — never inferred from this PR

- Formal adoption of an executable, corrected **Gate A validation protocol** (current draft still mentions multi-file export and 'synthetic/de-identified' fixtures; both must be corrected before adoption).
- L-18 tie/no-signal semantics and L-21 non-aggregable/constraint treatment, then Protocol Authority acceptance of the completed limitations register.
- Gate A Criterion 5 interpretation for tagged candidate versus the actual execution/deployment environment.
- Read-only API-key threat-model assessment for founder-operated versus Gate B stranger-operated contexts; implementation scope depends on findings.
- PA-27 authorisation and independent acceptance of L-29 engineering, and separate final merge authorisation.
- First synthetic fixture sign-off, first live-run authorisation, exact candidate freeze/tag/deployment and Gate A exit.

## Historical operational housekeeping (no invented proof)

- **Branch protection:** Earlier discussion reported `main` unprotected. On 22 November 2026 the connector's branch-protection endpoint returned **HTTP 403 — Resource not accessible by integration**; this is a permission failure, **not** positive evidence for either protection or non-protection. Authoritative contemporaneous controls are therefore **UNVERIFIED through this connector**; an authorised GitHub administrator/operator must retain dated branch/ruleset evidence before relying on its state. No settings change is authorised.
- **`npm ci`:** The merged `main` tree contains a **tracked** `package-lock.json` (Git blob `b487b49c44827a0982e7d6b770aacc496c6f56b1`). PR #96 CI and independent review report clean `npm ci`, `npm run validate` and `npm run build`, including post-merge CI run [44992548340](https://github.com/kojiro5150/phdss-instructions/actions/runs/44992548340). This is evidence for the particular tested SHA/environment, not a clean tagged RC2 candidate or proof of every dependency resolution condition. The exact future candidate lockfile/Node/npm identities and clean-clone logs remain to be captured. No package/lockfile mutation is authorised.
- **AI attribution:** Some historical PR #96 commit messages display the AI attribution text but lack the blank-line separator required for machine-readable Git trailers. No historical rewrite is authorised. New documentation commits include a correctly separated `AI-Assisted-By` footer.
- **UI cosmetics:** Formatting/narrative details lacking independent reproduction are not treated as closed engineering issues, and no code changes are authorised.

**Documentation status:** Proposed factual reconciliation under PA-26; independently review the complete diff. No claim that RC2 Phase B, tagged-build validation, UI walkthrough or Gate A passage has occurred.
