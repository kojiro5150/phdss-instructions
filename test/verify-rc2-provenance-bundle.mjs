// Entirely invented RC2 structural fixtures; NOT derived from RC1.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import {makeCompressionEvent,compressionEventRef} from "../src/runtime/compression-provenance.js";
import {compressDirectorOutput,compressSynthesisOutput} from "../src/runtime/governance-compression.js";
import {validDirectorBrief} from "./fixtures/governance-record-contracts.js";
import {createGovernanceExportBundle} from "../src/runtime/governance-export-bundle.js";
import {verifyGovernanceProvenance} from "../scripts/verify-governance-provenance-v2.mjs";
import {verifyGovernanceBundle} from "../scripts/verify-governance-bundle.mjs";

const sha=x=>crypto.createHash("sha256").update(Buffer.from(String(x),"utf8")).digest("hex");
const lived="94c5851146d849957af9610935a85f674c6ab05d";
const base="22b662999e01462fc4008446885a38df2cf735ad";
const files={systems:"systems.md",safety:"safety.md",equity:"equity.md",lived:"lived.md",digital:"digital.md",surfacemap:"surfacemap.md",epistemic:"epistemic.md",meta:"meta.md",reality:"reality.md",probe:"probe.md",stress:"stress.md",chair:"chair.md",comparator:"comparator.md"};
const stageToKey={surface_map:"surfacemap",epistemic_audit:"epistemic",cross_domain_tension_analysis:"meta",reality_anchor:"reality",adversarial_probe:"probe",stress_test:"stress",chair:"chair",comparator:"comparator"};
const all=["systems","economics","behaviour","policy","equity","lived","digital","ethics","sovereignty","safety","physics","measurement","innovation"];
const active=["systems","safety","equity","lived","digital"];
const synthesis=["surface_map","epistemic_audit","cross_domain_tension_analysis","reality_anchor","adversarial_probe","stress_test","chair","comparator"];
const stageIds=[...active.map(x=>"director:"+x),...synthesis];
const decision="Should a public health service deploy an AI tool?";
const commitFor=file=>file==="lived.md"?lived:base;
const urlFor=file=>"https://cdn.jsdelivr.net/gh/kojiro5150/phdss-instructions@"+commitFor(file)+"/"+file;
const sourceLoader=async(commit,file)=>{
  // Deliberately return identical bytes regardless of commit to catch false source attribution.
  if(!commit||!Object.values(files).includes(file))throw Error("unavailable");
  return "INSTRUCTION "+file+"\n";
};
function makeStage(id){
  const key=id.startsWith("director:")?id.slice(9):stageToKey[id];
  const file=files[key],sys="SYS "+id,user="USER "+id,raw="RAW "+id,output="FULL SOURCE "+id;
  return {schema:"phdss.governance-stage-provenance.v3",decision_id:"DR-RC2-SYNTHETIC-ONLY",run_type:"GOVERNANCE",stage_id:id,
    stage_kind:id.startsWith("director:")?"director":id==="comparator"?"comparator":"synthesis",
    director_id:id.startsWith("director:")?key:null,
    captured_at:"2026-11-22T00:00:00.000Z",deployment_commit:"rc2-test-build",
    instruction_commit:lived,instruction_files:[file],instruction_normalization_version:"trim_v1",
    instruction_runtime_sha256:[sha(("INSTRUCTION "+file+"\n").trim())],
    instruction_source_commits:[commitFor(file)],instruction_source_urls:[urlFor(file)],
    model:"claude-sonnet-4-6",model_settings:{max_tokens:16000,temperature:0.8,auto_continue:true},
    web_search:false,system_prompt:sys,system_prompt_sha256:sha(sys),user_message:user,user_message_sha256:sha(user),
    raw_output:raw,raw_output_sha256:sha(raw),output_transform:"synthetic_transform",
    output_capture_stage:"post_synthetic_transform",output,output_sha256:sha(output),
    status:"success",error:null,authority_repair:{required:false,attempt_count:0,outcome:"not_required"}};
}
const originalStages=stageIds.map(makeStage);
const ledger={decision_id:"DR-RC2-SYNTHETIC-ONLY",record:"Invented no-real-case decision"};
const instructionSources={};
for(const [key,file] of Object.entries(files))instructionSources[key]={file,commit:commitFor(file),url:urlFor(file)};

