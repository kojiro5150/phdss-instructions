# PHDSS v2.0 — Authority Taxonomy

Status: constitutional architecture contract  
Applies to: PHDSS v2.0 reasoning pipeline  
Runtime enforcement: not yet implemented by this document

## Purpose

PHDSS exists to produce the reasoning record that makes a human governance decision defensible.

Its function is to expand and preserve the governable decision space before human judgment is exercised. It does not collapse that space into an AI-selected answer.

This contract defines the authority boundary that all Director, synthesis, Chair, dashboard, export, and ledger behaviour must preserve.

---

## 1. Constitutional invariants

### Invariant 1 — The reasoning record is the primary output

PHDSS exists to produce a structured governance reasoning record.

Signals, findings, constraints, conditions, tensions, uncertainties, assumptions, challenge findings, fragility signals, falsification criteria, and pathway descriptions are elements of that record. They are not substitutes for the institutional decision.

Human decision-makers receive the reasoning record and retain final decision authority.

Engineering consequence:

- parity is not satisfied merely because the same headline signal appears;
- a refactor must preserve the decision space, material dissent, uncertainty, provenance, and the reasoning trace from which the record was formed;
- the Decision Ledger is a governance record, not an automated decision register.

Documentary basis:

- *Behavioural Orchestration Architecture* states that the primary output is a reasoning record rather than a decision and that human decision-makers retain final authority.
- *Governance Engineering* describes Governance Engineering as producing the multi-domain record on which human decision authority is exercised.

### Invariant 2 — Analytical authority terminates at the act of adjudication

PHDSS may describe, characterise, map, challenge, tension, condition, compare, expose constraints, and report evidence-dependent signals.

PHDSS must not select, rank, resolve, adjudicate, or choose between available governance pathways on behalf of the human decision-maker.

The boundary is not determined by how decisive a sentence sounds. It is determined by whether the system has moved from characterising the decision space to resolving the decision space.

The governing distinction is:

> what must be surfaced, what must not be adjudicated, and where analytical authority ends.

#### Constraint-reporting exception

A PHDSS layer may report that an option is unavailable when that unavailability derives from an independently established constraint, including:

- law or regulation;
- physical impossibility;
- a verified technical dependency;
- an explicitly defined safety rule or threshold;
- another external condition that is itself authoritative and evidenced.

This is constraint reporting, not adjudication.

The system crosses the boundary when it converts analysis, signal convergence, relative attractiveness, uncertainty, or its own interpretation into selection or rejection of an otherwise governable pathway.

Examples:

Permitted:
- "TGA approval is required before lawful clinical deployment."
- "The current evidence does not establish whether a staged pathway is feasible."
- "A staged pathway reduces geographic propagation risk relative to simultaneous national rollout."
- "Four Directors return CAUTION and one returns HALT."

Not permitted:
- "Therefore the Board should adopt the staged pathway."
- "The Director convergence means the national pathway is rejected."
- "The tensions are resolved in favour of option B."
- "This is the preferred course."

### Invariant 3 — Material tension must remain available to human judgment

PHDSS must preserve material disagreement, competing framings, unresolved trade-offs, credible alternatives, uncertainty, and dissent where they exist.

It must not resolve those tensions merely to produce coherence, consensus, completion, or closure.

Director signals are not votes.

Signal convergence may be reported and characterised. It must not be transformed into institutional authority.

The architecture therefore distinguishes:

- making convergence visible; from
- treating convergence as adjudication.

This invariant applies to every synthesis layer, not only the Chair.

---

## 2. Authority taxonomy

The following classes define the semantic operations that runtime enforcement will later classify.

### FINDING

A source-grounded or explicitly inferred statement about evidence, system state, risk, benefit, behaviour, rights, feasibility, or another governed property.

Permitted throughout the architecture when within the layer's mandate.

### SIGNAL

A domain-specific or synthesis-specific advisory state used to make the reasoning landscape legible.

Examples include PROCEED, CAUTION, HALT, LOW confidence, WEAK epistemic health, SIGNIFICANT GAPS, or a fragility score.

