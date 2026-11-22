# PHDSS — Protocol Authority Decision Record
## RC1 Gate A closure and RC2 preparation mandate

**Record ID:** PHDSS-PA-DR-2026-11-22-RC1-RC2-01 (authority-confirmed v0.5)  
**Decision date:** 22 November 2026 (Australia/Melbourne)  
**Decision maker / Protocol Authority:** Sam Hayward  
**Revision note (v0.5, 22 November 2026):** Clarifies that PA-12a gates fixture registration and the live evaluation, not remediation engineering or deterministic tests. No change to approved decisions.
**Status:** AUTHORITY DECISIONS RECORDED — PA-01–PA-12 authorised; PA-12a policy approval NOT YET GRANTED. Record prepared, not committed. No repository changes or RC2 implementation.  
**Record type:** Gate A candidate disposition and scoped remediation mandate  
**Source of authority:** Explicit Protocol Authority approvals supplied in the conversation on 22 November 2026.  
**Repository:** `kojiro5150/phdss-instructions`  
**RC1 frozen candidate:** `7649eb4ed5f07072a29a7c5758040d2f9ecd9828`  
**RC1 governance-run decision:** `DR-20261122-115931-4417e9`  
**RC2 commit/tag:** NOT ASSIGNED; RC2 is not yet built or frozen.

> **Record integrity and execution boundary:** PA-01–PA-08 were expressly authorised in this conversation. PA-09 was reported as approved in the Claude review conversation (~13:59 AEDT 22 Nov 2026) and is **directly confirmed** by the Protocol Authority in this conversation on 22 Nov 2026. PA-10, PA-11 and PA-12 were approved together by the Protocol Authority’s express “yes” to the four-decision approval request. **PA-12 is authority to review, not approval of the policy; PA-12a remains pending.** This record is not an execution log, repository commit, RC2 freeze, fixture registration or approval, release tag, transfer or deployment authorisation. Original RC1 exports must remain unchanged.

## 1. Decisions adopted by Protocol Authority

| ID | Decision | Authorised disposition | Immediate consequence |
|---|---|---|---|
| PA-01 | Close RC1 Gate A | **APPROVED — NOT PASSED** | Close the RC1 attempt as unsuccessful against its unchanged seven exit criteria. Retain the criteria-level successes and limitations individually. Do not create a release tag or authorise transfer. |
| PA-02 | Transition to a successor candidate | **OPTION B — separate RC2 Gate A** | RC1 is a completed historical attempt; RC2 requires a separate candidate identity, freeze, eligibility checks, independent evidence and Gate A decision. No RC1 evidence is inherited as proof that RC2 passes. |
| PA-03 | F-5: Uncaptured Governance Brief compression model calls | **BLOCK Criterion 6** | Governance provenance must cover the additional model-mediated compression steps. Do not weaken or narrow Criterion 6 relative to Advisory provenance. |
| PA-04 | F-6: Dashboard silently truncates Chair conditions/trade-offs | **BLOCK Criterion 7** | Correct material content loss and verify the presentation against preserved RC1 outputs. |
| PA-05 | F-7: Dashboard doubles logical-finding counts | **BLOCK Criterion 7** | Correct the parsing/counting defect and verify each count from the corresponding recorded source. |
| PA-06 | F-8: Instruction-guard text displaces a governance finding | **BLOCK Criterion 7** | Prevent instruction residue from replacing substantive displayed findings; test the known absent-perspective failure. |
| PA-07 | F-9: Misattributed/unverified citation | **QUALIFIED ACCEPTANCE WITH DOCUMENTED CONTROL** | Maintain evidence-integrity limitation (including L-11); require explicit disclosure and independent source checking before institutional reliance. A new automated citation feature is **not** included in narrow RC2 scope. Qualification does not establish factual correctness. |
| PA-08 | RC2 preparation | **APPROVE NARROW REMEDIATION PLAN** | The original approval covered F-5–F-8. L-14 was additionally approved as PA-09 (now directly confirmed); L-24 is approved as PA-10. Register and pre-check a versioned synthetic fixture, use deterministic replay of RC1 outputs for F-6–F-8, then validate F-5 with a new live run; obtain independent review before any acceptance decision. |

### Additional Protocol Authority determinations — expressly confirmed

