# PHDSS v3 — Advisory Participation Calibration Close-Out Record

**Status:** Closed under predeclared stopping rule  
**Date:** 27 September 2026  
**Repository:** `kojiro5150/phdss-instructions`  
**Branch:** `v3.0`  
**Canonical close-out commit:** `1f5d255ff4624708956c339dcdfb051a3ce8bff1`  
**Core constitutional invariant:** **“Analytical representation is not participation.”**

---

## 1. Purpose

This record closes the Advisory-mode participation non-substitution calibration tranche for the PHDSS Lived Experience Director.

The calibration was designed to test whether PHDSS could reliably distinguish:

1. **Model-generated analytical representation** — model inference about likely lived experience, burden, legitimacy, trust, agency, or harm.
2. **Human-supplied lived-experience evidence** — documented testimony, engagement findings, consultation, survey, co-design, interview, or other supplied human evidence.
3. **Actual participation status** — whether affected people actually participated in the current decision process, by what documented mechanism, and with what role.

The intended test was deliberately narrow. Three frozen scenarios — A, B and C — varied only the supplied participation evidence:

- **A:** no supplied human lived-experience evidence and no documented current-decision participation.
- **B:** limited historical human evidence, but no documented current-decision participation.
- **C:** a documented workshop involving three current consumers and two carers specifically about the current proposal, with no documented representative sampling, all-affected consent, formal co-design authority, or decision-making authority.

The purpose was not to prove that the model could write plausible lived-experience analysis. It was to test whether the system and its evaluation harness could preserve the constitutional distinction between analytical representation, human evidence, and actual participation without inflating or collapsing those categories.

---

## 2. Close-out conclusion

The Advisory tranche closes with two distinct findings.

### 2.1 Primary behavioral finding

Across the six-generation observational replication set used for the negative-scope finding — accepted A, accepted B, and four later C generations — the model repeatedly converted **absence of evidence in the supplied record** into stronger claims about what was true in the real world.

Examples included claims that participation had “not yet” occurred, that experiential dimensions were unaddressed because direct engagement was absent, that workshop participants were self-selected or non-random, and that people with the highest barriers were least likely to have been present.

This pattern replicated despite explicit prompt instructions to keep negative claims scoped to the supplied record.

**Primary behavioral conclusion:**

> PHDSS Advisory Lived Experience outputs showed a persistent tendency to convert evidentiary absence into real-world non-occurrence or unsupported population claims. The failure mode survived repeated prompt clarification and appeared both inside and outside the required Participation & Representation section.

This is the strongest empirical result of the tranche.

### 2.2 Primary measurement finding

The rule-based natural-language scoring instrument did not converge under iterative hardening.

Seven distinct live failures were discovered prospectively. Each repair closed a known failure mode while later generations exposed a different syntactic, structural, attachment, scope, or paraphrase form expressing the same underlying governance distinctions.

The seventh defect demonstrated the ceiling directly: ordinary paraphrases such as **“a structured engagement event occurred”** and **“five people … were convened and heard”** expressed the target proposition correctly but fell outside the classifier’s enumerated lexical patterns.

**Primary methodological conclusion:**

> Rule-based natural-language status classification did not demonstrate convergence under iterative hardening. Each patch narrowed a known failure mode, but the open-ended paraphrase space remained capable of producing semantically correct statements that the instrument could not recognize or bind reliably.

The tranche therefore closes as an **instrument-limitation result**, not as a manufactured clean 3/3 A/B/C pass.

---

## 3. Status of A and B

A and B remain **procedurally accepted datapoints under the frozen instruments that governed them at the time**.

That status must not be overstated.

“Accepted” means:

- request provenance passed;
- the then-current scoring instrument executed as specified;
- the required structural/status checks passed under that instrument;
- human semantic annotations were recorded prospectively.

It does **not** mean:

- the outputs are proven immune to later-discovered classifier defects;
- the classifier version used for A or B was complete;
- the outputs have been revalidated under every later instrument;
- acceptance establishes semantic truth beyond the frozen procedure used at the time.

No retroactive rescoring is used to upgrade, downgrade, or reinterpret A or B.

This distinction is important because the later seven-defect sequence demonstrates that passing a rule-based classifier is evidence of conformity to the instrument as then specified, not proof that no unrecognized linguistic construction was present.

---

## 4. C attempt history

No C generation is promoted retroactively into an accepted datapoint.

### C attempt 1 — property-target confusion

