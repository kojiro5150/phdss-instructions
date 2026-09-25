# PHDSS v2.0 — Fixture Schema

Status: fixture architecture contract  
Schema version: `1.0.0`  
Depends on: `docs/AUTHORITY_TAXONOMY.md`

## Purpose

PHDSS v2.0 requires behavioural fixtures strong enough to detect architectural regression without publishing Governance-in-Confidence source material.

A fixture must preserve enough structure to prove that the recovered and refactored runtime still:

- invokes the expected reasoning architecture;
- preserves signal distribution and material dissent;
- produces the expected synthesis stages and record shapes;
- preserves uncertainty, conditions, and pathway openness;
- maintains provenance;
- respects the constitutional authority boundary.

A fixture must not reproduce confidential decision content merely to make a test realistic.

This contract therefore separates fixture evidence into three classes:

1. **public structural fixtures** — non-sensitive observed runtime facts;
2. **synthetic semantic fixtures** — invented text used to test parsers and authority enforcement;
3. **private evidence manifests** — local-only mappings to the real Governance-in-Confidence artefacts from which structural observations were derived.

No single fixture class is sufficient on its own.

---

## 1. Fixture principles

### 1.1 Preserve behaviour, not confidential prose

Public fixtures preserve architectural behaviour and output shape.

They must not contain:

- original decision text;
- organisational context from a confidential run;
- Director prose;
- synthesis prose;
- Chair/Decision Brief prose;
- discussion questions;
- conditions copied verbatim from the source run;
- affected-group descriptions copied from the source run;
- source filenames or identifiers that expose confidential case details unnecessarily.

### 1.2 Preserve defects as observations, not parity requirements

A historical run may contain behaviour that v2 is explicitly intended to repair.

Such behaviour must be recorded under `known_defects`, with `preserve: false`.

A regression test must never require a known defect to remain present merely because it occurred in the reference run.

### 1.3 Synthetic text tests semantics

Authority enforcement cannot be validated from abstract signal counts alone.

Synthetic fixtures must therefore contain invented statements that distinguish:

- legitimate strong constraint reporting;
- legitimate pathway comparison;
- legitimate signal reporting;
- legitimate uncertainty;
- adjudicative selection;
- adjudicative ranking;
- adjudicative resolution;
- unsupported foreclosure.

Synthetic cases must not be paraphrases of confidential source text.

### 1.4 Private evidence remains available for audit

The real source artefacts remain the evidentiary basis for the fixture.

A local-only manifest may map opaque fixture observations to:

- exact source filenames;
- source run identifier;
- artifact type;
- cryptographic hash;
- local path;
- notes on the observation derived from the artifact.

That manifest is never committed.

### 1.5 Fixture identity is opaque

Public fixtures use an opaque fixture identifier such as:

`core-live-2026-09-25-b`

They do not require the original Decision ID.

---

## 2. Directory contract

Tracked:

```text
tests/
  fixtures/
    public/
      <fixture-id>.structural.json
    synthetic/
      authority-cases.json
    README.md
```

Never tracked:

```text
tests/
  fixtures/
    private/
      <fixture-id>.manifest.json
```

The entire `tests/fixtures/private/` path must be gitignored before any private manifest is written.

---

## 3. Public structural fixture schema

A public structural fixture contains only non-sensitive runtime facts.

Canonical shape:

```json
{
  "fixture_schema_version": "1.0.0",
  "fixture_id": "core-live-2026-09-25-b",
  "fixture_class": "public_structural",
  "source": {
    "deployment_ref": "gh-pages",
    "deployment_commit": "<sha>",
    "instruction_commit": "<sha>",
    "observed_date": "2026-09-25",
    "source_classification": "GOVERNANCE_IN_CONFIDENCE",
    "contains_source_prose": false
  },
  "run_contract": {
    "mode": "CORE",
    "registry_size": 13,
    "coverage_count": 5,
    "active_directors": [],
    "omitted_directors": [],
    "signal_distribution": {
      "PROCEED": 0,
      "CAUTION": 0,
      "HALT": 0
    }
  },
  "synthesis_contract": {
    "modules_expected": [],
    "stress": {
      "ran": true,
      "trigger_class": "<generic-class>",
      "fragility_score": null
    },
    "epistemic_score": "<enum>",
    "probe_verdict": "<enum>",
    "decision_brief_status_class": "<enum>"
  },
  "view_contract": {
    "technical_view_expected": true,
    "governance_record_view_expected": true,
    "exports_expected": []
  },
  "record_shape": {
    "director_governance_record_sections": [],
    "synthesis_governance_record_sections": {},
    "chair_sections": []
  },
  "ledger_contract": {
    "schema_version_observed": "<version>",
    "required_fields_observed": [],
    "provenance_gaps_observed": []
  },
  "authority_observations": {
    "constitutional_contract_version": "1.0.0",
    "known_defects": []
  }
}
```

