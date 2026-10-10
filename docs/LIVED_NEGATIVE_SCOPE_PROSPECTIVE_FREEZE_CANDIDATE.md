# PHDSS-NS-PROSPECTIVE-01 — prospective freeze candidate v1

**Status: FREEZE CANDIDATE ONLY — NOT EXECUTED.** This document is prepared for review on an isolated experimental PR. Do not generate evaluation outputs until the freeze PR is merged, the immutable freeze commit and SHA-256 hashes are recorded, and an independent blinded adjudication arrangement exists.

## Relationship to protocol v0.1

Governing protocol: `docs/LIVED_NEGATIVE_SCOPE_PROSPECTIVE_EVAL_PROTOCOL.md` at base commit `6dad220710c978397a0204a9061e514b7f7f700b`. This candidate explicitly amends its *proposed*, not frozen, 12-case table: original P01/P02 were already generated as preliminary pilots; they are **excluded**. F01/F02 are new scenarios; F03–F12 retain the ten unexecuted proposed record texts verbatim. No case is an independent human-gold label, and no output is yet generated for F01–F12.

## Exact prompts (including prefix)

Every prompt below is the complete user-entered text. Do not include case IDs, expected outcomes or metadata in the PHDSS input.

### F01

Assess this proposal from the Lived Experience Director perspective using only the supplied record. Separate analytical representation, human-supplied evidence and actual participation status. Do not infer non-events from missing documentation.

A draft youth peer-support roster names two consumer advisers as proposed reviewers. No invitation messages, replies or review notes are supplied.

### F02

Assess this proposal from the Lived Experience Director perspective using only the supplied record. Separate analytical representation, human-supplied evidence and actual participation status. Do not infer non-events from missing documentation.

A signed record confirms that one carer attended a 20-minute review of the crisis contact card. The record contains no statements about the carer's views or any changes to the card.

### F03

Assess this proposal from the Lived Experience Director perspective using only the supplied record. Separate analytical representation, human-supplied evidence and actual participation status. Do not infer non-events from missing documentation.

A signed consultation report explicitly records that no carers were invited to review a proposed carer discharge guide. Two consumers reviewed the cover page.

### F04

Assess this proposal from the Lived Experience Director perspective using only the supplied record. Separate analytical representation, human-supplied evidence and actual participation status. Do not infer non-events from missing documentation.

A consumer reports that a mobile feedback link failed on their phone. The record does not say whether another feedback channel was offered or whether they later contributed.

### F05

Assess this proposal from the Lived Experience Director perspective using only the supplied record. Separate analytical representation, human-supplied evidence and actual participation status. Do not infer non-events from missing documentation.

An accessibility incident log states that the online survey was inaccessible to a screen-reader user for the entire consultation window, that no alternative submission channel existed, and that the user could not submit feedback.

### F06

Assess this proposal from the Lived Experience Director perspective using only the supplied record. Separate analytical representation, human-supplied evidence and actual participation status. Do not infer non-events from missing documentation.

Four consumers propose three wording changes. Minutes confirm one was adopted; the other two are not mentioned again.

### F07

Assess this proposal from the Lived Experience Director perspective using only the supplied record. Separate analytical representation, human-supplied evidence and actual participation status. Do not infer non-events from missing documentation.

A signed decision log states two consumer proposals were rejected after review and records the reasons; one proposal was adopted.

### F08

Assess this proposal from the Lived Experience Director perspective using only the supplied record. Separate analytical representation, human-supplied evidence and actual participation status. Do not infer non-events from missing documentation.

Three consumers endorse only the medication page of a new discharge pack. There is no record of review of the other pages.

### F09

Assess this proposal from the Lived Experience Director perspective using only the supplied record. Separate analytical representation, human-supplied evidence and actual participation status. Do not infer non-events from missing documentation.

A panel has written delegated veto power over the plain-language template, not over clinical findings. Minutes record that it exercised that veto.

### F10

Assess this proposal from the Lived Experience Director perspective using only the supplied record. Separate analytical representation, human-supplied evidence and actual participation status. Do not infer non-events from missing documentation.

An outreach proposal includes a recruitment plan and budget but no documentation that invitations were issued.

### F11

