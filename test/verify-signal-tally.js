import assert from "node:assert/strict";

import {
  extractDirectorSignal,
  dominantSignalFromCounts,
  tallyDirectorSignals,
} from "../src/signal-tally.js";
import { runGovernancePipeline } from "../src/pipeline.js";

// L-18 regression: every stage told the dominant signal or the signal counts
// must receive the same values from one shared tally.

const failures=[];
async function check(label,fn){
  try { await fn(); }
  catch(error){ failures.push(label+": "+error.message); }
}

function directorOutput(signal){
  return [
    "**Key Finding**",
    "Synthetic finding.",
    "**Recommendation Signal**: "+signal+" — synthetic rationale.",
  ].join("\n");
}

const NOT_APPLICABLE_OUTPUT="NOT APPLICABLE — synthetic proposal is outside this Director's mandate.";

await check("signal extraction",async function(){
  assert.equal(extractDirectorSignal(directorOutput("PROCEED")),"PROCEED");
  assert.equal(extractDirectorSignal("**Recommendation Signal**: [CAUTION] - x"),"CAUTION");
  assert.equal(extractDirectorSignal("**Recommendation Signal** HALT"),"HALT");
  assert.equal(extractDirectorSignal("**Recommendation Signal**: proceed"),null);
  assert.equal(extractDirectorSignal("no signal here"),null);
  assert.equal(extractDirectorSignal(undefined),null);
});

await check("dominant rule preserved from pre-L-18 Surface Map path",async function(){
  // No parsed signals satisfies the CAUTION branch (0 >= 0), so MIXED is
  // unreachable under the preserved rule. Recorded under L-18; not decided here.
  assert.equal(dominantSignalFromCounts(0,0,0),"CAUTION");
  assert.equal(dominantSignalFromCounts(3,1,1),"PROCEED");
  assert.equal(dominantSignalFromCounts(1,3,1),"CAUTION");
  assert.equal(dominantSignalFromCounts(1,1,3),"HALT");
  assert.equal(dominantSignalFromCounts(2,2,0),"CAUTION");
  assert.equal(dominantSignalFromCounts(0,2,2),"CAUTION");
  assert.equal(dominantSignalFromCounts(2,2,2),"CAUTION");
  // Recorded as an open tie-semantics question under L-18; preserved, not decided here.
  assert.equal(dominantSignalFromCounts(4,1,4),"PROCEED");
});

await check("tally counts, NOT APPLICABLE and undefined",async function(){
  const t=tallyDirectorSignals([
    {output:directorOutput("PROCEED")},
    {output:directorOutput("CAUTION")},
    {output:directorOutput("HALT")},
    {output:NOT_APPLICABLE_OUTPUT},
    {output:"NOT APPLICABLE but **Recommendation Signal**: proceed"},
    {output:"[Director failed: synthetic]"},
  ]);
  assert.deepStrictEqual({...t},{proceed:1,caution:1,halt:1,notApplicable:1,undefinedCount:2,total:6,dominant:"CAUTION"});
  assert.equal(Object.isFrozen(t),true);
  assert.equal(tallyDirectorSignals([]).dominant,"CAUTION");
  assert.equal(tallyDirectorSignals(null).total,0);
});

function baseConfig(){
  return {
    decision:"Synthetic governance decision",
    decisionId:"DR-TEST-L18",
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
  return {
    director:label,signal:"",key_finding:"Synthetic",signal_rationale:"Synthetic rationale.",
  };
}

// Runs the pipeline with Director signals supplied in order and returns the
// dominant signal each stage was given.
async function stageDominants(signalsInOrder){
  const prompts={};
  let call=0;
  const runtime={
    compressDirectorImpl:async function(label){return directorBrief(label);},
    deterministicDirectorBriefImpl:function(label){return directorBrief(label);},
    compressSynthesisImpl:async function(moduleLabel){return synthesisBrief(moduleLabel);},
    deterministicSynthesisBriefImpl:function(moduleLabel){return synthesisBrief(moduleLabel);},
    sleepImpl:async function(){},
    callClaudeImpl:async function(){
      const signal=signalsInOrder[call++];
      return signal==="NOT APPLICABLE"?NOT_APPLICABLE_OUTPUT:directorOutput(signal);
    },
    callGovernedSynthesisImpl:async function(layer,system,user){
      prompts[layer]={system:String(system||""),user:String(user||"")};
      if(layer==="surface_map") return "**Dominant Signal**\nCAUTION\nSynthetic surface.";
      if(layer==="epistemic_audit") return "**Epistemic Health Score**: ADEQUATE\n"+("E".repeat(2100));
      if(layer==="cross_domain_tension_analysis") return "**Integration Signal**: MEDIUM";
      if(layer==="reality_anchor") return "**Operational Confidence**: MEDIUM";
      if(layer==="adversarial_probe") return "**The Strongest Counter-Argument**\nSynthetic.\n\n**Probe Verdict**: SIGNIFICANT GAPS";
      if(layer==="stress_test") return "**Fragility Score**: 5/10";
      if(layer==="chair") return "**Decision Brief Status**: Complete — synthetic unresolved tension\nSynthetic Chair reasoning long enough to establish a complete decision brief.";
      return "Synthetic stage output";
    },
    repairChairDecisionBoundaryImpl:async function(text){return text;},
    nowImpl:function(){return "2026-11-02T00:00:00.000Z";},
  };
  const state=await runGovernancePipeline(baseConfig(),runtime,function(){});
  const surface=(prompts.surface_map.user.match(/DOMINANT SIGNAL: ([A-Z]+)/)||[])[1];
  const probe=(prompts.adversarial_probe.system.match(/The Board's dominant signal is: ([A-Z]+)/)||[])[1];
  return {surface,probe,directorCount:call,state};
}

await check("Surface Map and Probe receive the same dominant signal on a tie",async function(){
  // Discover how many Directors this configuration runs, then build an
  // order-sensitive PROCEED/CAUTION tie with PROCEED reported first.
  const probeRun=await stageDominants(new Array(32).fill("CAUTION"));
  const n=probeRun.directorCount;
  assert.ok(n>=2,"configuration must run at least two Directors, ran "+n);
  const signals=[];
  for(let i=0;i<n;i++) signals.push(i%2===0?"PROCEED":"CAUTION");
  if(n%2===1) signals[n-1]="NOT APPLICABLE";
  const run=await stageDominants(signals);
  assert.equal(run.surface,"CAUTION","Surface Map dominant");
  assert.equal(run.probe,run.surface,"Probe must be told the Surface Map's dominant signal");
  assert.equal(run.state.signalTally.dominant,"CAUTION");
  assert.equal(run.state.signalTally.proceed,run.state.signalTally.caution);
});

await check("Surface Map and Probe agree when no signal is parsed",async function(){
  const run=await stageDominants(new Array(32).fill("NOT APPLICABLE"));
  assert.equal(run.surface,"CAUTION");
  assert.equal(run.probe,run.surface);
});

if(failures.length){
  failures.forEach(function(f){console.error("FAIL "+f);});
  process.exit(1);
}
console.log("L-18 shared signal tally: PASS");