const events=[];
for(const s of originalStages.filter(x=>x.stage_id!=="comparator")){
  const text=JSON.stringify({synthetic_brief:s.stage_id});
  events.push(await makeCompressionEvent({event_id:"compression:"+s.stage_id+":attempt:1:request",parent_stage_id:s.stage_id,
    compression_kind:s.stage_kind==="director"?"director":"synthesis",mode:"model",phase:"request",attempt_index:1,
    captured_at:"2026-11-22T00:00:00.000Z",status:"pending",selected:false,
    source_output:s.output,system_prompt:"Compress "+s.stage_id,user_message:"Source: "+s.output}));
  events.push(await makeCompressionEvent({event_id:"compression:"+s.stage_id+":attempt:1:result",parent_stage_id:s.stage_id,
    compression_kind:s.stage_kind==="director"?"director":"synthesis",mode:"model",phase:"result",attempt_index:1,
    captured_at:"2026-11-22T00:00:01.000Z",status:"success",selected:true,
    source_output:s.output,system_prompt:"Compress "+s.stage_id,user_message:"Source: "+s.output,
    raw_response:text,final_response:text}));
}
const manifest={
 schema:"phdss.governance-provenance.v2",decision_id:ledger.decision_id,run_type:"GOVERNANCE",
 captured_at:"2026-11-22T00:00:00.000Z",deployment_commit:"rc2-test-build",
 instruction_commit:lived,instruction_sources:instructionSources,instruction_normalization_version:"trim_v1",
 analysis_mode:"CORE",decision_text:decision,chair_selected_directors:[],model:"claude-sonnet-4-6",
 model_settings:{max_tokens:16000,temperature:0.8,auto_continue:true},web_search:false,public_web_search:false,
 session_evidence_count:0,director_embedded_evidence_counts:{},active_directors:active,
 omitted_directors:all.filter(x=>!active.includes(x)),
 stages:originalStages.map(r=>({stage_id:r.stage_id,status:r.status,output_sha256:r.output_sha256})),
 compression_events:await Promise.all(events.map(compressionEventRef)),
 compression_results:events.filter(e=>e.selected).map(e=>({parent_stage_id:e.parent_stage_id,brief_sha256:e.final_response_sha256})),
 final_ledger_sha256:sha(JSON.stringify(ledger))
};
const valid=await verifyGovernanceProvenance({manifest,stageRecords:originalStages,compressionEvents:events,sourceLoader,expectedDeployment:"rc2-test-build"});
assert.equal(valid.run_provenance_status,"VALID",JSON.stringify(valid.failures));
const bundle=await createGovernanceExportBundle({manifest,stages:originalStages,compression_events:events,ledger_record:ledger});
const bundled=await verifyGovernanceBundle({bundle,sourceLoader,expectedDeployment:"rc2-test-build"});
assert.equal(bundled.status,"VALID",JSON.stringify(bundled.errors));
assert.equal(bundled.checked_files,2+originalStages.length+events.length);

