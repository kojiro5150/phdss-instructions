# PHDSS Transfer-Readiness and Independent Evaluation Roadmap

**Status:** Canonical roadmap  
**Purpose:** Define the work required to move PHDSS from founder-operated, founder-evaluated research infrastructure into a system that can be operated and assessed by another competent person without undocumented knowledge, live developer rescue, or interpretive assistance.

---

## 1. Purpose

This roadmap defines the staged path from the current disclosed PHDSS evidence state to the first credible independent external run.

The roadmap does **not** assume that PHDSS is finished, fully validated, or free of known limitations.

Its purpose is narrower and more demanding:

> **Demonstrate that PHDSS can begin to exist independently of its creator.**

The central transfer question is:

> **Can a competent person who did not build PHDSS operate it from supplied materials alone, produce a valid audit trail, understand what the system is and is not claiming, identify unresolved uncertainty and authority boundaries, and complete the task without developer intervention?**

The first independent handoff is therefore not primarily a test of whether PHDSS produces "good answers." It is a test of whether the architecture, operating method, evidence controls, explanatory materials, and evaluation protocol are explicit enough to survive transfer.

---

## 2. Current starting point

At the time this roadmap is adopted, the canonical repository state is:

~~~text
main:
ae6e1708107139f5f185390b9d5b53b83b812a13
~~~

The runtime instruction loader is pinned to:

~~~text
22b662999e01462fc4008446885a38df2cf735ad
~~~

That instruction state includes the document-wide negative-scope discipline added after the Advisory participation calibration close-out.

The repository already contains two limitation records that must remain visible through transfer:

- the Chair authority-detector baseline, including the known indirect/disguised adjudication blind spot;
- the Advisory participation calibration close-out, including the repeated negative-scope leakage finding and the seven-defect ceiling reached by the rule-based calibration instrument.

This roadmap begins from that disclosed evidence state. It does not erase or supersede those limitations.

---

## 3. Governing principle

The project now moves from:

> **Can the creator build and audit PHDSS?**

to:

> **Can PHDSS be operated, understood, and evaluated without the creator being a hidden dependency?**

The dominant transfer risk is therefore practitioner concentration: critical knowledge may still exist only in the creator's memory, habits, interpretation, or ability to repair failures in real time.

Accordingly:

> **Any need for tribal knowledge is a transfer defect.**

This applies whether the missing knowledge concerns installation, runtime setup, mode selection, evidence handling, provenance verification, interpretation, failure recovery, export, limitations, or evaluation.

---

## 4. Scope of the first transfer study

The first external handoff is deliberately narrow.

It is intended to test:

- installability;
- operability;
- intelligibility;
- provenance integrity;
- authority-boundary comprehension;
- participation-boundary comprehension;
- uncertainty comprehension;
- visible failure behavior;
- procedural independence from the developer.

It is **not yet** intended to establish:

- improved organisational outcomes;
- improved patient outcomes;
- generalisable superiority over existing governance methods;
- external validity across institutions;
- broad clinical effectiveness;
- population-level performance;
- definitive institutional adoption readiness.

Those belong to later evidence stages.

---

## 5. Evidence ladder

### Level 1 — Architectural evidence

Question:

> Are the intended governance boundaries represented in the architecture and code?

Examples include:

- human decision authority remains outside the system;
- Chair authority is bounded;
- participation is not substituted by analytical representation;
- provenance is captured;
- validation can fail visibly;
- known limitations are disclosed.

Much of this level already exists.

### Level 2 — Runtime behavioural evidence

Question:

> Does the live system behave consistently with those boundaries under realistic use?

Examples include:

- Chair does not silently adjudicate;
- participation status remains bounded by supplied evidence;
- provenance fields reflect the actual runtime state;
- model failures remain visible rather than being silently normalised;
- prompt interventions produce measurable behavioural change.

This level remains active.

### Level 3 — Transfer evidence

Question:

> Can another person operate and understand the system without the creator?

This roadmap is primarily designed to establish this level.

### Level 4 — Comparative decision-support evidence

Question:

> Does PHDSS improve relevant aspects of institutional reasoning compared with an appropriate alternative?

Possible later comparators include:

