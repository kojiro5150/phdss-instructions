# PHDSS v3 Development Contract

Status: **normative development contract for the v3 product layer**

v3 begins from the sealed `v2.0.0` constitutional baseline. The v2 North Star, constitutional invariants, authority contracts, provenance rules, deterministic validation boundaries, degraded-state semantics, and frozen calibration evidence are inherited infrastructure. They are not ordinary v3 feature surfaces.

This document governs how new v3 product capabilities are evaluated before implementation.

## 1. The four development questions

Every material v3 feature must answer all four questions before implementation:

1. **Does this make the decision space more legible?**
2. **Does it preserve human adjudication?**
3. **Does it preserve evidentiary provenance?**
4. **Does it make failure more visible rather than less visible?**

A feature that cannot answer all four positively is not ready to enter the v3 product surface.

These questions are not feature-prioritisation criteria. They are architectural admissibility tests.

## 2. Inherited constitutional layer

The following are fixed infrastructure inherited from v2:

- the canonical North Star in `docs/NORTH_STAR.md`;
- decision-space expansion;
- non-substitution;
- epistemic provenance monotonicity;
- the authority chain:
  - AI: enlarge + interrogate;
  - Code: constrain + validate + preserve;
  - Chair: organise + expose;
  - Human: judge + decide;
- layer-specific authority termini;
- visible authority-repair telemetry;
- deterministic validation and bounded repair;
- mandatory versus degradable stage semantics;
- the frozen v2 calibration record.

A v3 feature may build above this layer. It must not silently redefine it.

Any proposal that requires changing one of these inherited constitutional elements is not an ordinary v3 feature. It is a **constitutional migration** and must be opened explicitly, justified, tested, calibrated, and versioned as such.

## 3. Evidence claims in v3

v3 development and evaluation must distinguish three evidence classes.

### 3.1 Architectural evidence

Evidence that the reasoning architecture behaves according to its stated contracts.

Examples include:

- authority violations detected and bounded;
- provenance promotion prevented;
- human adjudication preserved;
- degraded states labelled correctly;
- replay reproduces a bounded stage against frozen upstream evidence;
- a feature preserves the four development questions under test.

v2 provides substantive architectural evidence.

### 3.2 Decision-support evidence

Evidence that users experience useful changes in the quality or legibility of the decision space.

Examples include users reporting that PHDSS:

- surfaced considerations they had not previously identified;
- exposed assumptions or unresolved tensions;
- broadened plausible options;
- clarified missing evidence;
- made competing risks or affected perspectives more visible;
- preserved their sense of decision authority.

This evidence is early and must be described as such.

### 3.3 Institutional-effect evidence

Evidence that PHDSS improves institutional decisions, governance quality, implementation, service outcomes, safety, equity, resource stewardship, or other real-world outcomes.

v3 must not imply this evidence exists unless it has been generated through an appropriate evaluation design.

Absence of institutional-effect evidence must not be converted into a negative claim about effect. It remains an untested evidentiary state.

## 4. Persistent Decision Ledger boundary

The persistent Decision Ledger is a priority v3 development surface and a direct test of this contract.

### Permitted

A persistent Ledger may:

- store governance records;
- preserve provenance and version information;
- retrieve prior records;
- support audit, traceability, review, and longitudinal comparison;
- show how assumptions, evidence, conditions, or institutional context changed over time;
- let authorised humans inspect prior reasoning as historical material;
- surface prior records explicitly as prior records.

### Not permitted by default

A persistent Ledger must not silently treat prior PHDSS outputs as precedent that governs the current analysis.

It must not:

- convert a prior PHDSS signal into a current institutional presumption;
- increase the evidentiary weight of a current claim because a prior run reached a similar conclusion;
- rank current pathways based on historical PHDSS dispositions;
- infer that a previous governance response should be repeated;
- compress repeated historical outputs into apparent corroboration;
- use prior records to substitute for fresh evidence, current context, or current human judgment.

Historical retrieval is not precedent authority.

Repeated model agreement across time is not independent corroboration.

A future capability that intentionally introduces precedent reasoning would require a separate constitutional migration, with explicit authority, provenance, and institutional-governance design.

## 5. Julia and external validation

The first external v3 sessions should be treated as product-layer evaluation against the sealed v2 baseline.

Findings may inform:

- orientation;
- workflow;
- facilitation;
- evidence handling;
- terminology;
- Decision Ledger usability;
- interaction design;
- deployment and integration design.

They must not retroactively rewrite the frozen v2 calibration record.

A user misunderstanding of PHDSS authority, coverage, Decision Brief semantics, or Ledger purpose is a v3 product finding unless evidence shows an actual constitutional defect.

## 6. Workforce & Operational Practice Director

The planned fourteenth Workforce & Operational Practice Director is an explicit inherited v3 migration item.

Its introduction must account for:

- Director registry expansion from 13 to 14;
- FULL coverage denominator migration;
- CORE adaptive-selection logic;
- dashboard and coverage semantics;
- fixtures and parity tests;
- calibration comparability;
- documentation and orientation copy.

It must not be appended silently to the v2 registry contract.

## 7. Feature proposal template

Before implementation, a material v3 feature should state:

**Feature:**  
What capability is being added?

**Decision-space effect:**  
How does it make the decision space more legible?

**Human-authority effect:**  
How is adjudication kept outside the system?

**Provenance effect:**  
What evidence does it consume, create, transform, or retrieve, and how is evidentiary status preserved?

**Failure visibility:**  
How will failure, uncertainty, missing state, partial execution, or degraded operation remain visible?

**Constitutional impact:**  
Does the feature remain above the sealed v2 constitutional layer? If not, stop and open a constitutional migration.

**Evaluation evidence class:**  
Is the intended evidence architectural, decision-support, or institutional-effect evidence?

## 8. v3 product surface

Subject to this contract, v3 may develop:

- persistent and longitudinal Decision Ledger capabilities;
- institutional workflow and facilitation;
- richer evidence ingestion and evidence-state visibility;
- external usability findings;
- deployment and controlled integrations;
- the Workforce & Operational Practice Director migration;
- governance-session continuity and review;
- improved board/executive interaction design.

The purpose of v3 is to make the trustworthy governance engine easier to use in real institutional settings without making it more institutionally authoritative.

## 9. Governing principle

v2 established that the thesis becomes more precise when the architecture is tested rather than merely described.

v3 therefore follows the same discipline:

**Do not weaken a boundary to make a feature easier to build. Change the feature or the architecture explicitly.**
