# Gate A — Synthetic-Only Test-Data Policy

**Approval status:** Determined only by a separate, version-specific Protocol Authority decision record. This document does not self-certify approval; a repository commit is not policy approval.
**Scope:** PHDSS Gate A transfer-candidate validation and the first bounded external transfer study
**Authority:** `docs/V3_TRANSFER_READINESS_AND_INDEPENDENT_EVALUATION_ROADMAP.md` §13; `docs/GATE_A_ENTRY.md` §4
**Enforcement status:** Procedural policy only. No runtime technical prevention of prohibited inputs is established by this document.

## 1. Purpose and boundary

PHDSS transfer evaluation tests whether a competent person can operate and understand a bounded governance-reasoning system without creator intervention. It is **not** authorisation to process live clinical, workforce or institutional cases, and it is not evidence of clinical, organisational or decision-effect validity.

Although the canonical roadmap permits synthetic or deliberately de-identified fixtures within its broader boundary, **this Gate A and first external transfer-study policy permits fully synthetic fixtures only**. A fixture derived from a specific real case is not eligible here, even if altered, anonymised or described as de-identified. Any later deliberately de-identified or real-data study requires a separate, prospectively authorised governed protocol and eligibility determination.

No real-case substitution during a run is permitted.

## 2. Permitted inputs

- Invented decisions, organisations, services, roles, populations, events, dates, metrics and source documents, labelled as synthetic.
- Synthetic evidence bundles intentionally designed to exercise missing evidence, conflicting perspectives, uncertainty, authority boundaries and participation-status reasoning.
- Publicly available generic framework excerpts where permitted by applicable rights and attribution requirements, with no private case facts added.

Synthetic scenarios **may be informed by general professional experience and knowledge** and may resemble plausible health or public-sector settings. They must be invented rather than adapted, reconstructed, combined or lightly altered from any **specific real case**, including one described as de-identified. Do not claim that invented participation, consultations or clinical events actually occurred.

## 3. Prohibited inputs

Do not enter, upload, paste, link for ingestion, or otherwise submit:

- Identifiable consumer, patient, carer or staff information, including combinations of indirect identifiers.
- Raw clinical records, case notes, referral details or identifiable health histories.
- Sensitive or individual-level workforce, employment, complaints or disciplinary records.
- Confidential live institutional decisions, incident reports, internal correspondence or unpublished service material without separate authority.
- Informally supplied real cases, screenshots, exports or attachments containing any of the above.
- Credentials, access tokens, private URLs, or other secrets.
- Any material derived from a specific real case, including material labelled 'de-identified', however well anonymised (see Section 1).

An operator must not treat an LLM's assurance that material is anonymous as evidence of de-identification.

## 4. Before each test run

The operator or evaluator must:

1. Identify the fixture ID, version, source and **fully synthetic** classification.
2. Confirm the fixture contains no prohibited data and record the check.
3. Confirm and record that the fixture is invented, not derived from a specific real case, and eligible under this fully synthetic-only policy. Any uncertainty about its origins makes it ineligible pending replacement or a separate authorised protocol.
4. Confirm the planned prompts, uploads, evidence bundles and any enabled web/search inputs remain within this policy.
5. Record the build/version, instruction pin and relevant provenance artefact identifiers under the transfer protocol.

If these checks are not completed, the run must not be marked eligible for the synthetic transfer study.

## 5. Outputs, provenance, storage and export

Generated outputs can repeat input text, infer apparently specific facts, or contain unverified claims. Treat prompts, model responses, stage provenance, exported manifests, ledgers, logs and screenshots as **evaluation artefacts**, not validated institutional records.

- Label artefacts with fixture ID, policy version and **SYNTHETIC EVALUATION — NOT A LIVE CASE**. Do not use this label for a fixture derived from a specific real case.
- Store and share artefacts only in the designated project/evaluation location with access restricted to authorised participants. Do not place restricted material in public repositories, issues, PRs or demonstration links.
- Review artefacts before export or publication for accidental personal, confidential or secret material.
- Record which artefacts were produced and where they were stored; do not assume exports or browser downloads are centrally retained or automatically deleted.
- Retain only what is necessary to reproduce the evaluation and its audit trail. The evaluator must record the chosen retention location, responsible custodian and deletion/review date before the first internal live RC2 run. **No universal retention period or automatic deletion mechanism is established here.**
- Delete unintended local copies and record any exception under a documented handling arrangement established **before the first internal live RC2 run** (see Sections 7 and 10). Do not claim deletion from model providers or external services without evidence.

