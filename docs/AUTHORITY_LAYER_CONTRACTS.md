# PHDSS v2.0 — Per-Layer Authority Contracts

Status: constitutional layer contract  
Depends on:
- `docs/AUTHORITY_TAXONOMY.md`
- `docs/FIXTURE_SCHEMA.md`

## Purpose

This document applies the PHDSS constitutional authority invariants to each synthesis layer.

Every layer is defined through three contract blocks:

- `OBLIGATED_TO_SURFACE`
- `PERMITTED_TO_CHARACTERISE`
- `PROHIBITED_FROM_ADJUDICATING`

The shared constitutional test is:

> Has this layer moved from characterising the decision space to resolving the decision space?

If yes, the output has crossed into adjudication unless it is faithfully reporting an independently established external constraint whose applicability is evidenced.

## Shared rules

All synthesis layers MAY:
- report source-grounded findings;
- report their own defined signal or score;
- expose uncertainty;
- name conditions;
- describe candidate pathways;
- compare pathways without ranking;
- identify external constraints;
- preserve disagreement and unresolved tension.

All synthesis layers MUST NOT:
- select a pathway for the institution;
- rank pathways into a preferred ordering;
- turn Director signal counts into a decision;
- convert analytical convergence into approval, rejection, deferral, or adoption;
- erase a material tension merely to create closure;
- claim institutional authority.

A layer may state that a pathway is unavailable when that conclusion follows directly from an independently established law, regulation, physical impossibility, verified technical dependency, or pre-specified authoritative safety rule. The source of that constraint must remain visible.

---

## 1. Decision Surface Map

### OBLIGATED_TO_SURFACE
- exact received Director signal distribution;
- convergence and divergence zones;
- material conflict zones;
- trade-off axes;
- fragility hotspots;
- coverage limitations;
- pathway-specific landscape differences where supported.

### PERMITTED_TO_CHARACTERISE
- whether signals converge or diverge;
- whether a signal is preliminary because coverage is partial;
- which risks or conditions cluster across domains;
- how pathways differ in exposure, reversibility, or consequence;
- whether an external constraint removes a pathway from the current landscape.

### PROHIBITED_FROM_ADJUDICATING
- treating majority or unanimity as a vote;
- declaring that convergence rejects or approves a proposal;
- selecting the pathway the Board should choose;
- ranking pathways from best to worst;
- stating that the Board's immediate decision is to return, approve, reject, defer, or pilot the proposal;
- converting a Dominant Signal into institutional disposition.

Authority terminus:
The Surface Map ends at **landscape legibility**.

---

## 2. Epistemic Confidence Audit

### OBLIGATED_TO_SURFACE
- confidence calibration;
- overconfidence;
- evidential gaps;
- systematic bias signals;
- source/assumption distinctions;
- coverage impact on epistemic quality;
- epistemic health score.

### PERMITTED_TO_CHARACTERISE
- that evidence is insufficient for a claimed level of certainty;
- that a conclusion is unsupported, weakly supported, or requires verification;
- that a Director's confidence should be reweighted analytically;
- what evidence would strengthen or weaken a finding.

### PROHIBITED_FROM_ADJUDICATING
- deciding the institutional course because evidence is weak or strong;
- treating WEAK or COMPROMISED epistemic health as automatic rejection or deferral;
- selecting which pathway should be implemented;
- resolving value or policy tensions under the guise of evidence quality.

Authority terminus:
The Epistemic Audit ends at **confidence in the reasoning record**.

---

## 3. Cross-Domain Tension Analysis / META

### OBLIGATED_TO_SURFACE
- sourced conflicts;
- inferred conflicts;
- hidden assumptions;
- cross-domain reasoning gaps;
- unresolved tensions;
- coverage limitations;
- integration signal.

### PERMITTED_TO_CHARACTERISE
- whether tensions are material;
- whether two framings are compatible, incompatible, or unresolved;
- what additional domains or evidence are required to understand the tension;
- consequences of resolving the tension in different directions.

### PROHIBITED_FROM_ADJUDICATING
- resolving a material tension on behalf of the decision-maker;
- choosing which value, domain, or framing should dominate;
- using integration coherence as authority to select a pathway;
- instructing the Board to defer, proceed, reject, approve, or pilot.

Authority terminus:
META ends at **structured unresolved tension**.

---

## 4. Reality Anchor

### OBLIGATED_TO_SURFACE
- baseline facts versus assumptions;
- operational capability;
- monitoring reality;
- reversibility reality;
- accountability reality;
- falsification conditions;
- feasibility gaps;
- operational confidence.

### PERMITTED_TO_CHARACTERISE
- that a capability is absent, unverified, insufficient, or operationally implausible;
- that a proposed condition may not be achievable;
- that formal reversibility differs from operational reversibility;
- that an external legal, regulatory, physical, or verified technical constraint makes a pathway unavailable;
- what operational evidence would change feasibility.