| ID | Decision | Approved disposition | Authority and boundary |
|---|---|---|---|
| PA-09 | Extend RC2 scope to correct L-14 source attribution | **APPROVED** — preserve Criteria 5 and 6; capture and verify actual per-file source commit under composite instruction pins | Earlier approval reported from Claude review conversation (~13:59 AEDT, 22 Nov 2026), **directly confirmed** in this conversation on 22 Nov 2026. |
| PA-10 | Extend RC2 scope to remediate L-24 export-delivery incompleteness | **APPROVED** — single, complete, independently verifiable export bundle including compression-event provenance, integrity inventory and rejection of missing/altered parts | Approved in this conversation on 22 Nov 2026. Engineering implementation and repository writes are separately controlled. |
| PA-11 | Interpret Gate A Criterion 4 | **APPROVED — NOT MET for RC1 by purposive interpretation.** Literal “documented and explicit” wording is satisfied, but the policy remains `PROPOSED — Protocol Authority review required`, and is not treated as operative without approval. | Explicit interpretation by Protocol Authority; **no text change to Criterion 4**. RC1's missing pre-run eligibility checks independently make that run ineligible for the synthetic transfer study. |
| PA-12 | Initiate version-specific synthetic-policy review | **APPROVED — review mandate only.** Review the exact policy bytes identified below, resolve the approval decision before registering RC2's fixture or beginning live evaluation, and record deferred implementation dependencies. | This is a Protocol Authority governance action, **not** an engineering “policy change” and **not** approval of the underlying policy. |
| PA-12a | Approve synthetic policy following PA-12 review | **NOT YET DECIDED** | Requires its own express Protocol Authority determination referencing the reviewed exact file version and effective date. Approval applies prospectively only. |

**PA-12 version identity for review:** `docs/GATE_A_SYNTHETIC_TEST_DATA_POLICY.md`, git blob `06328f266432`, SHA-256 `9e9d329349e488aea6654cad2b67c3675836bc973654562dbe818359eb3ca108`; last changed in commit `5996d0f`, and recorded unchanged at `91202fa`. Recompute the file hash before PA-12a; a changed file requires a new review and cannot inherit this approval request.

**PA-12 review and conditions to record:** For internal fully synthetic RC2 evaluation: fixture ID/version, prohibited-input screening, prompts/evidence/web settings, build and instruction identity, custodian and restricted storage, retention/review date. Before **first external run**: handling and incident procedure (§§7, 10), named custodian/contact and access controls, retention/deletion-review arrangements, provider/service terms and configuration, publication/sharing review. **De-identified-data use** requires its own separate governed protocol and pre-run eligibility determination; it is neither authorised by PA-12 nor necessary for internal RC2. Deferred external/de-identified requirements must remain visible in any eventual PA-12a decision and cannot be treated as implemented.

**Authority boundary:** No new criterion wording, waiver, or relaxation was authorised. No GitHub write, release tag, deployment, transfer, or RC2 freeze has been authorised by these decisions.

## 2. RC1 closure — each Gate A criterion separately

The exit conditions are those of `docs/GATE_A_ENTRY.md` §4. `NOT PASSED` is the overall **attempt outcome**, not a claim that all tests failed.

