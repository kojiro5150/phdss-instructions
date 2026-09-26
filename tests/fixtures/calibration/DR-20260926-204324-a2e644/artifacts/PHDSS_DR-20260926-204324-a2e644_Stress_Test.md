===================================================================
  PHDSS - PUBLIC HEALTH DECISION STEWARDSHIP SYSTEM
  STRESS_TEST
===================================================================
  Document ID:    DR-20260926-204324-a2e644
  Generated:      26/09/2026, 9:45:54 pm AEST
  Classification: GOVERNANCE IN CONFIDENCE
  Currency:       Australian Dollars (AUD)
-------------------------------------------------------------------
  Decision:       Should St Elsewhere convert its 6-bed Statewide Child Unit to a Hospital in the Home (HITH) model?
  Signal:         A service redesign is being considered that would replace or substantially reduce the existing 6-bed metropolitan inpatient model with a statewide Hospital in the Home model. The purpose of this analysis is to make the decision space larger and more legible before humans decide, including identifying benefits, constraints, uncertainties, affected groups, operational dependencies and credible alternative pathways.
  Context:        Large Australian public health service operating a statewide tertiary child and adolescent mental health service. The decision involves clinical care, workforce, family experience, statewide access, safety, service configuration, legal and regulatory obligations, implementation feasibility and resource stewardship. Decision authority remains with the responsible human governance body.
St Elsewhere operates one of two statewide tertiary child and adolescent mental health inpatient services for children aged 12 years and under. The service has a statewide catchment that includes inner-metropolitan, regional and remote families.  
The current model is a family-admission model: families travel to the metropolitan inpatient unit and stay with the child during admission. Specialist child psychiatry and nursing capability is concentrated in metropolitan services, with a strong allied health component. There is currently no established regional outreach model equivalent to the inpatient service.  
The proposal is to consider converting the existing 6-bed Statewide Child Unit to a Hospital in the Home model, dispersing care from the metropolitan inpatient setting into children’s homes across the statewide catchment.
A second child inpatient unit provides services to approximately the other half of the state. St Elsewhere is therefore one of two statewide providers, not the sole provider.
===================================================================
## EXECUTIVE LAYER

The decision's most consequential fragility is structural rather than operational: the model's safety architecture depends on three load-bearing assumptions — a legally confirmed involuntary treatment pathway, an operationally committed second statewide service fallback, and verified regional and remote connectivity — none of which is established, and the first requires legislative or regulatory resolution outside the organisation's administrative control. The single most significant cascade finding is that these three unverified assumptions are not independent failure modes but mutually reinforcing: the scenario in which all three are simultaneously absent — an acute involuntary presentation in a remote child, HITH team cannot attend physically, second service at capacity, connectivity degraded — has no demonstrated safe resolution, and is predictable rather than improbable given the population's acuity profile and the statewide catchment's geography.

**Fragility Score**: 9/10 — the score reflects a model whose safety architecture rests entirely on structural prerequisites that are simultaneously unverified, mutually load-bearing, and partially unresolvable through administrative action alone. (10 = extremely fragile)

---

**Decision Under Test**

St Elsewhere proposes to convert its 6-bed Statewide Child Unit — a tertiary-acuity inpatient psychiatric service for children aged 12 and under, serving a statewide catchment including regional and remote areas — to a Hospital in the Home (HITH) model in which clinical care is delivered in the child's home environment by a metropolitan-based specialist team, with remote monitoring and telehealth oversight as primary clinical mechanisms.

*Assumed in scope* (not confirmed in the decision text): the conversion applies to the full 6-bed inpatient capacity; the statewide catchment is retained under the HITH model; the specialist workforce currently employed in the inpatient unit transitions to HITH delivery; and a second statewide inpatient service is assumed to function as the escalation fallback.

*Assumed out of scope* (not confirmed): legislative change to the applicable state Mental Health Act; new capital or infrastructure investment; creation of a new regional outreach workforce; and any parallel inpatient capacity retained during a transition period.

These scope assumptions are analytically necessary for the cascade analysis and are labelled as such — the decision text does not confirm them.

---

**Assumptions Used (Explicit)**