## 6. External services and provider handling

The policy does not establish what any model provider, CDN, web-search service, logging platform or deployment host retains or processes. **Before any live evaluation run, including an internally governed run that sends material to an externally hosted model or search service**, the responsible operator must identify enabled external services and confirm the applicable data-handling terms and configuration for the proposed synthetic fixture. Synthetic-only status does not remove the need to protect credentials and non-public evaluation artefacts. This policy does not establish whether browser-held API keys are exposed; credential exposure requires separate security assessment.

Do not assert that PHDSS technically blocks prohibited inputs, prevents provider retention, or provides automatic redaction or deletion unless independently verified.

## 7. Breach, stop and disposition

If prohibited or potentially identifiable/confidential material is discovered **before submission**, stop and replace the fixture; do not submit it for model processing.

If discovered **during or after submission**:

1. Stop the run immediately. Do not continue, retry, publish or treat it as an eligible synthetic transfer result.
2. Preserve only the minimum incident metadata needed for an authorised response, without copying sensitive content into public issue trackers or ordinary PRs.
3. Notify the designated Protocol Authority/data custodian through the approved private channel **identified and recorded before the first internal live RC2 run**, and follow applicable organisational incident/privacy procedures.
4. Identify affected inputs, outputs, exports, logs and services for authorised containment and deletion assessment.
5. Record the run as **INELIGIBLE — DATA-POLICY BREACH**; document any later restart as a new run with a new fixture and explicit authorisation.

A prohibited-data event is not retroactively cured by redacting the published report.

## 8. Exceptions and later real-data studies

**There is no ad hoc exception within the first synthetic transfer study.** A request to use a specific real institutional case, a fixture derived from one (including deliberately de-identified material), or other real data requires stopping the synthetic study workflow and establishing a separate, prospectively authorised governed protocol and eligibility determination before that use. Invented scenarios informed only by general professional knowledge remain permitted under Section 2.

That separate protocol must address approvals, lawful basis, consent where applicable, minimisation, redaction, storage, access, retention, deletion, provider handling, exports and audit access. Approval for a later study does not retroactively validate a contaminated synthetic run.

## 9. Compliance record (minimum checklist)

Record the following for each run or in a linked evaluation record:

- [ ] Fixture ID/version and source recorded
- [ ] Fully synthetic status and absence of derivation from a specific real case confirmed before use
- [ ] No prohibited data, secrets or live confidential case material identified
- [ ] Prompts, uploads, evidence and web/search settings checked
- [ ] Build/instruction identity and provenance export location recorded
- [ ] Artefact custodian, storage location and retention/deletion review date recorded
- [ ] Outputs reviewed before external sharing
- [ ] Run disposition recorded: ELIGIBLE / INELIGIBLE / STOPPED
- [ ] Any incident or restart documented separately

The checklist is a procedural attestation, **not** automated proof of compliance.

## 10. Gate A acceptance and unresolved decisions

Gate A policy documentation can be marked complete **only when** the Protocol Authority separately approves the exact hash-identified policy version and the transfer artefacts reference that approved version and decision. Approval status is established by the Protocol Authority decision record, **not by this file's status line or by committing it**. This does not itself prove operator compliance or technical enforcement.

Before the first **internal live RC2 run**, the responsible authority must record the actual restricted artefact location and access controls, custodian, retention/deletion review date, private incident contact route and handling arrangement, and applicable enabled external-provider configurations and terms. Before the first **external transfer run**, additionally establish the participant/access arrangements and complete external-run handling, publication and retention requirements. These are **implementation details not established by this policy** and must not be silently invented.

This policy does not change PHDSS's human-decision authority boundary, Director instructions, runtime, or Decision Ledger schema.
