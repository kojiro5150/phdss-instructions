# PHDSS Live Replay Gate: CI Design Specification

> **NON-OPERATIVE DRAFT.** This document describes a proposed assurance gate. Nothing in it is implemented, enforced or wired into CI. It changes no runtime behaviour, no instruction pins and no deployment. Final acceptance of this specification is pending review.

Repository baseline: `main` at `57d8283`.

## 0. Decision record (20 Oct 2026)

| Field | Decision |
|---|---|
| Design direction | Approved |
| Docs-only PR | Authorised |
| Live CI implementation | Not yet authorised |
| Director and synthesis replay expansion | Separate architecture decision |
| Production deployment | Unchanged |
| Gate A | Remains open pending its own evidence |
| Final specification acceptance | Pending document review |

**Governing principle.** An assurance result is scoped to the exact configuration, evidence and execution path it actually tested. It confers nothing on any configuration, evidence or path it did not test. This principle is intended to apply across PHDSS, MHSI and JARVIS.

## 1. Purpose and claims boundary

The live replay gate tests one claim: **the effective instruction set proposed for promotion produces model behaviour within defined bounds on a frozen corpus, compared with the effective instruction set currently promoted.**

It does not establish:

- that PHDSS is reproducible or its provenance verifiable (Gate A establishes that, separately);
- clinical validity, participatory legitimacy or institutional authority;
- that a passing change is acceptable for governance use.

Gate A and this gate share no workflow, job or status check. Neither result may be cited as evidence for the other.

## 2. Verified repository state (inspected 20 Oct 2026)

| Finding | Consequence for design |
|---|---|
| Existing CI runs on instruction `.md` changes. All checks are deterministic, and no secrets are present. | The deterministic stage already exists. The live stage is new. |
| The runtime loads instructions from jsDelivr at pinned commits in `src/runtime/instruction-loader.js`. | Editing a `.md` file changes nothing deployed. **The pin change is the promotion event.** |
| Pins are split: `lived.md` resolves at `INSTRUCTION_COMMIT`, while every other file resolves at `BASELINE_INSTRUCTION_COMMIT`. | The effective instruction set is a composite of two commits. It is not the content of any single commit or working tree. |
| `scripts/replay-stage.mjs` loads `chair.md` and `comparator.md` from the **working tree**, but records `INSTRUCTION_COMMIT` (the `lived.md` pin) as `replay_instruction_commit`. | Existing replay records can attribute results to a commit that did not supply the instructions actually evaluated. The gate must not inherit this. See §6, step 2. |
| Replay supports `--from chair\|comparator` only. | Only Chair and Comparator content can be live-evaluated. |
| One frozen calibration fixture exists (`DR-20260926-204324-a2e644`). Its comparator expectation is `NOT_TESTED_BILLING_FAILURE`. | There is no Comparator baseline. |
| All calls use `claude-sonnet-4-6` at temperature 0.8, with no `cache_control`. | Run-to-run variance is intrinsic. Repeated runs are required. |
| Deterministic assertors exist: `assessAuthorityBoundary` / `authorityBoundaryLeak`, `validate*GovernanceRecord`, `assessProvenanceMonotonicity`, participation classifier v3-2, and `scanLivedNegativeScope` (warning-only). | Phase 1 needs no model-based evaluator. |

## 3. Scope

**Phase 1.** Live evaluation of Chair and Comparator content within the effective instruction set.

**Phase 2 (separate architecture decision, not authorised here).** Replay of Director and synthesis entry stages.

**Excluded.** Prompt caching, temperature changes and model changes. Each is a separate experiment with its own baseline.

## 4. Result vocabulary

Each evaluation produces exactly one primary result. The five results are distinct and machine-readable. None may be mapped onto another.

| Result | Meaning | Eligible for automatic progression |
|---|---|---|
| `PASS` | Every changed file in the effective set was covered and evaluated against an established baseline. No invariant failures. No graded change requiring review. | **Yes, and only this result.** |
| `BLOCK` | A hard invariant failed in the candidate that did not fail in the baseline, or pin integrity failed (§6). | No |
| `REVIEW` | A graded behavioural change, or an invariant failure also present in the baseline (`REVIEW (pre-existing)`). A pre-existing failure is an inherited defect, not a successful result. | No |
| `NOT_COVERED` | At least one changed file in the effective set cannot be replayed (in Phase 1, any Director or synthesis file). | No |
| `NO_BASELINE` | A covered stage has no established baseline (in Phase 1, the Comparator). | No |

**Precedence.** When several conditions hold, report all of them in `decision.conditions` and set the primary result by this order: `BLOCK` > `NOT_COVERED` > `NO_BASELINE` > `REVIEW` > `PASS`. A run is `PASS` only if no other condition applies.

**Execution failures.** A budget abort or harness error yields `ABORTED`. This is an execution status, not an assurance result. It carries no evidential weight and is never eligible for progression.

