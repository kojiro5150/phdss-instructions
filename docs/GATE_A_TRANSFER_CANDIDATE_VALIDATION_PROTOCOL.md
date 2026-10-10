# Gate A — Transfer Candidate Manifest and Validation Protocol (proposed)

**Status:** DRAFT — procedure only; no transfer candidate frozen, no test execution evidenced, no tag authorised
**Scope:** Gate A release identification, validation and Governance provenance capture/export integration
**Authority:** `docs/GATE_A_ENTRY.md` §§2–4; `docs/V3_TRANSFER_READINESS_AND_INDEPENDENT_EVALUATION_ROADMAP.md` §§9–14; `docs/LIMITATIONS_REGISTER.md` L-09/L-12
**Data:** `docs/GATE_A_SYNTHETIC_TEST_DATA_POLICY.md` applies to any test input

This document is a proposed repeatable procedure, **not a completed validation report**. A green deterministic suite alone does not prove Governance provenance parity, behavioural reliability, operator independence, or Gate A exit. Record observations and links to retained evidence; do not backfill results from expectations.

## 1. Candidate identity and release manifest

Complete this manifest **after** the proposed candidate commit and scope are selected, **before** executing its candidate validation. Do not invent values.

| Field | Recorded value / evidence |
|---|---|
| Candidate identifier | PENDING |
| Repository commit (full SHA) | PENDING |
| Branch and clean checkout proof | PENDING |
| Runtime instruction commit (read from loader) | `22b662999e01462fc4008446885a38df2cf735ad` — reconfirm on candidate |
| Instruction file count/hash verification | PENDING |
| Package-lock state (present/absent/tracked/untracked, exact identity if present) | PENDING |
| Node and npm versions, OS, environment | PENDING |
| Deployment/build commit and build timestamp | PENDING |
| Model, model settings and provider/runtime configuration | PENDING — derive from actual candidate, do not infer from this document |
| Validation command | `npm run validate` |
| Validation output, timestamp, disposition | PENDING |
| Build command, output, timestamp, disposition | `npm run build` — PENDING |
| Governance integration fixture/run and export evidence | PENDING |
| Known limitations and policy | `docs/LIMITATIONS_REGISTER.md`; `docs/GATE_A_SYNTHETIC_TEST_DATA_POLICY.md` |
| Operator-facing version and release tag | NOT YET CREATED |
| Protocol Authority disposition | PENDING |

Record the **actual** package-lock state. An untracked local `package-lock.json` warning is not itself a repository defect and does not authorise unrelated housekeeping. Record whether the candidate's dependency resolution is reproducible; do not silently assume a lockfile exists.

## 2. Candidate validation sequence

1. **Scope check:** Confirm the proposed commit contains all intended Gate A changes, approved policy/register, and UI disclosures. Identify any unresolved blocking changes before freeze.
2. **Clean environment:** Check out the **exact full candidate SHA** in a clean worktree or fresh clone. Capture `git rev-parse HEAD`, `git status --porcelain`, `node --version`, `npm --version`, and the package-lock identity. Record the dependency installation command and result; do not substitute a local dirty tree.
3. **Deterministic validation:** Run `npm run validate` at the candidate SHA; retain complete logs, exit code, timestamp and environment. A failed command is FAIL pending investigation or explicit accepted exception; do not label it PASS.
4. **Build and deployment identity:** Run `npm run build`; retain logs and generated provenance/build identity. Verify the built artefact points to the intended deployment commit and the immutable instruction pin. Record any mismatch.
5. **Governance end-to-end integration:** Perform the separate procedure in §3 using only approved synthetic/de-identified fixtures. A unit verifier or handcrafted sidecar alone does **not** satisfy this step.
6. **UI disclosure:** Inspect the actual candidate UI and export surface for intelligible disclosure of L-01/L-02/L-03/L-04/L-07/L-09 and relevant transfer limitations. Record screenshots or other traceable evidence and gaps. Do not assume repository text is visible to operators.
7. **Disposition:** Record each test as PASS, FAIL, BLOCKED, or NOT RUN, with evidence links and reviewer. Update L-09/L-12 or add new limitations for confirmed findings. Distinguish accepted limitations from unmet Gate A requirements.
8. **Freeze and tag:** Only after candidate validation and Protocol Authority review, create an immutable release tag pointing at the **validated exact SHA**. Re-check the tag target and re-run/verify the canonical validation at the tagged commit; record evidence separately. If the tag or content differs, restart candidate validation. Do not tag in this documentation PR.
9. **Gate A exit:** Compare evidence against **all seven** `docs/GATE_A_ENTRY.md` §4 criteria. A separate explicit Gate A exit decision is required; no automatic promotion to Gate B.

GitHub CI, local deterministic validation, browser integration and external operator testing are **different evidence classes**. Record each separately.

## 3. Governance v2 provenance capture/export integration — required live-path test

**Purpose:** Confirm that the actual Governance application path captures and exports provenance adequate for a third-party evaluator to trace a request/output pair to the declared runtime state. This is not satisfied by `test/verify-governance-provenance-v2.mjs` alone.