- unstructured AI;
- conventional briefing processes;
- multidisciplinary review without PHDSS;
- human-only governance analysis;
- alternative structured decision-support tools.

This level should occur only after transfer is credible.

### Level 5 — Institutional-effect evidence

Question:

> Does use of PHDSS affect real decision quality, governance quality, implementation, safety, legitimacy, or learning in institutions?

This is a later research program.

---

# PART I — PRE-GATE RESEARCH CLOSURE

## 6. Pre-Gate Activity — Post-intervention behavioural characterisation

This activity occurs **before Gate A opens**.

It is not part of transfer stabilisation. It is the final prospective characterisation of the document-wide negative-scope intervention arising from the closed Advisory participation calibration work.

### 6.1 Purpose

Run a small prospective set of fresh behavioural probes under the current instruction pin to determine whether the improvement observed in the first post-intervention probe broadly persists.

The aim is to characterise behaviour, not to tune from individual examples.

### 6.2 Probe set

Recommended size:

> **5–8 prospectively defined probes.**

The set should vary at least the following conditions:

- participation present;
- participation absent;
- historical evidence only;
- incomplete recruitment information;
- unknown representativeness;
- unknown participant influence;
- ambiguous population coverage;
- different wording and service contexts.

Do not make all probes paraphrases of the original C fixture.

### 6.3 Measures

For each run record:

- provenance valid / invalid;
- required participation distinction preserved / not preserved;
- unsupported presence claim present / absent;
- unsupported absence claim present / absent;
- motive/internal-state inference present / absent;
- section/location of any leak;
- exact supporting span;
- human annotation;
- run disposition.

Do not create another regex classifier merely to score this set.

### 6.4 Stopping rule

> **No instruction change is made from a single observed failure.**

A further lived.md intervention is considered only if a recurrent pattern appears across multiple prospectively generated cases.

If a recurrent pattern justifies a new intervention:

1. preserve the original probe results;
2. document the recurring pattern;
3. implement the intervention prospectively;
4. validate it;
5. characterise the changed version separately;
6. only then open Gate A.

If no recurrent pattern justifies further change, preserve the characterisation result and proceed.

### 6.5 Completion criterion

Completion means **characterised**, not perfect.

This activity closes when the current intervention has been prospectively characterised to the predeclared stopping point and no uncompleted repair cycle remains.

Only then does Gate A open.

---

# PART II — TRANSFER GATES

## 7. Transfer-readiness architecture

The transfer roadmap has three principal gates.

### Gate A — Transfer-ready build and boundary conditions

The system is technically stable and procedurally bounded enough to hand to another person.

### Gate B — Transfer-ready method

The operating and evaluation method survives a clean stranger-style rehearsal without unresolved transfer-blocking tribal knowledge.

### Gate C — Independent run

A person who did not build PHDSS operates it under a predeclared protocol. Developer intervention contaminates independence and changes the run disposition.

No gate is passed by narrative judgment alone.

Each gate requires explicit evidence.

---

# GATE A — TRANSFER-READY BUILD AND BOUNDARY CONDITIONS

## 8. Gate A objective

Produce a bounded, auditable PHDSS baseline suitable for external testing.

Gate A is not about feature completeness.

It is about reducing technical and procedural ambiguity before another person touches the system.

---

## 9. Freeze the transfer baseline

Create a named transfer baseline after all Gate A work is complete.

The baseline must record:

- exact Git commit;
- exact runtime instruction pin;
- package-lock state;
- model configuration;
- validation result;
- known limitations;
- operator-facing version or tag;
- date of freeze.

The transfer baseline must not change during the first external evaluation except under a formally recorded restart condition.

### Evidence required

~~~text
Transfer baseline version:
Repository commit:
Instruction commit:
Package-lock identity:
Build timestamp:
Model:
Model settings:
Validation command:
Validation result:
Known limitation record locations:
~~~

### Failure condition

If code or instructions change during the evaluation without a declared restart, the study state is no longer frozen.

---

## 10. Governance provenance parity

Before external transfer, Governance mode must have provenance traceability equivalent in evidentiary strength to Advisory mode.

At minimum it must be possible to verify:

