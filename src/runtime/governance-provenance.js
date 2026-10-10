import { SYNTHESIS_MODEL } from "./anthropic-client.js";

export const GOVERNANCE_PROVENANCE_SCHEMA="phdss.governance-provenance.v1";
// Stage schema versioned to v2 to add raw_output, raw_output_sha256,
// output_transform and output_capture_stage (G-01 / G-02 repair).
export const GOVERNANCE_STAGE_PROVENANCE_SCHEMA="phdss.governance-stage-provenance.v2";

export async function sha256Text(value){
  if(typeof globalThis==="undefined"||!globalThis.crypto||!globalThis.crypto.subtle||typeof TextEncoder==="undefined"){
    throw new Error("SHA-256 Governance provenance unavailable");
  }
  var bytes=new TextEncoder().encode(String(value==null?"":value));
  var digest=await globalThis.crypto.subtle.digest("SHA-256",bytes);
  return Array.from(new Uint8Array(digest)).map(function(b){return b.toString(16).padStart(2,"0");}).join("");
}

export function instructionKeyForStage(stageId){
  if(String(stageId||"").indexOf("director:")===0) return String(stageId).slice("director:".length);
  var map={
    surface_map:"surfacemap",
    epistemic_audit:"epistemic",
    cross_domain_tension_analysis:"meta",
    reality_anchor:"reality",
    adversarial_probe:"probe",
    stress_test:"stress",
    chair:"chair",
    comparator:"comparator"
  };
  return map[stageId]||null;
}

export async function buildInstructionProvenance(stageId,instructions){
  var key=instructionKeyForStage(stageId);
  if(!key) return {instruction_files:[],instruction_runtime_sha256:[]};
  var content=instructions&&instructions[key];
  if(typeof content!=="string"||!content.trim()){
    return {instruction_files:[key+".md"],instruction_runtime_sha256:[null]};
  }
  return {
    instruction_files:[key+".md"],
    instruction_runtime_sha256:[await sha256Text(content)]
  };
}

export async function createGovernanceStageRequest(input){
  var instruction=await buildInstructionProvenance(input.stage_id,input.instructions||{});
  return {
    schema:GOVERNANCE_STAGE_PROVENANCE_SCHEMA,
    decision_id:input.decision_id,
    run_type:"GOVERNANCE",
    stage_id:input.stage_id,
    stage_kind:input.stage_kind,
    director_id:input.director_id||null,
    captured_at:input.captured_at,
    deployment_commit:input.deployment_commit||"UNRECORDED",
    instruction_commit:input.instruction_commit,
    instruction_files:instruction.instruction_files,
    instruction_normalization_version:"trim_v1",
    instruction_runtime_sha256:instruction.instruction_runtime_sha256,
    model:SYNTHESIS_MODEL,
    model_settings:{
      max_tokens:16000,
      temperature:0.8,
      auto_continue:!!input.auto_continue
    },
    web_search:!!input.web_search,
    system_prompt:String(input.system_prompt||""),
    system_prompt_sha256:input.system_prompt==null?null:await sha256Text(input.system_prompt),
    user_message:String(input.user_message||""),
    user_message_sha256:input.user_message==null?null:await sha256Text(input.user_message),
    raw_output:null,
    raw_output_sha256:null,
    output_transform:null,
    output_capture_stage:null,
    output:null,
    output_sha256:null,
    status:"pending",
    error:null,
    authority_repair:{
      required:false,
      attempt_count:0,
      outcome:"not_required",
      initial_violation_reason:null,
      final_violation_reason:null,
      offending_clause_excerpt:null,
      final_offending_clause_excerpt:null
    }
  };
}