- **The conversion is full, not staged, and the inpatient unit ceases to operate as the primary care setting** — *provided* (the decision frames "conversion," not "pilot" or "staged transition"; not confirmed as full conversion)
- **The statewide catchment is retained under the HITH model, including regional and remote enrolments** — *provided* (the statewide framing is explicit; regional and remote delivery capacity is not verified)
- **The second statewide inpatient service will function as the escalation fallback** — *provided* (stated in the proposal's architecture; not confirmed by the second service; structural feasibility unassessed)
- **Digital connectivity and telehealth infrastructure are adequate across the statewide catchment** — *provided* (asserted in the proposal; not verified at individual address level — Digital & AI Governance)
- **Family carers are the primary clinical observers and deterioration escalators in the home setting** — *inferred* (follows from the structural logic of HITH at this acuity level; not explicitly confirmed as a design feature)
- **Specialist workforce (child psychiatry, nursing, allied health) is currently concentrated in metropolitan settings** — *inferred* (characterised across multiple Directors; not quantified)
- **The current inpatient unit has no confirmed structured, extractable baseline outcome dataset** — *inferred* (Measurement & Evidence Integrity identifies this as unconfirmed; absence not confirmed)
- **The applicable state Mental Health Act has not been confirmed as legally compatible with involuntary assessment, treatment, and detention in a home setting** — *provided* (characterised across eight Directors; formal legal opinion not obtained)
- **St Elsewhere's delegated authority to make this reconfiguration without ministerial approval is unconfirmed** — *provided* (Policy & Power; not independently verified)
- **The HITH model's safety architecture depends on all three load-bearing assumptions simultaneously** — *inferred* (follows from the cascade structure; no single assumption independently sustains the model's safety)
- **Under surge conditions, the second statewide service may face competing demand that reduces available capacity** — *speculative* (used to chain the capacity gap finding [Capacity & Constraints] with the escalation pathway finding [Safety, Quality & Harm] into a simultaneous-failure cascade; not established as a confirmed operational condition of the second service)
- **Referrers will adapt their behaviour toward informal routing of complex presentations away from HITH over time** — *speculative* (used to connect the scope compression finding [Behaviour & Implementation] with the equity drift finding [Measurement & Evidence Integrity] into a delayed acuity-drift cascade; not confirmed as a referral pattern that has or will emerge)

---

**Plausible Failure Cascade (Worst-Case, Stepwise)**

*The cascade is constructed from Director-identified risks chained into a plausible sequence. Speculative links are labelled. The cascade is not the only failure pathway — it is a credible one.*

**Step 1 — Implementation proceeds without confirmed legal authority or legal opinion on involuntary treatment viability**
The governance authority question (Policy & Power) and the involuntary treatment legal gap (eight Directors) are unresolved at implementation. The institution proceeds on the assumption that these are administrative matters to be resolved during operation. This is the initiating condition: the model is structurally exposed from the first enrolment.

**Step 2 — A child in a regional or remote setting presents with acute psychiatric deterioration requiring assessment for involuntary treatment**
This is not a low-probability event — it is a predictable presentation type in a tertiary-acuity child psychiatry service (Safety, Quality & Harm). The child is enrolled in HITH; the family has contacted the metropolitan team with deterioration signals. The team cannot attend physically from metropolitan location within a clinically safe window. The involuntary treatment pathway requires a medical practitioner or authorised officer to be physically present under the applicable Mental Health Act — a procedural requirement that has not been confirmed as satisfiable in a home setting.

**Step 3 — The team attempts to activate the second statewide service as the escalation fallback**
The second service has not confirmed capacity, intake criteria, or a formal escalation protocol (eleven Directors). Under concurrent demand — *speculative: assumed surge conditions at the second service at the time of this escalation* — the second service is at or near capacity and cannot confirm immediate acceptance. No formal agreement specifying priority intake for HITH escalations exists. The escalation call is managed through informal clinical relationships rather than a binding protocol.

**Step 4 — Emergency services are activated as the only available response mechanism**
Emergency services are contacted. They do not have confirmed paediatric psychiatric capability in the regional area (Safety, Quality & Harm). The response is delayed by geographic distance. The child's family — functioning as the primary clinical observer — is now managing an acute involuntary psychiatric presentation in a home environment without clinical support present.