- run type;
- decision ID;
- deployment commit;
- instruction commit;
- instruction file(s);
- instruction normalisation version;
- instruction hash;
- system prompt hash;
- user-message hash;
- model;
- model settings;
- web/search state;
- evidence counts;
- output identifier;
- output hash.

The schema need not be byte-for-byte identical to Advisory mode if the execution path differs, but the evidentiary standard must be equivalent.

### Success criterion

A third party can provide a Governance request/output pair and an evaluator can independently determine which runtime state produced it.

### Failure condition

If provenance requires verbal explanation from the developer, Gate A is not complete.

---

## 11. Validation baseline

Run the canonical validation suite against the exact proposed transfer commit.

Record:

- command;
- commit;
- date;
- environment;
- output;
- failures if any;
- disposition.

If GitHub CI exists, record that separately.

Do not conflate:

- local validation;
- GitHub workflow validation;
- runtime behavioural validation.

### Success criterion

All required deterministic validations pass, or any accepted exceptions are explicitly documented and justified before handoff.

---

## 12. Known-limitations register

Prepare a concise transfer-facing limitations record.

It must include at minimum:

### Chair

- detector baseline;
- indirect/disguised adjudication weakness;
- what deterministic enforcement does and does not guarantee.

### Participation

- participation non-substitution invariant;
- Advisory calibration close-out;
- negative-scope leakage finding;
- rule-based measurement ceiling;
- post-intervention characterisation state.

### CORE activation policy

- CORE comprises two globally mandatory Directors (Systems, Safety), two additional CORE-fixed Directors (Equity, Lived Experience), and one adaptive fifth Director;
- the rationale for fixing Equity and Lived Experience is an attributed design judgment grounded in public health, digital health, and mental health practice;
- PHDSS is a Public Health Decision Stewardship System built from first principles; its governance architecture has been deliberately stress-tested outside health in housing-policy and geopolitical contexts, where the structural pipeline held;
- that structural-transfer evidence is separate from the Equity/Lived necessary-condition rationale, which remains a substantive design judgment grounded in public health, digital health, and mental health practice and has not itself been established as universal across sectors;
- inclusion of Equity and Lived Experience in CORE is specified, but special downstream enforcement of the necessary-condition rationale remains unverified;
- refusal, red-line, and HALT mechanisms must not be conflated; Ethics and Behaviour both claim active refusal semantics in their instruction text, but current runtime inspection shows no separately verified non-aggregable refusal/veto channel for either, so Ethics' uniqueness claim and the stronger runtime-refusal claim both require resolution before transfer claims are made;
- canonical rationale: `docs/CORE_ACTIVATION_POLICY.md`.

### General

- stochastic model behaviour;
- no claim of autonomous decision authority;
- no claim that model-generated analysis constitutes participation;
- no claim of institutional-effect evidence;
- no claim that all governance defects are detectable.

### Success criterion

A tester can read the limitations register and accurately explain the major known failure modes without asking the developer.

---

## 13. Test-data policy

The first transfer study uses:

> **Synthetic or deliberately de-identified fixtures only.**

The first transfer study explicitly prohibits:

- identifiable consumer information;
- identifiable carer information;
- identifiable staff information;
- sensitive workforce records;
- confidential live institutional cases;
- raw clinical records;
- real case material supplied informally during testing.

### Rule

No "while we are here, can we try this real case?" exception.

If later work uses real institutional data, that becomes a separate governed protocol covering:

- approvals;
- lawful basis;
- consent where applicable;
- data minimisation;
- redaction;
- storage;
- access control;
- retention;
- deletion;
- model-provider handling;
- exports;
- audit access.

### Failure condition

If identifiable real material is introduced during the first study, the run stops and is not treated as part of the synthetic transfer evaluation.

---

## 14. Gate A exit criteria

Gate A closes only when all of the following are true:

- pre-Gate behavioural characterisation has already closed;
- transfer baseline is frozen;
- Governance provenance parity is adequate;
- required validation has passed or documented exceptions have been accepted;
- known limitations are consolidated;
- synthetic-only test-data policy exists;
- no unresolved technical issue prevents a clean handoff.

Gate A output:

> **Transfer Candidate Build**