| # | Gate A exit criterion | RC1 status at closure | Evidence and qualification |
|---|---|---|---|
| 1 | Clean, versioned, tagged release build | **NOT MET** | Candidate SHA frozen; release-candidate tag never created. Prior conditional tag authorisation remains unexercised and is not a new authority to tag RC1 after closure. |
| 2 | `npm run validate` passes unmodified | **MET at candidate commit** | CI and clean local validation passed for `7649eb4` under its own suite. This is not a pass on a non-existent release tag. |
| 3 | Limitations register complete and accurate | **NOT MET** | L-24 exists as a reviewed draft; F-5–F-9 and new disclosure consequences not yet integrated and accepted in the register. Prior open limitations remain open unless separately disposed. |
| 4 | Synthetic-only test-data policy documented and explicit | **NOT MET — PA-11 purposive interpretation** | The literal criterion text (“documented and explicit”) is satisfied by the existing policy. Protocol Authority interprets the criterion purposively: `PROPOSED — Protocol Authority review required` is not an operative approved policy. **Policy approval is not evidenced for RC1.** Independently, the RC1 live run omitted §4 pre-run fixture/version and screening checks and is **NOT ELIGIBLE** for the synthetic transfer study. PA-12 authorises future review; PA-12a is pending and cannot retroactively change RC1. The prior Gate A and PR #93 status `MET` must be corrected in a separately authorised repository update. |
| 5 | Deployment provenance and instruction-pin verification pass on tagged build | **PARTIAL** | Candidate build and pin byte-equivalence evidence exist. RC1 was not deployed or release-tagged; L-14 source attribution is qualified/open. Byte matches do not prove actual instruction-source identity. |
| 6 | Governance provenance parity with Advisory benchmark | **NOT MET** | Official CLI verifier VALID, independently reproduced byte-identically; 13/13 stage records verified and two negative controls failed as expected. However, F-5 reveals additional Governance Brief compression model calls whose prompts, raw responses and attempts are outside the provenance chain; Advisory has no equivalent uncaptured compression step. L-14 and other registered boundaries persist. |
| 7 | Limitations intelligibly disclosed to competent non-builder | **NOT MET** | F-6 silent omission, F-7 incorrect counts and F-8 loss of a material absent-perspective finding undermine the operator-facing presentation. F-9 also requires a specific citation/evidence-quality control. Positive disclosures elsewhere do not cure these defects. |

**Final RC1 attempt disposition: GATE A NOT PASSED.** The RC1 result is not a release approval, Gate B entry, clinical validity claim or institutional-use endorsement.

## 3. RC1 run evidence: positive results preserved with boundaries

- The live CORE run identified 5 active Directors (Systems, Safety, Equity, Lived Experience, Digital) with 13 successful recorded stages.
- Original manifest, 13 stage JSON exports and Ledger are preserved in the review evidence bundle. The operator's verifier output and an independent verifier rerun matched byte-for-byte; reported verifier-output SHA-256: `bf0ceb6d388f38c995bf02b95638c3cb430bbddbbc687287e2246f40c884dfb5`.
- The independent review demonstrated sensitivity to missing stage records and modified Chair output (both correctly INVALID).
- First browser exports delivered only the manifest plus the first nine stage files; the final four stage exports were recovered using a targeted, recorded DevTools workaround. Original duplicates matched byte-for-byte. This is L-24 (export completeness risk), not evidence of missing runtime stages.
- Six UI-export stage texts (five Directors and the Chair) matched recorded transformed stage outputs exactly; Comparator displayed summary and coverage note matched in an independent visual comparison, **not** a complete character-exact comparison of the 40,288-character Comparator output. Other stages have not undergone complete UI parity checking.
- The verifier tests the implemented record/hash/source-byte checks; it does **not** prove truth of asserted facts, correct historical instruction-source attribution, complete transform replay, or capture of every model-mediated compression call.
- The live authority-repair check was exercised at Cross-Domain Tension Analysis. The second Chair repair-pass boundary was **NOT EXERCISED**, notwithstanding a static transform label.
- RC1 remains valuable as a fixed, demonstrably failure-provoking **defect-discovery and regression dataset**, not an eligible synthetic transfer-study result.

**Evidence sources:** `INDEPENDENT_REVIEW_DR-20261122-115931-4417e9.md` with Addenda A–C; independent verifier JSON; original run manifest/stages/Ledger; preserved screenshots; `GATE_A_CANDIDATE_RECORD.md`; `GATE_A_ENTRY.md`; validation protocol and synthetic-data policy. Historical original files and their checksums are to be stored without alteration.

## 4. RC1 synthetic-data and evidence-handling disposition

**Synthetic-run eligibility statement (adopted):**

> Operator-generated synthetic test scenario; no patient information or organisational case evidence supplied. Pre-run checks under policy §4 not completed; run **not eligible** for the synthetic transfer study. Retained as Gate A defect-discovery and regression evidence.

This statement describes the supplied scenario and known procedural defect; it is **not** an independently completed prohibited-data screen or approval. The governing policy explicitly bars retrospective eligible status when the pre-run checks were not done.

**Label:** The original exports carry `GOVERNANCE IN CONFIDENCE` and not the synthetic-evaluation notice required by policy §5. **Do not alter their bytes.** Apply `SYNTHETIC EVALUATION — NOT A LIVE CASE` and the RC1 ineligibility status to the **enclosing evidence index/package**, with original-label discrepancy recorded. All files remain evaluation artifacts, not live institutional records.

