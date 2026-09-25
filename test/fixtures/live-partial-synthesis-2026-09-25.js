// Structural regression fixture derived from the live UI run
// DR-20260925-155752-a300ae on 2026-09-25.
// Generated prose is intentionally omitted; only execution-chain facts are retained.

export const livePartialSynthesis20260925 = Object.freeze({
  decisionId:"DR-20260925-155752-a300ae",
  outputs:Object.freeze({
    surfaceMapOut:null,
    epistemicOut:"**Epistemic Health Score**: WEAK",
    metaOut:"**Integration Signal**: MEDIUM",
    realityAnchorOut:null,
    probeOut:"**Probe Verdict**: SIGNIFICANT GAPS",
    stressOut:"**Fragility Score**: 9/10",
    chairOut:"**Decision Brief Status**: Complete — Partial Evidence Base — synthetic retained Chair output long enough for Ledger completeness detection.",
  }),
  synthesisStageStatus:Object.freeze({
    surface_map:Object.freeze({status:"failed",error:"live run Surface Mapper failure"}),
    epistemic_audit:Object.freeze({status:"success"}),
    meta:Object.freeze({status:"success"}),
    reality_anchor:Object.freeze({status:"failed",error:"live run Reality Anchor failure"}),
    probe:Object.freeze({status:"success"}),
    stress:Object.freeze({status:"success"}),
    chair:Object.freeze({status:"success"}),
    comparator:Object.freeze({status:"success"}),
  }),
  expected:Object.freeze({
    sessionGovernanceStatus:"INCOMPLETE_MANDATORY_SYNTHESIS_FAILURE",
    failedSynthesisStages:Object.freeze(["surface_map","reality_anchor"]),
    failedMandatorySynthesisStages:Object.freeze(["surface_map"]),
  }),
});
