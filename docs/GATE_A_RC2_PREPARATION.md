# Gate A — RC2 Preparation Record

**Date:** 22 November 2026 (Australia/Melbourne)  
**Status:** RC2 PHASE A ENGINEERING MERGED (PR #96, PA-25); distinct RC2 candidate not yet frozen, tagged, fixture-registered, live-tested or accepted  
**Authority:** PA-02, PA-08–PA-12a, PA-24 (bounded engineering), PA-25 (merge), PA-26 (documentation-only reconciliation); earlier publication under PA-13  
**Source of decisions:** `docs/GATE_A_RC1_CLOSURE_RC2_PREPARATION_DECISION.md` (authority-confirmed v0.5, with dated PA-13 addendum)  
**Review confirmation:** Decision record v0.5 and its repository addition were independently reviewed and accepted, 22 November 2026.  
**Repository:** `kojiro5150/phdss-instructions`  
**RC1 frozen reference:** `7649eb4ed5f07072a29a7c5758040d2f9ecd9828` — **closed NOT PASSED; not an RC2 build**  
**RC1 run (defect-discovery evidence only):** `DR-20261122-115931-4417e9` — **not eligible** for the synthetic transfer study

This remains a **preparation and acceptance-evidence plan**, not a new engineering, fixture, evaluation, release or Gate A authorisation. The historical PA-13 wording applied to its original PR #93 publication. **PA-24 separately authorised Phase A engineering and PA-25 authorised its exact reviewed merge:** PR #96 is merged at `81ac31ab1993690181d5ec2ddbddfc66d2153763`, following independent RC1 replay review and passing `main` CI. Under PA-26 only this documentation is being reconciled; the seven Gate A criteria remain unchanged. The unchanged seven Gate A exit criteria are in `docs/GATE_A_ENTRY.md` §4.

---

## 1. Separate candidate identity and record boundaries

RC1 is a historical unsuccessful Gate A attempt. Its positive validation results, recovered bundle, reviewer findings and negative controls may inform deterministic regression tests but **do not become eligible study data** and do not count as RC2 Gate A passes. The historical RC1 release-candidate tag authorisation is superseded; **do not create an RC1 tag**.

RC2 must acquire a **new, explicitly recorded** candidate commit, freeze decision, release identity, build/deployment provenance, actual instruction source commits, model/provider settings, fixture identity and independent results. None is currently assigned. In particular, `7649eb4` must never be relabelled as an RC2 candidate or treated as its released build. No merger of the RC1 and RC2 evidence sets is authorised.

Keep original RC1 manifest, 13 stage JSON records, Ledger, screenshots, independent verifier output and operator recovery materials **byte-identical**, in restricted custody with independent hashes and an explicit evidence inventory. The original run must be described verbatim as follows:

> Operator-generated synthetic test scenario; no patient information or organisational case evidence supplied. Pre-run checks under policy §4 not completed; run **not eligible** for the synthetic transfer study. Retained as Gate A defect-discovery and regression evidence.

The enclosing evidence package, not altered original files, must carry `SYNTHETIC EVALUATION — NOT A LIVE CASE` and the ineligibility notice. No RC1 prompt/response corpus is authorised for publication on the public PR.

---

## 2. Strictly bounded remediation scope

Only these **six** work items belonged to the approved **PA-24 Phase A engineering mandate**. **All six are now remediated in code in merged PR #96, independently accepted for engineering only; prospective RC2 evidence and Gate A closure remain pending.** Their historical planned scope and evidence thresholds below are retained as the original planning record. New L-29 is separate and cannot be fixed under PA-24 or this documentation-only PA-26.

| ID | Defect and authority | Required remediation | Minimum evidence of repair |
|---|---|---|---|
| **F-5 / L-25** | Governance Brief compression model calls not captured; PA-03, Criterion 6 BLOCK | Record model-mediated Director and synthesis compression events, input/prompt and instruction identity, model/settings, attempt and fallback outcomes, raw/final responses, hashes and downstream linkages. Make events independently verifiable and exportable. | Deterministic capture and integrity tests; reject omitted/tampered compression events; new eligible RC2 live chain and independent parity review against Advisory. Do not mistake downstream brief text for captured model-call provenance. |
| **F-6 / L-26** | Chair conditions/trade-offs silently truncated; PA-04, Criterion 7 BLOCK | Parse substantive logical conditions and trade-offs without silent loss. If bounded presentation is retained, disclose omissions and make the complete source accessible. | Regression against exact frozen RC1 Chair output; verify all six substantive conditions and all six trade-offs and UI/export equivalence. |
| **F-7 / L-27** | CDTA findings doubled in dashboard; PA-05, Criterion 7 BLOCK | Count logical findings rather than Markdown heading/body fragments and preserve accurate display/export text. | Deterministic RC1 regression yields four conflicts, four hidden assumptions and four reasoning gaps, rather than eight each; test formatting variants. |
| **F-8 / L-28** | Internal guard-comment text displaced an absent-perspective finding; PA-06, Criterion 7 BLOCK | Prevent guard residue from becoming or displacing operator-facing findings; preserve legitimate perspective text and avoid a broad undocumented content filter. | Replay frozen RC1 Probe through the presentation parser; assert the substantive Aboriginal and Torres Strait Islander perspective appears rather than `<`. Confirm the `<!--` / `!` sentence-split mechanism cannot recur; test verbatim/paraphrased guard cases and new UI/export output. |
| **L-14** | Composite-pin source attribution incorrect; PA-09, Criteria 5–6 | Record and check **actual per-instruction-file loaded source commit**, not merely identical bytes available at a reported pin. | Positive and negative attribution tests (including same bytes at different source commits and differing bytes), frozen-build verification and independent actual-source check. |
| **L-24** | Ordinary browser export delivered only ten of fourteen files; PA-10 | Provide a **single complete, independently verifiable bundle** with manifest, original stage records, compression events, appropriate Ledger cross-check material and integrity inventory. | UI-path delivery without DevTools workaround; independently reject missing/modified parts and reconcile inventory, run identity and source/deployment identifiers. |

**No additional engineering scope follows automatically from this table.** The following are not authorised under RC2's narrow scope: general citation-verification product functionality (F-9), a broad UI redesign, rewriting Director reasoning, changing constitutional authority contracts, changing Gate A's seven criteria or thresholds, human-comprehension trials, L-13 remediation, live replay gate implementation, persistent Decision Ledger implementation, temporal-layer change, RAG or unrelated code improvements.

**F-9 disposition (PA-07):** Existing L-11 remains OPEN. Use a documented operator-facing evidence-control disclosure and independent authoritative-source checking **before institutional reliance**; do not describe the cited Kirubarajan review or regulatory statements as verified. Qualified acceptance of this limitation does **not** waive Criterion 7 or authorise a new automated citation feature. The disclosure surface itself remains subject to Criterion 7 evaluation.

---

## 3. Engineering verification sequence — Phase A completed; Phase B prospective

**Phase A — deterministic work (PA-24 authorised, PR #96 merged and independently reviewed):** The following numbered steps document the original planned sequence, not outstanding authorisation. Public regression fixtures are separately invented and contain no RC1 excerpts; the original RC1 outputs were replayed privately by the independent reviewer.

1. Preserve immutable RC1 regression inputs under restricted control; create any derivative fixture only with separately recorded inventory, hashes, access and disclosure review. Do not silently modify originals or treat the RC1 run as a pre-registered eligible fixture. **A CI regression fixture in this public repository would itself be a publication:** use only the minimum defensible excerpts (Chair Decision Conditions and Key Trade-offs, CDTA conflicts/hidden assumptions/reasoning gaps, and Probe Whose Perspective Is Absent), not the full RC1 corpus. Even these excerpts require **advance, separately recorded Protocol Authority publication review and approval** of their exact bytes, provenance and confidentiality/re-identification risks **before committing them**. Until approval, keep excerpts restricted and use local deterministic tests or separately authored non-sensitive synthetic fixtures without copying RC1 text.
2. Implement and test F-6–F-8 presentation parsing using recorded RC1 output, without fresh model calls. Assert correct logical item counts, no hidden truncation and no guard-comment displacement, including the deterministic frozen-parser `<` reproduction.
3. Implement and unit-/contract-test F-5 compression-event provenance (attempts, fallback, raw/final output, source identity and downstream linkage), L-14 actual source attribution and L-24 single-bundle completeness. Include deliberately missing, corrupted and wrongly-attributed event/part negative controls.
4. Only after separately authorised implementation, obtain clean validation/build evidence, record exact source SHA, instruction-pin configuration and versioned verifier; then propose a **new RC2 candidate freeze** for explicit Protocol Authority action. No freeze is granted by this document.

**Phase B — governed live evaluation (still blocked pending separate fixture/run authorisations and operational prerequisites):**

5. **PA-12a approved the exact final fully synthetic policy** on 22 November 2026: `docs/GATE_A_SYNTHETIC_TEST_DATA_POLICY.md`, git blob `690def4d58128545b944d221031f8ce694d9ee67`, SHA-256 `d24baff959b852490a27499bc9482aa184c5496645b1a2e427eaacf79c773f2c`. Approval is recorded prospectively in `docs/PA_26_RC2_DOCUMENTATION_RECONCILIATION.md`; it **does not register the first fixture or authorise the first internal live run**. Those require separately recorded prospective Protocol Authority sign-offs, eligible fixtures, adopted protocol and actual custody/provider controls.
6. Once PA-12a is granted, register a fully synthetic fixture **before the run**, including ID/version, source/classification and prohibited-data check, prompt/evidence/web settings, candidate build, model, actual instruction pins, custodian, controlled storage and retention/review date. **Proposed only:** fixture ID `GATEA-AITRIAGE-001`, version `1.0`, decision text exactly `Deploy AI triage screening across all emergency departments nationally`. Neither ID nor version is approved or registered by this record.
7. Run a **new eligible RC2** CORE Governance integration evaluation on the exact candidate. Validate complete compression-event linkage, source provenance and the single downloaded bundle independently; check actual UI disclosure and exports with a **full §2.6 walkthrough** (the RC1 UI examination was only partial). A clean stochastic run alone does not prove the F-8 parser defect fixed.
8. Obtain independent review of original eligible RC2 evidence, verifier behaviour, negative controls, deployment/source identity, UI completeness and disclosure. Only the **human Protocol Authority** may apply all seven unchanged Gate A exit criteria and determine whether RC2 passes. No RC1 success is inherited and no automatic gate closure is implied.

**Required RC2 labels:** Every new evaluation evidence package must visibly carry `SYNTHETIC EVALUATION — NOT A LIVE CASE` and its registered fixture ID/version. If any application-level label is missing, record and disposition the failure rather than silently treating it as compliant.

### 3.1 Seven-criterion RC2 readiness map — planning only

This checklist prevents completion of the six remediation items from being confused with Gate A passage. The seven exit criteria remain **verbatim and unchanged** in `docs/GATE_A_ENTRY.md` §4. All RC2 rows below are **NOT YET SATISFIED**; identified evidence is prospective. Decisions reserved for the Protocol Authority are not engineering approvals delegated to either AI reviewer.

| Criterion | Evidence required for RC2 | Evidence producer / independent check | Authority or unresolved prerequisite |
|---|---|---|---|
| **1. Clean, versioned, tagged release build** | Clean source/build identity, versioned release artifact, verified immutable tag resolving to the **new RC2 commit**, and documented tag provenance. | Engineering supplies the reproducible build, source SHA and proposed tag; independent reviewer checks commit/tag/artifact identity. | **Protocol Authority must explicitly authorise the RC2 freeze and release tag** after prerequisite validation. RC1's tag permission is superseded; PA-13 does not authorise an RC2 tag. |
| **2. `npm run validate` on tagged build** | Unmodified `npm run validate` output from a clean checkout of the **exact RC2 tag target**, with environment/dependency identity, exit status, hash/log and test-set coverage. | Engineering executes and preserves logs; independent reviewer repeats or independently inspects the exact invocation and target. | Current CI triggers on main/PR, **not tags**. A passing PR workflow is insufficient. **Clean local validation at the tagged commit** is the proposed evidence route; its adequacy must be reviewed. No CI workflow change is authorised. |
| **3. Complete and accurate limitations register** | Updated L-01–L-29 statuses and F-9 disclosure/control; evidence-backed treatment of remaining defects; explicit disposition of **L-18 and L-21**; register-version identity and intelligibility review. | Engineering maintains candidate register and cross-links test/disclosure evidence; independent reviewer examines completeness and accuracy. | **Protocol Authority decides L-18 and L-21 dispositions and separately accepts the RC2 register as complete/accurate.** No acceptance is inherited from RC1 or implied by a review candidate. |
| **4. Documented and explicit synthetic-only policy** | Exact hash-identified policy version, documented effective approval and implementation conditions; prospectively completed internal synthetic fixture/pre-run controls. | Policy custodian presents version and checks; independent reviewer verifies hash and compliance evidence. | **PA-12a approved the final policy version** (SHA-256 `d24baff9…c773f2c`). **Prospective controls, first fixture registration and first live-run authorisation remain outstanding.** The seven criteria are unchanged. |
| **5. Deployment provenance and instruction-pin verification on tagged build** | Verified tagged build commit/provenance, actual per-file instruction-source commits and bytes (L-14), independent source/content checks, and evidence from the **deployment configuration** required by the criterion. | Engineering supplies tagged build and, if required, deployed-instance provenance; independent reviewer checks runtime resolution against pinned records and tamper/attribution negative controls. | **Protocol Authority must determine whether an independently proven local tagged build suffices or whether a tagged build must actually be deployed for Criterion 5.** Do not assume local build alone is enough or mark MET before that interpretation and required evidence. Deployment, if required, needs its own explicit authorisation; not granted by PA-13. |
| **6. Governance provenance parity with Advisory** | Capture of all Governance stage **and** model-mediated compression events (F-5/L-25), complete export and inventory (L-24), accurate source attribution (L-14), negative omission/tamper tests, independently reproduced verifier results against the tagged RC2 build. | Engineering creates captures/verifiers and test results; independent reviewer runs verifier and checks complete chain versus Advisory, including transforms and downstream links. | **Protocol Authority makes the criterion determination** after evidence-based review. The 13-stage RC1 `VALID` result alone is insufficient. |
| **7. Known limitations intelligible to a non-builder** | Complete and accurate UI/export presentation (F-6–F-8), accessible limitation and evidence-quality disclosures (including F-9), plus **full protocol §2.6 UI walkthrough**, with evidence of what was actually visible. | Engineering supplies the UI/export and disclosure inventory; independent reviewer examines actual candidate interface, completeness and intelligibility rather than relying on repository prose alone. | **Protocol Authority decides acceptance** on the new RC2 evidence; RC1's partial UI inspection does not meet this criterion. |

**Decision sequencing:** Deterministic fixes and tests require **separate RC2 engineering approval**, not PA-12a. The Protocol Authority must prospectively decide L-18/L-21 and the register's acceptability, PA-12a policy status, the specific RC2 freeze/tag, and the Criterion 5 deployment-evidence interpretation. A tag should be created only when authorised at the sequence required by the applicable validation protocol; once the tag exists, **re-run or independently verify validation at its exact commit** and record the result. A tag, validated build, or deployment does not itself imply passage of any other criterion. No present document authorises a deployment or automatic PASS.

---

## 4. Policy boundaries, external runs and evidence publication

The PA-12 review must identify and record unresolved implementation requirements. For an **internal fully synthetic RC2 evaluation**, these include all prospective fixture and prohibited-data checks, build/instruction/evidence settings, restricted storage, custodian and retention. Before the **first external run**, the handling and incident procedure, contacts, access, retention/deletion-review rules, service/provider configurations and sharing/publication requirements must be established. A de-identified-data study needs its **own separately governed protocol and prospective eligibility determination**; it is not covered by the internal synthetic RC2 permission. Neither external/de-identified requirement automatically blocks internal fully synthetic RC2 testing, once PA-12a and its internal-run conditions are satisfied.

PR #93 contained five public files under `tests/evidence/gate-a/rc1-2026-11-22/` (build log, two validation logs and two source-hash reports). **PA-14 expressly approved their continued public publication retrospectively on 22 November 2026**, as recorded in PR #93's description and limited **only to the exact five listed Git blob SHAs**. These files were already public before that decision; PA-14 does not rewrite that chronology or approve any altered/new version, restricted RC1 prompt/response, stage records, Ledger or screenshot. The separately recorded **PA-15** approved updating PR #93's description; it was metadata-only. A new publication of evidence remains subject to separate prospective review.

---

## 5. Decision / implementation status

| Item | Current status |
|---|---|
| RC1 Gate A | **CLOSED — NOT PASSED**; original run **INELIGIBLE** for synthetic transfer study |
| RC2 concept and narrow scope | **APPROVED** (PA-02, PA-08–PA-10); Phase A engineering **APPROVED** under PA-24 and **MERGED** under PA-25; further work separately governed |
| RC2 engineering source on `main`, candidate freeze, tag or deployment | **Merged engineering source:** `81ac31a`; **no RC2 candidate freeze, release tag or deployment approved** |
| F-5–F-8, L-14 and L-24 repairs | **REMEDIATED IN CODE** (merged PR #96; independent engineering acceptance); **PENDING ELIGIBLE RC2 VALIDATION**, not closed |
| PA-11 Criterion 4 interpretation | **ADOPTED for RC1**; seven Gate A criteria unchanged |
| PA-12 exact policy review | Completed with amended final policy; PA-12a independently approved exact final bytes |
| PA-12a version-specific policy approval | **APPROVED** on 22 November 2026, SHA-256 `d24baff9…c773f2c`; first fixture and run authorisations remain separate |
| RC2 fixture registration / pre-run checks | **NOT DONE** |
| RC2 live run, complete UI walkthrough, independent assessment and Gate A determination | **NOT DONE** |
| PR #93 publication review of existing five evidence files | **APPROVED RETROSPECTIVELY UNDER PA-14** (22 November 2026), exactly five blob SHAs recorded in PR #93 description. No approval for modifications or additional restricted RC1 material; PA-15 authorised only PR-description metadata correction. |
| Decision record v0.5 and its repository addition | **INDEPENDENTLY REVIEWED AND ACCEPTED, 22 NOVEMBER 2026** |
| This RC2 preparation document | **PENDING independent diff review** |

**Authorship and boundary:** Original historical preparation authored under PA-13; factual status reconciled by ChatGPT (OpenAI) in proposed PA-26 documentation PR. PA-24 and PA-25 authority for completed Phase A is recorded separately; **PA-26 authorises documentation only**. Its diff requires independent review and a separate merge decision. No RC2 freeze, release tag, fixture registration, live run, deployment, transfer or Gate A PASS is authorised here.
