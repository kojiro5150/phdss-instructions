import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";

function sha(v){return crypto.createHash("sha256").update(Buffer.from(String(v),"utf8")).digest("hex");}
function stage(id,status="success",opts={}){
  const system=opts.system||("SYS "+id);
  const user=opts.user||("USER "+id);
  const output=status==="skipped"?null:(opts.output||("OUT "+id));
  return {
    schema:"phdss.governance-stage-provenance.v1",
    decision_id:"DR-TEST",
    run_type:"GOVERNANCE",
    stage_id:id,
    stage_kind:id.startsWith("director:")?"director":"synthesis",
    director_id:id.startsWith("director:")?id.slice(9):null,
    captured_at:"2026-09-27T00:00:00.000Z",
    deployment_commit:"abc123",
    instruction_commit:"instr123",
    instruction_files:[],
    instruction_normalization_version:"trim_v1",
    instruction_runtime_sha256:[],
    model:"claude-sonnet-4-6",
    model_settings:{max_tokens:16000,temperature:0.8,auto_continue:true},
    web_search:false,
    system_prompt:status==="skipped"?"":system,
    system_prompt_sha256:status==="skipped"?null:sha(system),
    user_message:status==="skipped"?"":user,
    user_message_sha256:status==="skipped"?null:sha(user),
    output,
    output_sha256:output==null?null:sha(output),
    status,
    error:status==="skipped"?(opts.reason||"not triggered"):(opts.error||null),
    authority_repair:id==="chair"?{required:false,attempt_count:0,outcome:"not_required"}:{required:false,attempt_count:0,outcome:"not_required"}
  };
}
function fixture(overrides={}){
  const records=[
    stage("director:lived"),stage("director:safety"),
    stage("surface_map"),stage("epistemic_audit"),stage("cross_domain_tension_analysis"),
    stage("reality_anchor"),stage("adversarial_probe"),stage("stress_test","skipped",{reason:"stress trigger not met"}),
    stage("chair"),stage("comparator")
  ];
  const manifest={
    schema:"phdss.governance-provenance.v1",decision_id:"DR-TEST",run_type:"GOVERNANCE",
    captured_at:"2026-09-27T00:00:00.000Z",deployment_commit:"abc123",instruction_commit:"instr123",
    instruction_normalization_version:"trim_v1",analysis_mode:"CORE",model:"claude-sonnet-4-6",
    model_settings:{max_tokens:16000,temperature:0.8,auto_continue:true},web_search:false,public_web_search:false,
    session_evidence_count:0,director_embedded_evidence_counts:{lived:0,safety:0},
    active_directors:["lived","safety"],omitted_directors:["systems"],
    stages:records.map(r=>({stage_id:r.stage_id,status:r.status,output_sha256:r.output_sha256||null})),final_ledger_sha256:null
  };
  return {manifest,records,...overrides};
}
function runCase(name,mutate,expectedStatus,expectText){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"phdss-prov-"));
  const sdir=path.join(dir,"stages");fs.mkdirSync(sdir);
  const data=fixture(); mutate(data);
  fs.writeFileSync(path.join(dir,"manifest.json"),JSON.stringify(data.manifest,null,2));
  data.records.forEach((r,i)=>fs.writeFileSync(path.join(sdir,String(i).padStart(2,"0")+"_"+r.stage_id.replace(/:/g,"_")+".json"),JSON.stringify(r,null,2)));
  const out=spawnSync(process.execPath,["scripts/verify-governance-provenance.mjs",path.join(dir,"manifest.json"),sdir,"abc123"],{encoding:"utf8"});
  assert.equal(out.status,expectedStatus,name+" exit");
  assert.match(out.stdout,new RegExp(expectText),name+" output");
}

runCase("valid with skipped stress",()=>{},0,'"run_provenance_status": "VALID"');
runCase("failed Chair execution with valid provenance",(d)=>{
  const r=d.records.find(x=>x.stage_id==="chair");r.status="failed";r.error="authority violation persisted";r.output=null;r.output_sha256=null;
  const ref=d.manifest.stages.find(x=>x.stage_id==="chair");ref.status="failed";ref.output_sha256=null;
},0,'"run_provenance_status": "VALID"');
runCase("corrupt stage invalidates run",(d)=>{
  d.records.find(x=>x.stage_id==="surface_map").output="tampered";
},1,'"run_provenance_status": "INVALID"');
runCase("missing expected stage invalidates run",(d)=>{
  d.records=d.records.filter(x=>x.stage_id!=="chair");
},1,'"run_provenance_status": "INVALID"');
runCase("skipped stage without reason invalidates run",(d)=>{
  const r=d.records.find(x=>x.stage_id==="stress_test");r.error=null;
},1,'"run_provenance_status": "INVALID"');
runCase("active Director missing record invalidates run",(d)=>{
  d.records=d.records.filter(x=>x.stage_id!=="director:lived");
},1,'active Director missing provenance record');
runCase("omitted Director invoked invalidates run",(d)=>{
  const extra=stage("director:systems");d.records.push(extra);d.manifest.stages.push({stage_id:extra.stage_id,status:extra.status,output_sha256:extra.output_sha256});
},1,'omitted Director has invoked provenance record');

console.log("Governance provenance verifier regression cases passed.");