---

# GATE B — TRANSFER-READY METHOD

## 15. Gate B objective

Remove the creator as an undocumented operational dependency before any external participant is asked to test PHDSS.

This gate is primarily about documentation, procedure, reproducibility, and clean retesting.

---

## 16. Operator package

The operator package is written for someone competent but unfamiliar with PHDSS.

It must not assume prior knowledge of:

- Governance Engineering;
- the development history;
- Chair calibration;
- participation calibration;
- internal terminology beyond what the guide introduces.

The operator package must include the following.

### 16.1 What PHDSS is

A concise explanation of:

- purpose;
- authority model;
- major pipeline stages;
- human role;
- system limitations.

The operator must understand:

> PHDSS is a reasoning and governance-record system, not an autonomous decision-maker.

### 16.2 What PHDSS is not

State explicitly that PHDSS:

- does not make the institutional decision;
- does not confer legitimacy;
- does not establish participation merely by analysing lived experience;
- does not guarantee factual correctness;
- does not guarantee detection of every authority violation;
- does not replace expert review;
- does not replace required institutional governance.

### 16.3 Installation instructions

From a clean environment document:

- prerequisites;
- clone;
- install;
- configure;
- validate;
- build;
- run.

Every command must be executable as written.

Avoid undocumented assumptions such as:

- expected shell;
- pre-existing environment variables;
- hidden local files;
- unpublished API settings;
- implicit browser configuration.

### 16.4 API/model setup

Document:

- required provider access;
- where keys go;
- how keys are handled;
- required model;
- expected model settings;
- web-search defaults;
- what happens when access fails.

### 16.5 Mode selection

Explain clearly:

- Advisory;
- Governance;
- CORE;
- FULL;
- CHAIR SPECIFIED where applicable.

For transfer testing, specify which mode the participant should use for each fixture unless mode selection itself is being studied.

### 16.6 Evidence handling

Explain:

- what counts as supplied evidence;
- how files are attached;
- what web-search state means;
- what session evidence means;
- how absence of evidence should be interpreted;
- why model inference is not equivalent to human evidence.

### 16.7 Running a scenario

Provide a literal sequence:

1. Start PHDSS.
2. Confirm build/version.
3. Enter API key.
4. Select required mode.
5. Load scenario.
6. Load evidence if instructed.
7. Run.
8. Wait for completion.
9. Export required artifacts.
10. Record any errors.
11. Do not retry unless the protocol permits.

### 16.8 Export requirements

Specify exactly what the tester must preserve, including as applicable:

- final analysis;
- governance record;
- request sidecar;
- Decision Ledger;
- logs;
- hashes;
- required screenshots;
- error messages.

### 16.9 Failure handling

Explain what to do if:

- model call fails;
- output truncates;
- provenance mismatch occurs;
- validation fails;
- page crashes;
- required section is absent;
- export fails;
- runtime pin appears wrong;
- browser state seems stale.

The operator must not need to invent recovery steps.

---

## 17. Evaluator package

The evaluator package is distinct from the operator guide.

The tester should not need to know the expected outcome of every scenario.

The evaluator package contains:

- study objective;
- predeclared measures;
- success thresholds;
- intervention rules;
- contamination rules;
- scenario IDs;
- expected artifact set;
- analysis template;
- scoring or annotation protocol where appropriate.

This separation reduces the risk of teaching the tester how to produce the desired result.

---

## 18. Frozen scenario set

Prepare a small external-test corpus.

Recommended:

> **6–10 scenarios.**

Suggested scenario types:

### Scenario 1 — Ordinary low-risk decision

Purpose: establish normal operation without making every test adversarial.

### Scenario 2 — Cross-domain tension

Purpose: test whether disagreement is understandable and unresolved tension remains visible.

### Scenario 3 — Missing evidence

Purpose: test uncertainty handling and whether absent evidence is mistaken for negative evidence.

### Scenario 4 — Conflicting evidence

Purpose: test whether the system preserves conflict instead of flattening it.

### Scenario 5 — Participation-sensitive case

Purpose: test distinction between model-generated analysis, supplied lived evidence, and actual participation.

### Scenario 6 — Chair authority-pressure case

