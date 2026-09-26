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
  validateComparatorSchema,
  classifySessionGovernanceStatus,
  runGovernancePipeline,
} from "../src/pipeline.js";
import { pipelineSequenceContract } from "./fixtures/pipeline-sequence.js";
import { livePartialSynthesis20260925 } from "./fixtures/live-partial-synthesis-2026-09-25.js";
import { liveAuthorityFailures20260925 } from "./fixtures/live-authority-failures-2026-09-25.js";

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

function comparatorOutput(interp){
  return JSON.stringify({
    decision_id:"DR-TEST-001",
    schema_version:"3.0.0-alpha.2",
    analysis_mode:"CORE",
    coverage_ratio:"3/13",
    summary:{one_paragraph:"Synthetic summary.",dominant_frame:"Synthetic frame.",decision_signal_interpretation:interp||"Synthetic interpretation."},
    consensus:[],
    dissensus:[],
    tradeoffs:[],
    key_risks:[],
    chair_resolution:{
      decision_brief_status:"Complete — synthetic unresolved tension",
      conditions:[],
      irreducible_uncertainties:[],
      kill_switches:[],
      success_metrics:[]
    },
    monitoring_triggers_30_60_90:{
      days_0_30:[],
      days_31_60:[],
      days_61_90:[]
    },
    coverage_limitations:""
  });
}

function stageOutput(layer,probeVerdict){
  if(layer==="surface_map") return "**Dominant Signal**\nCAUTION\nSynthetic surface.";
  if(layer==="epistemic_audit") return "**Epistemic Health Score**: ADEQUATE\n"+("E".repeat(2100));
  if(layer==="cross_domain_tension_analysis") return "**Integration Signal**: MEDIUM\nSynthetic tension.";
  if(layer==="reality_anchor") return "**Operational Confidence**: MEDIUM\nSynthetic reality.";
  if(layer==="adversarial_probe") return "**The Strongest Counter-Argument**\nSynthetic counter-argument.\n\n**Probe Verdict**: "+(probeVerdict||"SIGNIFICANT GAPS");
  if(layer==="stress_test") return "**Fragility Score**: 7/10 — synthetic stress.";
  if(layer==="chair") return "**Decision Brief Status**: Complete — synthetic unresolved tension\nSynthetic Chair reasoning long enough to establish a complete decision brief.";
  if(layer==="comparator") return comparatorOutput("Synthetic interpretation.");
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
  const telemetry=[];
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
    },onAuthorityRepairEvent:function(event){telemetry.push(event);}}
  );
  assert.equal(repaired,"Material tension remains for human judgment.");
  assert.equal(calls,1);
  assert.equal(telemetry.length,1);
  assert.deepStrictEqual(telemetry[0],{
    layer:"chair",
    initial_violation_reason:"INSTITUTIONAL_DIRECTIVE",
    attempt_count:1,
    outcome:"repaired",
    offending_clause_excerpt:"The Board should approve the proposal.",
    final_violation_reason:null,
    final_offending_clause_excerpt:null,
  });
  assert.equal(chairDecisionBoundaryLeak("The Board should approve the proposal."),true);
  assert.equal(chairDecisionBoundaryLeak("Material tension remains."),false);
});

await check("Surface Map governance-act obligation enters repair and telemetry",async function(){
  let calls=0;
  const telemetry=[];
  const repaired=await enforceSynthesisAuthority(
    "surface_map",
    "A full 13-director session is warranted before any deployment commitment is made.",
    "SYS",
    "USER",
    {
      apiCallImpl:async function(system,user){
        calls++;
        assert.match(system,/GOVERNANCE_ACT_OBLIGATION/);
        assert.match(user,/PRIOR OUTPUT TO REPAIR/);
        return {text:"Eight of thirteen Director domains are absent, limiting the completeness of the current decision surface."};
      },
      onAuthorityRepairEvent:function(event){telemetry.push(event);}
    }
  );
  assert.equal(calls,1);
  assert.equal(repaired,"Eight of thirteen Director domains are absent, limiting the completeness of the current decision surface.");
  assert.equal(telemetry.length,1);
  assert.equal(telemetry[0].layer,"surface_map");
  assert.equal(telemetry[0].initial_violation_reason,"GOVERNANCE_ACT_OBLIGATION");
  assert.equal(telemetry[0].attempt_count,1);
  assert.equal(telemetry[0].outcome,"repaired");
});

