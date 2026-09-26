import assert from "node:assert/strict";
import fs from "node:fs";
import {
  buildReplayPlan,
  buildChairReplayPrompts,
  buildComparatorReplayPrompts,
  hydrateReplayState,
  replayFrozenStages,
  unwrapReplayDecision,
  validateReplayDecision,
} from "../src/stage-replay.js";

const fixtureDir="tests/fixtures/calibration/DR-20260926-204324-a2e644";
const manifest=JSON.parse(fs.readFileSync(fixtureDir+"/manifest.json","utf8"));
const ledgerDocument=JSON.parse(fs.readFileSync(fixtureDir+"/"+manifest.source_ledger,"utf8"));
const decision=unwrapReplayDecision(ledgerDocument,manifest.fixture_id);

assert.equal(manifest.fixture_class,"live_constitutional_calibration");
assert.equal(manifest.artifact_count,42);
assert.equal(decision.decision_id,manifest.fixture_id);
assert.equal(decision.instruction_commit,manifest.source_instruction_commit);
assert.equal(decision.session_governance_status,"COMPLETE_DEGRADED");
assert.equal(decision.synthesis_stage_status.chair.status,"success");
assert.equal(decision.synthesis_stage_status.comparator.status,"failed");
assert.match(decision.synthesis_stage_status.comparator.error,/credit balance is too low/i);
assert.equal(decision.authority_repair_events.filter(e=>e.layer==="chair").length,1);
assert.equal(decision.authority_repair_events.find(e=>e.layer==="chair").outcome,"repaired");

assert.deepStrictEqual(buildReplayPlan("comparator"),["comparator"]);
assert.deepStrictEqual(buildReplayPlan("chair"),["chair","comparator"]);
assert.throws(function(){buildReplayPlan("stress");},/Unsupported replay entry stage/);

validateReplayDecision(decision,"comparator");
validateReplayDecision(decision,"chair");

const state=hydrateReplayState(decision);
assert.equal(state.results.length,13);
assert.equal(state.activeDir.length,13);

const instructions={
  chair:fs.readFileSync("chair.md","utf8"),
  comparator:fs.readFileSync("comparator.md","utf8"),
};

const chairPrompts=buildChairReplayPrompts(decision,state,instructions);
assert.match(chairPrompts.system,/The Chair does not add a further judgment layer/);
assert.match(chairPrompts.user,/Decision Surface Map:/);
assert.match(chairPrompts.user,/Adversarial Bias Probe:/);

const comparatorPrompts=buildComparatorReplayPrompts(decision,state,instructions);
assert.deepStrictEqual(comparatorPrompts.counts,{proceed:0,caution:11,halt:2});
assert.match(comparatorPrompts.system,/Signal Tally .*0 PROCEED \/ 11 CAUTION \/ 2 HALT/);
assert.match(comparatorPrompts.system,/## Chair Decision Brief/);

function comparatorOutput() {
  return JSON.stringify({
    decision_id:manifest.fixture_id,
    schema_version:"3.0.0-alpha.2",
    analysis_mode:"FULL",
    coverage_ratio:"13/13",
    summary:{one_paragraph:"Synthetic.",dominant_frame:"Synthetic.",decision_signal_interpretation:"0 PROCEED / 11 CAUTION / 2 HALT"},
    consensus:[],
    dissensus:[],
    tradeoffs:[],
    key_risks:[],
    chair_resolution:{
      decision_brief_status:decision.decision_brief_status,
      conditions:[],
      irreducible_uncertainties:[],
      kill_switches:[],
      success_metrics:[]
    },
    monitoring_triggers_30_60_90:{days_0_30:[],days_31_60:[],days_61_90:[]},
    coverage_limitations:"Synthetic."
  });
}

const comparatorLayers=[];
const comparatorReplay=await replayFrozenStages({
  ledgerDocument:ledgerDocument,
  decisionId:manifest.fixture_id,
  from:"comparator",
  instructions:instructions,
  callGovernedImpl:async function(layer){
    comparatorLayers.push(layer);
    assert.equal(layer,"comparator");
    return comparatorOutput();
  }
});
assert.deepStrictEqual(comparatorLayers,["comparator"]);
assert.equal(comparatorReplay.stage_status.chair.status,"frozen");
assert.equal(comparatorReplay.stage_status.comparator.status,"success");
assert.equal(comparatorReplay.comparator.parsed.schema_version,"3.0.0-alpha.2");

const chairLayers=[];
const replacementChair="**Decision Brief Status**: Complete — synthetic unresolved tension\n"+
  "**Director Signal Distribution**\n2 HALT / 11 CAUTION / 0 PROCEED\n"+
  ("Representational Chair text. ".repeat(20));
const chairReplay=await replayFrozenStages({
  ledgerDocument:ledgerDocument,
  decisionId:manifest.fixture_id,
  from:"chair",
  instructions:instructions,
  callGovernedImpl:async function(layer){
    chairLayers.push(layer);
    if(layer==="chair") return replacementChair;
    if(layer==="comparator") return comparatorOutput();
    throw new Error("unexpected layer "+layer);
  },
  repairChairImpl:async function(text){return text;}
});
assert.deepStrictEqual(chairLayers,["chair","comparator"]);
assert.equal(chairReplay.stage_status.chair.status,"success");
assert.equal(chairReplay.stage_status.comparator.status,"success");
assert.equal(chairReplay.chair_output,replacementChair);

const billingReplay=await replayFrozenStages({
  ledgerDocument:ledgerDocument,
  decisionId:manifest.fixture_id,
  from:"comparator",
  instructions:instructions,
  callGovernedImpl:async function(){throw new Error("Your credit balance is too low to access the Anthropic API.");}
});
assert.equal(billingReplay.stage_status.comparator.status,"failed");
assert.match(billingReplay.stage_errors[0],/credit balance is too low/i);

console.log("PHDSS stage replay verification passed.");
console.log("Frozen calibration fixture: PASS");
console.log("Comparator-only replay path: PASS");
console.log("Chair-then-Comparator replay path: PASS");
console.log("Billing failure visibility: PASS");
