import { STRESS_KEYWORDS, RUNTIME_CONTRACT, LEDGER_SCHEMA } from "./constants.js";
import { DIRECTORS } from "./registry.js";
import { resolveActiveDirectors } from "./governance-rules.js";
import { safeMatch, findSignal, extractFirstJsonObject } from "./parsers.js";
import { stripCalibrationBleed, deduplicateSections } from "./text-utils.js";
import { buildCoverageNote } from "./coverage.js";
import {
  directorSystem,
  metaSystem,
  surfaceMapperSystem,
  realityAnchorSystem,
  stressSystem,
  chairSystem,
  epistemicAuditorSystem,
  adversarialProbeSystem,
  comparatorJsonSystem,
} from "./prompt-builders.js";
import { authorityBoundaryPrompt, assessAuthorityBoundary } from "./authority-contract.js";
import { INSTRUCTION_COMMIT } from "./runtime/instruction-loader.js";
import { apiCall, callClaude_synthesis } from "./runtime/anthropic-client.js";
import {
  compressDirectorOutput,
  deterministicDirectorBrief,
  compressSynthesisOutput,
  deterministicSynthesisBrief,
  formatBriefForSynthesis,
} from "./runtime/governance-compression.js";

export const MANDATORY_SYNTHESIS_STAGES = Object.freeze([
  "surface_map",
  "epistemic_audit",
  "meta",
  "probe",
  "chair",
]);

export const DEGRADABLE_SYNTHESIS_STAGES = Object.freeze([
  "reality_anchor",
  "stress",
  "comparator",
]);

function errorText(error) {
  return error && error.message ? error.message : String(error);
}

function stageStatusRecord(status,error,reason) {
  var record={status:status};
  if(error) record.error=errorText(error);
  if(reason) record.reason=String(reason);
  return record;
}

function inferSynthesisStageStatus(input,hasChair) {
  if(input.synthesisStageStatus) return input.synthesisStageStatus;
  return {
    surface_map:stageStatusRecord(input.surfaceMapOut?"success":"failed"),
    epistemic_audit:stageStatusRecord(input.epistemicOut?"success":"failed"),
    meta:stageStatusRecord(input.metaOut?"success":"failed"),
    reality_anchor:stageStatusRecord(input.realityAnchorOut?"success":"failed"),
    probe:stageStatusRecord(input.probeOut?"success":"failed"),
    stress:stageStatusRecord(input.stressResult&&input.stressResult.run?(input.stressOut?"success":"failed"):"skipped"),
    chair:stageStatusRecord(hasChair?"success":"failed"),
    comparator:stageStatusRecord(input.comparatorData?"success":"failed"),
  };
}

export function classifySessionGovernanceStatus(input) {
  var hasChair=input.hasChair===true;
  var stageStatus=inferSynthesisStageStatus(input,hasChair);
  var failedMandatory=MANDATORY_SYNTHESIS_STAGES.filter(function(stage){
    return !stageStatus[stage]||stageStatus[stage].status!=="success";
  });
  var failedDegradable=DEGRADABLE_SYNTHESIS_STAGES.filter(function(stage){
    return stageStatus[stage]&&stageStatus[stage].status==="failed";
  });
  if(failedMandatory.length>0) return "INCOMPLETE_MANDATORY_SYNTHESIS_FAILURE";
  if(!hasChair) return "INCOMPLETE";
  if(failedDegradable.length>0) return "COMPLETE_DEGRADED";
  if((input.failedDirectorCount||0)>0) return "COMPLETE_PARTIAL_EVIDENCE";
  return "COMPLETE";
}

export function shouldRunStressTest(mode, decisionText, activeDirectorOutputs, surfaceMapOut, epistemicOut, probeVerdict, realityAnchorOut) {
  if (mode === "FULL") return { run: true, reason: "FULL mode — stress test always runs" };
  var lower = (decisionText||"").toLowerCase();
  for (var i = 0; i < STRESS_KEYWORDS.length; i++) {
    if (lower.indexOf(STRESS_KEYWORDS[i]) !== -1) {
      return { run: true, reason: "Decision text contains stress trigger: '" + STRESS_KEYWORDS[i] + "'" };
    }
  }
  var haltCount = 0, cautionCount = 0;
  (activeDirectorOutputs||[]).forEach(function(r) {
    var sig = "";
    var patterns = [
      /\*\*Recommendation Signal\*\*:?\s*\[?\*{0,2}(PROCEED|CAUTION|HALT)\*{0,2}\]?/i,
      /Recommendation Signal[^:]*:?\s*\[?\*{0,2}(PROCEED|CAUTION|HALT)\*{0,2}\]?/i,
      /\*\*(PROCEED|CAUTION|HALT)\*\*/
    ];
    for (var pi = 0; pi < patterns.length; pi++) {
      var m = (r.output||"").match(patterns[pi]);
      if (m) { sig = (m[1]||"").toUpperCase(); break; }
    }
    if (sig === "HALT") haltCount++;
    if (sig === "CAUTION") cautionCount++;
  });
  if (haltCount >= 1) return { run: true, reason: haltCount + " director(s) signalled HALT" };
  if (cautionCount >= 2) return { run: true, reason: cautionCount + " directors signalled CAUTION" };
  if (realityAnchorOut && /capability mismatch|capacity gap|implementation gap|not ready|insufficient capacity/i.test(realityAnchorOut)) {
    return { run: true, reason: "Reality Anchor detected capability mismatch" };
  }
  if (surfaceMapOut && /high tension|highly contested|significant fragility|fragility hotspot/i.test(surfaceMapOut)) {
    return { run: true, reason: "Decision Surface Map detected high tension" };
  }
  if (epistemicOut && /(WEAK|COMPROMISED)/i.test(epistemicOut)) {
    return { run: true, reason: "Epistemic Audit detected major uncertainty" };
  }
  if (probeVerdict === "SIGNIFICANT GAPS" || probeVerdict === "CONCLUSION CHALLENGED") {
    return { run: true, reason: "Adversarial Probe verdict: " + probeVerdict };
  }
  return { run: false, reason: "No stress triggers detected" };
}

