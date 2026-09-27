# CORE Activation Policy

**Status:** Canonical design rationale  
**Design decision-maker:** Sam Hayward, PHDSS creator  
**Scope:** PHDSS CORE-mode Director activation, with primary design grounding in public health, digital health, and mental health

## 1. Runtime rule

CORE mode is intentionally composed as:

- **Globally mandatory:** Systems & Dynamics; Safety, Quality & Harm
- **CORE-fixed:** Equity & Human Rights; Lived Experience
- **Adaptive fifth:** one additional Director selected from the decision context

This is distinct from CHAIR_SPECIFIED mode, where the globally mandatory baseline is Systems and Safety and the Chair-selected set is added to that baseline.

The code-level activation rule is implemented in `src/governance-rules.js`.

## 2. Design rationale

PHDSS was designed primarily from professional practice in public health, digital health, and mental health decision contexts.

Within those domains, Systems & Dynamics, Safety, Quality & Harm, Equity & Human Rights, and Lived Experience are treated as foundational governance lenses.

Systems and Safety are globally mandatory because every governance decision requires a baseline assessment of system effects and potential harm.

Equity and Lived Experience are additionally fixed in CORE because, in the design decision-maker's professional judgment:

> **If Equity or Lived Experience materially falters, the proposal is not sound, regardless of what the other domains find.**

This is a necessary-condition claim for the intended PHDSS use context, not merely a statement that Equity and Lived Experience are important considerations. Their fixed inclusion in CORE exists so that a CORE analysis cannot be treated as complete without both lenses being present.

The fifth CORE Director remains adaptive so that the architecture can add context-sensitive coverage without sacrificing those foundational lenses.

## 3. Scope boundary - load-bearing

The necessary-condition rationale above is grounded in the domains for which PHDSS was designed and in which its creator works: **public health, digital health, and mental health**.

The current runtime applies the same CORE composition to every CORE run, including use outside those domains.

> **That extension should be understood as an architectural default rather than evidence that the necessary-condition rationale has been independently established for every sector.**

This sentence is load-bearing. It preserves the distinction between a scoped professional design judgment and a universal empirical claim. It should not be shortened into language implying that the necessary-condition rationale has been validated across all sectors.

Cross-domain use may support, challenge, or ultimately motivate revision of the default, but such evidence must be established prospectively rather than inferred from the existence of the rule.

## 4. Inclusion rationale is not downstream enforcement

The rationale for making Equity and Lived Experience CORE-fixed answers one architectural question:

> **Which Directors must always be present for a CORE analysis to count as sufficiently constituted in the intended PHDSS domains?**

It does **not**, by itself, answer a separate procedural question:

> **What must the runtime do when Equity or Lived Experience returns a materially adverse finding?**

Current inspection of the runtime establishes that Director signals are parsed and aggregated generically. A HALT from any Director contributes to the HALT count and can trigger downstream stress analysis. No separately verified runtime rule has yet been identified that gives an Equity or Lived Experience CAUTION/HALT a special determination cap, automatic Chair disposition, veto, or necessary-condition enforcement solely because of Director identity.

Therefore:

- the **CORE-fixed inclusion policy is documented and intentional**;
- the **necessary-condition design rationale is documented and attributed**;
- **special downstream enforcement of that necessary-condition claim remains unverified**.

The architecture must not be described as enforcing a sector-specific Equity/Lived necessary condition downstream unless such enforcement is separately specified and demonstrated.

## 5. Refusal, red-line, and HALT mechanisms are distinct

These concepts must not be collapsed into a single category.

### Equity & Human Rights

Equity has a rights-based red-line and legitimacy classification layer:

- **Minimum Core Obligations & Red Lines**
- **Legitimacy likely / uncertain / unlikely**
- `Legitimacy unlikely` is reserved for a confirmed rights violation, non-derogable obligation breach, or structurally incompatible condition that further process cannot cure
- the instruction states that `Legitimacy unlikely` can justify considering HALT

This is a strong red-line architecture, but it is **not written as an explicit active refusal protocol**.

### Ethics & Influence Risk

Ethics contains an explicit **Ethical Refusal Protocol**. It can directly refuse endorsement where a proposal enables manipulation, reduces agency, obscures intent, or concentrates influence without oversight.

### Behaviour & Implementation

Behaviour also contains an explicit **Ethics & Safety Lock** with an active refusal obligation for covert influence, manipulation, deception, coercion, and dark patterns.

This means the current instruction corpus contains a documentation inconsistency: `ethics.md` states that Ethics is "the only Director in PHDSS" with an active refusal obligation, while `behaviour.md` explicitly describes itself as having "the same structural feature as the Ethics Director."

That inconsistency should be resolved as a documentation/instruction-contract question before either uniqueness claim is repeated in transfer materials or working papers.

### Lived Experience

Lived Experience contains specific HALT-level escalation rules, including a documented re-traumatisation condition. This is a domain-specific HALT trigger, not an active refusal protocol.

## 6. Transfer-readiness implication

This design rationale was previously implicit in the creator's judgment and visible only indirectly through runtime selection logic.

That is a practitioner-concentration defect under the transfer-readiness principle:

> **Any need for tribal knowledge is a transfer defect.**

The repair is documentation and attribution, not retrospective invention of evidence.

A stranger should be able to determine from the repository:

1. why CORE contains five Directors;
2. which are globally mandatory versus CORE-fixed;
3. why Equity and Lived Experience are fixed;
4. the domain scope of that rationale;
5. that inclusion and downstream enforcement are separate claims;
6. that refusal, red-line, and HALT mechanisms are not interchangeable.

## 7. Canonical wording for papers and transfer materials

Use:

> **CORE mode comprises two globally mandatory Directors (Systems & Dynamics and Safety, Quality & Harm), two additional CORE-fixed Directors (Equity & Human Rights and Lived Experience), and one adaptive fifth Director selected from the decision context. Equity and Lived Experience are fixed because, in the design decision-maker's professional judgment for public health, digital health, and mental health contexts, if either materially falters the proposal is not sound regardless of what the other domains find. The same CORE composition currently applies outside those sectors as an architectural default; this should not be interpreted as evidence that the necessary-condition rationale has been independently established for every sector.**

Do not replace this with "two mandatory plus one adaptive" or describe all four fixed Directors as globally mandatory.