**Fail closed on coverage.** `NOT_COVERED` can never become `PASS`. A promotion containing uncovered changes needs either a recorded human exception (§7) or stays unpromoted.

**No baseline fabrication.** The Comparator stays `NO_BASELINE` until a successful replay establishes a baseline that can be independently inspected. A baseline is established only by a recorded human decision that references the specific replay record and its output hashes. It is never inferred, defaulted or synthesised.

## 5. Threat model

| Threat | Control |
|---|---|
| Untrusted PR code exfiltrates the API key | The live stage never runs on `pull_request` or on fork code, and never uses `pull_request_target` to check out a PR head. Only same-repository commits are accepted, verified by SHA. |
| Key exposed in logs or artifacts | The key is injected only into the replay step's environment. Uploaded artifacts are restricted to an allowlist. A post-run scan fails the job if any `sk-ant-` pattern appears in logs or artifacts. |
| Runaway spend | Anthropic-side: a dedicated evaluation workspace and key, with a workspace spend limit and usage alerts (confirm current Anthropic Console options before setup). GitHub secrets control storage and injection only. They do not constrain API permissions or expenditure. CI-side: a hard call-budget abort (§10). |
| Credential reuse or compromise | The key is used for evaluation only and never for production or development. Rotate it on a schedule and on any suspected exposure. |
| Workflow tampering | Workflow definitions are taken from `main` only. Changes to the live workflow need their own reviewed PR. |
| Tested content differs from promoted content | Pin integrity checks (§6, step 2). |
| Model-side drift misread as an instruction effect | Baseline and candidate are re-run in the same job, interleaved. This reduces model-side variability; it does not eliminate it. |
| Gate output mistaken for authority | Every report carries the §1 claims boundary. Human exceptions are recorded separately and never converted into `PASS`. |

## 6. Replay protocol

1. **Resolve the effective sets.** Read both pin constants at the baseline ref (current `main`) and at the candidate ref. For every key in `INSTRUCTION_FILES`, resolve the file at the commit the runtime would use (`lived.md` at `INSTRUCTION_COMMIT`, all others at `BASELINE_INSTRUCTION_COMMIT`) using `git show <pin>:<file>`. Hash each file, and hash the ordered manifest of all files. This produces two effective-set manifests.
2. **Verify pin integrity.** The harness must evaluate content resolved from the candidate pins, **not the working tree**. Before execution, assert that the bytes passed to the model match the effective-set manifest hashes. Optionally, in the dry run, fetch each pinned file from jsDelivr and confirm its hash matches the git-resolved content. Any mismatch produces `BLOCK (pin_integrity)`. This requires changing `replay-stage.mjs` to accept resolved instruction content and record the true source commit for each file (an implementation item, not authorised here).
3. **Classify the diff.** Compare the two manifests file by file. Mark each changed file `COVERED` (chair, comparator) or `NOT_COVERED`. If any change is `NOT_COVERED`, record that condition. If every change is `NOT_COVERED`, stop with no API calls.
4. **Check baselines.** For each covered stage, confirm an established baseline record exists. If not, record `NO_BASELINE` for that stage. Execution may still run to gather evidence for a future baseline decision, but the result cannot be `PASS`.
5. **Execute.** For each covered fixture and stage, run baseline and candidate k times each, interleaved (B, C, B, C, ...). The initial k is 3. Temperature stays at 0.8.
6. **Capture.** Record raw and parsed outputs, authority-repair events, token usage, and the model identifier returned in each response.
7. **Assert.** Apply the deterministic assertors (§8) to every run.
8. **Decide and report.** Set the primary result and all conditions (§4), and attach the provenance record (§9) and the claims boundary.

## 7. Human exceptions

A human exception permits promotion despite a non-`PASS` result. It is recorded as a separate object attached to the evaluation record and contains:

- the approver;
- a timestamp;
- the exact primary result and conditions being excepted;
- the effective-set manifest hash it applies to;
- the stated reason.

The primary result remains unchanged. An exception applies only to the effective set whose hash it names. Any change to that set voids it.

## 8. Assertion criteria

**Hard invariants.** A candidate failure on any of these is `BLOCK`. If the baseline also fails the same invariant, the result is `REVIEW (pre-existing)` instead.

- Chair authority leak (`authorityBoundaryLeak`).
- Governance record contract validation failure.
- Provenance monotonicity regression (`assessProvenanceMonotonicity`).
- Participation non-substitution violation (participation classifier v3-2).

**Graded changes.** Any of these is `REVIEW`.

- A categorical change in a manifest `expected` field in a majority of candidate runs, where the baseline majority did not change.
- More frequent authority-repair events in candidate runs than in baseline runs.
- `scanLivedNegativeScope` warnings that appear in candidate runs but not in baseline runs.