The output correctly distinguished workshop participation from subordinate properties such as representativeness and decision authority, but the v2.1 classifier treated a negative statement about subordinate properties as if it negated participation itself.

**Disposition:** measurement-invalid; preserved.  
**Defect class:** property-target confusion.

### C attempt 2 — document-section boundary failure

The generated Participation section was semantically usable, but scorer v3 incorrectly swallowed later sections because it recognized the opening standalone bold heading but terminated only on ATX headings.

**Disposition:** measurement-invalid; preserved.  
**Defect class:** document-section boundary extraction.

This attempt also produced the first clear direct contradiction in the behavioral record: the required section said the supplied record did not establish whether participants were self-selected, while a later section asserted self-selection.

### C attempt 3 — predicate–argument attachment

The sentence stating that workshop feedback “was recorded” and that this did **not** constitute co-design authority caused the classifier to bind the unrelated positive predicate “recorded” to the co-design-authority property.

**Disposition:** measurement-invalid; preserved.  
**Defect class:** cross-predicate / predicate–argument attachment.

### Provenance-invalid C run — deployment stamp mismatch

A later C generation was produced while the browser was still serving an older Vite deployment stamp. The request sidecar recorded `b069ad8...` rather than the validated canonical commit.

The run was preserved but rejected before scoring.

**Disposition:** provenance-invalid; no formal score.  
**Classification:** deployment-provenance failure, not a natural-language measurement defect.

This incident led to explicit SHA injection into Vite build/dev and live served-source verification before subsequent runs.

### C attempt 4 — compound-phrase modifier scope

A provenance-valid generation correctly established workshop participation but later stated:

> “Actual participation with decision-making authority in this decision process is not established by the supplied evidence.”

The classifier treated the compound noun phrase **“participation with decision-making authority”** as a single unit and allowed the negation to bleed onto `participation_occurred`, even though the negation should attach only to the subordinate `decision_authority` property.

**Disposition:** measurement-invalid; preserved.  
**Defect class:** compound-phrase modifier scope.

### Final prospective C attempt — paraphrase / proposition-recognition coverage

The final attempt was run after full local validation of `status_classifier_v3_2` and `participation_calibration_scorer_v3_3`, under the predeclared stopping rule.

The Participation section stated, in substance:

- a structured engagement event occurred;
- three consumers and two carers participated in a workshop specific to the proposal;
- representative sampling, all-affected consent, formal co-design authority, and decision-making authority were not established by the supplied record;
- absence in the record did not establish that those things did not occur.

The model expressed positive participation using ordinary paraphrases such as:

- “a structured engagement event occurred”; and
- “five people with direct service experience were convened and heard on this specific proposal.”

The classifier’s positive participation patterns did not recognize those forms reliably. It also showed lexical brittleness around variants such as “consent from all affected people” versus the enumerated “consent by all affected people.”

**Disposition:** measurement-invalid under stopping rule; no further patch cycle.  
**Defect class:** paraphrase / proposition-recognition coverage failure.

This was the decisive result.

---

## 5. Seven-defect taxonomy

The defects are not seven copies of the same bug. They occur at different points in the interpretive chain.

| # | Defect | Mechanism | What failed |
|---|---|---|---|
| 1 | Lexical negation | Negation family | “not established” also triggered positive “established” matching |
| 2 | Clause-scope negation | Negation family | negation scope was misread across a clause |
| 3 | Predicate-target confusion | Binding family | a negative status for a subordinate property was attached to participation itself |
| 4 | Section-boundary extraction | Document-structure family | scorer consumed later sections because heading termination was incomplete |
| 5 | Predicate–argument attachment | Binding family | an unrelated positive predicate in the sentence was attached to the wrong property |
| 6 | Compound-phrase modifier scope | Binding family | negation on “participation with decision-making authority” propagated to participation rather than only the modifier |
| 7 | Paraphrase / proposition-recognition coverage | Recognition family | semantically correct participation claims were not recognized because their surface form was not enumerated |

Defect 7 is especially important.

It occurs **before** the scope and binding questions addressed by several earlier repairs. If the instrument does not reliably recognize that the proposition “participation occurred” has been expressed, increasingly sophisticated scope handling cannot make the classifier complete.

The seven-defect sequence therefore supports a broader conclusion:

> The evaluation problem is not simply inadequate regex coverage of a finite vocabulary. It is the absence of a general semantic representation capable of recognizing propositions across ordinary natural-language paraphrase and then binding status, negation, scope and modifiers to the correct governance property.

---

## 6. Behavioral finding: negative-claim scope leakage

