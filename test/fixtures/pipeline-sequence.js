// Pipeline sequencing contract captured before extraction from App_FINAL.jsx.
// This is a structural fixture, not scenario evidence.

export const pipelineSequenceContract = Object.freeze({
  directorExecution: {
    mode: "sequential",
    interDirectorDelayMs: 3000,
    serverErrorRetries: [10000,15000],
    signalRescue: {
      whenSignalMissingAndOutputLongerThan: 500,
      model: "claude-sonnet-4-6",
      maxTokens: 300,
      temperature: 0.8,
    },
  },
  synthesisStages: [
    {stage:"surface_map",stageDone:2},
    {stage:"epistemic_audit",stageDone:3,retryShortOutputBelowChars:2000,retryDelaysMs:[2000,4000]},
    {stage:"cross_domain_tension_analysis",stageDone:4},
    {stage:"reality_anchor",stageDone:5},
    {stage:"adversarial_probe",stageDone:6},
    {stage:"stress_test",stageDone:7,conditional:true},
    {stage:"chair",stageDone:8},
    {stage:"comparator",stageDone:null},
  ],
  directorStageDone: 1,
  stress: {
    alwaysInFull: true,
    haltThreshold: 1,
    cautionThreshold: 2,
    probeTriggers: ["SIGNIFICANT GAPS","CONCLUSION CHALLENGED"],
  },
  chair: {
    probeResponseInjection: true,
    compatibilityRepairAfterGovernedSynthesis: true,
  },
  comparator: {
    correctSignalInterpretationIfCountsMissing: true,
    createdAtRuntime: true,
  },
  ledger: {
    appendAfterComparator: true,
    appendOnFatalWhenDirectorsExist: true,
    schemaVersion: "3.0.0-alpha.2",
    runtimeContract: "2.0-recovery",
  },
});
