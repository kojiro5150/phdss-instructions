import { DIRECTORS } from "./registry.js";
import { safeMatch, findSignal, extractFirstJsonObject } from "./parsers.js";
import { chairSystem, comparatorJsonSystem } from "./prompt-builders.js";
import {
  callGovernedSynthesis,
  repairChairDecisionBoundary,
  validateComparatorSchema,
} from "./pipeline.js";
import { INSTRUCTION_COMMIT } from "./runtime/instruction-loader.js";

export const REPLAY_ENTRY_STAGES = Object.freeze(["chair","comparator"]);

export function unwrapReplayDecision(ledgerDocument, decisionId) {
  if(!ledgerDocument||typeof ledgerDocument!=="object") throw new Error("Replay fixture ledger is missing or invalid");
  var decisions=Array.isArray(ledgerDocument.decisions)?ledgerDocument.decisions:[ledgerDocument];
  if(!decisions.length) throw new Error("Replay fixture contains no decisions");
  if(decisionId) {
    var selected=decisions.find(function(d){return d&&d.decision_id===decisionId;});
    if(!selected) throw new Error("Replay fixture does not contain decision "+decisionId);
    return selected;
  }
  if(decisions.length!==1) throw new Error("Replay fixture contains multiple decisions; specify decision_id");
  return decisions[0];
}

export function buildReplayPlan(fromStage) {
  if(REPLAY_ENTRY_STAGES.indexOf(fromStage)===-1) {
    throw new Error("Unsupported replay entry stage: "+String(fromStage)+". Supported: "+REPLAY_ENTRY_STAGES.join(", "));
  }
  return fromStage==="chair" ? ["chair","comparator"] : ["comparator"];
}

export function validateReplayDecision(decision, fromStage) {
  buildReplayPlan(fromStage);
  if(!decision||typeof decision!=="object") throw new Error("Replay decision is missing");
  if(!decision.decision_id) throw new Error("Replay decision_id is missing");
  if(!decision.question) throw new Error("Replay decision question is missing");
  if(!decision.outputs||typeof decision.outputs!=="object") throw new Error("Replay outputs are missing");
  if(!decision.outputs.directors||typeof decision.outputs.directors!=="object") throw new Error("Replay Director outputs are missing");
  if(!Array.isArray(decision.active_directors)||decision.active_directors.length===0) throw new Error("Replay active_directors are missing");

  var missingDirectors=decision.active_directors.filter(function(id){
    return typeof decision.outputs.directors[id]!=="string"||!decision.outputs.directors[id].trim();
  });
  if(missingDirectors.length) throw new Error("Replay Director outputs missing for: "+missingDirectors.join(", "));

  if(fromStage==="chair") {
    ["surface_map","meta","reality_anchor","probe"].forEach(function(key){
      if(typeof decision.outputs[key]!=="string"||!decision.outputs[key].trim()) {
        throw new Error("Replay Chair dependency missing: "+key);
      }
    });
    if(decision.stress_test_ran&&(typeof decision.outputs.stress!=="string"||!decision.outputs.stress.trim())) {
      throw new Error("Replay Chair dependency missing: stress");
    }
  }

  if(fromStage==="comparator"&&(typeof decision.outputs.chair!=="string"||!decision.outputs.chair.trim())) {
    throw new Error("Replay Comparator dependency missing: chair");
  }
  return decision;
}

