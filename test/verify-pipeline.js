import assert from "node:assert/strict";
import fs from "node:fs";

import { DIRECTORS } from "../src/registry.js";
import {
  shouldRunStressTest,
  enforceSynthesisAuthority,
  callGovernedSynthesis,
  chairDecisionBoundaryLeak,
  repairChairDecisionBoundary,
  buildLedgerRecord,
  runGovernancePipeline,
} from "../src/pipeline.js";
import { pipelineSequenceContract } from "./fixtures/pipeline-sequence.js";

const failures=[];
async function check(label,fn){
  try { await fn(); }
  catch(error){ failures.push(label+": "+error.message); }
}

function directorBrief(label,signal){
  return JSON.stringify({
    director:label,
    signal:signal,
    confidence:"HIGH",
    core_judgment:"Synthetic core judgment.",
    critical_risks:["Synthetic risk"],
    assumptions:["Synthetic assumption"],
    prerequisites:["Synthetic condition"],
    view_change_triggers:["Synthetic trigger"],
    coverage_limit:"",
    regulatory_blockers:[],
    overflow_flags:[],
    governance_record:{
      key_discovery:"Synthetic discovery.",
      primary_tension:"speed versus assurance",
      signal_rationale:"Synthetic rationale.",
      room_should_discuss:["Synthetic question?"],
      most_likely_to_benefit:["Synthetic beneficiary"],
      most_exposed_to_failure:["Synthetic exposed group"],
      non_negotiable_conditions:["Synthetic condition"],
      governance_implication:"Synthetic implication."
    }
  });
}

function directorOutput(signal){
  return [
    "## EXECUTIVE LAYER",
    "Synthetic Director analysis.",
    "",
    "**Recommendation Signal**: "+signal+" — synthetic rationale.",
    "",
    "Confidence: HIGH",
    "",
    "**Fragility Signals**",
    "A) Fragility signals identified: synthetic fragility.",
  ].join("\n");
}

function stageOutput(layer,probeVerdict){
  if(layer==="surface_map") return "**Dominant Signal**\nCAUTION\nSynthetic surface.";
  if(layer==="epistemic_audit") return "**Epistemic Health Score**: ADEQUATE\n"+("E".repeat(2100));
  if(layer==="cross_domain_tension_analysis") return "**Integration Signal**: MEDIUM\nSynthetic tension.";
  if(layer==="reality_anchor") return "**Operational Confidence**: MEDIUM\nSynthetic reality.";
  if(layer==="adversarial_probe") return "**The Strongest Counter-Argument**\nSynthetic counter-argument.\n\n**Probe Verdict**: "+(probeVerdict||"SIGNIFICANT GAPS");
  if(layer==="stress_test") return "**Fragility Score**: 7/10 — synthetic stress.";
  if(layer==="chair") return "**Decision Brief Status**: Complete — synthetic unresolved tension\nSynthetic Chair reasoning long enough to establish a complete decision brief.";
  if(layer==="comparator") return JSON.stringify({summary:{decision_signal_interpretation:"Synthetic interpretation."}});
  return "Synthetic output";
}