**Statistical stance.** With k = 3, results are screening, not inference, and every report says so. Raise k only when measured variance and cost justify it.

**Model-based evaluation.** Excluded from Phase 1. If introduced later, it is advisory and labelled as model judgement. It is never the sole basis for `PASS`. Ambiguous semantic failures go to human adjudication.

## 9. Provenance schema (`live-replay-record.json`)

```json
{
  "schema_version": "live-replay-gate/0.1",
  "gate_claim": "bounded behavioural evidence for the named effective instruction set; not governance acceptance",
  "workflow": {"run_id": "", "workflow_sha": ""},
  "pins": {
    "baseline": {"ref": "", "INSTRUCTION_COMMIT": "", "BASELINE_INSTRUCTION_COMMIT": ""},
    "candidate": {"ref": "", "INSTRUCTION_COMMIT": "", "BASELINE_INSTRUCTION_COMMIT": ""}
  },
  "effective_sets": {
    "baseline": {"manifest_sha256": "", "files": [{"key": "chair", "file": "chair.md", "source_commit": "", "sha256": ""}]},
    "candidate": {"manifest_sha256": "", "files": []}
  },
  "pin_integrity": {"evaluated_bytes_match_manifest": true, "cdn_crosscheck": "MATCH|MISMATCH|NOT_RUN"},
  "coverage": [{"file": "", "changed": true, "status": "COVERED|NOT_COVERED"}],
  "baselines": [{"stage": "comparator", "status": "ESTABLISHED|NO_BASELINE", "baseline_record_ref": null}],
  "model": {"requested": "claude-sonnet-4-6", "returned": [], "temperature": 0.8, "max_tokens": 16000},
  "fixtures": [{"fixture_id": "", "manifest_sha256": "", "entry_stage": ""}],
  "evaluation": {"assertor_versions": {}, "k": 3, "order": "interleaved"},
  "runs": [{"side": "baseline|candidate", "fixture_id": "", "stage": "", "run_index": 0,
            "started_at": "", "completed_at": "", "usage": {"input_tokens": 0, "output_tokens": 0},
            "api_calls": 0, "output_sha256": "", "assertions": {}}],
  "budget": {"call_ceiling": 0, "calls_used": 0},
  "execution_status": "COMPLETED|ABORTED",
  "decision": {
    "primary": "PASS|BLOCK|REVIEW|NOT_COVERED|NO_BASELINE",
    "conditions": [],
    "auto_progression_eligible": false
  },
  "human_exception": null
}
```

`auto_progression_eligible` is `true` only when `execution_status` is `COMPLETED` and `decision.primary` is `PASS`. `human_exception` never alters `decision`.

## 10. Cost ceiling

- **Baseline calls:** fixtures × covered stages × k × 2, plus a fixed retry allowance, because authority repair and transport retries can add calls.
- **Hard abort:** the harness counts calls and stops with `ABORTED` at the ceiling.
- **Setting the dollar ceiling:** only after the dry run produces a call estimate and one supervised calibration run measures real token use. Those measurements also feed the separate model-economics benchmark.
- **Corpus expansion:** only when measured cost per fixture and detection performance justify it.

## 11. Dry-run mode (no secret required)

The dry run executes on every relevant PR. It:

1. resolves both effective sets and verifies pin integrity, including the optional CDN cross-check;
2. validates fixture manifests and ledgers;
3. classifies coverage and baseline status;
4. emits the replay plan and the call-budget estimate;
5. **self-tests the assertors** against recorded artifacts and against mutation cases: injected Chair determination language, a stripped provenance field, implied-participation text, and a tampered instruction byte that must trigger `BLOCK (pin_integrity)`. Any undetected mutation fails the dry run;
6. validates the provenance record shape using a synthetic run.

## 12. Rollback

- **The gate:** disable the workflow or revoke the evaluation key. Neither affects the deployed app or Gate A.
- **Instructions:** promotion is by pin change, so rollback is a pin revert.
- **Changing the gate's status:** making the gate a required status check is a separate, recorded decision.

## 13. Prerequisites before implementation

1. Authorisation of live CI implementation (not yet given).
2. Synthetic frozen ledgers to expand the corpus under `GATE_A_SYNTHETIC_TEST_DATA_POLICY.md`, including one with a completed Comparator stage.
3. A dedicated Anthropic evaluation workspace and key, with spend limit and alerts.
4. A GitHub Environment `live-eval` with a required reviewer and an environment-scoped secret. With a single maintainer, approval is a deliberate-action checkpoint, not independent review.
5. Confirmation of whether `claude-sonnet-4-6` resolves to a fixed snapshot. Record the returned identifier either way.

## 14. Open decisions

1. The initial value of k (proposed: 3).
2. Corpus expansion target and source scenarios.
3. Scheduling of the Phase 2 Director replay relative to the SSRN architecture note.