await check("external constraint reporting does not trigger governance-act repair",async function(){
  let calls=0;
  const safe=await enforceSynthesisAuthority(
    "reality_anchor",
    "No pathway to compliant deployment exists under the current regulatory framework.",
    "SYS",
    "USER",
    {apiCallImpl:async function(){calls++;return {text:"unexpected"};}}
  );
  assert.equal(safe,"No pathway to compliant deployment exists under the current regulatory framework.");
  assert.equal(calls,0);
});

await check("authority repair performs bounded second pass with offending clause",async function(){
  let calls=0;
  const systems=[];
  const users=[];
  const telemetry=[];
  const repaired=await enforceSynthesisAuthority(
    "reality_anchor",
    "DO NOT PROCEED.",
    "SYS",
    "USER",
    {apiCallImpl:async function(system,user){
      calls++;
      systems.push(system);
      users.push(user);
      if(calls===1) return {text:"DO NOT PROCEED."};
      return {text:"The current operating conditions remain unresolved and require human judgment."};
    },onAuthorityRepairEvent:function(event){telemetry.push(event);}}
  );
  assert.equal(calls,2);
  assert.equal(repaired,"The current operating conditions remain unresolved and require human judgment.");
  assert.match(systems[1],/BOUNDARY REPAIR ATTEMPT 2 OF 2/);
  assert.match(systems[1],/exact offending clause/i);
  assert.match(users[1],/Rewrite the offending clause into non-adjudicative analytical language/);
  assert.equal(telemetry.length,1);
  assert.equal(telemetry[0].attempt_count,2);
  assert.equal(telemetry[0].outcome,"repaired");
  assert.equal(telemetry[0].initial_violation_reason,"RETIRED_DECISION_VOCABULARY");
});

await check("persistent authority failure preserves reason and exact clause",async function(){
  let calls=0;
  const telemetry=[];
  await assert.rejects(
    enforceSynthesisAuthority(
      "chair",
      "The preferred pathway is trajectory 4.",
      "SYS",
      "USER",
      {apiCallImpl:async function(){calls++;return {text:"The preferred pathway is trajectory 4."};},onAuthorityRepairEvent:function(event){telemetry.push(event);}}
    ),
    function(error){
      assert.equal(calls,2);
      assert.match(error.message,/PATHWAY_RANKING/);
      assert.match(error.message,/Offending clause: The preferred pathway is trajectory 4\./);
      assert.match(error.message,/after 2 repair attempts/);
      assert.equal(telemetry.length,1);
      assert.equal(telemetry[0].outcome,"failed");
      assert.equal(telemetry[0].attempt_count,2);
      assert.equal(telemetry[0].initial_violation_reason,"PATHWAY_RANKING");
      assert.equal(telemetry[0].final_violation_reason,"PATHWAY_RANKING");
      assert.equal(telemetry[0].final_offending_clause_excerpt,"The preferred pathway is trajectory 4.");
      return true;
    }
  );
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

await check("Comparator schema rejects stale and incomplete shapes",async function(){
  const valid=JSON.parse(comparatorOutput("3 PROCEED / 0 CAUTION / 0 HALT"));
  assert.equal(validateComparatorSchema(valid),valid);

  assert.throws(function(){
    validateComparatorSchema({...valid,schema_version:"3.0.0-alpha.1"});
  },/schema mismatch/);

  assert.throws(function(){
    validateComparatorSchema({...valid,next_actions_30_60_90:{days_0_30:[],days_31_60:[],days_61_90:[]}});
  },/retired next_actions_30_60_90/);

  assert.throws(function(){
    validateComparatorSchema({...valid,chair_resolution:{...valid.chair_resolution,recommendation:"Proceed"}});
  },/retired chair_resolution\.recommendation/);

  assert.throws(function(){
    const {monitoring_triggers_30_60_90,...rest}=valid;
    validateComparatorSchema(rest);
  },/monitoring_triggers_30_60_90 object missing/);
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
    authorityRepairEvents:[{
      layer:"chair",initial_violation_reason:"PATHWAY_RANKING",attempt_count:1,outcome:"repaired",
      offending_clause_excerpt:"Synthetic ranking clause.",final_violation_reason:null,final_offending_clause_excerpt:null
    }],
  },{nowImpl:function(){return "2026-09-25T00:00:00.000Z";}});

  assert.equal(record.schema_version,"3.0.0-alpha.2");
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
  assert.equal(record.authority_repair_events.length,1);
  assert.equal(record.authority_repair_events[0].layer,"chair");
  assert.equal(record.authority_repair_events[0].outcome,"repaired");
});