### PROHIBITED_FROM_ADJUDICATING
- selecting the alternative after identifying infeasibility;
- converting LOW operational confidence into institutional deferral or rejection;
- treating an inferred capability gap as an authoritative foreclosure;
- ranking pathways by preference rather than describing operational differences.

Authority terminus:
Reality Anchor ends at **operational availability and feasibility characterisation**.

---

## 5. Adversarial Probe

### OBLIGATED_TO_SURFACE
- strongest coherent counter-argument;
- missing perspective;
- neglected inaction harm where relevant;
- asymmetry in analytical treatment;
- AI limitation;
- challenge verdict.

### PERMITTED_TO_CHARACTERISE
- that the dominant case is incomplete;
- that an alternative has not been fairly tested;
- that status quo harm is under-analysed;
- that a conclusion is challenged by a stronger counter-case.

### PROHIBITED_FROM_ADJUDICATING
- replacing the dominant pathway with the Probe's preferred pathway;
- ranking alternatives;
- converting CONCLUSION CHALLENGED into a decision;
- instructing the institution to adopt the counter-position.

Authority terminus:
The Probe ends at **mandatory adversarial challenge**.

---

## 6. Decision Stress Test

### OBLIGATED_TO_SURFACE
- tested failure modes;
- fragility;
- threshold breaches;
- irreversibility;
- stress-specific consequences;
- failure conditions;
- fragility score.

### PERMITTED_TO_CHARACTERISE
- that a pathway fails under a specified stress;
- that a risk crosses a defined threshold;
- that irreversibility rises under specific conditions;
- that a pre-existing authoritative safety rule makes a pathway unavailable after a specified breach.

### PROHIBITED_FROM_ADJUDICATING
- selecting an alternative because the tested pathway is fragile;
- converting a high fragility score into institutional rejection;
- instructing the Board to pilot, defer, approve, or redesign;
- turning a stress result into a preferred course unless merely reporting a pre-existing authoritative rule.

Authority terminus:
The Stress Test ends at **failure visibility under stress**.

---

## 7. Chair / Decision Brief

### OBLIGATED_TO_SURFACE
- key discoveries;
- decision framing;
- trade-offs;
- Director signal distribution;
- Probe response;
- material conditions;
- irreducible uncertainty;
- residual risk;
- available pathways where relevant;
- Decision Brief Status;
- reasoning transparency.

### PERMITTED_TO_CHARACTERISE
- how findings fit together;
- which findings are most decision-relevant;
- where Director signals converge or diverge;
- which conditions are unresolved;
- what evidence would change the decision space;
- what pathways remain available or externally constrained.

### PROHIBITED_FROM_ADJUDICATING
- selecting a preferred course;
- approving or rejecting;
- deferring;
- directing a pilot;
- declaring that the proposal should or should not proceed;
- resolving the final tension;
- using signal distribution as a vote.

Authority terminus:
The Chair ends at **integrated Decision Brief for human judgment**.

---

## 8. Comparator

### OBLIGATED_TO_SURFACE
- material differences between records or pathways;
- changed conditions;
- changed constraints;
- changed evidence;
- changed signals;
- changed uncertainty;
- changed residual risk where represented.

### PERMITTED_TO_CHARACTERISE
- that one pathway has more or less of a named property;
- that two records differ materially;
- consequences of each difference;
- whether a difference changes the decision space.

### PROHIBITED_FROM_ADJUDICATING
- declaring a winner;
- ranking compared pathways into an overall ordering;
- selecting the preferred record or trajectory;
- recommending which path the institution should choose.

Authority terminus:
The Comparator ends at **difference visibility**.

---

## 9. Board-readable Governance Record extraction

The Governance Brief extractor is not a separate decision authority.

It MAY compress and translate source material.

It MUST preserve:
- the source layer's authority boundary;
- unresolved tension;
- source-grounded conditions;
- uncertainty;
- signal semantics.

It MUST NOT introduce adjudication that is absent from the technical source.

If the source technical output itself contains an authority violation, compression must not legitimise or amplify it. Runtime enforcement applies before or during board-readable extraction.

---

## 10. Runtime enforcement requirements

Step 2b must implement these contracts with layer identity available at enforcement time.

Minimum requirements:

1. every synthesis output is checked before display, export, downstream synthesis, or ledger commit;
2. every board-readable Governance Record is checked before display, export, or ledger commit;
3. strong external-constraint language is permitted;
4. signal-to-decision conversion is prohibited;
5. ranking, selection, resolution, and unsupported foreclosure are prohibited;
6. repair preserves findings, signals, conditions, uncertainty, and pathway descriptions;
7. a failed repair fails closed for the affected synthesis record rather than silently publishing adjudicative text;
8. the authority outcome is testable against `tests/fixtures/synthetic/authority-cases.json`.

## 11. Change rule

Any change to a layer's authority terminus requires:
- an update to this contract;
- corresponding synthetic fixture changes;
- regression-test changes;
- explicit review against the three constitutional invariants.