**Step 5 — The harm event occurs before clinical support arrives**
The child experiences a harm event — self-injury, attempted elopement, physical aggression — in the home setting. The family carer is unable to manage the clinical situation. The event occurs in the gap between the team's awareness of deterioration and the arrival of any clinically capable response.

**Step 6 — Post-event review reveals compounding governance failures**
Review identifies: no formal legal opinion on the involuntary treatment pathway was obtained before implementation; no formal escalation protocol with the second service was executed; no connectivity verification was conducted for this child's address; the family's monitoring role was not documented as an explicit, informed care agreement; and the governance authority for the reconfiguration itself was not confirmed before implementation. Each of these is individually identifiable as a structural failure — together they constitute a governance record that has no defensible foundation for the model's operation.

**Step 7 — Political and reputational consequences constrain the governance response**
The adverse event becomes publicly visible. The equity framing of the model — which was publicly endorsed — creates political pressure to attribute the event to implementation failures rather than model design failures (Policy & Power, Ethics & Influence Risk). The governance response is shaped by reputational management rather than clinical safety learning. The structural prerequisites that were absent before implementation are now characterised as things that "should have been in place" rather than things that made the model structurally unsafe from the start. The institutional learning that would prevent recurrence is suppressed by the accountability ambiguity created by the diffuse governance structure.

**Step 8 — Reversal is attempted but constrained**
The Board moves to pause or reverse the model. Specialist inpatient staff have redeployed, transferred, or left. The operational knowledge and workforce relationships that sustained the inpatient unit are no longer concentrated in the institution. Physical reconstitution of the inpatient model requires workforce recruitment, credentialling, and operational restart on a timeline of months to years. During the reconstitution period, there is no statewide tertiary child psychiatric inpatient service and no viable HITH alternative. The state-level access gap is acute.

---

**Second-Order & Delayed Consequences**

**Delayed harm 1 — Family carer burden accumulation (time lag: weeks to months)**
Family carers absorbing clinical observation, deterioration recognition, and escalation initiation functions will experience burden accumulation that is invisible to governance (Ethics & Influence Risk, Lived Experience, Health Economics). The governance record will show stable enrolment and low formal escalation rates — consistent with a model appearing to function — while carer burnout accumulates. The signal will not appear until a carer collapse triggers an emergency welfare or child protection intervention, at which point the burden has already exceeded the safety threshold. The time lag between burden onset and governance visibility is the primary mechanism by which this harm is delayed.

**Delayed harm 2 — Scope compression and acuity drift (time lag: months)**
Clinicians operating in geographic isolation without inpatient backup will progressively narrow the presentations they accept as manageable under HITH (Behaviour & Implementation). This compression is not a policy decision — it is a behavioural adaptation to structural conditions. The consequence is that the model's enrolment profile drifts toward lower-acuity presentations while higher-acuity cases are either rejected at triage or managed through informal routing to the second statewide service or emergency departments. The HITH outcome data will appear favourable because the enrolled population is no longer the intended population. The equity harm — that the highest-acuity regional and remote children are now without a viable service — will not appear in HITH metrics.

**Risk migration 1 — From inpatient setting to family home**
Clinical risk does not disappear when a child moves from inpatient to home care — it migrates to a setting with lower clinical intensity, less monitoring infrastructure, and a primary observer (the family carer) who has no clinical training obligation and no institutional accountability. The risk is not reduced; it is relocated to a setting where it is harder to detect and harder to manage (Systems & Dynamics, Safety, Quality & Harm).

**Risk migration 2 — From HITH governance to the second statewide service**
If the shadow triage system forms — referrers informally routing complex cases to the second statewide service — the second service absorbs increasing clinical load without a corresponding formal agreement, resourcing adjustment, or governance acknowledgment. The second service's capacity and governance architecture are not designed for this load. The risk migrated from HITH's governance record to the second service's operational environment, where it is invisible to St Elsewhere's governance mechanisms.