**Publication gate:** The project repository is public. No full prompt/response/provenance fixture is authorised for public commit by this decision. Before publication, carry out and record a dedicated review for prohibited/confidential content, secrets, licensing or proprietary instructions, and re-identification risk; identify custodian, access-controlled storage, evidence inventory, retention/review date and publication authoriser. A failed pattern scan alone is not proof that disclosure is safe.

**Provenance integrity:** Maintain unmodified originals, SHA-256 inventory, independent review notes and recovery deviation. Any public regression fixture should be a separately reviewed derivative, explicitly linked to preserved originals and with independently recorded hashes; do not silently replace originals.

## 5. RC2 preparation mandate — scope and acceptance design

**Identity:** `RC2` is a future candidate, with its own commit, freeze record, build identity, tested pins, configuration and independent Gate A evaluation. Do not treat `7649eb4` as RC2 or assign a tag now.

**Engineering scope expressly approved (PA-08):**

1. **F-5 compression provenance:** record and verify each model-mediated Governance Brief compression call (prompt/source identity, relevant settings, attempt/fallback state, raw response and final brief, transformations and hashes), and include these in the verifiable end-to-end chain in a manner comparable to Advisory provenance. Update verifier and negative controls; verify actual live capture/export. Exact schema and implementation require code review before adoption.
2. **F-6 silent truncation:** ensure each substantive Chair condition/trade-off is accurately represented; any bounded summary must explicitly show what is omitted and provide an accessible full source.
3. **F-7 count accuracy:** parse and count logical CDTA findings, not Markdown fragments. Verify displayed counts and lists against preserved source records.
4. **F-8 instruction residue:** prevent internal guard comments from being treated as governance findings or displacing absent perspectives in UI summaries; verify both underlying output handling and displayed summary.

**Additional engineering scope — PA-09 and PA-10 approved:**

5. **L-14 instruction-source attribution (PA-09):** update instruction-source capture and provenance verification to identify the *actual* per-file runtime source commit under composite pins. Matching source bytes at a different commit is not proof of actual origin. Independently verify source attribution with positive and negative tests, including equal-content/different-source cases. PA-09 is directly confirmed; actual implementation and verification remain outstanding.
6. **L-24 complete export delivery (PA-10):** provide a single complete, independently verifiable evidence download containing manifest, original stage records, compression events, ledger cross-check material as required, and an integrity inventory. The verifier must reject missing or modified components. A nested record schema may reduce file count, but must not obscure or drop model-call provenance. PA-10 is approved, but implementation and fresh validation remain outstanding.

**Not authorised as RC2 scope:** generalized citation-verification feature, rewriting Director reasoning, changing constitutional authority contracts, broad UI redesign, human comprehension study, substantive policy amendments or unrelated runtime enhancements. PA-12/PA-12a policy review and approval are governance actions, not RC2 engineering scope. F-9 is handled through documented disclosure and source-verification controls. Any material expansion needs a separately recorded Protocol Authority decision.

**Testing sequence:**

1. **Policy-approval dependency (not an engineering prerequisite):** PA-12 review and a separate PA-12a version-specific, prospective policy approval must be completed **before RC2 fixture registration and before the live integration run (step 5)**. This is **not** a prerequisite for RC2 engineering implementation or the deterministic/unit tests in steps 2–4. After PA-12a, register the fixture and complete the **pre-run** synthetic-policy checklist. Proposed identifier `GATEA-AITRIAGE-001`, version `1.0`, decision text exactly `Deploy AI triage screening across all emergency departments nationally`. The ID/version are proposals until actually registered; no approval is implied here. Record source/classification, screening, prompts/evidence/search settings, intended build/pins, custodian/location and review date. 
2. Preserve RC1 outputs as deterministic regression inputs. Execute F-6–F-8 tests against RC2 dashboard/presentation code without model calls; assert complete logical item counts, no silent loss, no guard-comment displacement, and meaningful incomplete-summary signalling if applicable.
3. Unit- and contract-test F-5's provenance capture, completeness, hash coverage, negative controls and verifier rejection of missing/altered compression events.
4. Re-freeze RC2 after authorised implementation and clean validation/build. Any change to frozen runtime/pins/build identity requires recorded restart/reverification.
5. Perform a **new, separately eligible** RC2 live Governance integration run only after the required pre-run checks; verify exported compression events end-to-end. **Under approved PA-09**, prove actual per-file instruction-source attribution rather than mere hash equivalence. **Under approved PA-10**, prove single-bundle completeness and independent verification without a browser-console workaround. Same decision text supports *structural* comparison, not deterministic equality of model answers. A clean model response without guard leakage does not by itself prove F-8 fixed.
6. Obtain an independent reviewer assessment of original exports, verifier, captured compression chain, UI/output correspondence, limitation disclosures and policy compliance. Apply the unchanged seven Gate A exit criteria on the RC2 build; none carries over automatically from RC1 as a pass.