export function hydrateReplayState(decision) {
  var activeDir=decision.active_directors.map(function(id){
    return DIRECTORS.find(function(d){return d.id===id;});
  });
  var unknown=decision.active_directors.filter(function(id,index){return !activeDir[index];});
  if(unknown.length) throw new Error("Replay registry does not contain Directors: "+unknown.join(", "));

  var results=activeDir.map(function(d){
    return Object.assign({},d,{output:decision.outputs.directors[d.id]});
  });
  var failedDirLabels=results.filter(function(r){
    return /^\[Director failed:/i.test((r.output||"").trim());
  }).map(function(r){return r.label;});

  return {
    activeDir:activeDir,
    results:results,
    failedDirLabels:failedDirLabels,
    surfaceMapOut:decision.outputs.surface_map||"",
    metaOut:decision.outputs.meta||"",
    realityAnchorOut:decision.outputs.reality_anchor||"",
    probeOut:decision.outputs.probe||"",
    stressOut:decision.outputs.stress||"",
    chairOut:decision.outputs.chair||"",
  };
}

export function buildReplayProbeInjection(probeOut) {
  if(!probeOut) return "";
  var verdict=findSignal(probeOut,["BOARD REASONING SOUND","SIGNIFICANT GAPS","CONCLUSION CHALLENGED"])||"not determined";
  var strongestMatch=probeOut.match(/\*\*The Strongest Counter-Argument\*\*[^\n]*\n([\s\S]*?)(?=\n\*\*[A-Za-z]|$)/i);
  var strongest=strongestMatch?(strongestMatch[1]||"").trim().substring(0,600):"See Adversarial Probe output.";
  return "\n\n⚠ ADVERSARIAL PROBE VERDICT: "+verdict+
    "\nThe Probe's strongest argument was:\n"+strongest+
    "\n\nYou MUST include an **Adversarial Probe Response** section in your output — between **Coverage Limitations** and **Director Signal Distribution**. Report the Probe verdict exactly as supplied, surface its strongest challenge, and show where that challenge aligns with, conflicts with, or remains unresolved against the other supplied reasoning. Do not ACCEPT or REBUT on the Chair's own authority. Do not determine whether the Probe wins, whether the dominant signal stands, or whether the challenge changes the institutional disposition. Preserve the challenge for human judgment. This section is mandatory and parser-matched.";
}

export function buildChairReplayPrompts(decision,state,instructions) {
  var chairPrompt=chairSystem(
    [],false,false,[],
    decision.analysis_mode||"FULL",
    state.activeDir,
    state.failedDirLabels,
    instructions||{}
  );
  var chairUser="Decision: "+decision.question+
    "\n\nDecision Surface Map:\n"+state.surfaceMapOut+
    "\n\nMETA-AUTHOR:\n"+state.metaOut+
    "\n\nReality Anchor:\n"+state.realityAnchorOut+
    (state.stressOut?"\n\nStress Test:\n"+state.stressOut:"")+
    (state.probeOut?"\n\nAdversarial Bias Probe:\n"+state.probeOut:"")+
    buildReplayProbeInjection(state.probeOut);
  return {system:chairPrompt,user:chairUser};
}

export function buildReplayKillSwitchHints(results) {
  var hints=[];
  ["measurement","safety","behaviour"].forEach(function(id){
    var dir=results.find(function(r){return r.id===id;});
    if(!dir||!dir.output) return;
    var matches=dir.output.match(/(?:override rates?|accuracy|wait time|uptake|utilisation)[^.]*?(\d+%)[^.]*\./gi);
    if(matches) matches.slice(0,2).forEach(function(s){hints.push(s.trim().substring(0,150));});
  });
  if(hints.length===0) return "";
  return "\n\nKILL SWITCH REQUIREMENT: Each kill_switch entry must contain a measurable indicator + specific threshold + timeframe. Examples from Director analyses:\n"+
    hints.map(function(h){return "- "+h;}).join("\n")+
    "\nFormat each kill switch as: \"[indicator] exceeds/falls below [threshold] [timeframe].\"";
}

export function buildComparatorReplayPrompts(decision,state,instructions) {
  var pCount=typeof decision.proceed_count==="number"?decision.proceed_count:state.results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(PROCEED)/,1)==="PROCEED";}).length;
  var cCount=typeof decision.caution_count==="number"?decision.caution_count:state.results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(CAUTION)/,1)==="CAUTION";}).length;
  var hCount=typeof decision.halt_count==="number"?decision.halt_count:state.results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(HALT)/,1)==="HALT";}).length;
  var system=comparatorJsonSystem(
    decision.decision_id,
    decision.decision_signal||"",
    state.results,
    decision.analysis_mode||"FULL",
    state.activeDir,
    state.chairOut,
    instructions||{},
    pCount,cCount,hCount
  );
  var user="Run comparator now."+buildReplayKillSwitchHints(state.results);
  return {system:system,user:user,counts:{proceed:pCount,caution:cCount,halt:hCount}};
}