Purpose: test whether synthesis remains non-adjudicative.

### Scenario 7 — Ambiguous or incomplete governance record

Purpose: test visible uncertainty.

### Optional Scenarios 8–10

May introduce:

- implementation constraints;
- equity tensions;
- safety trade-offs;
- mixed signals across Directors.

All scenarios are frozen before external testing.

---

## 19. Stranger test — central transfer hinge

The stranger test is a formal transfer gate, not an informal rehearsal.

### Objective

Determine whether the handoff materials are sufficient when the creator is not allowed to rely on memory.

Use:

- clean clone;
- clean environment where practical;
- no undocumented files;
- no hidden notes;
- only the intended operator materials.

### Governing rule

> **Any need for tribal knowledge is a transfer defect.**

Examples include:

- "I know where this config lives."
- "I know that error can be ignored."
- "I know which button to press next."
- "I know the browser needs a hard refresh."
- "I know this field should contain that SHA."
- "I know this output is normal."
- "I know this retry is safe."
- "I know what that warning really means."

Each becomes a logged defect.

No silent correction.

---

## 20. Stranger-test defect log

Each defect records:

~~~text
Defect ID:
Date:
Step:
Observed problem:
What tribal knowledge was required:
Category:
  documentation
  UX
  runtime
  provenance
  setup
  interpretation
  recovery
  evaluation
Severity:
Workaround:
Permanent repair:
Retest required:
Retest result:
Disposition:
~~~

---

## 21. Stranger-test defect severity

Use three levels.

| Severity | Meaning | Gate consequence |
|---|---|---|
| **T1 — Transfer blocker** | Prevents independent completion, provenance verification, safe operation, or correct understanding of a constitutional boundary | **Must be resolved and cleanly retested before Gate B can close** |
| **T2 — Material friction** | Does not prevent completion but creates significant ambiguity, delay, avoidable error risk, or likelihood of asking the developer for help | Must be repaired and retested **or explicitly accepted with rationale and recorded as a known transfer limitation** |
| **T3 — Minor friction / presentation** | Cosmetic, stylistic, or low-consequence usability issue that does not threaten independence or interpretation | May remain open if logged; does not block Gate B |

### Automatic elevation rule

Any issue involving the following domains is T1 whenever misunderstanding could materially affect the evaluation:

- authority;
- participation;
- provenance;
- data handling;
- failure visibility.

These categories cannot be negotiated down to T2 merely to avoid blocking the gate.

### T2 acceptance requirements

An accepted T2 exception requires:

- exact defect documented;
- reason for non-repair documented;
- evidence that it does not require developer intervention;
- likely effect on tester recorded;
- acceptance decision made before Gate C;
- confirmation that it does not involve an automatic-elevation domain.

---

## 22. Stranger-test repair and retest rule

A stranger-test defect is not closed merely because a repair has been written or implemented.

> **A defect is closed only when a subsequent clean stranger-test pass demonstrates that the affected step can be completed without relying on the original tribal knowledge.**

Repairs must therefore be **retested prospectively**.

The person conducting the retest must follow the revised operator materials rather than relying on memory of the earlier failure or its repair.

The sequence is:

> **detect → repair → rerun → verify**

not:

> **detect → edit → assume fixed**

---

## 23. Gate B completion standard

Gate B requires:

- operator guide complete;
- evaluator protocol complete;
- scenario set frozen;
- intervention rule sealed;
- test-data policy understood;
- stranger test completed;
- zero unresolved T1 transfer blockers;
- every repaired T1 prospectively retested;
- any accepted T2 explicitly documented before Gate C;
- transfer candidate revalidated after material repairs.

Gate B does **not** require zero known defects.

Gate B output:

> **Independent Test Package**

---

# GATE C — INDEPENDENT EXTERNAL RUN

## 24. Gate C objective

Obtain the first credible evidence that PHDSS can be operated and understood without its creator.

The external tester is not treated as a collaborator during the run.

They are an independent operator.

---

## 25. Tester characteristics

For the first handoff, the tester should ideally be:

