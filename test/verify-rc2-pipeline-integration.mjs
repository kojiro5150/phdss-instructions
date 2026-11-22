// Entirely synthetic RC2 integration: runtime -> per-call capture -> manifest ->
// single browser-export data structure -> independent Node verifier.
import assert from "node:assert/strict";
import { runGovernancePipeline } from "../src/pipeline.js";
import { INSTRUCTION_FILES,INSTRUCTION_COMMIT,BASELINE_INSTRUCTION_COMMIT } from "../src/runtime/instruction-loader.js";
import { SYNTHESIS_VERDICT_FIELDS } from "../src/governance-record-contract.js";
import { createGovernanceExportBundle } from "../src/runtime/governance-export-bundle.js";
import { verifyGovernanceBundle } from "../scripts/verify-governance-bundle.mjs";
import { validDirectorBrief } from "./fixtures/governance-record-contracts.js";

const loaded={},sources={};
for(const [key,file] of Object.entries(INSTRUCTION_FILES)){
  const commit=key==="lived"?INSTRUCTION_COMMIT:BASELINE_INSTRUCTION_COMMIT;
  loaded[key]="INVENTED INSTRUCTION "+file;
  sources[key]={file,commit,url:"https://cdn.jsdelivr.net/gh/kojiro5150/phdss-instructions@"+commit+"/"+file};
}
const decisionId="DR-RC2-INVENTED";
const config={
  decision:"Should a public service deploy an AI tool?",
  decisionId,decisionSignal:"Synthetic signal",orgContext:"Invented public organisation",
  analysisMode:"CORE",chairSelectedIds:[],docs:{},instructions:loaded,instructionSources:sources,
  webSearch:false,publicWebSearch:false,sessionEvidence:[],autoContinue:false,
  totalLoadedDocs:0,instrLoadState:"ready",
  ctx:{decisionSignal:"Synthetic signal",orgContext:"Invented public organisation",constraints:[],evidenceLinks:[]},
  priorStressTestResult:null
};
function stage(layer){
  if(layer==="surface_map")return "**Dominant Signal**\nCAUTION\nInvented surface.";
  if(layer==="epistemic_audit")return "**Epistemic Health Score**: ADEQUATE\n"+"E".repeat(2100);
  if(layer==="cross_domain_tension_analysis")return "**Integration Signal**: MEDIUM\nInvented tension.";
  if(layer==="reality_anchor")return "**Operational Confidence**: MEDIUM\nInvented reality.";
  if(layer==="adversarial_probe")return "**Probe Verdict**: SIGNIFICANT GAPS\nInvented challenge.";
  if(layer==="stress_test")return "**Fragility Score**: 7/10\nInvented fragility.";
  if(layer==="chair")return "**Decision Brief Status**: Complete — invented uncertainty.\nHuman authority remains.";
  if(layer==="comparator")return JSON.stringify({
    decision_id:decisionId,schema_version:"3.0.0-alpha.2",analysis_mode:"CORE",coverage_ratio:"5/13",
    summary:{one_paragraph:"Invented summary",dominant_frame:"Invented frame",decision_signal_interpretation:"CAUTION"},
    consensus:[],dissensus:[],tradeoffs:[],key_risks:[],
    chair_resolution:{decision_brief_status:"Complete — invented",conditions:[],irreducible_uncertainties:[],kill_switches:[],success_metrics:[]},
    monitoring_triggers_30_60_90:{days_0_30:[],days_31_60:[],days_61_90:[]},coverage_limitations:""
  });
  return "Invented output.";
}
const runtime={
  sleepImpl:async()=>{},
  callClaudeImpl:async()=> "**Recommendation Signal**: CAUTION — invented rationale.\nConfidence: MEDIUM\nInvented Director analysis.",
  callGovernedSynthesisImpl:async layer=>stage(layer),
  repairChairDecisionBoundaryImpl:async text=>text,
  nowImpl:()=> "2026-11-22T00:00:00.000Z",
  apiCallImpl:async(system,user)=>{
    if(user.startsWith("Director:"))return {text:JSON.stringify(validDirectorBrief)};
    const label=user.match(/^Module: ([^\n]+)/)?.[1];
    if(!label||!SYNTHESIS_VERDICT_FIELDS[label])throw new Error("unexpected compression module: "+label);
    return {text:JSON.stringify({
      module:label,verdict_label:SYNTHESIS_VERDICT_FIELDS[label],verdict:"CAUTION",
      key_discovery:"Invented observation.",primary_tension:"Trade-off remains.",
      signal_rationale:"The evidence is incomplete.",room_should_discuss:[],
      most_likely_to_benefit:[],most_exposed_to_failure:[],
      non_negotiable_conditions:[],governance_implication:"Human decision required."
    })};
  }
};
const events=[];
const state=await runGovernancePipeline(config,runtime,(type,payload)=>events.push({type,payload}));
assert.equal(state.fatalError,undefined,String(state.fatalError));
const provenance=state.governanceProvenance;
assert.equal(provenance.manifest.schema,"phdss.governance-provenance.v2");
const recorded=Object.values(provenance.stages);
assert.ok(recorded.length>=13,"CORE needs five Directors and eight synthesis/conditional stage records");
assert.ok(recorded.every(r=>r.schema==="phdss.governance-stage-provenance.v3"));
const expected=recorded.filter(r=>r.status==="success"&&r.stage_id!=="comparator");
assert.equal(provenance.compression_events.length,expected.length*2,"each successful compressed stage needs pre-call and result");
assert.equal(provenance.manifest.compression_results.length,expected.length);
assert.equal(events.filter(e=>e.type==="governance-compression-event").length,expected.length*2);
const bundle=await createGovernanceExportBundle({
  manifest:provenance.manifest,stages:provenance.stages,
  compression_events:provenance.compression_events,ledger_record:state.ledgerRecord
});
const verified=await verifyGovernanceBundle({
  bundle,expectedDeployment:"UNRECORDED",
  sourceLoader:async(commit,file)=>"INVENTED INSTRUCTION "+file
});
assert.equal(verified.status,"VALID",JSON.stringify(verified.errors));
console.log("RC2 pipeline compression/source-to-export integration: PASS");
