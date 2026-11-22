// First-class Governance Brief compression event provenance.
// This sidecar is separate from the stage request/output provenance.
import { sha256Text } from "./governance-provenance.js";
import { SYNTHESIS_MODEL } from "./anthropic-client.js";

export const COMPRESSION_EVENT_SCHEMA="phdss.governance-compression-event.v1";

export async function makeCompressionEvent(input) {
  const system=input.system_prompt==null?null:String(input.system_prompt);
  const user=input.user_message==null?null:String(input.user_message);
  const source=String(input.source_output==null?"":input.source_output);
  const raw=input.raw_response==null?null:String(input.raw_response);
  const final=input.final_response==null?null:String(input.final_response);
  return {
    schema:COMPRESSION_EVENT_SCHEMA,
    event_id:String(input.event_id),
    parent_stage_id:String(input.parent_stage_id),
    compression_kind:input.compression_kind,
    mode:input.mode,
    attempt_index:input.attempt_index,
    captured_at:input.captured_at||null,
    model:input.mode==="model"?SYNTHESIS_MODEL:null,
    model_settings:input.mode==="model"?{max_tokens:16000,temperature:0.8,web_search:false}:null,
    source_output_sha256:await sha256Text(source),
    system_prompt:system,
    system_prompt_sha256:system==null?null:await sha256Text(system),
    user_message:user,
    user_message_sha256:user==null?null:await sha256Text(user),
    raw_response:raw,
    raw_response_sha256:raw==null?null:await sha256Text(raw),
    final_response:final,
    final_response_sha256:final==null?null:await sha256Text(final),
    status:input.status,
    error:input.error||null,
    selected:!!input.selected
  };
}

export async function emitCompressionEvent(runtime,input) {
  if(!runtime||typeof runtime.onCompressionProvenance!=="function")return;
  const event=await makeCompressionEvent(input);
  await runtime.onCompressionProvenance(event);
}

export async function compressionEventRef(event) {
  return {
    event_id:event.event_id,
    parent_stage_id:event.parent_stage_id,
    status:event.status,
    selected:event.selected,
    event_sha256:await sha256Text(JSON.stringify(event))
  };
}