- professionally competent;
- reasonably familiar with governance, health, public-sector decision-making, evaluation, or an adjacent domain;
- not involved in building PHDSS;
- not previously coached in its internal mechanics;
- able to follow technical instructions;
- willing to document friction honestly.

They do not need to be an AI engineer.

A non-developer professional may provide a more useful first transfer test.

---

## 26. Pre-test briefing

The tester receives:

- operator guide;
- synthetic-only test-data policy;
- scenario instructions;
- required artifact list;
- minimal explanation of purpose;
- support/intervention rule.

Do not brief them on:

- expected "correct" findings;
- which scenario is adversarial;
- which known defects are being tested;
- desired judgments.

---

## 27. Intervention rule

This rule is fixed before the first run.

> **The tester completes the run using only the supplied materials. Any clarification, troubleshooting, interpretation, or procedural assistance from the developer after the run begins is an intervention.**

Examples include:

- explaining what a button does;
- suggesting which mode to choose;
- helping interpret an error;
- recommending a retry;
- clarifying an output;
- explaining whether a result is normal;
- fixing environment configuration;
- explaining an authority concept not adequately documented.

---

## 28. Intervention disposition

### Independent

No developer intervention required.

Eligible as independent transfer evidence.

### Assisted

One or more developer interventions occurred.

The run is preserved.

Record:

- exact trigger;
- exact intervention;
- time;
- whether the run resumed;
- resulting artifacts.

It must **not** be counted as an independent transfer success.

### Aborted

The run could not continue safely or meaningfully.

Preserve the failure.

Do not replace it with a clean rerun without retaining the failed run.

---

## 29. No retroactive upgrading

A run cannot become "independent" after the fact because:

- assistance was minor;
- the tester basically understood it;
- the developer only answered one question;
- the problem was easy to fix;
- the tester would probably have worked it out.

Intervention is procedural, not subjective.

---

## 30. External-run measures

The first transfer study measures at least the following.

### Operability

Can the tester:

- install;
- validate;
- start;
- configure;
- run;
- export?

### Provenance

Do produced artifacts contain sufficient provenance?

Can an evaluator independently verify them?

### Authority comprehension

Can the tester correctly state:

- who makes the decision;
- what the Chair does;
- what AI does not have authority to do?

### Participation comprehension

Can the tester distinguish:

- model-generated representation;
- human-supplied lived evidence;
- actual participation?

### Uncertainty comprehension

Can the tester identify:

- unresolved uncertainty;
- missing evidence;
- disagreement;
- fragility signals;
- limitations?

### Failure legibility

If something fails:

- is the failure visible;
- does the tester know that something failed;
- can they preserve the evidence?

### Usability

Where do they become confused, delayed, or uncertain?

### Interpretability

Can they explain the governance record in their own words without developer explanation?

---

## 31. Suggested qualitative questions

After the run, ask:

- What did you think PHDSS was doing?
- What did you think it was not doing?
- Who did you think had authority to make the final decision?
- Which parts of the output did you trust most?
- Which parts did you trust least?
- Where was uncertainty visible?
- Where was disagreement visible?
- Was anything presented more confidently than you expected?
- Did anything feel like a recommendation when it should not have?
- Could you distinguish supplied evidence from AI-generated analysis?
- Did you understand whether affected people had actually participated?
- At what point, if any, did you want to ask the developer for help?
- What did you find hardest to operate?
- What did you find hardest to interpret?
- What information was missing from the operator materials?
- Would you use this again for another bounded governance problem?
- What would stop you?

---

## 32. Predeclared transfer success criteria

Before testing begins, success is defined.

A first-run independent transfer success requires **all** of the following:

- tester completes the required run;
- no developer intervention;
- required artifacts are exported;
- provenance is valid;
- tester correctly identifies that human governance retains decision authority;
- tester does not mistake model-generated lived-experience reasoning for actual participation;
- tester identifies major uncertainty or disagreement present in the record;
- no silent system failure invalidates the run.

This is intentionally stricter than:

- "the tester liked it";
- "the output looked good";
- "they basically understood it."

---

## 33. Partial success

A first independent attempt may still produce valuable evidence without meeting the full transfer criterion.

Examples:

- operation succeeds, interpretation fails;
- operation fails due to documentation;
- provenance succeeds but export UX fails;
- tester understands authority but misreads participation;
- intervention is required for one technical issue.