function runtimeApiCall(runtime) {
  return runtime && runtime.apiCallImpl ? runtime.apiCallImpl : apiCall;
}

function runtimeClaude(runtime) {
  return runtime && runtime.callClaudeImpl ? runtime.callClaudeImpl : callClaude_synthesis;
}

function runtimeSleep(runtime) {
  return runtime && runtime.sleepImpl
    ? runtime.sleepImpl
    : function(ms){ return new Promise(function(resolve){ setTimeout(resolve,ms); }); };
}

function runtimeFetch(runtime) {
  if (runtime && runtime.fetchImpl) return runtime.fetchImpl;
  if (typeof globalThis !== "undefined" && typeof globalThis.fetch === "function") return globalThis.fetch.bind(globalThis);
  throw new Error("fetch is unavailable");
}

function runtimeNow(runtime) {
  return runtime && runtime.nowImpl ? runtime.nowImpl() : new Date().toISOString();
}

function boundedAuthorityClause(clause) {
  var value=String(clause||"").replace(/\s+/g," ").trim();
  return value.length>600?value.substring(0,597)+"...":value;
}

function emitAuthorityRepairTelemetry(runtime,event) {
  if(!runtime||typeof runtime.onAuthorityRepairEvent!=="function") return;
  try { runtime.onAuthorityRepairEvent(Object.assign({},event)); } catch(e) {}
}

export function authorityViolationMessage(layer,assessment,attemptCount) {
  var clause=boundedAuthorityClause(assessment&&assessment.clause);
  return layer+" authority boundary violation persisted after "+attemptCount+" repair attempt"+(attemptCount===1?"":"s")+": "+((assessment&&assessment.reason)||"UNKNOWN")+(clause?" | Offending clause: "+clause:"");
}

export async function enforceSynthesisAuthority(layer,text,systemPrompt,userPrompt,runtime) {
  if(!text) return text;
  var current=stripCalibrationBleed(text);
  var assessment=assessAuthorityBoundary(layer,current);
  if(!assessment.violates) return current;

  var initialAssessment=assessment;
  var initialClause=boundedAuthorityClause(initialAssessment.clause);

  for(var attempt=1;attempt<=2;attempt++) {
    var offendingClause=String(assessment.clause||"").replace(/\s+/g," ").trim();
    var repairSystem=systemPrompt+authorityBoundaryPrompt(layer)+
      "\n\nBOUNDARY REPAIR ATTEMPT "+attempt+" OF 2: The prior draft crossed the PHDSS authority boundary ("+assessment.reason+")."+
      (offendingClause?" The exact offending clause is: \""+offendingClause.substring(0,800)+"\".":"")+
      " Rewrite only as needed to remove adjudication while preserving the analytical substance. Preserve source-grounded findings, signals, constraints, conditions, tensions, uncertainty, pathway descriptions, section structure, and numeric values. Do not select, rank, resolve, approve, reject, defer, pilot, prefer, or choose an institutional pathway. Do not use retired decision vocabulary. Legitimate external constraint reporting may remain. Preserve the original output format exactly; if the input is JSON, return valid JSON only.";
    var repairUser=userPrompt+"\n\nPRIOR OUTPUT TO REPAIR:\n"+current+
      "\n\nREPAIR REQUIREMENT: Rewrite the offending clause into non-adjudicative analytical language. Do not merely remove a keyword while preserving the same institutional choice.";
    var raw=await runtimeApiCall(runtime)(repairSystem,repairUser,false);
    current=stripCalibrationBleed(raw.text||"");
    assessment=assessAuthorityBoundary(layer,current);
    if(!assessment.violates) {
      emitAuthorityRepairTelemetry(runtime,{
        layer:layer,
        initial_violation_reason:initialAssessment.reason,
        attempt_count:attempt,
        outcome:"repaired",
        offending_clause_excerpt:initialClause,
        final_violation_reason:null,
        final_offending_clause_excerpt:null,
      });
      return current;
    }
  }

  emitAuthorityRepairTelemetry(runtime,{
    layer:layer,
    initial_violation_reason:initialAssessment.reason,
    attempt_count:2,
    outcome:"failed",
    offending_clause_excerpt:initialClause,
    final_violation_reason:assessment.reason||null,
    final_offending_clause_excerpt:boundedAuthorityClause(assessment.clause)||null,
  });
  throw new Error(authorityViolationMessage(layer,assessment,2));
}

