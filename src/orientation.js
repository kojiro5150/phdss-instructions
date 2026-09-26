export const PHDSS_NORTH_STAR = "PHDSS is designed to make the decision space larger and more legible before humans decide — surfacing assumptions, tensions, missing evidence, affected perspectives, operational constraints and plausible alternatives that may otherwise remain hidden.";

export const ORIENTATION_AUTHORITY_CHAIN = Object.freeze([
  { id:"ai", label:"AI", action:"enlarge + interrogate", detail:"Surfaces perspectives, assumptions, tensions, evidence gaps, constraints and plausible alternatives." },
  { id:"code", label:"Code", action:"constrain + validate + preserve", detail:"Enforces process boundaries, validates structured outputs and preserves provenance." },
  { id:"chair", label:"Chair", action:"organise + expose", detail:"Presents the supplied reasoning, disagreement, uncertainty and adversarial challenge without adjudicating the decision." },
  { id:"human", label:"Human", action:"judge + decide", detail:"The authorised governance body retains judgment, accountability and decision authority." },
]);

export const ORIENTATION_FLOW = Object.freeze([
  { id:"inputs", label:"Inputs", detail:"Decision question, context, constraints, evidence and selected evidence-access tiers." },
  { id:"directors", label:"Directors", detail:"Independent domain lenses surface findings, risks, tensions, conditions and evidence gaps." },
  { id:"synthesis", label:"Synthesis", detail:"Surface Map, Epistemic Audit, META, Reality Anchor, Probe and conditional Stress Test interrogate the combined record." },
  { id:"decision_brief", label:"Decision Brief", detail:"The Chair organises and exposes the reasoning record for human judgment; it does not select a preferred course." },
  { id:"transparency", label:"Transparency", detail:"The dashboard makes coverage, signals, uncertainty, fragility, failures and degraded states visible." },
  { id:"ledger", label:"Decision Ledger", detail:"The session record preserves inputs, outputs, provenance, status and audit evidence without rewriting history." },
]);

export const ORIENTATION_USE_WHEN = Object.freeze([
  "A consequential institutional decision has material trade-offs, uncertainty or cross-domain effects.",
  "Assumptions, affected perspectives, missing evidence or operational constraints need to be surfaced before human judgment.",
  "A Board, executive, policy or governance process needs a reviewable reasoning record rather than a single model answer.",
]);

export const ORIENTATION_DO_NOT_USE_AS = Object.freeze([
  "An automated approval, rejection, ranking or recommendation engine.",
  "A substitute for authorised governance, legally required authority, consultation, clinical responsibility or subject-matter expertise.",
  "A low-stakes fact lookup or urgent operational command where a full governance reasoning workflow adds no value.",
]);

export const ORIENTATION_MODES = Object.freeze([
  {
    id:"CORE",
    label:"CORE",
    coverage:"5 adaptive Directors",
    cost:"Lower model/API cost",
    detail:"Faster partial-coverage governance run. Omitted domains remain visible and CORE should not be treated as equivalent to FULL coverage.",
  },
  {
    id:"FULL",
    label:"FULL",
    coverage:"All 13 Directors",
    cost:"Highest model/API cost",
    detail:"Broadest cross-domain coverage. Use when the governance body wants the complete Director set interrogated before synthesis.",
  },
  {
    id:"CHAIR_SPECIFIED",
    label:"CHAIR SPECIFIED",
    coverage:"Human-selected Directors",
    cost:"Cost varies with scope",
    detail:"Systems & Safety remain mandatory. The governance body deliberately chooses the narrower scope and remains accountable for that coverage choice.",
  },
]);

export const ORIENTATION_ADVISORY_NOTE = "Advisory Runs provide one or two domain perspectives only. They do not run the governance synthesis chain, produce a Decision Brief, populate the Transparency Dashboard, or create a governance Decision Ledger record.";

export const ORIENTATION_LEGITIMACY_NOTE = "PHDSS can improve the legibility and auditability of reasoning; it does not confer decision authority or institutional legitimacy. Legitimacy remains grounded in the authorised human process — who participates, what evidence is accepted, how affected perspectives are heard, how trade-offs are judged, and who is accountable for the decision.";