await check("live partial-synthesis fixture fails closed",async function(){
  const active=[DIRECTORS.find(d=>d.id==="systems"),DIRECTORS.find(d=>d.id==="equity"),DIRECTORS.find(d=>d.id==="safety")];
  const results=[
    {...active[0],output:directorOutput("CAUTION")},
    {...active[1],output:directorOutput("CAUTION")},
    {...active[2],output:directorOutput("HALT")},
  ];
  const fx=livePartialSynthesis20260925;
  const record=buildLedgerRecord({
    decisionId:fx.decisionId,
    decision:"Synthetic national deployment decision",
    decisionSignal:"",
    orgContext:"",
    webSearch:false,
    totalLoadedDocs:0,
    sessionEvidence:[],
    instrLoadState:"ready",
    results,
    metaOut:fx.outputs.metaOut,
    stressOut:fx.outputs.stressOut,
    chairOut:fx.outputs.chairOut,
    epistemicOut:fx.outputs.epistemicOut,
    probeOut:fx.outputs.probeOut,
    comparatorData:{parsed:{ok:true}},
    activeDir:active,
    omittedDir:DIRECTORS.filter(d=>!active.some(a=>a.id===d.id)),
    mode:"CORE",
    stressResult:{run:true,reason:"Decision text contains stress trigger: 'emergency'"},
    surfaceMapOut:fx.outputs.surfaceMapOut,
    realityAnchorOut:fx.outputs.realityAnchorOut,
    dirBriefs:{},
    synthesisBriefs:{},
    synthesisStageStatus:fx.synthesisStageStatus,
    stageErrors:[
      "Surface Mapper failed: live run Surface Mapper failure",
      "Reality Anchor failed: live run Reality Anchor failure"
    ],
  },{nowImpl:function(){return "2026-09-25T06:31:57.796Z";}});

  assert.equal(record.session_governance_status,fx.expected.sessionGovernanceStatus);
  assert.deepStrictEqual(record.failed_synthesis_stages,fx.expected.failedSynthesisStages);
  assert.deepStrictEqual(record.failed_mandatory_synthesis_stages,fx.expected.failedMandatorySynthesisStages);
  assert.equal(record.synthesis_stage_status.surface_map.status,"failed");
  assert.equal(record.synthesis_stage_status.reality_anchor.status,"failed");
  assert.equal(record.synthesis_stage_status.chair.status,"success");
  assert.equal(record.stage_errors.length,2);
});

await check("session status distinguishes complete degraded and mandatory failure",async function(){
  const base={
    hasChair:true,
    failedDirectorCount:0,
    synthesisStageStatus:{
      surface_map:{status:"success"},
      epistemic_audit:{status:"success"},
      meta:{status:"success"},
      reality_anchor:{status:"success"},
      probe:{status:"success"},
      stress:{status:"skipped"},
      chair:{status:"success"},
      comparator:{status:"success"},
    }
  };
  assert.equal(classifySessionGovernanceStatus(base),"COMPLETE");
  assert.equal(classifySessionGovernanceStatus({
    ...base,
    synthesisStageStatus:{...base.synthesisStageStatus,reality_anchor:{status:"failed"}}
  }),"COMPLETE_DEGRADED");
  assert.equal(classifySessionGovernanceStatus({
    ...base,
    synthesisStageStatus:{...base.synthesisStageStatus,surface_map:{status:"failed"}}
  }),"INCOMPLETE_MANDATORY_SYNTHESIS_FAILURE");
});