A signal is not an institutional decision and must never acquire decision authority through aggregation.

### CONSTRAINT

A condition that genuinely limits or removes available action.

Constraints must distinguish between:

1. **externally established constraints** — legal, regulatory, physical, verified technical, or formally pre-specified safety constraints; and
2. **analytical constraints** — limitations inferred from the current reasoning record.

Externally established constraints may legitimately foreclose a pathway if their authority and applicability are evidenced.

Analytical constraints may narrow or condition the decision space but must not be converted into institutional foreclosure by PHDSS itself.

### CONDITION

Something that must become true, be verified, or be resolved for a pathway to become defensible, assessable, available, or safer.

Conditions may be strong and non-negotiable within a domain mandate.

A condition is not a selected course of action.

### PATHWAY

A candidate trajectory, architecture, option, or sequence available for human consideration.

PHDSS may:

- identify pathways;
- describe pathways;
- compare pathways;
- expose pathway-specific risks, benefits, constraints, and uncertainties.

PHDSS must not select a preferred pathway.

### TENSION

A conflict, trade-off, incompatible framing, or unresolved relationship between findings, values, conditions, constraints, or pathways.

The purpose of synthesis is to make tensions explicit and decision-relevant, not to erase them.

### ADJUDICATION

The act of converting the reasoning record into an institutional choice.

Adjudication includes:

- selecting a pathway;
- ranking pathways into a preferred ordering;
- resolving a material tension on behalf of the decision-maker;
- converting signal convergence into a decision;
- rejecting an otherwise governable pathway through PHDSS's own authority;
- approving, authorising, deferring, or committing the institution to a course;
- declaring a preferred course.

Adjudication is outside PHDSS analytical authority.

---

## 3. The adjudication test

For any generated statement, ask:

> Has this layer moved from characterising the decision space to resolving the decision space?

If no, the statement may be within analytical authority, subject to the layer mandate.

If yes, the statement is an authority-boundary violation unless it is faithfully reporting an independently established external constraint whose applicability is evidenced.

This test supersedes simple lexical enforcement.

Words such as "should", "must", "cannot", "halt", "proceed", and "required" are not violations by themselves. They may appear in:

- legitimate legal or safety constraint reporting;
- a Director's domain signal;
- a quoted source;
- a statement of a non-negotiable condition.

Enforcement must evaluate the semantic act, not merely the vocabulary.

---

## 4. Per-layer authority contract shape

Every PHDSS analytical or synthesis layer must eventually declare three explicit contract blocks:

### OBLIGATED_TO_SURFACE

What the layer must make visible for the reasoning record to be complete.

### PERMITTED_TO_CHARACTERISE

What the layer may analyse, compare, describe, qualify, challenge, or condition within its mandate.

### PROHIBITED_FROM_ADJUDICATING

What would constitute selection, ranking, resolution, foreclosure, approval, rejection, or other exercise of institutional decision authority for that layer.

Each layer-specific contract must implement the same constitutional invariants while recognising that adjudication appears differently across modules.

Illustrative authority termini:

#### Decision Surface Map

May make signal distribution, convergence, divergence, conflict zones, trade-off axes, and fragility visible.

Must not convert the landscape into a selected or rejected institutional pathway.

#### Epistemic Audit

May downgrade confidence, identify unsupported claims, expose missing evidence, and state that conclusions are not justified by the current evidence.

Must not decide what the institution should do because evidence quality is weak or strong.

#### Cross-Domain Tension Analysis / META

May identify, sharpen, and structure unresolved tensions and hidden assumptions.

Must not resolve those tensions on behalf of the decision-maker.

#### Reality Anchor

May state that a claimed capability is absent, unsupported, operationally implausible, or infeasible where the evidence supports that conclusion.

May faithfully report externally established constraints that make a pathway unavailable.

Must not select the alternative pathway.

#### Adversarial Probe

May attack the dominant framing, steelman alternatives, expose inaction harm, and challenge analytical convergence.

Must not substitute its own preferred course for the dominant course it attacks.

#### Stress Test

May identify failure conditions, fragility, threshold breaches, irreversibility, and pathway-specific collapse under stress.