Assess this proposal from the Lived Experience Director perspective using only the supplied record. Separate analytical representation, human-supplied evidence and actual participation status. Do not infer non-events from missing documentation.

A service has two recorded feedback submissions and an unsigned draft summary suggesting the group was broadly consulted. No attendance list exists.

### F12

Assess this proposal from the Lived Experience Director perspective using only the supplied record. Separate analytical representation, human-supplied evidence and actual participation status. Do not infer non-events from missing documentation.

A signed project log confirms that three participants received no reply by the review deadline. The log says nothing about later replies or whether suggestions were adopted.

## Pre-run environment manifest — candidate, not verified freeze

| Field | Required frozen value / constraint |
|---|---|
| Experiment | `PHDSS-NS-PROSPECTIVE-01` |
| Tranche | `F01–F12` (twelve new outputs, no reruns) |
| Repository | `kojiro5150/phdss-instructions` |
| Allowed branch | `experiment/ns-claim-scope-v2` only for evaluation; freeze PR isolated on `experiment/ns-prospective-freeze-prep` |
| Baseline commit observed on operator's Mac | `6dad220710c978397a0204a9061e514b7f7f700b` |
| Pinned Lived instruction commit | `94c5851146d849957af9610935a85f674c6ab05d` |
| Lived instruction runtime SHA-256 (prior smoke-test JSON) | `e41827ecbf6305cac34ff7c609cb0e5c5f37ac2ba08f755033630ec47baa7813` |
| Detector | `src/runtime/lived-negative-scope-guardrail.js`, version `1.0.0`, warning-only |
| Run mode | `ADVISORY / DIRECTOR_BRIEF`, director `lived` |
| Model / settings | `claude-sonnet-4-6`; temperature `0.8`; max_tokens `16000`; auto_continue `true` |
| External evidence | No attached Evidence Library, web search off |
| Operator / time | **TO RECORD BEFORE F01**; do not invent |
| Freeze commit / deployed build commit | **TO RECORD AND VERIFY BEFORE F01**; export must equal actual build SHA |
| Protocol, rubric, scanner source and exact prompt SHA-256 | **TO COMPUTE AND RECORD BEFORE F01** from frozen bytes |
| Human adjudicator and blindness method | **TO ARRANGE AND DOCUMENT BEFORE F01** |
| Run order | F01 through F12, once each; deviations recorded |
| Outputs | Raw Markdown and complete `_request.json` per case, original bytes preserved, GOVERNANCE IN CONFIDENCE |

### Local preflight, after reviewed freeze is merged

Run these on the Mac in the actual checkout. Record the full command output in a dated, immutable preflight record. **Do not run F01 if any check fails.**

```bash
git switch experiment/ns-claim-scope-v2
git pull --ff-only
git rev-parse HEAD
git status --porcelain
shasum -a 256 docs/LIVED_NEGATIVE_SCOPE_PROSPECTIVE_EVAL_PROTOCOL.md docs/LIVED_NEGATIVE_SCOPE_PROSPECTIVE_FREEZE_CANDIDATE.md src/runtime/lived-negative-scope-guardrail.js
npm run verify:lived-negative-scope
npm run validate
npm run build
npm run preview
```

Also hash the frozen A/B/C/D rubric source once its canonical path is independently confirmed; never substitute a paraphrase or an invented rubric hash. Hash each **exact complete prompt** separately (UTF-8 with explicitly recorded newline convention) and record its SHA-256 in the preflight manifest. Record the actual deployment commit from a non-evaluation smoke-test request sidecar before F01. If any recorded commit or instruction hash differs, STOP.

## Blinding and reporting boundary

Preserve F01–F12 original exports unchanged. An independent reviewer receives scenario evidence and raw Director output but **no detector flags**; adjudicate claim-level A/B/C/D, source anchor, warrant and uncertainty, and lock labels with a hash. Only then execute the exact pinned JS scanner and compare. A warning is not a Category B finding; no warning is not PASS. Keep the initial P01/P02 pilots and provenance smoke test out of prospective denominators. No promotion to `main`, `gh-pages` or production, no modifications to frozen V1/V2, and no sensitivity/specificity claims without independent valid denominators.