function baseConfig(){
  return {
    decision:"Synthetic governance decision",
    decisionId:"DR-TEST-001",
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

function fakeCompression(signal){
  return {
    compressDirectorImpl:async function(label){return directorBrief(label,signal);},
    deterministicDirectorBriefImpl:function(label){return directorBrief(label,signal);},
    compressSynthesisImpl:async function(moduleLabel){
      return JSON.stringify({
        module:moduleLabel,verdict_label:"Synthetic",verdict:"Synthetic",
        key_discovery:"Synthetic",primary_tension:"",signal_rationale:"",
        room_should_discuss:[],most_likely_to_benefit:[],most_exposed_to_failure:[],
        non_negotiable_conditions:[],governance_implication:""
      });
    },
    deterministicSynthesisBriefImpl:function(moduleLabel){
      return JSON.stringify({
        module:moduleLabel,verdict_label:"Synthetic",verdict:"Synthetic",
        key_discovery:"Synthetic",primary_tension:"",signal_rationale:"",
        room_should_discuss:[],most_likely_to_benefit:[],most_exposed_to_failure:[],
        non_negotiable_conditions:[],governance_implication:"",_fallback_reason:"synthetic"
      });
    },
  };
}

await check("stress trigger contract",async function(){
  assert.deepStrictEqual(shouldRunStressTest("FULL","",[], "", "", "", ""),{run:true,reason:"FULL mode — stress test always runs"});
  assert.equal(shouldRunStressTest("CORE","emergency rollout",[], "", "", "", "").run,true);
  assert.equal(shouldRunStressTest("CORE","neutral",[{output:directorOutput("HALT")}], "", "", "", "").run,true);
  assert.equal(shouldRunStressTest("CORE","neutral",[{output:directorOutput("CAUTION")},{output:directorOutput("CAUTION")}], "", "", "", "").run,true);
  assert.equal(shouldRunStressTest("CORE","neutral",[], "", "", "", "capacity gap exists").run,true);
  assert.equal(shouldRunStressTest("CORE","neutral",[], "significant fragility hotspot", "", "", "").run,true);
  assert.equal(shouldRunStressTest("CORE","neutral",[], "", "WEAK", "", "").run,true);
  assert.equal(shouldRunStressTest("CORE","neutral",[], "", "", "CONCLUSION CHALLENGED", "").run,true);
  assert.deepStrictEqual(shouldRunStressTest("CORE","neutral",[], "", "ADEQUATE", "BOARD REASONING SOUND", "ready"),{run:false,reason:"No stress triggers detected"});
});

await check("authority repair remains in pipeline",async function(){
  let calls=0;
  const safe=await enforceSynthesisAuthority("chair","Material tension remains.","SYS","USER",{apiCallImpl:async function(){calls++;}});
  assert.equal(safe,"Material tension remains.");
  assert.equal(calls,0);

  const repaired=await enforceSynthesisAuthority(
    "chair",
    "The Board should approve the proposal.",
    "SYS",
    "USER",
    {apiCallImpl:async function(system,user){
      calls++;
      assert.match(system,/BOUNDARY REPAIR/);
      assert.match(user,/PRIOR OUTPUT TO REPAIR/);
      return {text:"Material tension remains for human judgment."};
    }}
  );
  assert.equal(repaired,"Material tension remains for human judgment.");
  assert.equal(calls,1);
  assert.equal(chairDecisionBoundaryLeak("The Board should approve the proposal."),true);
  assert.equal(chairDecisionBoundaryLeak("Material tension remains."),false);
});

await check("governed synthesis appends authority contract then repairs",async function(){
  let governedSystem="";
  const out=await callGovernedSynthesis(
    "chair","BASE","USER",true,false,
    {
      callClaudeImpl:async function(system){governedSystem=system;return "The Board should approve the proposal.";},
      apiCallImpl:async function(){return {text:"Conditions and uncertainty remain unresolved."};}
    }
  );
  assert.match(governedSystem,/PHDSS AUTHORITY CONTRACT/);
  assert.equal(out,"Conditions and uncertainty remain unresolved.");

  await assert.rejects(
    repairChairDecisionBoundary(
      "The Board should approve the proposal.","BASE","USER",
      {apiCallImpl:async function(){return {text:"The Board must reject the proposal."};}}
    ),
    /authority boundary violation persisted/
  );
});

await check("ledger assembly preserves recovered schema",async function(){
  const active=[DIRECTORS.find(d=>d.id==="systems"),DIRECTORS.find(d=>d.id==="equity"),DIRECTORS.find(d=>d.id==="safety")];
  const results=[
    {...active[0],output:directorOutput("CAUTION")},
    {...active[1],output:directorOutput("PROCEED")},
    {...active[2],output:directorOutput("HALT")},
  ];
  const record=buildLedgerRecord({
    decisionId:"DR-LEDGER",
    decision:"Synthetic decision",
    decisionSignal:"Synthetic signal",
    orgContext:"Synthetic org",
    webSearch:true,
    totalLoadedDocs:2,
    sessionEvidence:[{content:"one"},{content:""}],
    instrLoadState:"partial",
    results,
    metaOut:"META",
    stressOut:"**Fragility Score**: 7/10",
    chairOut:"**Decision Brief Status**: Complete — synthetic tension\nAdditional Chair reasoning to exceed fifty characters.",
    epistemicOut:"**Epistemic Health Score**: WEAK",
    probeOut:"**Probe Verdict**: SIGNIFICANT GAPS",
    comparatorData:{parsed:{ok:true}},
    activeDir:active,
    omittedDir:DIRECTORS.filter(d=>!active.some(a=>a.id===d.id)),
    mode:"CHAIR_SPECIFIED",
    stressResult:{run:true,reason:"synthetic"},
    surfaceMapOut:"SURFACE",
    realityAnchorOut:"REALITY",
    dirBriefs:{systems:"brief"},
    synthesisBriefs:{chair:"chair brief"},
  },{nowImpl:function(){return "2026-09-25T00:00:00.000Z";}});

  assert.equal(record.schema_version,"3.0.0-alpha.1");
  assert.equal(record.runtime_contract,"2.0-recovery");
  assert.equal(record.created_at,"2026-09-25T00:00:00.000Z");
  assert.equal(record.session_governance_status,"COMPLETE");
  assert.equal(record.run_intensity,"CUSTOM");
  assert.equal(record.coverage_ratio,"3/13");
  assert.equal(record.docs_loaded,3);
  assert.equal(record.proceed_count,1);
  assert.equal(record.caution_count,1);
  assert.equal(record.halt_count,1);
  assert.equal(record.epistemic_score,"WEAK");
  assert.equal(record.probe_verdict,"SIGNIFICANT GAPS");
  assert.equal(record.fragility_score,7);
  assert.equal(record.stress_test_ran,true);
  assert.equal(record.instruction_source,"github_partial");
  assert.deepStrictEqual(record.structured_records.directors,{systems:"brief"});
  assert.deepStrictEqual(record.structured_records.synthesis,{chair:"chair brief"});
});

await check("pipeline executes recovered stage order with stress",async function(){
  const events=[];
  const layers=[];
  const sleeps=[];
  const config=baseConfig();
  const runtime={
    ...fakeCompression("CAUTION"),
    sleepImpl:async function(ms){sleeps.push(ms);},
    callClaudeImpl:async function(){return directorOutput("CAUTION");},
    callGovernedSynthesisImpl:async function(layer){layers.push(layer);return stageOutput(layer,"SIGNIFICANT GAPS");},
    repairChairDecisionBoundaryImpl:async function(text){return text;},
    nowImpl:function(){return "2026-09-25T00:00:00.000Z";},
  };
  const state=await runGovernancePipeline(config,runtime,function(type,payload){events.push({type,payload});});

  assert.equal(state.fatalError,undefined);
  assert.deepStrictEqual(state.activeDir.map(d=>d.id),["systems","equity","safety"]);
  assert.equal(state.results.length,3);
  assert.deepStrictEqual(sleeps,[3000,3000]);
  assert.deepStrictEqual(layers,[
    "surface_map","epistemic_audit","cross_domain_tension_analysis","reality_anchor",
    "adversarial_probe","stress_test","chair","comparator"
  ]);
  assert.deepStrictEqual(events.filter(e=>e.type==="stages-done").map(e=>e.payload.value),[1,2,3,4,5,6,7,8]);
  assert.equal(state.stressDecision.run,true);
  assert.equal(state.stageErrors.length,0);
  assert.equal(Object.keys(state.dirBriefs).length,3);
  assert.equal(Object.keys(state.synthesisBriefs).length,7);
  assert.ok(state.ledgerRecord);
  assert.equal(state.ledgerRecord.caution_count,3);
  assert.equal(state.ledgerRecord.stress_test_ran,true);
  assert.match(state.comparatorData.parsed.summary.decision_signal_interpretation,/\[Signal tally: 0 PROCEED \/ 3 CAUTION \/ 0 HALT\]/);
  assert.equal(events.filter(e=>e.type==="ledger-record").length,1);
});

await check("pipeline skips stress when no trigger exists",async function(){
  const layers=[];
  const config=baseConfig();
  const runtime={
    ...fakeCompression("PROCEED"),
    sleepImpl:async function(){},
    callClaudeImpl:async function(){return directorOutput("PROCEED");},
    callGovernedSynthesisImpl:async function(layer){
      layers.push(layer);
      if(layer==="surface_map") return "**Dominant Signal**\nPROCEED\nSynthetic surface.";
      if(layer==="epistemic_audit") return "**Epistemic Health Score**: ADEQUATE\n"+("E".repeat(2100));
      if(layer==="cross_domain_tension_analysis") return "**Integration Signal**: HIGH";
      if(layer==="reality_anchor") return "**Operational Confidence**: HIGH\nReady.";
      if(layer==="adversarial_probe") return "**The Strongest Counter-Argument**\nSynthetic counter.\n\n**Probe Verdict**: BOARD REASONING SOUND";
      if(layer==="chair") return stageOutput("chair");
      if(layer==="comparator") return JSON.stringify({summary:{decision_signal_interpretation:"3 PROCEED / 0 CAUTION / 0 HALT"}});
      throw new Error("unexpected layer "+layer);
    },
    repairChairDecisionBoundaryImpl:async function(text){return text;},
    nowImpl:function(){return "2026-09-25T00:00:00.000Z";},
  };
  const state=await runGovernancePipeline(config,runtime,function(){});
  assert.equal(state.stressDecision.run,false);
  assert.equal(layers.includes("stress_test"),false);
  assert.equal(state.ledgerRecord.stress_test_ran,false);
});

await check("Director server-error retries preserve 10s and 15s backoff",async function(){
  const sleeps=[];
  let directorCalls=0;
  const config=baseConfig();
  const runtime={
    ...fakeCompression("PROCEED"),
    sleepImpl:async function(ms){sleeps.push(ms);},
    callClaudeImpl:async function(){
      directorCalls++;
      if(directorCalls<=2) throw new Error("500 internal server error");
      return directorOutput("PROCEED");
    },
    callGovernedSynthesisImpl:async function(layer){
      if(layer==="epistemic_audit") return "**Epistemic Health Score**: ADEQUATE\n"+("E".repeat(2100));
      if(layer==="adversarial_probe") return "**Probe Verdict**: BOARD REASONING SOUND";
      if(layer==="chair") return stageOutput("chair");
      if(layer==="comparator") return JSON.stringify({summary:{decision_signal_interpretation:"3 PROCEED / 0 CAUTION / 0 HALT"}});
      return "Synthetic stage output";
    },
    repairChairDecisionBoundaryImpl:async function(text){return text;},
    nowImpl:function(){return "2026-09-25T00:00:00.000Z";},
  };
  await runGovernancePipeline(config,runtime,function(){});
  assert.equal(directorCalls,5);
  assert.deepStrictEqual(sleeps.slice(0,4),[10000,15000,3000,3000]);
});

assert.equal(pipelineSequenceContract.directorExecution.interDirectorDelayMs,3000);
assert.deepStrictEqual(pipelineSequenceContract.directorExecution.serverErrorRetries,[10000,15000]);
assert.deepStrictEqual(pipelineSequenceContract.synthesisStages.map(s=>s.stage),[
  "surface_map","epistemic_audit","cross_domain_tension_analysis","reality_anchor",
  "adversarial_probe","stress_test","chair","comparator"
]);
assert.equal(pipelineSequenceContract.ledger.schemaVersion,"3.0.0-alpha.1");
assert.equal(pipelineSequenceContract.ledger.runtimeContract,"2.0-recovery");

const app=fs.readFileSync("App_FINAL.jsx","utf8");
const pipeline=fs.readFileSync("src/pipeline.js","utf8");
assert.ok(app.includes("./src/pipeline.js"));
assert.ok(/async function\s+runBoard\s*\(/.test(app));
assert.ok(/function\s+parseDashboard\s*\(/.test(app));
assert.ok(/async function\s+runAdvisory\s*\(/.test(app));
for(const name of ["shouldRunStressTest","enforceSynthesisAuthority","callGovernedSynthesis","repairChairDecisionBoundary","commitToLedger","storeSynthesisBrief"]){
  if(new RegExp("(?:async\\s+)?function\\s+"+name+"\\s*\\(").test(app)) failures.push(name+" remains duplicated in App_FINAL.jsx");
}
for(const name of ["shouldRunStressTest","enforceSynthesisAuthority","callGovernedSynthesis","repairChairDecisionBoundary","buildLedgerRecord","runGovernancePipeline"]){
  if(!new RegExp("(?:export\\s+)?(?:async\\s+)?function\\s+"+name+"\\s*\\(").test(pipeline)) failures.push(name+" missing from src/pipeline.js");
}

if(failures.length){
  console.error("PHDSS governance pipeline verification failed:");
  failures.forEach(function(failure){console.error("- "+failure);});
  process.exit(1);
}

console.log("PHDSS governance pipeline verification passed.");
console.log("Stress trigger matrix: PASS");
console.log("Authority execution/repair: PASS");
console.log("Ledger assembly: PASS");
console.log("Stage sequence 1-8: PASS");
console.log("Conditional stress on/off: PASS");
console.log("Director 500-retry backoff: PASS");
console.log("Pipeline scope guards: PASS");