### Required public fields

Every public structural fixture must contain:

- `fixture_schema_version`;
- `fixture_id`;
- `fixture_class`;
- deployment commit;
- instruction commit where known;
- mode;
- registry size;
- active Director identifiers;
- omitted Director identifiers;
- signal distribution;
- expected synthesis modules;
- stress execution state;
- Epistemic score;
- Probe verdict;
- Decision Brief status **class**, not prose;
- technical/governance-record view expectations;
- export expectations;
- observed ledger schema;
- known defects.

### Decision Brief status class

The public fixture records semantic class only.

Initial v2 classes:

- `COMPLETE`
- `COMPLETE_PARTIAL_EVIDENCE`
- `INCOMPLETE`
- `UNKNOWN_LEGACY`

It must not copy the full Decision Brief Status text from a confidential run.

### Generic stress trigger class

A public fixture may record a non-sensitive trigger category such as:

- `emergency_domain`
- `high_harm_domain`
- `explicit_stress_request`
- `other_deterministic_rule`

It must not reproduce the confidential decision sentence that triggered the gate.

---

## 4. Record-shape fixtures

Structural fixtures may preserve section names because section presence is part of the runtime contract.

Example Director Governance Record section keys:

```json
[
  "key_discovery",
  "primary_tension",
  "signal",
  "signal_rationale",
  "room_should_discuss",
  "most_likely_to_benefit",
  "most_exposed_to_failure",
  "non_negotiable_conditions",
  "governance_implication"
]
```

Synthesis records may have layer-specific signal fields, for example:

- Surface Map: `dominant_signal`;
- Epistemic Audit: `epistemic_health_score`;
- META: `integration_signal`;
- Reality Anchor: `operational_confidence`;
- Probe: `probe_verdict`;
- Stress Test: `fragility_score`;
- Chair: `decision_brief_status`.

The fixture records the presence and semantic role of these fields, not the confidential prose inside them.

---

## 5. Authority observation schema

Authority behaviour is recorded separately from ordinary parity behaviour.

Canonical known-defect shape:

```json
{
  "id": "AUTH-SURFACE-001",
  "layer": "surface_map",
  "class": "ADJUDICATION",
  "observed": true,
  "preserve": false,
  "description": "Reference run contained adjudicative pathway foreclosure in synthesis output."
}
```

Rules:

- `description` must be abstract and non-sensitive;
- do not quote the source sentence;
- `preserve` must be `false` for any constitutional violation;
- a repaired runtime is expected to differ from the historical fixture on these defects.

Known defects are evidence of the calibration arc, not requirements for behavioural preservation.

---

## 6. Synthetic authority fixture schema

Synthetic authority cases are invented examples used to test the semantic boundary defined by `AUTHORITY_TAXONOMY.md`.

Canonical shape:

```json
{
  "fixture_schema_version": "1.0.0",
  "fixture_class": "synthetic_authority",
  "cases": [
    {
      "id": "constraint-regulatory-001",
      "layer": "reality_anchor",
      "text": "Regulatory approval is required before this pathway is legally available.",
      "expected_classification": "CONSTRAINT",
      "expected_permitted": true,
      "reason_code": "EXTERNAL_CONSTRAINT_REPORTING"
    },
    {
      "id": "adjudication-selection-001",
      "layer": "chair",
      "text": "The institution should select pathway B.",
      "expected_classification": "ADJUDICATION",
      "expected_permitted": false,
      "reason_code": "PATHWAY_SELECTION"
    }
  ]
}
```