**Feedback loop 1 — Escalation underreporting amplifies apparent safety**
Each deterioration event managed informally rather than formally logged reduces the apparent escalation rate. A lower apparent escalation rate reduces the perceived urgency of establishing formal escalation protocols. Reduced urgency reduces the likelihood that protocols are established. This is a reinforcing feedback loop in which the absence of governance infrastructure makes the model appear safer than it is, which reduces the pressure to build the governance infrastructure that would make it actually safer (Measurement & Evidence Integrity, Behaviour & Implementation).

**Feedback loop 2 — Political endorsement suppresses course correction**
Once the model is publicly endorsed under an equity framing, adverse signals — escalation events, family burden reports, acuity drift — are institutionally filtered through a reputational management lens before reaching governance decision-makers (Policy & Power, Ethics & Influence Risk). The political cost of acknowledging model failure increases with each public endorsement. This creates a reinforcing loop in which the model's public legitimacy grows while its clinical safety evidence base degrades, and the divergence between the two is invisible until a high-visibility adverse event forces disclosure.

**Success-to-fragility dynamic — Early enrolment success masks structural exposure**
If the initial enrolments are lower-acuity presentations in metropolitan areas — a predictable early pattern given clinician risk aversion and referrer uncertainty — the model will appear to be functioning well. Early apparent success will generate momentum for geographic expansion into regional and remote settings before the structural prerequisites for safe remote delivery are established. The early success is real but derived from a population that does not stress-test the model's safety architecture. Expansion into the population that does stress-test it — high-acuity, remote, involuntary-treatment-requiring — occurs on the basis of evidence generated from a different population. The fragility is that the model's safety record, at the point of regional expansion, reflects conditions that will not hold under regional operation.

---

**Reversal Test (Risks if the opposite decision is taken)**

**Risks of not acting (retaining the current inpatient model)**

The current 6-bed inpatient model imposes real, documented access barriers on regional and remote families: mandatory travel to metropolitan settings, co-residence requirements, separation from community and cultural support, and financial and logistical burdens that are disproportionately borne by Aboriginal and Torres Strait Islander families and those with limited resources (Innovation & Improvement, Equity & Human Rights, Lived Experience). Retaining the current model means these harms continue to accumulate without governance visibility — Innovation & Improvement identifies that the current model's harms are real but unquantified and inadequately governed. Non-action is not a harm-free posture.

Retaining the inpatient model also forecloses the learning opportunity that a structured HITH pilot would generate. The evidence base for distributed tertiary child mental health care in the Australian context does not exist; it can only be generated through implementation. Indefinite deferral means that future children who might benefit from a demonstrated HITH model bear the cost of the current model's harms for longer.

The status quo may also be generating access failures that are not appearing in any governance record: regional and remote families who do not present at all because the access barriers are prohibitive. These non-presentations are invisible to the current governance architecture and are not counted in any safety or outcome metric.

**Risks of delaying (conditional deferral pending prerequisites)**

If deferral is contingent on prerequisites whose resolution timelines are not specified, deferral may function as indefinite suspension rather than a time-bounded governance commitment. The involuntary treatment legal gap requires legislative or regulatory action on a timeline outside the organisation's control; the workforce development gap has a multi-year horizon; the second service negotiation depends on another institution's willingness and capacity. If any of these timelines extends beyond what is politically or institutionally sustainable, the deferral converts into non-implementation without a formal decision to that effect — and the equity harm of the current model continues without a governance record of why.

Delay also risks losing the institutional momentum and workforce commitment that the proposal has generated. If specialist staff who are willing to operate in a HITH model perceive indefinite deferral as institutional abandonment of the model, they may leave or redirect their practice. The workforce asset that makes HITH operationally possible may erode during the deferral period.

**Risks of choosing an alternative direction (partial or hybrid model)**

A hybrid model — retaining some inpatient capacity while introducing HITH for lower-acuity or metropolitan presentations — distributes resources across two care modalities, potentially producing neither a viable inpatient unit nor a viable HITH service. Capacity & Constraints identifies that the inpatient model's safety depends on sufficient occupancy to sustain specialist team competency and operational culture; a reduced-capacity inpatient unit may be less safe than either a full inpatient unit or a well-resourced HITH model. The hybrid may create two structurally fragile services rather than one viable one.