const mutate=fn=>{
  const value=structuredClone(bundle);
  fn(value);
  return value;
};
const verify=async(value)=>verifyGovernanceBundle({bundle:value,sourceLoader,expectedDeployment:"rc2-test-build"});
async function invalid(name,value,pattern){
  const v=await verify(value);
  assert.equal(v.status,"INVALID",name);
  assert.match(JSON.stringify(v.errors),pattern,name);
}
const refreshInventory=value=>{
  value.inventory.files=value.inventory.files.filter(x=>Object.hasOwn(value.files,x.path));
  for(const entry of value.inventory.files){
    const json=JSON.stringify(value.files[entry.path]);
    entry.sha256=sha(json);entry.utf8_bytes=Buffer.byteLength(json,"utf8");
  }
  value.inventory.file_count=value.inventory.files.length;
  value.inventory_sha256=sha(JSON.stringify(value.inventory));
};
await invalid("missing stage",mutate(b=>{delete b.files["stages/director_systems.json"];}),/missing|inventory/);
await invalid("missing compression event",mutate(b=>{
  delete b.files["compression/compression_director_systems_attempt_1_request.json"];
  refreshInventory(b);
}),/bundle file set|missing/);
await invalid("tampered response",mutate(b=>{
  b.files["compression/compression_director_systems_attempt_1_result.json"].raw_response="altered";
  refreshInventory(b);
}),/compression event hash mismatch/);
await invalid("tampered stage prompt",mutate(b=>{
  b.files["stages/director_systems.json"].system_prompt="ALTERED";
  refreshInventory(b);
}),/system prompt hash mismatch/);
await invalid("same bytes, wrong source commit",mutate(b=>{
  const r=b.files["stages/director_systems.json"];
  r.instruction_source_commits[0]="another-commit-with-identical-bytes";
  r.instruction_source_urls[0]="https://cdn.jsdelivr.net/gh/kojiro5150/phdss-instructions@another-commit-with-identical-bytes/systems.md";
  b.files["manifest.json"].instruction_sources.systems.commit=r.instruction_source_commits[0];
  b.files["manifest.json"].instruction_sources.systems.url=r.instruction_source_urls[0];
  refreshInventory(b);
}),/source commit attribution mismatch/);
await invalid("missing selected brief",mutate(b=>{
  b.files["manifest.json"].compression_results=b.files["manifest.json"].compression_results.filter(x=>x.parent_stage_id!=="chair");
  refreshInventory(b);
}),/missing consumed brief hash/);
await invalid("wrong selected brief",mutate(b=>{
  b.files["manifest.json"].compression_results.find(x=>x.parent_stage_id==="chair").brief_sha256=sha("wrong");
  refreshInventory(b);
}),/selected compression output differs/);
// The actual model-facing compressor must record request BEFORE each invocation.
const observed=[];
let modelCalls=0;
const brief=await compressDirectorOutput("Safety","Synthetic complete Director analysis",{
  stageId:"safety",
  apiCallImpl:async function(){modelCalls++;return {text:modelCalls===1?"{}":JSON.stringify(validDirectorBrief)};},
  onCompressionProvenance:async event=>{observed.push(event);}
});
assert.equal(modelCalls,2);
assert.equal(observed.length,4);
assert.deepEqual(observed.map(x=>[x.phase,x.status,x.selected]),[
  ["request","pending",false],["result","rejected",false],
  ["request","pending",false],["result","success",true]
]);
assert.equal(observed[0].system_prompt_sha256,observed[1].system_prompt_sha256);
assert.equal(observed[0].user_message_sha256,observed[1].user_message_sha256);
assert.equal(sha(brief),observed[3].final_response_sha256);

// A provenance failure before dispatch must fail closed, with no model call.
let unsafeCalls=0;
await assert.rejects(compressDirectorOutput("Safety","Synthetic full analysis",{
  stageId:"safety",
  apiCallImpl:async function(){unsafeCalls++;return {text:JSON.stringify(validDirectorBrief)};},
  onCompressionProvenance:async function(){throw new Error("pre-call provenance unavailable");}
}),/pre-call provenance unavailable/);
assert.equal(unsafeCalls,0,"do not issue a model request without its provenance request record");

const synthEvents=[];
await compressSynthesisOutput("Decision Surface Map","Synthetic synthesis full analysis",{
  apiCallImpl:async function(){return {text:"{}"};},
  onCompressionProvenance:async event=>{synthEvents.push(event);}
});
assert.equal(synthEvents.length,5,"two model requests/results and one deterministic fallback");
assert.deepEqual(synthEvents.map(x=>x.phase),["request","result","request","result","fallback"]);
assert.equal(synthEvents.at(-1).selected,true);
assert.equal(synthEvents.at(-1).status,"fallback");

await invalid("missing pre-call request",mutate(b=>{
  delete b.files["compression/compression_director_systems_attempt_1_request.json"];
  refreshInventory(b);
}),/bundle file set/);
await invalid("reordered request/result",mutate(b=>{
  const refs=b.files["manifest.json"].compression_events;
  const a=refs.findIndex(x=>x.event_id==="compression:director:systems:attempt:1:request");
  const z=refs.findIndex(x=>x.event_id==="compression:director:systems:attempt:1:result");
  [refs[a],refs[z]]=[refs[z],refs[a]];
  refreshInventory(b);
}),/missing or out-of-order compression attempt/);

console.log("RC2 compressed-call, composite-source and single-bundle independent verification: PASS");