### Required semantic coverage

The synthetic corpus must eventually include at least one case for each of:

Permitted:
- finding;
- signal reporting;
- uncertainty;
- external constraint reporting;
- condition;
- pathway description;
- pathway comparison without ranking;
- unresolved tension;
- adversarial challenge.

Prohibited:
- pathway selection;
- pathway ranking;
- tension resolution;
- signal-to-decision conversion;
- unsupported pathway foreclosure;
- institutional approval;
- institutional rejection;
- institutional deferral;
- preferred-course declaration.

The same wording may produce different permission outcomes in different layers if the layer contracts differ.

---

## 7. Private evidence manifest schema

Private manifests are local-only audit artefacts.

Canonical shape:

```json
{
  "fixture_schema_version": "1.0.0",
  "fixture_id": "core-live-2026-09-25-b",
  "fixture_class": "private_evidence_manifest",
  "source_run_id": "<real-decision-id>",
  "classification": "GOVERNANCE_IN_CONFIDENCE",
  "artifacts": [
    {
      "artifact_id": "surface-map-technical",
      "artifact_type": "technical_analysis",
      "filename": "<real-filename>",
      "sha256": "<hash>",
      "local_path": "<local-path>",
      "supports_observations": []
    }
  ]
}
```

Private manifests may contain sensitive identifiers because they never leave the local evidence environment.

They must never be required for public CI.

---

## 8. Provenance model

The fixture architecture deliberately separates two kinds of provenance.

### Public provenance

Sufficient to establish which deployed runtime and instruction set the fixture describes:

- deployment branch/ref;
- deployment commit;
- instruction commit;
- fixture observation date;
- fixture schema version.

### Private provenance

Sufficient to audit the exact evidence behind each observation:

- source run ID;
- exact artifact filename;
- artifact hash;
- local path;
- mapping from artifact to observation.

Public CI validates runtime behaviour.

Private evidence validates that the public fixture was honestly derived.

---

## 9. Fixture validation rules

A public fixture is invalid if it:

- contains copied confidential prose;
- contains the original decision question;
- contains confidential organisational context;
- lacks deployment provenance;
- omits signal distribution;
- collapses known defects into expected behaviour;
- treats signal counts as a decision;
- stores full Decision Brief Status prose rather than a status class.

A synthetic authority fixture is invalid if it:

- copies or lightly paraphrases Governance-in-Confidence source text;
- relies only on prohibited keywords rather than semantic categories;
- lacks both permitted strong-language cases and prohibited adjudication cases.

A private manifest is invalid if it:

- is tracked by Git;
- is required for public CI;
- omits cryptographic hashes for source artifacts.

---

## 10. Relationship to parity

Fixture parity has three levels.

### Structural parity

The runtime invokes the expected architecture and preserves:

- Director set;
- signal distribution;
- synthesis stages;
- view availability;
- export paths;
- ledger fields;
- record shapes.

### Semantic parity

The runtime preserves the meaning required by the architecture:

- dissent remains visible;
- uncertainty remains visible;
- constraints remain distinguishable from decisions;
- pathways remain open unless independently constrained;
- material tensions are not silently resolved.

### Authority parity

The runtime obeys `AUTHORITY_TAXONOMY.md`:

- analytical authority terminates at adjudication;
- strong constraint language is not falsely blocked;
- adjudicative selection, ranking, resolution, and unsupported foreclosure are blocked or repaired.

A v2 refactor is behaviour-preserving only when all three levels hold.

---

## 11. Initial fixture sequence

After this schema is committed:

1. gitignore `tests/fixtures/private/`;
2. create `tests/fixtures/README.md`;
3. capture the 25 September CORE reference run as a public structural fixture without source prose;
4. create the first synthetic authority cases;
5. create a private evidence manifest locally only if needed for audit;
6. define per-layer authority contracts;
7. only then implement contract-aware runtime enforcement.

---

## 12. Schema change rule

Any change to fixture meaning requires an explicit `fixture_schema_version` change.

Additive optional fields may increment the minor version.

Breaking semantic changes require a major version increment.

Historical fixtures must remain interpretable under the schema version they declare.