**RC2 evaluation-artifact labels:** Required enclosing and produced artefacts: `SYNTHETIC EVALUATION — NOT A LIVE CASE` with fixture ID/version. Any remaining application-level label limitation must be captured and dispositioned, not hidden.

## 6. F-9 evidence-control disposition

F-9 is **qualified acceptance of a limitation**, **not a statement that citations or legal references are verified**, and not a blanket waiver of Criterion 7. For RC2's bounded evaluation, record clearly alongside outputs that web search was off/zero session evidence when applicable, that citations and legal/regulatory classifications may originate from model recall, and that authoritative sources must be checked independently before relying on the substantive claims. Maintain L-11; log the Kirubarajan citation defect and any subsequent verification or correction as an audit finding, not as an invisible replacement of original RC1 content. The precise operator-facing disclosure medium must be tested against Criterion 7; an outside note cannot be assumed to remedy materially misleading UI content.

## 7. Controls, dependencies and implementation authority

- **Scope authority:** PA-01–PA-12 approved by Protocol Authority; PA-09 directly confirmed in this conversation following its earlier Claude-conversation approval. PA-12a policy approval is **NOT GRANTED**. F-5–F-8, L-14, and L-24 are authorised remediation scope; this does not authorise implementation, repository writes or new release. No new criterion wording, waiver or relaxation is approved, especially no narrowing of Criterion 6.
- **Repository authority:** No GitHub write, commit, PR edit/merge, branch/tag creation or release/deployment is authorised by preparation of this document. Show an exact file-by-file proposed change list and obtain separate approval before modifying GitHub.
- **RC1 archive:** Close as NOT PASSED in a future authorised documentation change; preserve original evidence and record the current `GATE_A_ENTRY.md` status until the change is actually made.
- **RC2 freeze:** Authorised concept and scope only; no RC2 code, commit, candidate freeze, fixture approval, test execution or transfer is represented as completed here.
- **Policy interpretation and dependency:** PA-11 determines RC1 Criterion 4 **NOT MET by purposive interpretation**, notwithstanding that literal “documented and explicit” wording is met. PA-12 authorises a version-specific policy **review only**; PA-12a approval is a separate future act and a prerequisite to registering the RC2 fixture and executing the live RC2 evaluation. Original RC1 run remains ineligible. Correct the Gate A entry, PR #93 candidate record and closure table only through separately approved GitHub documentation edits; do not infer policy approval.
- **Open limitations:** L-05, L-09, L-11, L-14, L-24 and other pre-existing limitations stay open or qualified under their recorded statuses unless individually re-evaluated and authorised for closure.
- **Release status:** No tag, merge, transfer or deployment is approved. A later Gate A determination must review evidence from the exact RC2 build and retain the human Protocol Authority sign-off.

## 8. Pending administrative particulars (do not invent)

| Item | Status / required action |
|---|---|
| RC1 evidence archive path / access controls / custodian | TO BE RECORDED before external transfer or publication |
| Retention and deletion/review date | TO BE RECORDED under policy §5 |
| Public-fixture publication review | NOT PERFORMED; public commit prohibited until reviewed and expressly authorised |
| RC2 fixture ID/version | PROPOSED only; pre-run registration and checks pending |
| RC2 commit/branch/tag/model/build | NOT CREATED / NOT DETERMINED |
| RC1 closure entry in GitHub | NOT YET WRITTEN |
| Synthetic policy document `PROPOSED` status | PA-11 approved purposive RC1 NOT MET; PA-12 review authorised; **PA-12a approval pending** |
| L-14 source-attribution repair | PA-09 approved and directly confirmed here; implementation pending |
| L-24 single-bundle export repair | PA-10 approved; implementation pending |
| Independent review of this decision record | PENDING |