export async function finalizeGovernanceStage(record,input){
  var out=Object.assign({},record);
  out.status=input.status||"success";
  out.error=input.error||null;
  // raw_output: the model response text before any transformation.
  // Callers supply this separately; null means the stage failed or was skipped.
  // For epistemic_audit with retries, raw_output is the initial attempt only;
  // output_transform records the attempt count for audit purposes.
  // For chair, raw_output is the initial model response; replacement responses
  // generated inside the authority-repair loop of the second repairChair pass
  // are internal to the authority contract layer and are not captured here.
  //
  // Transformation-integrity boundary: output_transform names the declared
  // sequence; the verifier confirms raw_output_sha256 and output_sha256 are
  // internally consistent but cannot prove the declared sequence produced
  // output from raw_output. This is a documented structural limit of the
  // schema, not a gap to be closed within the schema itself.
  if(Object.prototype.hasOwnProperty.call(input,"raw_output")){
    out.raw_output=input.raw_output==null?null:String(input.raw_output);
    out.raw_output_sha256=input.raw_output==null?null:await sha256Text(input.raw_output);
  }
  // output_transform: the named sequence of transforms applied to raw_output.
  // output_capture_stage: the logical point at which output was captured.
  if(Object.prototype.hasOwnProperty.call(input,"output_transform")){
    out.output_transform=input.output_transform||null;
  }
  if(Object.prototype.hasOwnProperty.call(input,"output_capture_stage")){
    out.output_capture_stage=input.output_capture_stage||null;
  }
  if(Object.prototype.hasOwnProperty.call(input,"output")){
    out.output=input.output==null?null:String(input.output);
    out.output_sha256=input.output==null?null:await sha256Text(input.output);
  }
  var events=(input.authority_repair_events||[]).filter(function(event){
    return event&&event.layer===record.stage_id;
  });
  if(events.length){
    var last=events[events.length-1];
    out.authority_repair={
      required:true,
      attempt_count:events.reduce(function(max,event){return Math.max(max,event.attempt_count||0);},0),
      outcome:last.outcome||"failed",
      initial_violation_reason:events[0].initial_violation_reason||null,
      final_violation_reason:last.final_violation_reason||null,
      offending_clause_excerpt:events[0].offending_clause_excerpt||null,
      final_offending_clause_excerpt:last.final_offending_clause_excerpt||null
    };
  }
  return out;
}

export function createSkippedGovernanceStage(input){
  return {
    schema:GOVERNANCE_STAGE_PROVENANCE_SCHEMA,
    decision_id:input.decision_id,
    run_type:"GOVERNANCE",
    stage_id:input.stage_id,
    stage_kind:input.stage_kind||"synthesis",
    director_id:null,
    captured_at:input.captured_at,
    deployment_commit:input.deployment_commit||"UNRECORDED",
    instruction_commit:input.instruction_commit,
    instruction_files:[],
    instruction_normalization_version:"trim_v1",
    instruction_runtime_sha256:[],
    model:SYNTHESIS_MODEL,
    model_settings:{max_tokens:16000,temperature:0.8,auto_continue:!!input.auto_continue},
    web_search:false,
    system_prompt:"",
    system_prompt_sha256:null,
    user_message:"",
    user_message_sha256:null,
    raw_output:null,
    raw_output_sha256:null,
    output_transform:null,
    output_capture_stage:null,
    output:null,
    output_sha256:null,
    status:"skipped",
    error:input.reason||null,
    authority_repair:{required:false,attempt_count:0,outcome:"not_required",initial_violation_reason:null,final_violation_reason:null,offending_clause_excerpt:null,final_offending_clause_excerpt:null}
  };
}

export async function createGovernanceManifest(input){
  return {
    schema:GOVERNANCE_PROVENANCE_SCHEMA,
    decision_id:input.decision_id,
    run_type:"GOVERNANCE",
    captured_at:input.captured_at,
    deployment_commit:input.deployment_commit||"UNRECORDED",
    instruction_commit:input.instruction_commit,
    instruction_normalization_version:"trim_v1",
    analysis_mode:input.analysis_mode,
    decision_text:input.decision_text||null,
    chair_selected_directors:(input.chair_selected_directors||[]).slice(),
    model:SYNTHESIS_MODEL,
    model_settings:{max_tokens:16000,temperature:0.8,auto_continue:!!input.auto_continue},
    web_search:!!input.web_search,
    public_web_search:!!input.public_web_search,
    session_evidence_count:input.session_evidence_count||0,
    director_embedded_evidence_counts:Object.assign({},input.director_embedded_evidence_counts||{}),
    active_directors:(input.active_directors||[]).slice(),
    omitted_directors:(input.omitted_directors||[]).slice(),
    stages:(input.stages||[]).map(function(record){
      return {stage_id:record.stage_id,status:record.status,output_sha256:record.output_sha256||null};
    }),
    final_ledger_sha256:input.final_ledger==null?null:await sha256Text(JSON.stringify(input.final_ledger))
  };
}