export async function callGovernedSynthesis(layer,systemPrompt,userPrompt,autoContinue,useWeb,runtime) {
  var governedSystem=systemPrompt+authorityBoundaryPrompt(layer);
  var output=await runtimeClaude(runtime)(governedSystem,userPrompt,autoContinue,useWeb);
  return enforceSynthesisAuthority(layer,output,governedSystem,userPrompt,runtime);
}

export function chairDecisionBoundaryLeak(text) {
  return assessAuthorityBoundary("chair",text).violates;
}

export async function repairChairDecisionBoundary(text, systemPrompt, userPrompt, runtime) {
  return enforceSynthesisAuthority("chair",text,systemPrompt,userPrompt,runtime);
}

export function validateComparatorSchema(parsed) {
  if(!parsed||typeof parsed!=="object"||Array.isArray(parsed)){
    throw new Error("Comparator schema invalid: expected JSON object");
  }
  if(parsed.schema_version!==LEDGER_SCHEMA){
    throw new Error("Comparator schema mismatch: expected "+LEDGER_SCHEMA+" but received "+String(parsed.schema_version||"missing"));
  }
  if(Object.prototype.hasOwnProperty.call(parsed,"next_actions_30_60_90")){
    throw new Error("Comparator schema invalid: retired next_actions_30_60_90 field present");
  }
  var chair=parsed.chair_resolution;
  if(!chair||typeof chair!=="object"||Array.isArray(chair)){
    throw new Error("Comparator schema invalid: chair_resolution object missing");
  }
  if(Object.prototype.hasOwnProperty.call(chair,"recommendation")){
    throw new Error("Comparator schema invalid: retired chair_resolution.recommendation field present");
  }
  if(typeof chair.decision_brief_status!=="string"){
    throw new Error("Comparator schema invalid: chair_resolution.decision_brief_status missing");
  }
  var monitoring=parsed.monitoring_triggers_30_60_90;
  if(!monitoring||typeof monitoring!=="object"||Array.isArray(monitoring)){
    throw new Error("Comparator schema invalid: monitoring_triggers_30_60_90 object missing");
  }
  ["days_0_30","days_31_60","days_61_90"].forEach(function(key){
    if(!Array.isArray(monitoring[key])){
      throw new Error("Comparator schema invalid: monitoring_triggers_30_60_90."+key+" must be an array");
    }
  });
  return parsed;
}

export function buildLedgerRecord(input,runtime) {
  var results=input.results||[];
  var activeDir=input.activeDir||DIRECTORS;
  var omittedDir=input.omittedDir||[];
  var mode=input.mode||"FULL";
  var failedDirs=results.filter(function(r){return /^\[Director failed:/i.test((r.output||"").trim());});
  var hasChair=!!(input.chairOut&&input.chairOut.length>50&&!/Chair failed|Director failed/i.test(input.chairOut));
  var synthesisStageStatus=inferSynthesisStageStatus(input,hasChair);
  var failedSynthesisStages=Object.keys(synthesisStageStatus).filter(function(stage){
    return synthesisStageStatus[stage]&&synthesisStageStatus[stage].status==="failed";
  });
  var failedMandatorySynthesisStages=MANDATORY_SYNTHESIS_STAGES.filter(function(stage){
    return failedSynthesisStages.indexOf(stage)!==-1||!synthesisStageStatus[stage]||synthesisStageStatus[stage].status!=="success";
  });
  var sessionGovernanceStatus=classifySessionGovernanceStatus({
    hasChair:hasChair,
    synthesisStageStatus:synthesisStageStatus,
    failedDirectorCount:failedDirs.length,
  });
  var briefMatch=(input.chairOut||"").match(/\*\*Decision Brief Status\*\*:?\s*\*{0,2}(Complete(?:\s*[—–-]\s*Partial Evidence Base)?\s*[—–-]\s*[^\n*]+)/i);
  var decisionBriefStatus=briefMatch?briefMatch[1].trim():null;
  var directorOutputs={};
  results.forEach(function(r){directorOutputs[r.id]=stripCalibrationBleed(r.output||"");});
  return {
    decision_id:input.decisionId, schema_version:LEDGER_SCHEMA, created_at:runtimeNow(runtime),
    governance_family:"GOVERNANCE",
    session_governance_status:sessionGovernanceStatus,
    synthesis_stage_status:synthesisStageStatus,
    failed_synthesis_stages:failedSynthesisStages,
    failed_mandatory_synthesis_stages:failedMandatorySynthesisStages,
    stage_errors:(input.stageErrors||[]).slice(),
    authority_repair_events:(input.authorityRepairEvents||[]).map(function(event){return Object.assign({},event);}),
    run_intensity:mode==="FULL"?"MAXIMUM":mode==="CORE"?"MINIMUM_VIABLE":"CUSTOM",
    analysis_mode:mode,
    coverage_ratio:activeDir.length+"/"+DIRECTORS.length,
    coverage_note:buildCoverageNote(mode,activeDir,DIRECTORS),
    active_directors:activeDir.map(function(d){return d.id;}),
    omitted_directors:omittedDir.map(function(d){return d.id;}),
    question:input.decision, decision_signal:input.decisionSignal, org_context:input.orgContext,
    web_search_enabled:input.webSearch, docs_loaded:(input.totalLoadedDocs||0)+((input.sessionEvidence||[]).filter(function(e){return e.content;}).length),
    proceed_count:results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(PROCEED)/,1)==="PROCEED";}).length,
    caution_count:results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(CAUTION)/,1)==="CAUTION";}).length,
    halt_count:results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(HALT)/,1)==="HALT";}).length,
    decision_brief_status:decisionBriefStatus,
    epistemic_score:(function(){
      var m=(input.epistemicOut||"").match(/\*\*Epistemic Health Score\*\*:?\s*(STRONG|ADEQUATE|WEAK|COMPROMISED)/i);
      if(m) return m[1].toUpperCase();
      var m2=(input.epistemicOut||"").match(/Epistemic Health Score[:\s]+(STRONG|ADEQUATE|WEAK|COMPROMISED)/i);
      if(m2) return m2[1].toUpperCase();
      return findSignal(input.epistemicOut,["STRONG","ADEQUATE","COMPROMISED","WEAK"]);
    })(),
    probe_verdict:findSignal(input.probeOut,["BOARD REASONING SOUND","SIGNIFICANT GAPS","CONCLUSION CHALLENGED"]),
    fragility_score:parseInt(safeMatch(input.stressOut,/\*\*Fragility Score\*\*:?[^\d]*(\d+)/,1))||null,
    stress_test_ran:(input.stressResult&&input.stressResult.run)||false,
    stress_test_reason:(input.stressResult&&input.stressResult.reason)||null,
    instruction_source:input.instrLoadState==="ready"?"github":input.instrLoadState==="partial"?"github_partial":"inline_fallback",
    instruction_commit:INSTRUCTION_COMMIT,
    runtime_contract:RUNTIME_CONTRACT,
    comparator:input.comparatorData||null,
    outputs:{
      directors:directorOutputs,
      surface_map:stripCalibrationBleed(input.surfaceMapOut||"")||null,
      meta:stripCalibrationBleed(input.metaOut||"")||null,
      reality_anchor:stripCalibrationBleed(input.realityAnchorOut||"")||null,
      probe:stripCalibrationBleed(input.probeOut||"")||null,
      stress:stripCalibrationBleed(input.stressOut||"")||null,
      epistemic:stripCalibrationBleed(input.epistemicOut||"")||null,
      chair:stripCalibrationBleed(input.chairOut||"")||null
    },
    structured_records:{
      directors:Object.assign({},input.dirBriefs||{}),
      synthesis:Object.assign({},input.synthesisBriefs||{})
    },
    tags:[]
  };
}