A metropolitan-only HITH pilot — the most cautious staged option — does not address the legal gap for involuntary treatment in a home setting; it defers it. It also does not generate evidence about regional and remote delivery, which is the equity claim that animates the proposal. A metropolitan-only pilot may produce evidence that is not generalisable to the population and setting for which the model is most needed.

---

**Impact Surface (Who/where/when harms or benefits concentrate)**

**Who bears the downside risk**

*Children with the highest acuity presentations* bear the most acute downside risk: the model's safety architecture is least robust for the presentations that are most dangerous — acute psychiatric crises requiring involuntary intervention, rapid deterioration, or physical management. These children are most likely to be harmed by the legal pathway gap and the escalation architecture failure.

*Regional and remote children and families* bear the geographic downside risk: they are enrolled in a model whose delivery infrastructure is unverified for their settings, whose escalation pathways are slowest for their locations, and whose connectivity assumptions are least reliable for their addresses. They are also the population for whom the equity claim is strongest — meaning the population most likely to be enrolled on the basis of the equity aspiration is the population for whom the model's safety architecture is most exposed.

*Aboriginal and Torres Strait Islander families* are disproportionately represented in regional and remote settings and among the families least positioned to absorb the care burden transfer. They are also the families for whom genuine co-design has not occurred (Equity & Human Rights, Lived Experience) and for whom culturally safe escalation and crisis management pathways are least established in the HITH model architecture.

*Family carers* bear the primary operational downside risk: they are the model's safety net and the model's most undermonitored component. The burden accumulation, the deterioration recognition demands, and the escalation initiation responsibilities transferred to them are not compensated, not formally acknowledged in governance structures, and not monitored until they collapse.

*HITH clinical staff* bear the operational and professional downside risk of managing high-acuity presentations in a model without confirmed escalation pathways, without inpatient backup, and with governance accountability diffused across the team, the technology vendor, and the family. Scope compression is a predictable protective response that carries its own professional and ethical consequences.

**Who receives benefits and when**

*Lower-acuity children in metropolitan settings* are most likely to receive the early benefits of HITH: proximity to family, reduced institutional disruption, and the clinical benefits of home-based recovery — and are most likely to do so safely, given that the model's structural exposures are least activated in metropolitan, lower-acuity presentations.

*Regional and remote families* are the intended primary beneficiaries of the equity aspiration — reduced travel, family proximity, community connection — but receive these benefits only if the model's infrastructure prerequisites are met, which is currently undemonstrated. The benefit is real in direction and unverified in delivery.

*The institution* may receive early reputational and political benefits from the equity framing and the innovation narrative — benefits that arrive before the model's structural exposures are visible in outcome data.

**Where burden concentrates**

Clinical burden concentrates on: family carers (monitoring, escalation initiation), the HITH coordinator and team leader (single points of failure under surge), and regional and remote emergency services (absorbing escalations without paediatric psychiatric capability). Governance burden concentrates on the HITH clinical team operating without confirmed protocols, legal authority, or escalation infrastructure.

**Which groups are least able to absorb shocks**

Families with limited social support, financial resources, or health literacy — disproportionately regional, remote, and Aboriginal and Torres Strait Islander families — are least able to absorb the care burden transfer. They are also least able to navigate informal escalation pathways if formal pathways fail. The model's burden distribution is inversely correlated with capacity to absorb it.

---

**Unknown-Unknown Prompts (Decision-sensitive questions)**

**Boundary conditions**
- At what acuity level does the model's safety architecture fail structurally rather than operationally? Is there a presentation type for which HITH is never safe regardless of infrastructure, or is the boundary a function of support architecture?
- What is the minimum connectivity threshold below which remote clinical monitoring is categorically unsafe rather than suboptimal, and what proportion of the statewide catchment falls below it?
- What is the minimum specialist response time for an acute involuntary presentation in a child aged 12 and under, and what proportion of the statewide catchment cannot achieve that time under any escalation pathway currently available?