## 9. Sign-off and next approval

**Protocol Authority decisions PA-01 through PA-08:** Approved in this conversation dated 22 November 2026.  
**PA-09:** Approved previously (Claude review conversation, as reported by reviewer), and directly confirmed by Protocol Authority in this conversation on 22 November 2026.  
**PA-10:** Approved in this conversation, 22 November 2026.  
**PA-11:** Approved *purposive* interpretation; RC1 Criterion 4 NOT MET, 22 November 2026.  
**PA-12:** Formal version-specific policy review authorised, 22 November 2026. **No policy approval implied.**  
**PA-12a:** NOT DECIDED; review and prospective approval of hash-identified text remain outstanding.  
**Documentation author:** ChatGPT, prepared from the Protocol Authority's approvals and preserved evidence.  
**Repository disposition:** No changes made.  
**Next approval boundary:** Following independent review, present an exact file-by-file GitHub documentation change plan for separate approval. Do not implement RC2, amend PR #93, tag, merge or transfer without further authorisation. Policy approval PA-12a requires an independent, hash-specific Protocol Authority determination before fixture registration or live RC2 evaluation.

---

### Reference documents

- `docs/GATE_A_ENTRY.md`, §4 exit criteria; source checked on `docs/gate-a-candidate-record`.
- `docs/GATE_A_CANDIDATE_RECORD.md`, frozen candidate and prior sign-off; same branch.
- `docs/GATE_A_SYNTHETIC_TEST_DATA_POLICY.md`, §§4–5, 9–10; same branch.
- `docs/GATE_A_TRANSFER_CANDIDATE_VALIDATION_PROTOCOL.md`, §3 Governance capture/export inspection; DRAFT; same branch.
- `INDEPENDENT_REVIEW_DR-20261122-115931-4417e9.md` and Addenda A–C, provided by independent reviewer.
- `PHDSS_DR-20261122-115931-4417e9_*` original artifacts, independent verifier and screenshot evidence; held in current evaluation bundle, not committed here.

---

## 10. Repository implementation status addendum — 22 November 2026 (after PA-13)

**Purpose:** Preserve the exact substantive authority decisions from approved v0.5 above while recording later execution of **documentation-only** authority PA-13. Contemporaneous v0.5 statements such as “record prepared, not committed”, “no repository changes”, “future authorised documentation change” and “no GitHub write authorised” refer to the earlier **pre-PA-13** preparation state. They are superseded solely as statements about subsequent documentation implementation—not as a change to any PA-01–PA-12 determination, Gate A criterion or RC2 engineering boundary.

**PA-13 authority source:** Protocol Authority expressly replied `Approve PA-13` in the ChatGPT conversation on 22 November 2026 to the exact file-by-file PR #93 documentation change mandate. This permits reviewed documentation commits on the **existing draft PR #93 branch only**; each actual diff is subject to independent review. **No merge, tag, runtime/code/pin change, deployment, transfer, policy approval or RC2 engineering was authorised by PA-13.**

**Document source identity:** The substantive decision record preceding this addendum is reproduced from `PHDSS_RC1_RC2_Decision_Record_AUTHORISED_v0.5_2026-11-22.md` (source SHA-256 `157c0fca1c104db0c7018d6e9c024201799d86a69d69bdc80c73e70e969140cd`), prepared and authority-confirmed on 22 November 2026. This source-file hash identifies **v0.5 alone**, not the repository file including this addendum. No original RC1 evidence bytes are included or changed here.

**Documentation commits independently reviewed and accepted before adding this file:** `docs/GATE_A_CANDIDATE_RECORD.md` (closure and corrections), `docs/GATE_A_ENTRY.md` (RC1 status without changing seven exit criteria), `docs/LIMITATIONS_REGISTER.md` (L-24–L-28 and F-9 case; fixes reviewed), `docs/REPOSITORY_HANDOVER.md` (current status and priority corrections). The handover review was accepted at PR head `a66279fb8f815b3b33df3b8b824a2799237486c3`. No new decision or correction is implied by the inclusion of this note.

