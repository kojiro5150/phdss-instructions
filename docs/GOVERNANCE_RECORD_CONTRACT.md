# PHDSS v2.0 — Governance Record Contract

Status: runtime structural contract  
Contract version: `1.0.0`

## Purpose

The Governance Record is the board-readable representation of source-grounded PHDSS reasoning. This contract makes its previously implicit data shapes explicit and testable.

It does not alter the North Star:

- the reasoning record is the primary output;
- analytical authority terminates at adjudication;
- material tension remains available to human judgment.

Authority semantics remain defined by `docs/AUTHORITY_TAXONOMY.md` and `docs/AUTHORITY_LAYER_CONTRACTS.md`. This document defines structure, not authority.

## Contract layers

PHDSS currently carries three related record shapes.

### 1. Director Brief

The Director Brief serves two consumers:

- synthesis receives the technical fields;
- board-readable display receives the nested `governance_record`.

Required top-level fields:

`director`, `signal`, `confidence`, `core_judgment`, `critical_risks`, `assumptions`, `prerequisites`, `view_change_triggers`, `coverage_limit`, `regulatory_blockers`, `overflow_flags`, `governance_record`.

The nested `governance_record` requires:

`key_discovery`, `primary_tension`, `signal_rationale`, `room_should_discuss`, `most_likely_to_benefit`, `most_exposed_to_failure`, `non_negotiable_conditions`, `governance_implication`.

Director signals are structurally limited to `PROCEED`, `CAUTION`, `HALT`, or `FAILED`. They remain domain advisory signals, not institutional decisions.

### 2. Synthesis Brief

A synthesis brief is the structured board-readable extraction of one synthesis module.

Required fields:

`module`, `verdict_label`, `verdict`, `key_discovery`, `primary_tension`, `signal_rationale`, `room_should_discuss`, `most_likely_to_benefit`, `most_exposed_to_failure`, `non_negotiable_conditions`, `governance_implication`.

The `verdict_label` is contract-bound by module:

- Decision Surface Map → Dominant Signal
- Epistemic Confidence Audit → Epistemic Health Score
- Cross-Domain Tension Analysis → Integration Signal
- Reality Anchor → Operational Confidence
- Adversarial Probe → Probe Verdict
- Decision Stress Test → Fragility Score
- Chair Decision → Decision Brief Status

An optional `_fallback_reason` may be present on deterministic recovery output.

### 3. Board Governance Record

The display/export adapter maps Director or synthesis briefs into one board-readable shape:

`headlineLabel`, `headline`, `headlineColor`, `headlineRationale`, `keyDiscoveryLabel`, `keyDiscovery`, `primaryTension`, `roomShouldDiscuss`, `mostLikelyToBenefit`, `mostExposedToFailure`, `nonNegotiableConditions`, `governanceImplication`, `extractionFlags`.

This adapter shape is presentation-facing. It does not become a new source of governance reasoning.

## Validation boundary

The contract validates:

- required field presence;
- string versus string-array types;
- allowed Director signal/confidence vocabularies;
- exact synthesis module identity;
- exact synthesis verdict-label identity;
- board-record display shape.

The contract deliberately does **not** decide:

- whether a finding is substantively correct;
- whether evidence is sufficient;
- whether a condition is justified;
- whether language crosses the adjudication boundary.

Those remain evidence, epistemic, and authority questions handled elsewhere.

## Compatibility rule

v1.0.0 formalises the JSON shapes already emitted by the recovered v2 runtime. It does not add a `contract_version` field to generated records and therefore does not alter the existing runtime JSON payload.

A future breaking field change requires:

1. a contract version increment;
2. fixture changes;
3. migration handling for existing ledger/runtime records;
4. explicit review against the authority contract.

## Governance activation policy

Director activation rules are not registry data. They live in `src/governance-rules.js`, separate from `src/registry.js`, so CORE and CHAIR_SPECIFIED participation policy is explicit and independently reviewable.