async function rescueDirectorSignal(systemPrompt,output,runtime) {
  var cOut=output;
  if (/\*\*Recommendation Signal\*\*/.test(cOut) || cOut.length<=500) return cOut;
  try {
    var rescueBody={
      model:"claude-sonnet-4-6",max_tokens:300,temperature:0.8,
      system:systemPrompt,
      messages:[
        {role:"user",content:"Decision under review: "+runtime.decision},
        {role:"assistant",content:cOut},
        {role:"user",content:"Your analysis was cut off before the closing signal line. Based solely on your analysis above, complete the output now with only: **Recommendation Signal**: [PROCEED/CAUTION/HALT] - one sentence rationale. Nothing else."}
      ]
    };
    var response=await runtimeFetch(runtime)("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(rescueBody)});
    var data=await response.json();
    var rescueText=(data.content||[]).map(function(b){return b.text||"";}).join("").trim();
    if(rescueText&&/Recommendation Signal/i.test(rescueText)) return cOut+"\n\n"+rescueText;
  } catch(e) {}
  return cOut;
}

function stageEmitter(emit,stage,loading) {
  emit("stage-loading",{stage:stage,loading:loading});
}

function makeLedgerInput(config,state,stressResult) {
  return {
    decisionId:config.decisionId,
    decision:config.decision,
    decisionSignal:config.decisionSignal,
    orgContext:config.orgContext,
    webSearch:config.webSearch,
    totalLoadedDocs:config.totalLoadedDocs,
    sessionEvidence:config.sessionEvidence,
    instrLoadState:config.instrLoadState,
    results:state.results,
    metaOut:state.metaOut,
    stressOut:state.stressOut,
    chairOut:state.chairOut,
    epistemicOut:state.epistemicOut,
    probeOut:state.probeOut,
    comparatorData:state.comparatorData,
    activeDir:state.activeDir,
    omittedDir:state.omittedDir,
    mode:config.analysisMode,
    stressResult:stressResult,
    surfaceMapOut:state.surfaceMapOut,
    realityAnchorOut:state.realityAnchorOut,
    dirBriefs:state.dirBriefs,
    synthesisBriefs:state.synthesisBriefs,
    synthesisStageStatus:state.synthesisStageStatus,
    stageErrors:state.stageErrors,
    authorityRepairEvents:state.authorityRepairEvents,
  };
}

export async function runGovernancePipeline(config,runtime,emit) {
  runtime=runtime||{};
  emit=emit||function(){};
  var sleep=runtimeSleep(runtime);
  var callClaude=runtime.callClaudeImpl||callClaude_synthesis;
  var compressDirector=runtime.compressDirectorImpl||compressDirectorOutput;
  var deterministicDirector=runtime.deterministicDirectorBriefImpl||deterministicDirectorBrief;
  var compressSynthesis=runtime.compressSynthesisImpl||compressSynthesisOutput;
  var deterministicSynthesis=runtime.deterministicSynthesisBriefImpl||deterministicSynthesisBrief;
  var authorityRepairEvents=[];
  var externalAuthorityObserver=runtime.onAuthorityRepairEvent;
  var governedRuntime=Object.assign({},runtime,{
    onAuthorityRepairEvent:function(event){
      authorityRepairEvents.push(Object.assign({},event));
      emit("authority-repair",{event:Object.assign({},event)});
      if(typeof externalAuthorityObserver==="function"){
        try { externalAuthorityObserver(Object.assign({},event)); } catch(e) {}
      }
    }
  });
  var runGoverned=runtime.callGovernedSynthesisImpl||function(layer,systemPrompt,userPrompt,autoContinue,useWeb){
    return callGovernedSynthesis(layer,systemPrompt,userPrompt,autoContinue,useWeb,governedRuntime);
  };
  var repairChair=runtime.repairChairDecisionBoundaryImpl||function(text,systemPrompt,userPrompt){
    return repairChairDecisionBoundary(text,systemPrompt,userPrompt,governedRuntime);
  };

  var activeDir=resolveActiveDirectors(config.analysisMode,config.decision,config.chairSelectedIds||[]);
  var omittedDir=DIRECTORS.filter(function(d){return !activeDir.some(function(a){return a.id===d.id;});});
  var state={
    activeDir:activeDir,omittedDir:omittedDir,results:[],dirBriefs:{},synthesisBriefs:{},
    metaOut:"",surfaceMapOut:"",realityAnchorOut:"",stressOut:"",chairOut:"",
    epistemicOut:"",probeOut:"",comparatorData:null,stageErrors:[],stressDecision:null,
    synthesisStageStatus:{},authorityRepairEvents:authorityRepairEvents
  };

  emit("active-directors",{activeDir:activeDir,omittedDir:omittedDir});
  activeDir.forEach(function(d){emit("director-loading",{id:d.id,loading:true});});

  function setSynthesisStageStatus(stage,status,error,reason) {
    var record=stageStatusRecord(status,error,reason);
    state.synthesisStageStatus[stage]=record;
    emit("stage-status",{stage:stage,status:status,error:record.error||null,reason:record.reason||null});
    return record;
  }

  function recordStageFailure(stage,label,error) {
    var message=label+" failed: "+errorText(error);
    state.stageErrors.push(message);
    setSynthesisStageStatus(stage,"failed",error);
    return message;
  }

  async function storeSynthesisBrief(key,moduleLabel,output) {
    var brief;
    try {
      brief=await compressSynthesis(moduleLabel,output);
    } catch(e) {
      brief=deterministicSynthesis(moduleLabel,output,e.message||String(e));
    }
    state.synthesisBriefs[key]=brief;
    emit("synthesis-brief",{key:key,brief:brief});
    return brief;
  }

  try {
    var results_seq=[];
    for(var di=0;di<activeDir.length;di++){
      var dirI=activeDir[di],dirId=dirI.id;
      if(di>0) await sleep(3000);
      try {
        var sysPrompt=directorSystem(dirI,(config.docs&&config.docs[dirId])||[],config.webSearch,config.ctx,config.publicWebSearch,config.sessionEvidence,config.analysisMode,activeDir,config.instructions);
        var dirOut;
        var isServerErr=function(e){return /internal server error|500|server error/i.test(e.message);};
        try { dirOut=await callClaude(sysPrompt,"Decision under review: "+config.decision,config.autoContinue,config.webSearch||config.publicWebSearch); }
        catch(err1){
          if(isServerErr(err1)){
            await sleep(10000);
            try { dirOut=await callClaude(sysPrompt,"Decision under review: "+config.decision,config.autoContinue,config.webSearch||config.publicWebSearch); }
            catch(err2){
              if(isServerErr(err2)){
                await sleep(15000);
                dirOut=await callClaude(sysPrompt,"Decision under review: "+config.decision,config.autoContinue,config.webSearch||config.publicWebSearch);
              } else { throw err2; }
            }
          } else { throw err1; }
        }
        var cOut=deduplicateSections(stripCalibrationBleed(dirOut+""));
        cOut=await rescueDirectorSignal(sysPrompt,cOut,Object.assign({},runtime,{decision:config.decision}));
        emit("director-output",{id:dirId,output:cOut});
        emit("director-loading",{id:dirId,loading:false});
        results_seq.push(Object.assign({},dirI,{output:cOut}));
        try {
          var brief=await compressDirector(dirI.label,cOut);
          state.dirBriefs[dirId]=brief;
          emit("director-brief",{id:dirId,brief:brief});
        } catch(compErr) {
          var fallback=deterministicDirector(dirI.label,cOut,compErr.message||String(compErr));
          state.dirBriefs[dirId]=fallback;
          emit("director-brief",{id:dirId,brief:fallback});
        }
      } catch(dirErr) {
        var errMsg="[Director failed: "+dirErr.message+"]";
        emit("director-loading",{id:dirId,loading:false});
        emit("director-output",{id:dirId,output:errMsg});
        state.stageErrors.push(dirI.label+" failed");
        results_seq.push(Object.assign({},dirI,{output:errMsg}));
        state.dirBriefs[dirId]=null;
      }
    }
    state.results=results_seq;
    emit("director-results",{results:state.results});
    emit("stages-done",{value:1});

    var briefSummary=state.results.map(function(d){
      var brief=state.dirBriefs[d.id];
      return brief?"### "+d.label+"\n"+formatBriefForSynthesis(brief,d.output):"### "+d.label+"\n"+d.output;
    }).join("\n\n");

    var proceed=state.results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(PROCEED)/,1)==="PROCEED";}).length;
    var caution=state.results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(CAUTION)/,1)==="CAUTION";}).length;
    var halt=state.results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(HALT)/,1)==="HALT";}).length;
    var notApplicable=state.results.filter(function(r){return /NOT APPLICABLE/i.test(r.output)&&!safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(PROCEED|CAUTION|HALT)/i,1);}).length;
    var undefinedCount=state.results.length-proceed-caution-halt-notApplicable;
    var dominant=(halt>caution&&halt>proceed)?"HALT":(caution>=halt&&caution>=proceed)?"CAUTION":(proceed>0)?"PROCEED":"MIXED";
    var signalCountNote="\n\n[AUTHORITATIVE SIGNAL COUNTS — use these exact figures in your Signal Tally, do not recount from text: "+proceed+" PROCEED / "+caution+" CAUTION / "+halt+" HALT"+(notApplicable>0?" / "+notApplicable+" NOT APPLICABLE":"")+(undefinedCount>0?" / "+undefinedCount+" UNDEFINED":"")+". Total directors: "+state.results.length+". DOMINANT SIGNAL: "+dominant+" — use exactly this single word for the Dominant Signal field, not a compound like HALT/CAUTION. NOT APPLICABLE means the Director correctly determined the proposal is outside their mandate — do not count as PROCEED.]";

    try {
      stageEmitter(emit,"surface_map",true);
      state.surfaceMapOut=await runGoverned("surface_map",surfaceMapperSystem(config.analysisMode,activeDir,config.instructions),"Decision: "+config.decision+"\n\nAll Director Governance Briefs:\n"+briefSummary+signalCountNote,config.autoContinue);
      emit("stage-output",{stage:"surface_map",output:state.surfaceMapOut});
      await storeSynthesisBrief("surfacemap","Decision Surface Map",state.surfaceMapOut);
      setSynthesisStageStatus("surface_map","success");
    } catch(e){ recordStageFailure("surface_map","Surface Mapper",e); }
    stageEmitter(emit,"surface_map",false); emit("stages-done",{value:2});

    var fullDirSummary=state.results.map(function(d){return "### "+d.label+"\n"+d.output;}).join("\n\n");
    void fullDirSummary;
    var epistemicBriefSummary=state.results.map(function(r){
      var brief=state.dirBriefs[r.id];
      var confMatch=r.output.match(/Confidence:?\s*(HIGH|MEDIUM|LOW)/i);
      var confLabel=confMatch?"\nDirector self-rated confidence: "+confMatch[1]:"";
      var fragMatch=r.output.match(/A\)\s*Fragility signals identified:([^\n]+(?:\n[^\n*#]{0,200})*)/i);
      var fragLabel=fragMatch?"\nFragility: "+fragMatch[1].substring(0,300).replace(/\n/g," "):"";
      return brief?"### "+r.label+"\n"+formatBriefForSynthesis(brief,r.output)+confLabel+fragLabel:"### "+r.label+"\n"+r.output.substring(0,1500)+confLabel+fragLabel;
    }).join("\n\n");
    try {
      stageEmitter(emit,"epistemic_audit",true);
      var epistemicPrompt=epistemicAuditorSystem(config.analysisMode,activeDir,config.instructions);
      var epistemicUser="Decision: "+config.decision+"\n\nDirector Governance Briefs (with confidence ratings):\n"+epistemicBriefSummary;
      state.epistemicOut=await runGoverned("epistemic_audit",epistemicPrompt,epistemicUser,config.autoContinue);
      if(state.epistemicOut&&state.epistemicOut.length<2000){
        console.warn("PHDSS: Epistemic output short ("+state.epistemicOut.length+" chars), retry 1 of 2...");
        await sleep(2000);
        state.epistemicOut=await runGoverned("epistemic_audit",epistemicPrompt,epistemicUser,config.autoContinue);
        if(state.epistemicOut&&state.epistemicOut.length<2000){
          console.warn("PHDSS: Epistemic still short ("+state.epistemicOut.length+" chars), retry 2 of 2...");
          await sleep(4000);
          state.epistemicOut=await runGoverned("epistemic_audit",epistemicPrompt,epistemicUser,config.autoContinue);
        }
      }
      state.epistemicOut=state.epistemicOut?stripCalibrationBleed(state.epistemicOut):state.epistemicOut;
      emit("stage-output",{stage:"epistemic_audit",output:state.epistemicOut});
      await storeSynthesisBrief("epistemic","Epistemic Confidence Audit",state.epistemicOut);
      setSynthesisStageStatus("epistemic_audit","success");
    } catch(e){ recordStageFailure("epistemic_audit","Epistemic",e); }
    stageEmitter(emit,"epistemic_audit",false); emit("stages-done",{value:3});

    try {
      stageEmitter(emit,"meta",true);
      state.metaOut=await runGoverned("cross_domain_tension_analysis",metaSystem((config.docs&&config.docs.meta)||[],config.webSearch,config.publicWebSearch,config.sessionEvidence,config.analysisMode,activeDir,config.instructions),"Decision: "+config.decision+"\n\nDecision Surface Map:\n"+state.surfaceMapOut+"\n\nDirector Governance Briefs:\n"+briefSummary+(state.epistemicOut?"\n\nEpistemic Audit:\n"+state.epistemicOut:""),config.autoContinue,config.webSearch||config.publicWebSearch);
      emit("stage-output",{stage:"meta",output:state.metaOut});
      await storeSynthesisBrief("meta","Cross-Domain Tension Analysis",state.metaOut);
      setSynthesisStageStatus("meta","success");
    } catch(e){ recordStageFailure("meta","META",e); }
    stageEmitter(emit,"meta",false); emit("stages-done",{value:4});

    try {
      stageEmitter(emit,"reality_anchor",true);
      state.realityAnchorOut=await runGoverned("reality_anchor",realityAnchorSystem(config.analysisMode,activeDir,config.instructions),"Decision: "+config.decision+"\n\nDirector Governance Briefs:\n"+briefSummary+"\n\nDecision Surface Map:\n"+state.surfaceMapOut+"\n\nMETA Synthesis:\n"+state.metaOut,config.autoContinue);
      emit("stage-output",{stage:"reality_anchor",output:state.realityAnchorOut});
      await storeSynthesisBrief("reality","Reality Anchor",state.realityAnchorOut);
      setSynthesisStageStatus("reality_anchor","success");
    } catch(e){ recordStageFailure("reality_anchor","Reality Anchor",e); }
    stageEmitter(emit,"reality_anchor",false); emit("stages-done",{value:5});

    try {
      stageEmitter(emit,"probe",true);
      var sigs=state.results.map(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(PROCEED|CAUTION|HALT)/,1);}).filter(Boolean);
      var sigCounts=sigs.reduce(function(a,s){return Object.assign({},a,{[s]:(a[s]||0)+1});},{});
      var dominantSignal=(Object.entries(sigCounts).sort(function(a,b){return b[1]-a[1];})[0]||[])[0]||"UNKNOWN";
      state.probeOut=await runGoverned("adversarial_probe",adversarialProbeSystem(dominantSignal,config.analysisMode,activeDir,config.instructions),"Decision: "+config.decision+"\n\nAll Director Governance Briefs:\n"+briefSummary+"\n\nMETA-AUTHOR Synthesis:\n"+state.metaOut+"\n\nReality Anchor:\n"+state.realityAnchorOut,config.autoContinue);
      emit("stage-output",{stage:"probe",output:state.probeOut});
      await storeSynthesisBrief("probe","Adversarial Probe",state.probeOut);
      setSynthesisStageStatus("probe","success");
    } catch(e){ recordStageFailure("probe","Probe",e); }
    stageEmitter(emit,"probe",false); emit("stages-done",{value:6});

    var probeVerdict=findSignal(state.probeOut,["BOARD REASONING SOUND","SIGNIFICANT GAPS","CONCLUSION CHALLENGED"]);
    state.stressDecision=shouldRunStressTest(config.analysisMode,config.decision,state.results,state.surfaceMapOut,state.epistemicOut,probeVerdict,state.realityAnchorOut);
    emit("stress-decision",{stressDecision:state.stressDecision});
    if(state.stressDecision.run){
      try {
        stageEmitter(emit,"stress",true);
        state.stressOut=await runGoverned("stress_test",stressSystem((config.docs&&config.docs.stress)||[],config.webSearch,config.publicWebSearch,config.sessionEvidence,config.analysisMode,activeDir,config.instructions),"Decision: "+config.decision+"\n\nDecision Surface Map:\n"+state.surfaceMapOut+"\n\nMETA-AUTHOR:\n"+state.metaOut+"\n\nReality Anchor:\n"+state.realityAnchorOut,config.autoContinue,config.webSearch||config.publicWebSearch);
        emit("stage-output",{stage:"stress",output:state.stressOut});
        await storeSynthesisBrief("stress","Decision Stress Test",state.stressOut);
        setSynthesisStageStatus("stress","success");
      } catch(e){ recordStageFailure("stress","Stress",e); }
      stageEmitter(emit,"stress",false);
    } else {
      setSynthesisStageStatus("stress","skipped",null,"stress trigger not met");
    }
    emit("stages-done",{value:7});

    var failedDirLabels=state.results.filter(function(r){return /^\[Director failed:/i.test((r.output||"").trim());}).map(function(r){return r.label;});
    var probeInjection=(function(){
      if(!state.probeOut) return "";
      var verdict=findSignal(state.probeOut,["BOARD REASONING SOUND","SIGNIFICANT GAPS","CONCLUSION CHALLENGED"])||"not determined";
      var strongestMatch=state.probeOut.match(/\*\*The Strongest Counter-Argument\*\*[^\n]*\n([\s\S]*?)(?=\n\*\*[A-Za-z]|$)/i);
      var strongest=strongestMatch?(strongestMatch[1]||"").trim().substring(0,600):"See Adversarial Probe output.";
      return "\n\n⚠ ADVERSARIAL PROBE VERDICT: "+verdict+"\nThe Probe's strongest argument was:\n"+strongest+"\n\nYou MUST include an **Adversarial Probe Response** section in your output — between **Coverage Limitations** and **Director Signal Distribution** — that either ACCEPTS this finding (explaining how it changes the decision conditions) or REBUTS it (with explicit Director-grounded reasoning). This section is mandatory and parser-matched. Do not convert the Probe finding into a preferred course of action.";
    })();
    try {
      stageEmitter(emit,"chair",true);
      var chairPrompt=chairSystem((config.docs&&config.docs.chair)||[],config.webSearch,config.publicWebSearch,config.sessionEvidence,config.analysisMode,activeDir,failedDirLabels,config.instructions);
      var chairUser="Decision: "+config.decision+"\n\nDecision Surface Map:\n"+state.surfaceMapOut+"\n\nMETA-AUTHOR:\n"+state.metaOut+"\n\nReality Anchor:\n"+state.realityAnchorOut+(state.stressOut?"\n\nStress Test:\n"+state.stressOut:"")+(state.probeOut?"\n\nAdversarial Bias Probe:\n"+state.probeOut:"")+probeInjection;
      state.chairOut=await runGoverned("chair",chairPrompt,chairUser,config.autoContinue,config.webSearch||config.publicWebSearch);
      state.chairOut=await repairChair(state.chairOut,chairPrompt,chairUser);
      emit("stage-output",{stage:"chair",output:state.chairOut});
      await storeSynthesisBrief("chair","Chair Decision",state.chairOut);
      setSynthesisStageStatus("chair","success");
    } catch(e){ recordStageFailure("chair","Chair",e); }
    stageEmitter(emit,"chair",false); emit("stages-done",{value:8});

    if(!state.synthesisStageStatus.chair||state.synthesisStageStatus.chair.status!=="success"){
      state.comparatorData=null;
      setSynthesisStageStatus("comparator","skipped",null,"required upstream stage chair failed");
      emit("comparator-skipped",{reason:"required upstream stage chair failed"});
    } else {
      try {
        var pCount=state.results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(PROCEED)/,1)==="PROCEED";}).length;
        var cCount=state.results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(CAUTION)/,1)==="CAUTION";}).length;
        var hCount=state.results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(HALT)/,1)==="HALT";}).length;
        var killSwitchHints=(function(){
          var hints=[];
          var measureDir=state.results.find(function(r){return r.id==="measurement";});
          var safetyDir=state.results.find(function(r){return r.id==="safety";});
          var behaviourDir=state.results.find(function(r){return r.id==="behaviour";});
          [measureDir,safetyDir,behaviourDir].forEach(function(dir){
            if(!dir||!dir.output) return;
            var m=dir.output.match(/(?:override rates?|accuracy|wait time|uptake|utilisation)[^.]*?(\d+%)[^.]*\./gi);
            if(m) m.slice(0,2).forEach(function(s){hints.push(s.trim().substring(0,150));});
          });
          if(hints.length===0) return "";
          return "\n\nKILL SWITCH REQUIREMENT: Each kill_switch entry must contain a measurable indicator + specific threshold + timeframe. Examples from Director analyses:\n"+hints.map(function(h){return "- "+h;}).join("\n")+"\nFormat each kill switch as: \"[indicator] exceeds/falls below [threshold] [timeframe].\"";
        })();
        var compRaw=await runGoverned("comparator",comparatorJsonSystem(config.decisionId,config.decisionSignal,state.results,config.analysisMode,activeDir,state.chairOut,config.instructions,pCount,cCount,hCount),"Run comparator now."+killSwitchHints,config.autoContinue);
        var compParsed=validateComparatorSchema(extractFirstJsonObject(compRaw));
        if(compParsed&&compParsed.summary&&typeof compParsed.summary.decision_signal_interpretation==="string"){
          var interp=compParsed.summary.decision_signal_interpretation;
          if(interp.indexOf(String(cCount))===-1||interp.indexOf(String(hCount))===-1){
            compParsed.summary.decision_signal_interpretation="[Signal tally: "+pCount+" PROCEED / "+cCount+" CAUTION / "+hCount+" HALT] "+interp;
          }
        }
        state.comparatorData={raw:compRaw,parsed:compParsed,created_at:runtimeNow(runtime)};
        emit("comparator",{comparatorData:state.comparatorData});
        setSynthesisStageStatus("comparator","success");
      } catch(e){ recordStageFailure("comparator","Comparator",e); }
    }

    if(state.results.length>0){
      var record=buildLedgerRecord(makeLedgerInput(config,state,state.stressDecision),runtime);
      emit("ledger-record",{record:record});
      state.ledgerRecord=record;
    }
  } catch(fatalErr) {
    state.fatalError=fatalErr;
    if(state.results.length>0){
      try {
        var fatalRecord=buildLedgerRecord(makeLedgerInput(config,state,config.priorStressTestResult),runtime);
        emit("ledger-record",{record:fatalRecord});
        state.ledgerRecord=fatalRecord;
      } catch(e) {}
    }
  }

  return state;
}