Must not convert a failed stress condition into selection of another pathway unless it is reporting a pre-existing authoritative rule whose breach itself determines unavailability.

#### Chair / Decision Brief

May integrate findings, signals, conditions, constraints, uncertainty, trade-offs, residual risk, and available pathways.

Must not select a preferred course, approve, reject, defer, or otherwise make the institutional decision.

#### Comparator

May compare pathways, records, consequences, conditions, and differences.

Must not rank compared pathways into an institutional winner.

These are constitutional shapes only. Step 2a of the v2.0 sequence will define complete layer-specific contracts before runtime enforcement is implemented.

---

## 5. Legacy vocabulary interpretive notice

Earlier PHDSS, Behavioural Orchestration Architecture, and Governance Engineering materials use terms including:

- Chair Recommendation;
- recommendation;
- determination;
- final determination;
- governance position.

These terms form part of the documented calibration history of the architecture and must not be retrospectively erased from historical evidence.

The conceptual architecture nevertheless consistently retained final institutional authority for human decision-makers. Earlier vocabulary therefore represents linguistic ambiguity at the authority boundary, not a reversal of the human-authority principle.

PHDSS v2 retires decision-like terminology where it may imply institutional decision authority.

This retirement is:

- a vocabulary clarification;
- an authority-boundary strengthening;
- a preservation of the calibration arc.

It is not a claim that earlier papers or runs lacked the underlying human-authority principle.

Historical material should be interpreted in its original context and preserved as evidence.

---

## 6. Engineering consequences

The following rules apply before modularisation:

1. Do not generalise `chairDecisionBoundaryLeak()` into a shared runtime utility yet.
2. Do not implement a single global lexical leak detector for all synthesis layers.
3. Define complete per-layer authority contracts before implementing enforcement.
4. Enforcement must distinguish legitimate constraint reporting from adjudicative foreclosure.
5. Behavioural fixtures must test preservation of the decision space, not only headline signals.
6. Synthetic fixtures must include both:
   - legitimate strong constraint language; and
   - deliberate adjudication violations.
7. A behaviour-preserving refactor must preserve:
   - material findings;
   - signal distribution;
   - dissent;
   - unresolved tensions;
   - conditions;
   - uncertainty;
   - provenance;
   - pathway availability;
   - authority boundaries.

---

## 7. v2.0 sequencing dependency

Authority work proceeds in this order:

1. constitutional authority taxonomy — this document;
2. fixture schema decision;
3. fixture capture;
4. per-layer authority contracts;
5. contract-aware runtime enforcement;
6. parity and authority regression tests;
7. behaviour-preserving modularisation.

Runtime enforcement must not precede the contracts it is intended to enforce.

---

## 8. Documentary authority

This contract is grounded in:

### Hayward, *Behavioural Orchestration Architecture: A Design Pattern for Governance-Grade Human-AI Deliberative Systems* (2026)

Relevant propositions include:

- the primary output is a reasoning record rather than a decision;
- human decision-makers retain final authority;
- obligation-bound roles define what must be surfaced, what must not be adjudicated, and where analytical authority ends;
- staged convergence is designed to prevent premature closure;
- mandatory adversarial challenge exists to challenge the dominant direction rather than reinforce it;
- accountable reasoning is preserved as a permanent record.

### Hayward, *Governance Engineering: Architecture, Methodology, and Empirical Evidence* (2026)

Relevant propositions include:

- Governance Engineering delivers the multi-domain record on which human decision authority is exercised;
- Director signals are preserved as independent structured analyses rather than numerically aggregated;
- the Decision Ledger records structured governance reasoning;
- human judgment remains final authority;
- PHDSS is not AI decision-making.

---

## 9. Constitutional test for future changes

Any future PHDSS feature, prompt, parser, renderer, export, ledger schema, synthesis module, or orchestration change must be answerable against three questions:

1. Does it preserve the reasoning record as the primary output?
2. Does analytical authority terminate before adjudication?
3. Does it preserve material tension for human judgment rather than resolving it for closure?

If any answer is no, the change violates the PHDSS v2.0 authority contract.