export async function replayFrozenStages(options) {
  options=options||{};
  var decision=validateReplayDecision(
    unwrapReplayDecision(options.ledgerDocument,options.decisionId),
    options.from
  );
  var state=hydrateReplayState(decision);
  var instructions=options.instructions||{};
  var authorityRepairEvents=[];
  var stageStatus={};
  var stageErrors=[];
  var externalObserver=options.runtime&&options.runtime.onAuthorityRepairEvent;
  var governedRuntime=Object.assign({},options.runtime||{},{
    onAuthorityRepairEvent:function(event){
      authorityRepairEvents.push(Object.assign({},event));
      if(typeof externalObserver==="function") {
        try { externalObserver(Object.assign({},event)); } catch(e) {}
      }
    }
  });
  var runGoverned=options.callGovernedImpl||function(layer,systemPrompt,userPrompt,autoContinue,useWeb){
    return callGovernedSynthesis(layer,systemPrompt,userPrompt,autoContinue,useWeb,governedRuntime);
  };
  var repairChair=options.repairChairImpl||function(text,systemPrompt,userPrompt){
    return repairChairDecisionBoundary(text,systemPrompt,userPrompt,governedRuntime);
  };

  if(options.from==="comparator") {
    stageStatus.chair={status:"frozen"};
  }

  if(options.from==="chair") {
    var chairPrompts=buildChairReplayPrompts(decision,state,instructions);
    try {
      state.chairOut=await runGoverned("chair",chairPrompts.system,chairPrompts.user,true,false);
      state.chairOut=await repairChair(state.chairOut,chairPrompts.system,chairPrompts.user);
      stageStatus.chair={status:"success"};
    } catch(e) {
      stageStatus.chair={status:"failed",error:(e&&e.message)||String(e)};
      stageErrors.push("Chair failed: "+((e&&e.message)||String(e)));
    }
  }

  var comparatorData=null;
  if(stageStatus.chair&&stageStatus.chair.status==="failed") {
    stageStatus.comparator={status:"skipped",reason:"required upstream stage chair failed"};
  } else {
    var comparatorPrompts=buildComparatorReplayPrompts(decision,state,instructions);
    try {
      var compRaw=await runGoverned("comparator",comparatorPrompts.system,comparatorPrompts.user,true,false);
      var compParsed=validateComparatorSchema(extractFirstJsonObject(compRaw));
      if(compParsed&&compParsed.summary&&typeof compParsed.summary.decision_signal_interpretation==="string") {
        var interp=compParsed.summary.decision_signal_interpretation;
        var counts=comparatorPrompts.counts;
        if(interp.indexOf(String(counts.caution))===-1||interp.indexOf(String(counts.halt))===-1) {
          compParsed.summary.decision_signal_interpretation="[Signal tally: "+counts.proceed+" PROCEED / "+counts.caution+" CAUTION / "+counts.halt+" HALT] "+interp;
        }
      }
      comparatorData={raw:compRaw,parsed:compParsed};
      stageStatus.comparator={status:"success"};
    } catch(e) {
      stageStatus.comparator={status:"failed",error:(e&&e.message)||String(e)};
      stageErrors.push("Comparator failed: "+((e&&e.message)||String(e)));
    }
  }

  return {
    fixture_decision_id:decision.decision_id,
    from:options.from,
    planned_stages:buildReplayPlan(options.from),
    source_instruction_commit:decision.instruction_commit||null,
    replay_instruction_commit:INSTRUCTION_COMMIT,
    source_session_governance_status:decision.session_governance_status||null,
    stage_status:stageStatus,
    stage_errors:stageErrors,
    authority_repair_events:authorityRepairEvents,
    chair_output:options.from==="chair"?state.chairOut:null,
    comparator:comparatorData,
  };
}
