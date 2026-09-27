# PHDSS Governance Provenance Manifest — Schema Contract

**Status:** Normative design contract for Governance provenance hardening  
**Scope:** Governance-mode model invocations and run-level provenance  
**Schema family:** `phdss.governance-provenance.v1`

---

## 1. Purpose

Governance mode has materially more moving parts than Advisory mode. A single flat request sidecar is therefore insufficient for forensic reconstruction of a Governance run.

The provenance design MUST support both:

1. **run-level reconstruction** — which build, instruction state, model configuration, evidence state, active Directors, stages, and outputs constituted the Governance run; and
2. **stage-level isolation** — a specific Director or synthesis stage, especially the Chair, can be independently inspected as a bounded request/output evidence object.

The architecture is therefore:

> **One top-level run manifest referencing one provenance record per model stage.**

The manifest MUST NOT collapse all stage prompts and outputs into one aggregate hash.

---

## 2. Constitutional reason for stage granularity

The Chair boundary is independently governed and independently testable.

Chair authority enforcement, repair, and fail-closed behaviour occur at the Chair boundary rather than at the Governance run as an undifferentiated whole.

Accordingly:

> **The Chair request/output pair MUST be isolatable and verifiable on its own.**

The same structure applies to Directors and other synthesis stages so provenance is uniform rather than special-cased after the fact.

---

## 3. Top-level manifest

A Governance run exports one manifest with the schema:

~~~json
{
  "schema": "phdss.governance-provenance.v1",
  "decision_id": "DR-...",
  "run_type": "GOVERNANCE",
  "captured_at": "ISO-8601",
  "deployment_commit": "<git sha or UNRECORDED>",
  "instruction_commit": "<git sha>",
  "instruction_normalization_version": "trim_v1",
  "analysis_mode": "CORE | FULL | CHAIR_SPECIFIED",
  "model": "claude-sonnet-4-6",
  "model_settings": {
    "max_tokens": 16000,
    "temperature": 0.8,
    "auto_continue": true
  },
  "web_search": false,
  "public_web_search": false,
  "session_evidence_count": 0,
  "director_embedded_evidence_counts": {},
  "active_directors": [],
  "omitted_directors": [],
  "stages": [],
  "final_ledger_sha256": "<sha256 or null>"
}
~~~

The manifest is the run index. It is not a substitute for stage records.

---

## 4. Stage record

Each model-bearing stage produces a separate record.

~~~json
{
  "schema": "phdss.governance-stage-provenance.v1",
  "decision_id": "DR-...",
  "run_type": "GOVERNANCE",
  "stage_id": "chair",
  "stage_kind": "director | synthesis | comparator",
  "director_id": null,
  "captured_at": "ISO-8601",
  "deployment_commit": "<git sha or UNRECORDED>",
  "instruction_commit": "<git sha>",
  "instruction_files": ["chair.md"],
  "instruction_normalization_version": "trim_v1",
  "instruction_runtime_sha256": ["<sha256>"],
  "model": "claude-sonnet-4-6",
  "model_settings": {
    "max_tokens": 16000,
    "temperature": 0.8,
    "auto_continue": true
  },
  "web_search": false,
  "system_prompt_sha256": "<sha256>",
  "user_message_sha256": "<sha256>",
  "output_sha256": "<sha256>",
  "status": "success | failed | skipped",
  "authority_repair": {
    "required": false,
    "attempt_count": 0,
    "outcome": "not_required | repaired | failed"
  }
}
~~~

Raw system prompt, user message, and output MAY be embedded or exported alongside the record. When embedded, their hashes MUST still be present.

---

## 5. Required stage coverage

The manifest MUST be able to reference records for:

### Directors

One record per invoked Director.

Stage ID format:

~~~text
director:<director_id>
~~~

Examples:

~~~text
director:lived
director:safety
director:measurement
~~~

### Synthesis stages

At minimum:

~~~text
surface_map
epistemic_audit
cross_domain_tension_analysis
reality_anchor
adversarial_probe
stress_test
chair
comparator
~~~

Skipped conditional stages MUST be represented as skipped rather than silently absent where the pipeline expected the stage.

---

## 6. Instruction provenance

Each stage record MUST identify the instruction file or files that materially contributed to its system prompt.

For a Director, this includes that Director's runtime instruction.

For synthesis stages, this includes the relevant synthesis instruction source.

Each instruction source MUST be tied to:

- `instruction_commit`;
- normalization version;
- normalized runtime content hash.

