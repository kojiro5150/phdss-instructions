import assert from "node:assert/strict";

import { runGovernancePipeline } from "../src/pipeline.js";

// L-22 characterisation. The Adversarial Probe's challenge direction is set by
// prompt text only. Nothing in the pipeline checks that the Probe's strongest
// counter-argument opposes the dominant signal it was given. This test pins
// the observed behaviour: a Probe output that REINFORCES a CAUTION Board is
// accepted as a successful stage and forwarded to the Chair without any flag.
// It records a known limitation, not desired behaviour. If a direction check
// is added, this test fails by design: update L-22 and this test together.

const REINFORCING_PROBE=[
  "**The Strongest Counter-Argument**",
  "The strongest case against proceeding is that the Board has not gone far enough: implementation risk is understated and the proposal should not proceed.",
  "",
  "**Probe Verdict**: SIGNIFICANT GAPS",
].join("\n");

function directorOutput(){
  return "**Key Finding**\nSynthetic finding.\n**Recommendation Signal**: CAUTION — synthetic rationale.";
}

function synthesisBrief(moduleLabel){
  return JSON.stringify({
    module:moduleLabel,verdict_label:"Synthetic",verdict:"Synthetic",
    key_discovery:"Synthetic",primary_tension:"",signal_rationale:"",
    room_should_discuss:[],most_likely_to_benefit:[],most_exposed_to_failure:[],
    non_negotiable_conditions:[],governance_implication:""
  });
}

function directorBrief(label){
  return {director:label,signal:"",key_finding:"Synthetic",signal_rationale:"Synthetic rationale."};
}

const config={
  decision:"Synthetic governance decision",
  decisionId:"DR-TEST-L22",
  decisionSignal:"Synthetic decision signal",
  orgContext:"Synthetic organisation",
  analysisMode:"CHAIR_SPECIFIED",
  chairSelectedIds:["equity"],
  docs:{},
  instructions:{},
  webSearch:false,
  publicWebSearch:false,
  sessionEvidence:[],
  autoContinue:true,
  totalLoadedDocs:0,
  instrLoadState:"ready",
  ctx:{decisionSignal:"Synthetic decision signal",orgContext:"Synthetic organisation",constraints:[],evidenceLinks:[]},
  priorStressTestResult:null,
};

const prompts={};
const runtime={
  compressDirectorImpl:async function(label){return directorBrief(label);},
  deterministicDirectorBriefImpl:function(label){return directorBrief(label);},
  compressSynthesisImpl:async function(moduleLabel){return synthesisBrief(moduleLabel);},
  deterministicSynthesisBriefImpl:function(moduleLabel){return synthesisBrief(moduleLabel);},
  sleepImpl:async function(){},
  callClaudeImpl:async function(){return directorOutput();},
  callGovernedSynthesisImpl:async function(layer,system,user){
    prompts[layer]={system:String(system||""),user:String(user||"")};
    if(layer==="surface_map") return "**Dominant Signal**\nCAUTION\nSynthetic surface.";
    if(layer==="epistemic_audit") return "**Epistemic Health Score**: ADEQUATE\n"+("E".repeat(2100));
    if(layer==="cross_domain_tension_analysis") return "**Integration Signal**: MEDIUM";
    if(layer==="reality_anchor") return "**Operational Confidence**: MEDIUM";
    if(layer==="adversarial_probe") return REINFORCING_PROBE;
    if(layer==="stress_test") return "**Fragility Score**: 5/10";
    if(layer==="chair") return "**Decision Brief Status**: Complete — synthetic unresolved tension\nSynthetic Chair reasoning long enough to establish a complete decision brief.";
    return "Synthetic stage output";
  },
  repairChairDecisionBoundaryImpl:async function(text){return text;},
  nowImpl:function(){return "2026-11-08T00:00:00.000Z";},
};

const state=await runGovernancePipeline(config,runtime,function(){});

try {
  assert.equal((prompts.adversarial_probe.system.match(/The Board's dominant signal is: ([A-Z]+)/)||[])[1],"CAUTION","Probe was told CAUTION");
  assert.equal(state.synthesisStageStatus.probe.status,"success","reinforcing Probe recorded as a successful stage");
  assert.ok(prompts.chair&&prompts.chair.user.includes("the Board has not gone far enough"),"reinforcing challenge forwarded to the Chair");
  assert.ok(!/direction/i.test(JSON.stringify(state.synthesisStageStatus.probe)),"no direction flag recorded on the Probe stage");
} catch(error){
  console.error("FAIL L-22 probe-direction characterisation: "+error.message);
  console.error("Observed behaviour changed. Update L-22 in docs/LIMITATIONS_REGISTER.md and this test together.");
  process.exit(1);
}
console.log("L-22 probe-direction characterisation: PASS");