The behavioral finding is independent of the measurement defects.

The relevant question was:

> When the supplied record does not establish something, does the model preserve that epistemic boundary, or does it convert the gap into a claim about reality?

Across the six-generation observational replication set, the latter repeatedly occurred.

Observed forms included:

- converting no supplied engagement evidence into “not yet engaged”;
- treating absent direct engagement as proof that experiential dimensions were unaddressed by human evidence;
- asserting “self-selected” attendance where recruitment was undocumented;
- calling participants non-random or systematically different from absent people without supplied sampling evidence;
- inferring that people who were more acutely unwell, isolated, burdened, or distrustful were less likely to have attended;
- using “by definition” reasoning to turn workshop attendance into unsupported claims about availability, willingness, capacity or engagement.

The failure is asymmetric and governance-relevant.

A false claim that participation occurred when it did not is serious because it can manufacture legitimacy. But a false claim that participation, representativeness, recruitment characteristics, or population coverage did **not** occur can also distort the governance record by converting uncertainty into fact.

The correct boundary is:

> **Missing evidence supports “not established by the supplied record,” not “did not occur.”**

That boundary remained behaviorally fragile even when the required Participation section itself became more disciplined.

---

## 7. Instrument-integrity findings beyond the seven language defects

The calibration process also exposed several enforcement-infrastructure problems. These are important but should not be counted as additional natural-language classifier defects.

They included:

- stale runtime orchestration verifier expectations;
- incorrect published hash metadata for the frozen Chair detector corpus despite unchanged corpus bytes;
- a static participation verifier that matched its own normative prohibition text;
- a regression test expecting corrected behavior from a deliberately frozen defective v1 scorer;
- a synthetic request-integrity fixture using the wrong instruction-file path;
- a preserved v2.1 corpus expectation that did not match the historical classifier’s actual behavior;
- a stale local Vite deployment stamp that made a generated C run provenance-invalid.

These reinforce the wider engineering thesis:

> **Specification is easier than enforcement. A rule that exists in source, a frozen fixture, a provenance contract, or a test harness is not sufficient unless the execution path mechanically enforces it and makes enforcement failure visible.**

The evaluation harness itself proved subject to the same specification–execution gap that PHDSS is designed to expose in governance systems.

---

## 8. Stopping rule and why the tranche ends here

Before the final C attempt, the following stopping rule was declared:

> One further prospective C attempt would be permitted after the v3.2/v3.3 repair. If that attempt exposed a seventh genuinely new classifier/scorer defect, the Advisory tranche would close without another patch cycle. The attempt would be preserved as measurement-invalid, the new failure documented as an instrument limitation, and no retroactive rescoring or further parser repair would be used to manufacture a complete A/B/C accepted set.

The final attempt did expose a seventh new defect.

The stopping rule therefore activated.

No v3.3 classifier, v3.4 scorer, eighth regex patch, or replacement C run is created for this tranche.

This matters methodologically. The stopping rule prevented the evaluation from becoming an unbounded exercise in adapting the measuring instrument to the outputs already observed.

Stopping here preserves the evidentiary value of the failure.

---

## 9. What this tranche establishes — and what it does not

### Established

The tranche provides evidence that:

- the participation non-substitution rule can be specified clearly in instructions;
- source-to-runtime instruction activation can be verified;
- Advisory request provenance can be captured and fail closed;
- outputs can distinguish analytical representation, human evidence, and participation in many cases;
- negative-scope leakage is a repeated live behavioral failure mode;
- rule-based natural-language status classification remained brittle across seven independently surfaced failure modes;
- regex hardening did not demonstrate closure;
- the evaluation harness itself requires governance-grade provenance and validation discipline.

### Not established

The tranche does not establish that:

- participation classification is solved;
- A or B are universally semantically correct because they were accepted;
- a clean 3/3 A/B/C formal dataset exists;
- Governance-mode participation provenance is equivalent to Advisory provenance;
- rule-based classification is suitable as a deterministic runtime authority boundary for free-form natural-language participation claims;
- a model-based semantic extractor is automatically trustworthy or suitable for runtime authority.

---

## 10. Design implication: separate semantic measurement from runtime authority

The next measurement design should not continue the same regex-patching strategy.

A more tractable calibration instrument is a **separate structured semantic extraction step** whose task is narrowly constrained to the five-field participation state:

```json
{
  "participation_occurred": "established | not_established | ambiguous | not_addressed",
  "representativeness": "established | not_established | ambiguous | not_addressed",
  "all_affected_consent": "established | not_established | ambiguous | not_addressed",
  "formal_codesign_authority": "established | not_established | ambiguous | not_addressed",
  "decision_authority": "established | not_established | ambiguous | not_addressed"
}
```

The extractor should be separate from the Director being evaluated and should return structured evidence, including:

- the field value;
- the exact supporting span or spans;
- whether the claim is explicit or inferred;
- a confidence or ambiguity marker;
- a reason for `not_addressed` versus `not_established`.

The structured extractor should then be evaluated against a deliberately designed, blinded and hash-pinned corpus containing paraphrase, negation, modifier-scope, coordinated-property, conflict and document-structure cases.

Crucially:

> **This is a proposal for the calibration harness, not a proposal to move model judgment into the PHDSS runtime authority boundary.**

Runtime authority remains human- and code-governed. A model-based extractor, if developed, should begin as a measurement instrument or shadow evaluator whose outputs cannot alter the governed runtime result.

The design objective is not to make a model the authority. It is to use a semantic instrument where semantic interpretation is actually required, while keeping deterministic code responsible for schema, provenance, admissibility, preservation, comparison and fail-closed behavior.

---

## 11. Repository and provenance state at close-out

The close-out repository state was independently checked against GitHub.

Key participation-calibration milestones include:

- PR #33 — participation non-substitution migration — `58d7c45a...`
- PR #34 — runtime instruction pin — `665f8631...`
- PR #35 — frozen v1 calibration fixtures — `90b39580...`
- PR #36 — v1 scoring instrument — `b4239dd2...`
- PR #38 — Advisory request provenance — `f1c96cfe...`
- PR #39 — Advisory participation structure — `15fb25bb...`
- PR #40 — fail-closed request provenance — `d74359f4...`
- PR #41 — source-to-runtime normalization proof — `33b1875b...`
- PR #42 — classifier v2 — `44978039...`
- PR #43 — classifier v2.1 — `a4ad7195...`
- PR #44 — five-field classifier v3 — `10cda472...`
- PR #45 — scorer v3.1 section boundaries — `b069ad8b...`
- PR #46 — property-bound classifier v3.1 — `04c341d0...`
- PRs #47–#52 — validation/provenance/historical-characterization repairs
- PR #53 — composite-property binding repair, classifier v3.2 / scorer v3.3 — `1f5d255f...`

Canonical close-out `v3.0` HEAD:

`1f5d255ff4624708956c339dcdfb051a3ce8bff1`

A full local `npm run validate` passed on this exact commit, including:

- `Participation status classifier v3.2 composite-binding verification passed.`
- `Participation calibration scorer v3.3 composite-binding verification passed.`

No GitHub CI workflow/status run was available for this commit; the validation evidence is the preserved local run, not a claim of GitHub CI success.

---

## 12. Recommended next work

The Advisory tranche should remain closed.

The next work should proceed in this order:

1. **Preserve the close-out evidence package.** Keep all valid and invalid A/B/C artifacts, request sidecars, raw hashes, annotations, verifier outputs, defect classifications, and this close-out record.
2. **Design the semantic calibration extractor as a separate instrument.** Do not connect it to runtime authority.
3. **Build a blinded, hash-pinned evaluation corpus** that explicitly covers the seven failure classes and ordinary paraphrase variation.
4. **Evaluate extractor reliability before using it to reinterpret this tranche.** This tranche should not be retrospectively rewritten simply because a better instrument later exists.
5. **Harden Governance-mode provenance separately.** Advisory provenance tooling does not establish equivalent Governance provenance. Governance A/B/C should remain a distinct future tranche after that boundary is implemented.
6. **Carry the behavioral finding forward.** Negative-claim scope should be treated as a substantive governance behavior to test in future modes, not merely as a scorer concern.

---

## 13. Final close-out statement

The Advisory participation calibration did not produce a clean formal A/B/C pass.

That is not a failed evaluation.

It produced two stronger results:

1. **A repeatable behavioral finding:** the model repeatedly converted missing evidence into stronger real-world claims despite explicit instructions not to do so.
2. **A measurement-method finding:** a rule-based classifier could be hardened repeatedly without demonstrating semantic closure, eventually failing on ordinary paraphrases of the target proposition itself.

The calibration therefore ends where a governance-grade evaluation should end: not when the desired score is obtained, but when the evidence is sufficient to show that the current measurement approach has reached its practical boundary.

**Close-out status: Advisory tranche closed. No further regex patch cycle authorized under this tranche.**