**Outstanding:** PA-12a remains **NOT APPROVED**. RC2 is not built, frozen, tagged, fixture-registered or live-tested; the seven criteria must be decided against an eligible new RC2 candidate. The publication review and Protocol Authority sign-off for the five previously public evidence files under `tests/evidence/gate-a/rc1-2026-11-22/` are **PENDING**. Independent review of this exact repository addition is also **PENDING**. Do not publish original RC1 run prompts/outputs or infer study eligibility from a passing stage verifier.

**Prepared for documentation commit by:** ChatGPT (OpenAI), under PA-13; **approval of substantive decisions:** Protocol Authority (not ChatGPT).

---

## 11. PA-22 drafting-provenance erratum and proposed policy amendment — 22 November 2026

**Nature:** Dated explanatory erratum; the historical PA-12 mandate and conditions above are **not rewritten**, rescinded or falsely represented as having originated in the policy text. **Authority:** PA-22 expressly approved by the Protocol Authority on 22 November 2026 for a two-file documentation-only amendment PR, subject to independent review. **PA-12a remains NOT APPROVED.**

**Correction of provenance:** During the PA-12 preparatory review, Claude (the independent AI reviewer) stated that the existing synthetic-data policy required a separate protocol for deliberately de-identified fixtures. Claude subsequently acknowledged that this was a **misreading**: the original `docs/GATE_A_SYNTHETIC_TEST_DATA_POLICY.md` at Git blob `06328f266432e1639441e29f4bc11785599e3cff`, SHA-256 `9e9d329349e488aea6654cad2b67c3675836bc973654562dbe818359eb3ca108`, permitted such fixtures under §§1–2 following a documented prospective Protocol Authority eligibility determination. Its §8 separately required a governed protocol for real institutional cases, leaving an ambiguity about whether derived, deliberately de-identified real-case fixtures counted as real-data use. The stricter PA-12 condition originated in the reviewer's interpretation, was then approved by the Protocol Authority, and was **not** a deliberate tightening of the original policy at that time.

**Prospective choice, separate from the erratum:** Following disclosure of that error and an explicit comparison of alternatives, the Protocol Authority approved **PA-22's amendment mandate**, deliberately choosing a **fully synthetic-only Gate A / first external transfer-study policy**. Invented scenarios informed by general professional knowledge remain permitted; fixtures adapted from or reconstructed around a **specific real case**, even if altered or de-identified, are not. Deliberately de-identified and other real-data use would need a separately authorised prospective protocol and eligibility determination. This is a **new, deliberate prospective policy choice**, not retroactive evidence about the original text's intended rule and not retrospective authorisation of RC1.

**Authorship/review qualification:** Original policy and validation-protocol drafting were collaborative with authorship not conclusively established; Protocol Authority recollects substantial personal input and possible ChatGPT assistance. Claude located evidence of earlier conceptual recommendation/commentary, but no conclusive record of drafting or independently reviewing the committed policy. ChatGPT's current clause review may be author-involved. Claude's challenge of the exact PA-22 amendment must be identified as cross-model scrutiny, **not certified author-independent review**.

**Version and status boundaries:** PA-22 authorises a **draft, two-file documentation-only PR** amending this erratum and the policy, plus independent exact-diff review. It **does not approve the revised policy**, approve PA-12a, authorise a merge or change, or grant RC2 engineering, fixture registration, live-run, tag, deployment, transfer or Gate A passage. The revised policy's approval status must be set **only by a later, separate Protocol Authority determination referencing its final exact SHA-256**; the policy does not self-certify approval. Both the prior policy hash above and the prospective new policy version must remain distinguishable.

**Related operational boundaries:** Before the first eligible internal live RC2 run, record a private incident-contact route/handling arrangement, fixture and prohibited-input checks, provider/service configuration when externally hosted services are used, restricted storage/custodian and retention review details. Approved policy version/decision must be referenced by transfer artefacts. Browser-held API-key exposure is a separate risk, not solved by this policy. PA-12a and formal validation-protocol adoption are separate decisions. Phase A deterministic engineering remains possible **only with separate engineering authorisation**, without awaiting PA-12a; fixture registration and Phase B live evaluation remain gated.
