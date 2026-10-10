# Gate A — Synthetic-Only Test-Data Policy

**Status:** PROPOSED — Protocol Authority review required
**Scope:** PHDSS Gate A transfer-candidate validation and the first bounded external transfer study
**Authority:** `docs/V3_TRANSFER_READINESS_AND_INDEPENDENT_EVALUATION_ROADMAP.md` §13; `docs/GATE_A_ENTRY.md` §4
**Enforcement status:** Procedural policy only. No runtime technical prevention of prohibited inputs is established by this document.

## 1. Purpose and boundary

PHDSS transfer evaluation tests whether a competent person can operate and understand a bounded governance-reasoning system without creator intervention. It is **not** authorisation to process live clinical, workforce or institutional cases, and it is not evidence of clinical, organisational or decision-effect validity.

The canonical roadmap permits **synthetic or deliberately de-identified fixtures only**. For Gate A and the first external study, the operational default is **fully synthetic fixtures**. Deliberately de-identified fixtures may be used only after a documented, pre-run Protocol Authority eligibility determination confirming that the fixture is genuinely de-identified, permitted for this evaluation and presents no reasonable re-identification or confidentiality risk in context. Removing names alone is insufficient. If eligibility cannot be established, do not use the fixture.

No real-case substitution during a run is permitted.

## 2. Permitted inputs

- Invented decisions, organisations, services, roles, populations, events, dates, metrics and source documents, labelled as synthetic.
- Synthetic evidence bundles intentionally designed to exercise missing evidence, conflicting perspectives, uncertainty, authority boundaries and participation-status reasoning.
- Publicly available generic framework excerpts where permitted by applicable rights and attribution requirements, with no private case facts added.
- Deliberately de-identified fixtures **only** when their eligibility, provenance and approval are recorded before use, meeting Section 1's standard of no reasonable re-identification or confidentiality risk in context.

Synthetic scenarios may resemble plausible health or public-sector settings, but must not be lightly altered versions of identifiable real cases. Do not claim that invented participation, consultations or clinical events actually occurred.

## 3. Prohibited inputs

Do not enter, upload, paste, link for ingestion, or otherwise submit:

- Identifiable consumer, patient, carer or staff information, including combinations of indirect identifiers.
- Raw clinical records, case notes, referral details or identifiable health histories.
- Sensitive or individual-level workforce, employment, complaints or disciplinary records.
- Confidential live institutional decisions, incident reports, internal correspondence or unpublished service material without separate authority.
- Informally supplied real cases, screenshots, exports or attachments containing any of the above.
- Credentials, access tokens, private URLs, or other secrets.
- Material labelled 'de-identified' where contextual detail, rare events, dates or combinations of attributes could reasonably reveal a person or confidential case.

An operator must not treat an LLM's assurance that material is anonymous as evidence of de-identification.

## 4. Before each test run

The operator or evaluator must:

1. Identify the fixture ID, version, source and synthetic/de-identified classification.
2. Confirm the fixture contains no prohibited data and record the check.
3. For any deliberately de-identified fixture, record the pre-run eligibility determination, approver, date and restrictions; otherwise use synthetic material.
4. Confirm the planned prompts, uploads, evidence bundles and any enabled web/search inputs remain within this policy.
5. Record the build/version, instruction pin and relevant provenance artefact identifiers under the transfer protocol.

If these checks are not completed, the run must not be marked eligible for the synthetic transfer study.

## 5. Outputs, provenance, storage and export

Generated outputs can repeat input text, infer apparently specific facts, or contain unverified claims. Treat prompts, model responses, stage provenance, exported manifests, ledgers, logs and screenshots as **evaluation artefacts**, not validated institutional records.

- Label artefacts with fixture ID and **SYNTHETIC EVALUATION — NOT A LIVE CASE**; for approved deliberately de-identified fixtures, identify their classification without exposing original identities.
- Store and share artefacts only in the designated project/evaluation location with access restricted to authorised participants. Do not place restricted material in public repositories, issues, PRs or demonstration links.
- Review artefacts before export or publication for accidental personal, confidential or secret material.
- Record which artefacts were produced and where they were stored; do not assume exports or browser downloads are centrally retained or automatically deleted.
- Retain only what is necessary to reproduce the evaluation and its audit trail. The evaluator must record the chosen retention location, responsible custodian and deletion/review date before transfer. **No universal retention period or automatic deletion mechanism is established here.**
- Delete unintended local copies and record any exception according to the handling procedure that must be established before the first external run (see Section 10). Do not claim deletion from model providers or external services without evidence.

## 6. External services and provider handling

The policy does not establish what any model provider, CDN, web-search service, logging platform or deployment host retains or processes. Before an external transfer run, the responsible operator must identify enabled external services and confirm the applicable data-handling terms and configuration for the proposed synthetic fixture. Synthetic-only status does not remove the need to protect credentials and non-public evaluation artefacts.

Do not assert that PHDSS technically blocks prohibited inputs, prevents provider retention, or provides automatic redaction or deletion unless independently verified.

## 7. Breach, stop and disposition

If prohibited or potentially identifiable/confidential material is discovered **before submission**, stop and replace the fixture; do not submit it for model processing.

If discovered **during or after submission**:

1. Stop the run immediately. Do not continue, retry, publish or treat it as an eligible synthetic transfer result.
2. Preserve only the minimum incident metadata needed for an authorised response, without copying sensitive content into public issue trackers or ordinary PRs.
3. Notify the designated Protocol Authority/data custodian through the approved private channel, and follow applicable organisational incident/privacy procedures.
4. Identify affected inputs, outputs, exports, logs and services for authorised containment and deletion assessment.
5. Record the run as **INELIGIBLE — DATA-POLICY BREACH**; document any later restart as a new run with a new fixture and explicit authorisation.

A prohibited-data event is not retroactively cured by redacting the published report.

## 8. Exceptions and later real-data studies

**There is no ad hoc exception within the first synthetic transfer study.** A request to try a real institutional case requires stopping the synthetic study workflow and establishing a separate governed protocol before any real-data use.

That separate protocol must address approvals, lawful basis, consent where applicable, minimisation, redaction, storage, access, retention, deletion, provider handling, exports and audit access. Approval for a later study does not retroactively validate a contaminated synthetic run.

## 9. Compliance record (minimum checklist)

Record the following for each run or in a linked evaluation record:

- [ ] Fixture ID/version and source recorded
- [ ] Synthetic status confirmed, or de-identification eligibility approved before use
- [ ] No prohibited data, secrets or live confidential case material identified
- [ ] Prompts, uploads, evidence and web/search settings checked
- [ ] Build/instruction identity and provenance export location recorded
- [ ] Artefact custodian, storage location and retention/deletion review date recorded
- [ ] Outputs reviewed before external sharing
- [ ] Run disposition recorded: ELIGIBLE / INELIGIBLE / STOPPED
- [ ] Any incident or restart documented separately

The checklist is a procedural attestation, **not** automated proof of compliance.

## 10. Gate A acceptance and unresolved decisions

Gate A policy documentation can be marked complete when the Protocol Authority approves this policy and the transfer artefacts reference it. This does not itself prove operator compliance or technical enforcement.

Before the first external run, the responsible authority must specify the actual artefact repository/access controls, retention/deletion review date, incident contact route, and applicable provider configuration. These are **implementation details not established by this policy** and must not be silently invented.

This policy does not change PHDSS's human-decision authority boundary, Director instructions, runtime, or Decision Ledger schema.