**Dependency and lock-in**
- Once the inpatient unit is operationally wound down, what is the realistic timeline and cost for reconstitution if the HITH model fails? Has this been modelled?
- What contractual, infrastructure, and workforce dependencies are created at implementation that constrain future governance design? Are any of these dependencies irreversible within a governance-acceptable timeframe?
- Does the second statewide service's structural mandate permit it to absorb statewide escalations from a dispersed HITH model, or is this precluded regardless of capacity negotiation?

**Monitoring feasibility**
- Can family carer burden be measured prospectively and independently of the treating team from first enrolment, and what instrument and frequency would be required? If not, is there any monitoring architecture that would detect burden accumulation before carer collapse?
- Can escalation events be distinguished from informal deterioration management in retrospective data review, or does underreporting make the distinction operationally invisible?
- What is the realistic data quality of remote clinical monitoring under operational conditions — not in design specifications but in comparable deployed systems — and how does data quality degrade under workforce pressure?

**Escalation viability under real-world pressure**
- If the HITH team and the second statewide service are simultaneously managing high-acuity presentations, what is the governance pathway for a third concurrent escalation? Has this scenario been operationally modelled?
- Under what conditions would emergency services in regional areas be an effective substitute for specialist paediatric psychiatric response, and have those conditions been confirmed as present in the relevant catchment areas?

**Subgroup effects and equity drift**
- If acuity drift occurs — HITH enrolments progressively lower-acuity — which population subgroup is most likely to be excluded from the model's actual operation while remaining within its formal scope? Is this subgroup identifiable in advance?
- For Aboriginal and Torres Strait Islander children, what culturally safe crisis management pathways exist in regional and remote settings that the HITH model can activate, and have these been confirmed with community representatives?

---

**Coverage Limitations**

Full 13-Director coverage was active. The following absent inputs most limit the stress test and leave specific cascade pathways underanalysed:

**Legal counsel — involuntary treatment compatibility**: The Plausible Failure Cascade's most consequential step (Step 2 — involuntary treatment requirement in a home setting) cannot be characterised with precision because the applicable legal framework has not been formally assessed. The stress test cannot determine whether the legal gap is a design parameter addressable through model architecture, a gap addressable through regulatory amendment, or a structural prohibition requiring legislative change. This distinction materially affects whether the cascade is activatable under any implementation posture or only under specific ones. All cascade pathways involving involuntary treatment are therefore underanalysed.

**Quantified workforce data**: The Reversal Test's characterisation of reversal feasibility and the cascade's Step 8 (reconstitution) cannot be quantified. Whether reconstitution is a matter of months or years — and whether it is feasible at all within a governance-acceptable timeframe — depends on workforce data that no Director has confirmed. The irreversibility finding is structurally sound but operationally unanchored.

**Second statewide service operational profile**: The cascade's Step 3 and the Reversal Test's hybrid model analysis both depend on whether the second service is structurally positioned for the fallback role. If the second service is structurally precluded from the fallback role — not merely unconfirmed — the cascade accelerates at Step 3 without the speculative surge assumption, and the hybrid model alternative is also structurally unavailable. This pathway is underanalysed because the second service's structural constraints are not confirmed.

**Baseline outcome data from the current inpatient unit**: The Success-to-Fragility dynamic and the Monitoring & Measurement analysis are both constrained by the absence of confirmed baseline data. If no usable baseline exists, the evaluation collapse risk is not a risk to be mitigated — it is a confirmed baseline condition, and the cascade's Step 6 governance failure is structurally more severe than the stress test characterises.

**Clinical outcomes evidence from adjacent models**: The Unknown-Unknown Prompts regarding boundary conditions and monitoring feasibility cannot be answered from the governance record. Whether comparable models have established the boundary conditions that determine when HITH is structurally unsafe — rather than operationally challenged — is unknown. The stress test's worst-case cascade is plausible but cannot be calibrated against empirical precedent.

---

**Fragility Signals**

The decision's robustness fails under the following structural conditions:

**Signal 1 — Simultaneous multi-prerequisite absence under first high-acuity activation**
The model's safety architecture requires the legal pathway, the second service fallback, and regional connectivity to function simultaneously. Under the first high-acuity remote presentation requiring involuntary treatment, all three may be absent simultaneously — not as a multi-safeguard failure scenario but as a structural feature of implementing before prerequisites are established. This is not a fatigue or pressure failure; it is a design-state failure that is present from first enrolment.

