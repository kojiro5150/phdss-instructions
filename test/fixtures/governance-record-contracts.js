// Synthetic Governance Record contract fixtures.
// No production or Governance-in-Confidence content.

export const validDirectorBrief = {
  director: "Safety, Quality & Harm",
  signal: "HALT",
  confidence: "HIGH",
  core_judgment: "A synthetic safety threshold is unresolved.",
  critical_risks: ["Synthetic harm pathway"],
  assumptions: ["Synthetic assumption"],
  prerequisites: ["Synthetic prerequisite"],
  view_change_triggers: ["Synthetic evidence would change the view"],
  coverage_limit: "Synthetic coverage limit.",
  regulatory_blockers: ["Synthetic regulatory blocker"],
  overflow_flags: [],
  governance_record: {
    key_discovery: "A synthetic safety threshold is unresolved.",
    primary_tension: "speed versus assurance",
    signal_rationale: "The synthetic threshold remains unresolved.",
    room_should_discuss: ["What evidence resolves the threshold?"],
    most_likely_to_benefit: ["Synthetic beneficiary"],
    most_exposed_to_failure: ["Synthetic exposed group"],
    non_negotiable_conditions: ["Resolve the synthetic threshold"],
    governance_implication: "The unresolved threshold remains material to the decision space.",
  },
};

export const validFailedDirectorBrief = {
  director: "Synthetic Director",
  signal: "FAILED",
  confidence: "LOW",
  core_judgment: "Director failed to complete.",
  critical_risks: [],
  assumptions: [],
  prerequisites: [],
  view_change_triggers: [],
  coverage_limit: "Director did not complete.",
  regulatory_blockers: [],
  overflow_flags: ["DIRECTOR_FAILED"],
  governance_record: {
    key_discovery: "Director did not complete.",
    primary_tension: "",
    signal_rationale: "",
    room_should_discuss: [],
    most_likely_to_benefit: [],
    most_exposed_to_failure: [],
    non_negotiable_conditions: [],
    governance_implication: "",
  },
};

export const validSurfaceBrief = {
  module: "Decision Surface Map",
  verdict_label: "Dominant Signal",
  verdict: "CAUTION",
  key_discovery: "Synthetic domains converge on unresolved conditions.",
  primary_tension: "speed versus assurance",
  signal_rationale: "Synthetic signal distribution remains cautious.",
  room_should_discuss: ["Which condition is decision-consequential?"],
  most_likely_to_benefit: ["Synthetic beneficiary"],
  most_exposed_to_failure: ["Synthetic exposed group"],
  non_negotiable_conditions: ["Synthetic condition"],
  governance_implication: "The decision space remains conditioned by unresolved assurance.",
};

export const validChairBrief = {
  module: "Chair Decision",
  verdict_label: "Decision Brief Status",
  verdict: "Complete — material tension remains unresolved",
  key_discovery: "Synthetic reasoning record is complete.",
  primary_tension: "benefit versus residual uncertainty",
  signal_rationale: "",
  room_should_discuss: ["Which residual uncertainty is material?"],
  most_likely_to_benefit: [],
  most_exposed_to_failure: [],
  non_negotiable_conditions: ["Synthetic condition"],
  governance_implication: "Human judgment remains required.",
  _fallback_reason: "",
};

export const validBoardRecord = {
  headlineLabel: "Recommendation Signal",
  headline: "CAUTION",
  headlineColor: { fg:"#B45309", bg:"#FFFBEB", border:"#B45309" },
  headlineRationale: "Synthetic rationale.",
  keyDiscoveryLabel: "Key Discovery",
  keyDiscovery: "Synthetic discovery.",
  primaryTension: "speed versus assurance",
  roomShouldDiscuss: ["Synthetic question"],
  mostLikelyToBenefit: ["Synthetic beneficiary"],
  mostExposedToFailure: ["Synthetic exposed group"],
  nonNegotiableConditions: ["Synthetic condition"],
  governanceImplication: "Synthetic governance implication.",
  extractionFlags: [],
};

export const invalidContractCases = [
  {
    label: "Director brief missing governance record",
    kind: "director",
    value: {
      ...validDirectorBrief,
      governance_record: undefined,
    },
  },
  {
    label: "Director brief uses non-array risks",
    kind: "director",
    value: {
      ...validDirectorBrief,
      critical_risks: "not-an-array",
    },
  },
  {
    label: "Director brief has unknown signal",
    kind: "director",
    value: {
      ...validDirectorBrief,
      signal: "APPROVE",
    },
  },
  {
    label: "Synthesis brief module mismatch",
    kind: "synthesis",
    moduleLabel: "Decision Surface Map",
    value: {
      ...validSurfaceBrief,
      module: "Reality Anchor",
    },
  },
  {
    label: "Synthesis brief verdict label mismatch",
    kind: "synthesis",
    moduleLabel: "Decision Surface Map",
    value: {
      ...validSurfaceBrief,
      verdict_label: "Recommendation",
    },
  },
  {
    label: "Board record has scalar discussion field",
    kind: "board",
    value: {
      ...validBoardRecord,
      roomShouldDiscuss: "not-an-array",
    },
  },
];
