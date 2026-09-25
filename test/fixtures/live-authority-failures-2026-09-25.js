// Structural regression facts from live UI run DR-20260925-165634-0e8b48.
// No generated scenario prose is retained here.

export const liveAuthorityFailures20260925 = Object.freeze({
  decisionId:"DR-20260925-165634-0e8b48",
  failures:Object.freeze({
    reality_anchor:Object.freeze({
      reason:"RETIRED_DECISION_VOCABULARY",
    }),
    chair:Object.freeze({
      reason:"PATHWAY_RANKING",
    }),
  }),
  expected:Object.freeze({
    sessionGovernanceStatus:"INCOMPLETE_MANDATORY_SYNTHESIS_FAILURE",
    comparatorStatus:"skipped",
    comparatorReason:"required upstream stage chair failed",
  }),
});