**Signal 2 — Escalation underreporting under workforce isolation**
In a small, geographically dispersed specialist team, the social dynamics of escalation reporting — professional identity, peer perception, fear of triggering slow or uncertain pathways — create structural pressure toward informal management of deterioration events. This pressure intensifies under workforce fatigue and geographic isolation. Formal escalation protocols, even if documented, are unlikely to be consistently activated under real operational conditions unless independently monitored. The governance record will appear safer than the clinical reality.

**Signal 3 — Carer burden accumulation without governance signal**
Family carers will absorb increasing clinical burden without generating a governance signal until the burden exceeds their capacity. The time lag between burden onset and governance visibility is determined by the absence of a monitoring mechanism, not by the severity of the burden. Under sustained stress — multiple complex enrolments, concurrent deterioration episodes, limited family social support — carer capacity will degrade before the governance record reflects it.

**Signal 4 — Political endorsement as reversibility constraint under low trust**
Once publicly endorsed under an equity framing, the model's governance response to adverse signals will be filtered through reputational management. In a low-trust political environment — where the state health department has incentives to endorse reform in principle while avoiding accountability for adverse events — the institutional pressure against course correction will intensify with each public commitment. The clinical governance mechanisms for suspension or modification will be structurally weakened by the political commitment made at launch.

**Signal 5 — Scope compression as governance-invisible safety response**
Clinicians operating without confirmed escalation pathways will progressively restrict accepted presentations to those they can safely manage within the model's actual (rather than designed) capabilities. This restriction is not documented, not reported, and not visible in formal governance signals. It appears in outcome data only as a favourable acuity profile — which is misread as model success rather than scope compression. The governance record cannot distinguish between a model that is safe because it is well-designed and a model that appears safe because it has stopped accepting the presentations that would stress-test its design.

**Signal 6 — Reversibility assumed but operationally and politically foreclosed**
The governance record characterises reversibility as a governance value without confirming it as an operational capability. Specialist workforce reconstitution, infrastructure decommissioning reversal, referral ecosystem re-establishment, and political narrative reversal are all structurally constrained in ways that make reversal significantly harder than implementation. The model is treated as reversible in governance design and is likely to be substantially irreversible in operational and political practice.

**Signal 7 — Burden concentration in lowest-capacity populations**
The model's care burden transfer falls disproportionately on families least positioned to absorb it — regional, remote, Aboriginal and Torres Strait Islander, and resource-limited families. These are precisely the families for whom the equity claim is strongest, meaning the population most likely to be enrolled on the basis of the equity aspiration is the population for whom the burden concentration is most severe and the monitoring architecture is least adequate. The equity framing and the burden distribution are inversely aligned.

**Signal 8 — Evaluation collapse under low-volume, high-dispersion conditions**
In a low-volume, geographically dispersed service with strong team social dynamics, the three conditions for evaluation collapse — no structured baseline, escalation underreporting, and informal deterioration management — are all structurally present rather than contingent. The governance record will appear to show a functioning model while clinical risk accumulates invisibly. The conditions for evaluation collapse are not created by poor governance intent; they are created by the structural features of the model operating in this context.

A) Fragility signals identified: [simultaneous multi-prerequisite absence under first high-acuity activation; escalation underreporting under workforce isolation; carer burden accumulation without governance signal; political endorsement as reversibility constraint under low trust; scope compression as governance-invisible safety response; reversibility assumed but operationally and politically foreclosed; burden concentration in lowest-capacity populations; evaluation collapse under low-volume, high-dispersion conditions]

**Fragility Score**: 9/10 — the model's safety architecture rests entirely on three mutually load-bearing structural prerequisites — involuntary treatment legal pathway, second service fallback, and regional connectivity — none of which is established, the first of which requires action outside the organisation's administrative control, and all of which must function simultaneously for the model to be safe in its highest-risk scenarios. (10 = extremely fragile)

-------------------------------------------------------------------
PHDSS - Stress_Test - DR-20260926-204324-a2e644
AI-generated. Currency: AUD. Requires human expert review.