**Preconditions:** Use an eligible synthetic fixture with recorded ID and pre-run eligibility. Capture exact deployment/build SHA, instruction pin, provider/model settings, web-search state, fixture ID and evaluation operator. If model-provider access, a functioning app, or export access is unavailable, mark **BLOCKED/NOT RUN**; do not substitute mocked output and claim live integration PASS.

**Procedure:**

1. Start the exact candidate build or deployed candidate identified in §1. Capture application version/build provenance before input.
2. Run a **GOVERNANCE** decision using the pre-approved synthetic fixture through the actual user-facing runtime. Record decision ID, run mode, enabled Directors, relevant settings and whether any stage retries or authority repairs occur. Do not deliberately induce real-data exposure.
3. After the GOVERNANCE-mode run completes, open the **Ledger** tab and click **Export Provenance** (not **Export JSON**, which exports the decision ledger). The provenance button appears when the Governance provenance manifest is available. Export the actual Governance artefacts through this product path, including the Governance manifest and individual stage request JSON files; separately use **Export JSON** if the decision ledger is required. Preserve the unmodified exports, export time and hashes in the evaluation evidence store. If a required artefact is not exposed, record that as a finding rather than reconstructing it manually.
4. Inspect the manifest and relevant stage records for: run type; decision ID; deployment commit; instruction commit, files, normalisation and hashes; system/user prompt text or hashes; model/settings; search state; evidence counts; stage/output identifiers and hashes; stage status; authority-repair metadata; `raw_output`, `raw_output_sha256`, `output_transform`, `output_capture_stage`, `output`, `output_sha256` where applicable. Record fields that are absent, null or not independently verifiable.
5. The browser's **Export Provenance** action downloads the manifest and individual stage JSON files, not a ready-made stages directory. Create a dedicated directory and place **only the downloaded stage JSON files for this run** in it; keep the manifest outside that directory. Run the standalone CLI verifier from the **same repository commit** using `node scripts/verify-governance-provenance-v2.mjs <manifest.json> <stages-dir> <expected-deployment-sha>` (replace placeholders with actual paths and the recorded deployment SHA). The `test/verify-governance-provenance-v2.mjs` file is a regression test, **not** this CLI. If an exported ledger JSON is available, optionally pass the CLI's further arguments `[repo-slug] [ledger.json]` to cross-check `final_ledger_sha256`; otherwise record ledger verification as **NOT_CHECKED**, not PASS. Independently recompute hashes of the **exported** raw and final text, and compare exported manifest references to the corresponding stage artefacts and decision ID. Do not infer a replayable transformation merely because both hashes match.
6. Confirm that the output seen in the UI corresponds to the exported output; inspect failed/skipped stages if present. For any retry/repair, explicitly assess L-09's known uncaptured intermediate-response boundaries. If not exercised, record **NOT EXERCISED**, not PASS.
7. Have a reviewer who did not generate the run inspect the preserved request/output/export pair and determine whether the declared runtime state can be independently identified **without verbal developer explanation**. Record ambiguities and evidence gaps. This reviewer check is not the Gate C stranger-run study.
8. Assign an evidence-backed disposition against roadmap §10. **Do not declare parity** if the export chain is missing required information or only internal runtime objects (not actual exports) were inspected.

**Evidence bundle:** Fixture eligibility record; candidate SHA and build identity; operator/time/environment; full logs; original export files with SHA-256; field/hash comparison; screenshot of UI/output where appropriate; independent review and disposition; documented limitations. Protect artefacts under the synthetic test-data policy. Record repository/custodian/retention arrangement before external runs.

**Interpretation boundary:** `phdss.governance-stage-provenance.v2` records initial raw response and final output with internally verifiable hashes. It does **not** prove `output_transform(raw_output) = output`, nor individually preserve every epistemic retry or second Chair authority-repair response (L-09). Gate A.1 remains **PARTIAL** until actual capture/export evidence is reviewed; even a successful integration run does not erase these accepted structural limits.

## 4. Results record (fill after execution)

| Check | Status | Evidence location | Reviewer / date | Finding / accepted exception |
|---|---|---|---|---|
| Candidate identity and clean checkout | NOT RUN | — | — | — |
| Dependency installation and lock state | NOT RUN | — | — | — |
| `npm run validate` | NOT RUN | — | — | — |
| `npm run build` and deployment identity | NOT RUN | — | — | — |
| Actual Governance v2 capture/export integration | NOT RUN | — | — | — |
| Independent export-chain review | NOT RUN | — | — | — |
| UI limitations disclosure | NOT RUN | — | — | — |
| Tagged commit re-verification | NOT RUN | — | — | — |
| Gate A exit review | NOT RUN | — | — | — |

**Stop/restart rule:** Any changed runtime, instruction, model configuration or build artefact that breaks the frozen identity requires a recorded restart and appropriate revalidation. An inability to produce evidence is not a PASS.

## 5. Independent review before adopting this procedure

Ask the reviewer to check that the actual application **exposes** the exports and fields requested above, that each check is executable by a competent person, and that the protocol does not silently treat unit verification as end-to-end provenance parity. Flag any undocumented export pathway, environment prerequisite or fixture-handling assumption. Return PASS / CONDITIONAL PASS / FAIL with minimal corrections. **No runtime implementation or release tag is authorised by this document.**