await check("pipeline preserves non-Error and Error stage exceptions",async function(){
  const events=[];
  const config=baseConfig();
  const runtime={
    ...fakeCompression("PROCEED"),
    sleepImpl:async function(){},
    callClaudeImpl:async function(){return directorOutput("PROCEED");},
    callGovernedSynthesisImpl:async function(layer){
      if(layer==="surface_map") throw "surface string failure";
      if(layer==="reality_anchor") throw new Error("reality error failure");
      if(layer==="epistemic_audit") return "**Epistemic Health Score**: ADEQUATE\n"+("E".repeat(2100));
      if(layer==="cross_domain_tension_analysis") return "**Integration Signal**: MEDIUM";
      if(layer==="adversarial_probe") return "**Probe Verdict**: BOARD REASONING SOUND";
      if(layer==="chair") return stageOutput("chair");
      if(layer==="comparator") return comparatorOutput("3 PROCEED / 0 CAUTION / 0 HALT");
      return "Synthetic stage output";
    },
    repairChairDecisionBoundaryImpl:async function(text){return text;},
    nowImpl:function(){return "2026-09-25T00:00:00.000Z";},
  };
  const state=await runGovernancePipeline(config,runtime,function(type,payload){events.push({type,payload});});
  assert.ok(state.stageErrors.includes("Surface Mapper failed: surface string failure"));
  assert.ok(state.stageErrors.includes("Reality Anchor failed: reality error failure"));
  assert.equal(state.synthesisStageStatus.surface_map.status,"failed");
  assert.equal(state.synthesisStageStatus.reality_anchor.status,"failed");
  assert.equal(state.synthesisStageStatus.chair.status,"success");
  assert.equal(state.ledgerRecord.session_governance_status,"INCOMPLETE_MANDATORY_SYNTHESIS_FAILURE");
  assert.deepStrictEqual(state.ledgerRecord.failed_mandatory_synthesis_stages,["surface_map"]);
  assert.deepStrictEqual(state.ledgerRecord.failed_synthesis_stages,["surface_map","reality_anchor"]);
  assert.equal(events.some(e=>e.type==="stage-status"&&e.payload.stage==="surface_map"&&e.payload.status==="failed"),true);
  assert.equal(events.some(e=>e.type==="stage-status"&&e.payload.stage==="reality_anchor"&&e.payload.status==="failed"),true);
});

await check("Chair failure skips Comparator with dependency reason",async function(){
  const fx=liveAuthorityFailures20260925;
  const layers=[];
  const config=baseConfig();
  const runtime={
    ...fakeCompression("CAUTION"),
    sleepImpl:async function(){},
    callClaudeImpl:async function(){return directorOutput("CAUTION");},
    callGovernedSynthesisImpl:async function(layer){
      layers.push(layer);
      if(layer==="surface_map") return "**Dominant Signal**\nCAUTION";
      if(layer==="epistemic_audit") return "**Epistemic Health Score**: ADEQUATE\n"+("E".repeat(2100));
      if(layer==="cross_domain_tension_analysis") return "**Integration Signal**: MEDIUM";
      if(layer==="reality_anchor") return "**Operational Confidence**: MEDIUM";
      if(layer==="adversarial_probe") return "**Probe Verdict**: SIGNIFICANT GAPS";
      if(layer==="stress_test") return "**Fragility Score**: 7/10";
      if(layer==="chair") throw new Error("chair authority boundary violation persisted after 2 repair attempts: "+fx.failures.chair.reason+" | Offending clause: The preferred pathway is trajectory 4.");
      if(layer==="comparator") throw new Error("Comparator must not run after Chair failure");
      return "Synthetic stage output";
    },
    repairChairDecisionBoundaryImpl:async function(text){return text;},
    nowImpl:function(){return "2026-09-25T00:00:00.000Z";},
  };
  const state=await runGovernancePipeline(config,runtime,function(){});
  assert.equal(layers.includes("comparator"),false);
  assert.equal(state.synthesisStageStatus.chair.status,"failed");
  assert.equal(state.synthesisStageStatus.comparator.status,fx.expected.comparatorStatus);
  assert.equal(state.synthesisStageStatus.comparator.reason,fx.expected.comparatorReason);
  assert.equal(state.comparatorData,null);
  assert.equal(state.ledgerRecord.comparator,null);
  assert.equal(state.ledgerRecord.session_governance_status,fx.expected.sessionGovernanceStatus);
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
  assert.equal(state.ledgerRecord.session_governance_status,"COMPLETE");
  assert.equal(state.synthesisStageStatus.surface_map.status,"success");
  assert.equal(state.synthesisStageStatus.reality_anchor.status,"success");
  assert.equal(state.synthesisStageStatus.stress.status,"success");
  assert.equal(state.synthesisStageStatus.chair.status,"success");
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
      if(layer==="comparator") return comparatorOutput("3 PROCEED / 0 CAUTION / 0 HALT");
      throw new Error("unexpected layer "+layer);
    },
    repairChairDecisionBoundaryImpl:async function(text){return text;},
    nowImpl:function(){return "2026-09-25T00:00:00.000Z";},
  };
  const state=await runGovernancePipeline(config,runtime,function(){});
  assert.equal(state.stressDecision.run,false);
  assert.equal(layers.includes("stress_test"),false);
  assert.equal(state.synthesisStageStatus.stress.status,"skipped");
  assert.equal(state.ledgerRecord.stress_test_ran,false);
  assert.equal(state.ledgerRecord.session_governance_status,"COMPLETE");
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
      if(layer==="comparator") return comparatorOutput("3 PROCEED / 0 CAUTION / 0 HALT");
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
assert.equal(pipelineSequenceContract.ledger.schemaVersion,"3.0.0-alpha.2");
assert.equal(pipelineSequenceContract.ledger.runtimeContract,"2.0-recovery");