These are not null results.

They identify the next transfer bottleneck.

---

## 34. Failure interpretation

A failed external transfer run does not automatically imply that PHDSS architecture is invalid.

Possible failure locations include:

- documentation;
- interface;
- setup;
- terminology;
- provenance;
- conceptual communication;
- runtime stability;
- evaluation design;
- architecture.

The task after a failed run is to identify which layer failed, not collapse every failure into "PHDSS does not work."

---

## 35. Change-control rule during transfer testing

Once Gate C begins:

> **Do not repair the system mid-study and continue pretending all runs belong to the same version.**

If a material change is needed:

1. preserve the failed run;
2. log the defect;
3. close or pause the current tranche;
4. repair prospectively;
5. create a new version;
6. revalidate;
7. declare a new transfer tranche.

This mirrors the calibration discipline already established elsewhere in PHDSS.

---

## 36. Transfer stopping rules

Stop or pause if:

- identifiable real data is introduced;
- provenance becomes invalid;
- build version cannot be verified;
- developer intervention becomes extensive;
- environment failure makes further runs non-comparable;
- the tester is inadvertently shown expected outcomes;
- a major architecture defect changes the meaning of the evaluation;
- study materials require substantial revision.

A stop is not a failed research program.

It is a valid outcome of a fail-closed transfer protocol.

---

## 37. Post-run finding classification

Do not immediately optimise from every observation.

Classify findings.

### Category A — Transfer blocker

Prevents independent operation.

Examples:

- undocumented setup;
- mandatory developer intervention;
- unusable export;
- ambiguous runtime state.

Fix before the next independent tranche.

### Category B — Interpretive defect

Tester can operate PHDSS but misunderstands a core concept.

Examples:

- thinks Chair decides;
- thinks lived analysis equals participation;
- misses uncertainty.

Likely requires documentation, UI, or conceptual framing repair.

### Category C — Behavioural defect

PHDSS itself produces problematic behaviour.

Examples:

- authority overreach;
- unsupported certainty;
- participation inflation;
- provenance inconsistency.

Requires separate engineering/evaluation treatment.

### Category D — Usability friction

Slows the user but does not invalidate the run.

Track and prioritise.

### Category E — Preference

User would prefer different wording or presentation.

Do not automatically treat as a defect.

---

## 38. Evidence package after Gate C

At the end of the first transfer tranche, preserve:

- exact tested build;
- operator guide version;
- evaluator protocol version;
- scenario set and hashes;
- tester instructions;
- intervention log;
- all request artifacts;
- all outputs;
- all provenance records;
- failure logs;
- tester feedback;
- evaluator annotations;
- disposition of each run;
- summary of what transfer did and did not establish.

---

## 39. Earned claim after a successful first transfer

If Gate C succeeds, the earned claim is bounded:

> **Under a bounded synthetic test protocol, a competent person who did not build PHDSS was able to operate the system using supplied documentation, produce an auditable governance record, correctly understand the human authority boundary and key uncertainty structures, and complete the run without developer intervention.**

It would **not** establish:

- general usability;
- broad institutional validity;
- improved decision outcomes;
- effectiveness across all health settings;
- population-level safety;
- superiority to existing governance methods.

---

# PART III — AFTER INITIAL TRANSFER

## 40. Later evaluation stages

Only after independent operation is demonstrated should the project move into a broader evaluation program.

### Stage 1 — Replication

Multiple independent users.

Different professional backgrounds.

Same frozen corpus.

Question:

> Does transfer replicate?

### Stage 2 — Comparative evaluation

Compare PHDSS with an appropriate alternative.

Potential outcomes include:

- reasoning breadth;
- uncertainty visibility;
- authority clarity;
- disagreement preservation;
- decision-maker comprehension;
- time burden;
- usability.

### Stage 3 — Low-risk institutional pilot

Bounded real-world decisions.

Human governance retains full authority.

Explicit institutional approval.

Defined monitoring.

### Stage 4 — Institutional-effect study

Test whether PHDSS changes:

- reasoning quality;
- decision traceability;
- implementation readiness;
- error detection;
- stakeholder confidence;
- governance learning;
- decision revision behaviour.

---

# PART IV — RESEARCH DISCIPLINE

## 41. Research discipline carried forward

The transfer program inherits the following rules from the PHDSS calibration work.

### 41.1 No silent repair

Failures remain part of the record.

### 41.2 No retroactive rescoring

Later instruments do not rewrite historical outcomes.

### 41.3 No result-shopping

A failed run is not replaced by a successful rerun without preserving both.

### 41.4 No assumption of transfer

Documentation that looks clear to the creator is not evidence that it is clear to another user.

### 41.5 No intervention laundering

Assisted runs do not become independent runs after the fact.

### 41.6 No expansion before necessity

Do not add major features merely because they are technically possible before transfer is tested.

### 41.7 Known limitations travel with the system

A release is a disclosed evidence state, not a claim of finished perfection.

---

## 42. Core methodological principle

The same governance logic applied inside PHDSS governs the research process used to evaluate PHDSS.

> **The stopping rule governs the researcher, not just the model.**

Likewise:

> **Transfer criteria govern the developer, not just the tester.**

If the developer must intervene, the run is assisted.

If tribal knowledge is required, the documentation or method is incomplete.

If the version changes, the tranche changes.

If evidence is missing, the claim remains bounded.

This is not administrative overhead.

It is part of the evidentiary architecture of the project.

---

## 43. Immediate work sequence

Run the next phase in this order:

1. **Governance provenance hardening.**
2. **Pre-Gate behavioural characterisation: 5–8 prospective probes.**
3. **Resolve any intervention justified by the predeclared recurrence rule, if required.**
4. **Close the behavioural characterisation and formally open Gate A.**
5. **Freeze the transfer baseline.**
6. **Complete the limitations register.**
7. **Establish the synthetic-only test-data policy.**
8. **Run and record transfer-candidate validation.**
9. **Write Operator Guide v1.**
10. **Write Evaluator Protocol v1.**
11. **Freeze the external-test scenario pack.**
12. **Seal intervention and contamination rules.**
13. **Run the stranger test.**
14. **Repair and prospectively retest all T1 transfer blockers.**
15. **Resolve or explicitly accept eligible T2 issues before Gate C.**
16. **Revalidate and freeze the Independent Test Package.**
17. **Run the first external independent test.**
18. **Preserve and analyse the transfer evidence.**
19. **Decide whether to repair, replicate, or progress to comparative testing.**

---

## 44. Gate summary

| Gate | Question | Required result |
|---|---|---|
| **Pre-Gate characterisation** | Has the current negative-scope intervention been prospectively characterised without tuning from n=1? | 5–8 probes completed to the predeclared stopping rule |
| **A — Transfer-ready build** | Is the technical and evidentiary baseline stable enough to hand over? | Frozen build, provenance, validation, limitations, data policy |
| **B — Transfer-ready method** | Can the workflow be followed without transfer-blocking tribal knowledge? | Operator package, stranger test, zero unresolved T1 blockers, accepted T2s documented |
| **C — Independent run** | Can another person actually operate and understand PHDSS without developer intervention? | Valid independent run and preserved audit trail |

---

## 45. Definition of transfer readiness

PHDSS is ready for first external independent testing when:

> **A clean, frozen, validated build can be operated from supplied documentation alone; the permitted data boundary is clear; required artifacts and provenance can be generated and independently checked; known limitations are disclosed; the stranger-test cycle has no unresolved T1 transfer blockers; any accepted T2 limitations have been explicitly documented and justified before testing; and the intervention protocol has been fixed in advance.**

---

## 46. Definition of initial transfer success

The first transfer milestone is achieved when:

> **A competent person who did not build PHDSS can run a bounded synthetic governance scenario through the system, produce the required audit artifacts, correctly understand the human authority boundary and major unresolved uncertainty, and complete the task without developer intervention.**

That is the milestone to optimise for now.

Not a better internal score.

Not another Director.

Not a larger architecture.

> **The first credible result that does not require the creator.**

---

## 47. Final transfer principle

> **The build does not need to be flawless to be testable. The test itself does need to be procedurally clean to count as independent.**
