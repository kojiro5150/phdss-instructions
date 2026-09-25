// Reference states for the later parseDashboard split.
// parseDashboard remains in App_FINAL.jsx in PR 1 because it calls new Date()
// and emits diagnostic console.warn side effects. These fixtures preserve the
// conditional states that the future pure-core/runtime-wrapper split must cover.
// They are intentionally synthetic and contain no production scenario prose.

const director = (id, label, icon, color) => ({ id, label, icon, color });

const systems = director("systems", "Systems & Dynamics", "*", "#06B6D4");
const equity = director("equity", "Equity & Human Rights", "=", "#34D399");
const lived = director("lived", "Lived Experience", "o", "#F87171");
const digital = director("digital", "Digital & AI Governance", "~", "#60A5FA");
const safety = director("safety", "Safety, Quality & Harm", "!", "#EF4444");

export const dashboardReferenceStates = [
  {
    label: "complete synthesis run",
    input: {
      decision: "Synthetic decision A",
      dirOutputs: {
        systems: "**Recommendation Signal**: CAUTION\n**Fragility Signals**\n- feedback risk",
        equity: "**Recommendation Signal**: CAUTION\n**Fragility Signals**\n- equity risk",
        lived: "**Recommendation Signal**: PROCEED\n**Fragility Signals**\n- trust risk",
        digital: "**Recommendation Signal**: CAUTION\n**Fragility Signals**\n- data risk",
        safety: "**Recommendation Signal**: CAUTION\n**Fragility Signals**\n- safety risk",
      },
      meta: "**Cross-Domain Conflicts**\n- Safety pressure conflicts with speed of implementation across the synthetic service.\n**Hidden Assumptions**\n- Monitoring capability is assumed to be available at every site.\n**Reasoning Gaps**\n- Local validation evidence is incomplete.\n**Unresolved Tensions**\n- Speed versus assurance remains unresolved.\n**Integration Signal**: MEDIUM — material tensions remain visible.",
      stress: "**Fragility Score**: 6/10 — synthetic rationale.",
      chair: "**Decision Brief Status**: Complete — assurance versus implementation speed remains unresolved.\n**Decision Conditions**\n- Validate monitoring before expansion.\n**Key Trade-offs**\n- Speed versus assurance.",
      epistemic: "**Epistemic Health Score**: ADEQUATE\n**Overconfidence Flags**\n- National transferability remains uncertain.\n**Epistemic Gaps**\n- Local evidence.",
      probe: "**Probe Verdict**: BOARD REASONING SOUND\n**What the Board Missed**\n- Synthetic omission.",
      analysisMode: "CORE",
      activeDirectors: [systems, equity, lived, digital, safety],
      omittedDirectors: [],
      dialogueHistory: [],
      totalLoadedDocs: 2,
      webSearch: false,
    },
    expected: {
      covered: 5,
      failedCount: 0,
      proceedCount: 1,
      cautionCount: 4,
      haltCount: 0,
      fragScore: "6",
      decisionBriefStatus: "Complete",
      epistemicScore: "ADEQUATE",
      probeVerdict: "BOARD REASONING SOUND",
    },
    expectedDiagnostics: [],
  },
  {
    label: "partial synthesis run",
    input: {
      decision: "Synthetic decision B",
      dirOutputs: {
        systems: "**Recommendation Signal**: CAUTION\n**Fragility Signals**\n- system risk",
        equity: "[Director failed: synthetic error]",
        lived: "",
      },
      meta: "",
      stress: "",
      chair: "",
      epistemic: "",
      probe: "",
      analysisMode: "CHAIR_SPECIFIED",
      activeDirectors: [systems, equity, lived],
      omittedDirectors: [digital, safety],
      dialogueHistory: [],
      totalLoadedDocs: 0,
      webSearch: false,
    },
    expected: {
      covered: 1,
      failedCount: 1,
      coverageScore: 33,
      proceedCount: 0,
      cautionCount: 1,
      haltCount: 0,
      decisionBriefStatus: "-",
      fragScore: "-",
    },
    expectedDiagnostics: [],
  },
  {
    label: "HALT signal distribution",
    input: {
      decision: "Synthetic decision C",
      dirOutputs: {
        systems: "**Recommendation Signal**: CAUTION\n**Fragility Signals**\n- system risk",
        equity: "**Recommendation Signal**: CAUTION\n**Fragility Signals**\n- equity risk",
        lived: "**Recommendation Signal**: CAUTION\n**Fragility Signals**\n- trust risk",
        digital: "**Recommendation Signal**: CAUTION\n**Fragility Signals**\n- data risk",
        safety: "**Recommendation Signal**: HALT\n**Fragility Signals**\n- safety threshold",
      },
      meta: "**Integration Signal**: LOW — synthetic cross-domain tension.",
      stress: "**Fragility Score**: 9/10 — synthetic stress result.",
      chair: "**Decision Brief Status**: Complete — material safety tension remains unresolved.",
      epistemic: "**Epistemic Health Score**: WEAK",
      probe: "**Probe Verdict**: SIGNIFICANT GAPS",
      analysisMode: "CORE",
      activeDirectors: [systems, equity, lived, digital, safety],
      omittedDirectors: [],
      dialogueHistory: [],
      totalLoadedDocs: 1,
      webSearch: false,
    },
    expected: {
      covered: 5,
      proceedCount: 0,
      cautionCount: 4,
      haltCount: 1,
      fragScore: "9",
      epistemicScore: "WEAK",
      probeVerdict: "SIGNIFICANT GAPS",
    },
    expectedDiagnostics: [],
  },
  {
    label: "META under-extraction diagnostic",
    input: {
      decision: "Synthetic decision D",
      dirOutputs: {
        systems: "**Recommendation Signal**: CAUTION\n**Fragility Signals**\n- system risk",
      },
      meta: "**Cross-Domain Conflicts**\n**SOURCED**\n**SOURCED**\n**INFERRED**\n**Hidden Assumptions**\n",
      stress: "",
      chair: "",
      epistemic: "",
      probe: "",
      analysisMode: "CHAIR_SPECIFIED",
      activeDirectors: [systems],
      omittedDirectors: [],
      dialogueHistory: [],
      totalLoadedDocs: 0,
      webSearch: false,
    },
    expected: {
      covered: 1,
    },
    expectedDiagnostics: [
      {
        code: "META_UNDER_EXTRACTION",
        currentTransport: "console.warn",
        messagePattern: "META has 3 SOURCED/INFERRED blocks",
        preserveWhenSplit: true,
        governanceMeaning: "extraction quality may have degraded; do not silently discard the diagnostic",
      },
    ],
  },
];
