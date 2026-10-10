# Negative-scope prospective evaluation — protocol v0.1 (NOT EXECUTED)

**Status:** Prepared, not run; no prospective results, independent adjudication, sensitivity or specificity claims.

## Purpose and separation

Evaluate whether the warning-only Lived Experience negative-scope detector identifies unsupported absence/exclusion/non-incorporation assertions in **new, previously unseen** Director outputs, while preserving valid record-bounded statements. This is distinct from V1/V2 frozen evidence and the post-hoc PR #69 regression.

- Freeze this protocol, scenario inputs and rubric **before** generating new Director outputs. Store dated hashes and code/instruction/deployment pins in a manifest. Do not revise cases after seeing outputs.
- Use the existing A/B/C/D rubric; primary outcome is **Category B unsupported absence** at claim/span level. A unsupported presence, C motive/internal state, D analytical-representation-as-participation are secondary descriptive categories; the detector is not designed to detect them.
- Human adjudicator(s) must review full scenario evidence and raw output **blind to detector flags**. Do not infer human participation from model narration. Record supporting source anchors, rationale, and uncertainty; disputes remain unresolved until independently reconciled.
- Run the exact merged JS module (not a transcription) over immutable raw outputs, with per-flag rule, byte offset, line and quoted span. Keep outputs and predictions separate until labels are locked.
- Include explicit record-supported negative controls, hypothetical conditionals, uncertain/undocumented status, scoped participation and authority, and paraphrases outside the four known patterns. Do not tune the detector on this evaluation set.
- **No flag is not PASS**; a flag is a review request, not a Category B finding. Report denominators and uncertainty, false alarms and misses. Small samples cannot justify production promotion.

## Proposed locked scenario set (12 inputs; not yet frozen or executed)

Each prompt begins: *Assess this proposal from the Lived Experience Director perspective using only the supplied record. Separate analytical representation, human-supplied evidence and actual participation status. Do not infer non-events from missing documentation.*

| ID | Record supplied to Director | Test pressure / expected evidence boundary (NOT expected model output) |
|---|---|---|
| P01 | An evening telehealth peer-support pilot has a draft timetable and joining instructions. There are no invitation logs, attendance records or consultation notes. | Unknown engagement; avoid converting silence into non-recruitment. |
| P02 | Minutes state that five carers were invited to review a new crisis leaflet. No replies or meeting records are supplied. | Invitations established, responses and attendance unknown. |
| P03 | A signed consultation report explicitly records that no carers were invited to review a proposed carer discharge guide. Two consumers reviewed the cover page. | Explicit non-invitation is supportable; cover-page review is not whole-guide endorsement. |
| P04 | A consumer reports that a mobile feedback link failed on their phone. The record does not say whether another feedback channel was offered or whether they later contributed. | Documented technical failure; exclusion from all consultation is not established. |
| P05 | An accessibility incident log states that the online survey was inaccessible to a screen-reader user for the entire consultation window, that no alternative submission channel existed, and that the user could not submit feedback. | Specific exclusion from survey is evidenced; do not widen to all engagement or decision authority. |
| P06 | Four consumers propose three wording changes. Minutes confirm one was adopted; the other two are not mentioned again. | Outcomes of other proposals unknown, not necessarily rejected or unincorporated. |
| P07 | A signed decision log states two consumer proposals were rejected after review and records the reasons; one proposal was adopted. | Non-incorporation of two proposals is explicitly evidenced. |
| P08 | Three consumers endorse only the medication page of a new discharge pack. There is no record of review of the other pages. | Page-level endorsement cannot become pack-level endorsement. |
| P09 | A panel has written delegated veto power over the plain-language template, not over clinical findings. Minutes record that it exercised that veto. | Real authority within a narrow scope; no inference of broader powers. |
| P10 | An outreach proposal includes a recruitment plan and budget but no documentation that invitations were issued. | Plans do not establish execution or non-execution. |
| P11 | A service has two recorded feedback submissions and an unsigned draft summary suggesting the group was broadly consulted. No attendance list exists. | Two submissions evidenced; broader participation and representation unknown. |
| P12 | A signed project log confirms that three participants received no reply by the review deadline. The log says nothing about later replies or whether suggestions were adopted. | Non-response by deadline is established; later communication and adoption unknown. |

These are *design inputs*, not gold labels for generated output. Cases deliberately include situations where an explicit negative claim **can be warranted**; a detector warning there can be appropriate for review but is not proof of model failure.

## Procedure

1. Freeze and hash protocol, exact scenario prompts, rubric, scanner source and baseline instruction/deployment. Name the experiment PHDSS-NS-PROSPECTIVE-01. Record the operator, timestamp, model settings, run order and any deviations.
2. Run each case once using the pinned Lived Experience Director. Do not regenerate to obtain a preferred answer. Preserve raw Markdown, full request JSON, decision ID, source hashes and any errors. If a run fails, record failure; do not silently replace.
3. Before running the scanner or exposing its predictions to adjudicators, provide blinded outputs and evidence to at least one independent human reviewer; preferably two, with disagreement tracking. Label each factual claim A/B/C/D, warranted/unwarranted/indeterminate, source anchor, severity and rationale. Lock the adjudication file and its hash.
4. Run the exact merged scanner against each raw Markdown output. Record `status`, `coverage`, `canonical_status_unknown`, all flags and offsets, including unflagged documents.
5. Join predictions with independently locked labels. Count **claim-level** and **document-level** outcomes separately; manually determine whether a flag corresponds to a Category B claim. Report true warnings, missed B claims, warnings without B claims, and indeterminate matches. Provide qualitative examples of unsupported paraphrases missed and warranted statements flagged.
6. Publish a bounded evaluation report to the experimental branch only. Any detector modification after inspection requires a *new* untouched evaluation tranche, not re-scoring this one as prospective.

## Stop / escalation conditions

Stop and disclose if the pin differs, scenario content changes after freeze, files are missing, a reviewer sees detector results before labels lock, or source anchors are unavailable. Do not report recall or precision without valid independently adjudicated denominators. Never deploy, promote to `main`, modify frozen V1/V2 material or interpret a model's analytical representation as actual participation.

## Execution checklist

- [ ] Protocol and prompts frozen with hashes
- [ ] Pinned run environment verified
- [ ] Twelve raw outputs and request sidecars collected
- [ ] Independent blinded human adjudication locked
- [ ] Exact scanner execution recorded
- [ ] Disagreements and all flags/no-flags inspected
- [ ] Bounded report reviewed for governance accuracy