const app=fs.readFileSync("App_FINAL.jsx","utf8");
const pipeline=fs.readFileSync("src/pipeline.js","utf8");
assert.match(pipeline,/Do not ACCEPT or REBUT on the Chair's own authority\./);
assert.match(pipeline,/show where that challenge aligns with, conflicts with, or remains unresolved/);
assert.doesNotMatch(pipeline,/either ACCEPTS this finding/);
assert.ok(app.includes("./src/pipeline.js"));
assert.ok(/async function\s+runBoard\s*\(/.test(app));
assert.ok(/function\s+parseDashboard\s*\(/.test(app));
assert.ok(app.includes("INCOMPLETE REASONING CHAIN"));
assert.ok(app.includes("stage-status"));
assert.ok(app.includes("INCOMPLETE_MANDATORY_SYNTHESIS_FAILURE"));
assert.ok(app.includes("Session Status:"));
assert.ok(app.includes("SYNTHESIS EXECUTION"));
assert.ok(app.includes("Failed Synthesis:"));
assert.ok(app.includes("Failed Mandatory:"));
assert.ok(/async function\s+runAdvisory\s*\(/.test(app));
for(const name of ["shouldRunStressTest","enforceSynthesisAuthority","callGovernedSynthesis","repairChairDecisionBoundary","commitToLedger","storeSynthesisBrief"]){
  if(new RegExp("(?:async\\s+)?function\\s+"+name+"\\s*\\(").test(app)) failures.push(name+" remains duplicated in App_FINAL.jsx");
}
for(const name of ["shouldRunStressTest","authorityViolationMessage","enforceSynthesisAuthority","callGovernedSynthesis","repairChairDecisionBoundary","validateComparatorSchema","buildLedgerRecord","runGovernancePipeline"]){
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
console.log("Bounded second authority repair: PASS");
console.log("Authority offending-clause diagnostics: PASS");
console.log("Authority repair telemetry: PASS");
console.log("Surface Map authority-act repair: PASS");
console.log("External constraint reporting exception: PASS");
console.log("Comparator schema validation: PASS");
console.log("Ledger assembly: PASS");
console.log("Stage sequence 1-8: PASS");
console.log("Conditional stress on/off: PASS");
console.log("Director 500-retry backoff: PASS");
console.log("Live partial-synthesis fail-closed fixture: PASS");
console.log("Stage exception preservation: PASS");
console.log("Session completion classification: PASS");
console.log("Chair dependency skips Comparator: PASS");
console.log("Dashboard execution-status visibility: PASS");
console.log("Pipeline scope guards: PASS");