A stage record MUST NOT claim an instruction hash without identifying which instruction source it hashes.

---

## 7. Request provenance

For each model-bearing stage, provenance MUST be constructed **before the model call**.

At minimum capture:

- system prompt hash;
- user message hash;
- model;
- model settings;
- web-search state;
- instruction provenance;
- stage identity.

This prevents successful output generation from retroactively manufacturing request provenance.

---

## 8. Response provenance

After the stage completes, capture:

- final stage output hash;
- success/failure status;
- failure reason where applicable;
- authority-repair summary where applicable.

If the stage fails before an output exists, `output_sha256` is null and the failure remains visible.

---

## 9. Chair-specific requirements

The Chair stage record MUST remain independently exportable.

It MUST expose enough provenance to verify:

- exact Chair system prompt hash;
- exact Chair user-message hash;
- exact final Chair output hash;
- instruction source state;
- model/settings;
- web-search state;
- whether authority repair was required;
- repair attempt count;
- repair outcome.

If authority enforcement fails closed, the Chair record MUST remain preservable as a failed stage record.

The top-level manifest MUST NOT hide a failed Chair record merely because the overall run terminates or degrades.

---

## 10. Authority repair provenance

Authority repair is not a silent implementation detail.

Where a governed synthesis stage triggers authority repair, stage provenance MUST record:

- whether repair was required;
- initial violation reason where available;
- attempt count;
- final outcome;
- final violation reason if repair fails.

The record SHOULD preserve bounded offending-clause excerpts if already emitted by the authority telemetry.

The provenance layer MUST NOT rewrite the stage output in order to make provenance validation pass.

---

## 11. Retries and continuation

Transport retries and model continuation passes are distinguishable from governance-stage identity.

Version 1 of the schema treats the stage request as the logical Governance invocation and records the final logical output.

If future evaluation requires transport-level reconstruction, a later schema MAY add an `attempts` array.

That future extension MUST be prospective. It MUST NOT silently reinterpret v1 records as transport-complete traces.

---

## 12. Hash requirements

Hashes use SHA-256 over exact UTF-8 strings.

For instruction content, normalization MUST be declared. Current expected normalization is:

~~~text
trim_v1
~~~

No hash may be treated as comparable unless its byte-normalization rule is known.

---

## 13. Fail-closed verifier requirements

A Governance provenance verifier MUST reject a record when any required invariant fails.

At minimum verify:

- supported schema version;
- decision ID consistency;
- deployment commit supplied externally matches the record when an expected deployment SHA is provided;
- instruction commit matches the expected runtime pin;
- declared instruction source exists at that commit;
- normalized instruction hash matches captured runtime content;
- system prompt hash matches supplied system prompt;
- user-message hash matches supplied user message;
- output hash matches supplied output;
- stage identity is valid;
- Chair stage includes authority-repair metadata;
- manifest stage references correspond to actual stage records.

A mismatch is **invalid provenance evidence**, not a warning.

---

## 14. Export model

A Governance run SHOULD export:

~~~text
PHDSS_<decision_id>_governance_manifest.json
PHDSS_<decision_id>_director_<id>_request.json
PHDSS_<decision_id>_<stage>_request.json
...
~~~

The exact filename convention may change without changing schema semantics.

The Chair record MUST be directly identifiable.

---

## 15. Relationship to the Decision Ledger

The Decision Ledger and provenance manifest serve different purposes.

The Ledger is the governance record.

The provenance manifest is chain-of-custody evidence about how that record was produced.

The manifest SHOULD include the final Ledger SHA-256, but the Ledger MUST NOT be treated as a substitute for stage provenance.

---

## 16. Relationship to Advisory provenance

Governance provenance is intended to reach **equivalent evidentiary strength**, not necessarily identical structure, to Advisory request provenance.

Advisory has a single primary Director invocation.

Governance has multiple Directors and multiple synthesis stages.

Therefore Governance uses:

> **run manifest + per-stage records**

rather than flattening the run into a single Advisory-style sidecar.

---

## 17. Versioning rule

This schema is prospective.

Existing historical Governance runs are not retroactively declared provenance-verified merely because their outputs or Ledger records still exist.

The first Governance run generated after implementation and validated against this contract becomes the first eligible live provenance proof.

---

## 18. Earned claim after implementation

Passing deterministic schema tests alone earns only:

> **Governance provenance capture and verification are implemented at the code level.**

A successful live Governance run with independently verified hashes is required before claiming:

> **Governance provenance has been demonstrated on a live runtime execution.**

