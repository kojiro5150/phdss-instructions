# PHDSS Orientation Contract

Status: product-orientation layer for v2.0. This contract is explanatory only; it does not alter governance runtime behaviour.

**Normative-source rule:** This document is the source of truth for all PHDSS orientation and explanatory UI copy. JSX and other presentation surfaces implement this contract and must not redefine it independently. `docs/NORTH_STAR.md` governs the broader constitutional invariants; for orientation copy, this contract is normative.

## North Star

> PHDSS is designed to make the decision space larger and more legible before humans decide — surfacing assumptions, tensions, missing evidence, affected perspectives, operational constraints and plausible alternatives that may otherwise remain hidden.

The orientation layer must present that sentence verbatim before explanatory product copy.

## Authority model

The orientation layer explains the architecture as:

**AI: enlarge + interrogate → Code: constrain + validate + preserve → Chair: organise + expose → Human: judge + decide**

This is not marketing shorthand for delegated decision authority. It is a boundary statement:

- AI may surface, challenge, compare and characterise.
- deterministic code constrains process, validates outputs and preserves provenance;
- the Chair organises the supplied reasoning without adjudicating the institutional decision;
- the authorised human governance body judges and decides.

## Product flow

The user-facing flow is:

**Inputs → Directors → Synthesis → Decision Brief → Transparency → Decision Ledger**

The orientation must make clear that:

- the Decision Brief is an integrated presentation layer, not a Chair recommendation;
- Transparency exposes coverage, uncertainty, fragility, failure and degraded-state information;
- the Decision Ledger preserves the historical record rather than silently normalising or rewriting it.

## When to use PHDSS

PHDSS is oriented to consequential institutional decisions where multiple perspectives, assumptions, evidence gaps, operational constraints or material trade-offs need to be visible before human judgment.

It is not an automated approval/rejection engine, a substitute for authorised governance or professional/legal responsibilities, or a general-purpose fact lookup / urgent command interface.

## Mode guidance and cost awareness

The orientation must distinguish governance run depth without disguising partial coverage:

- **CORE** — 5 adaptive Directors. Lower model/API cost and faster, but partial coverage must remain explicit.
- **FULL** — all 13 Directors. Broadest coverage and highest model/API cost.
- **CHAIR SPECIFIED** — human-selected Directors with Systems & Safety mandatory. Cost varies with selected scope; the human governance body owns that coverage choice.

Advisory Runs remain separate: they provide domain briefings only and do not produce the governance synthesis chain, Decision Brief, Transparency Dashboard or governance Decision Ledger record.

## Institutional legitimacy

PHDSS may improve reasoning legibility, challenge and auditability. It does not create institutional legitimacy by itself. Legitimacy remains a property of the authorised human governance process, including participation, accepted evidence, affected perspectives, judgment and accountability.

## Non-goals of this tranche

This tranche does not change:

- Director or synthesis instructions;
- the instruction commit pin;
- authority detection or repair;
- pipeline stage order;
- Decision Ledger schema;
- Comparator schema or behaviour;
- API call count for a governance run.

The orientation is static product guidance and therefore requires no model/API call.
