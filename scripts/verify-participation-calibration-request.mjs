#!/usr/bin/env node
import fs from "node:fs";
import crypto from "node:crypto";

function parseArgs(argv){
  const out={json:false};
  for(let i=2;i<argv.length;i++){
    const a=argv[i];
    if(a==="--json"){ out.json=true; continue; }
    if(a==="--request"){ out.request=argv[++i]; continue; }
    if(a==="--expected-deployment-commit"){ out.expectedDeploymentCommit=argv[++i]; continue; }
    if(a==="--baseline"){ out.baseline=argv[++i]; continue; }
    throw new Error("Unknown argument: "+a);
  }
  if(!out.request) throw new Error("--request is required");
  if(!out.expectedDeploymentCommit) throw new Error("--expected-deployment-commit is required");
  return out;
}

function sha256(text){
  return crypto.createHash("sha256").update(text,"utf8").digest("hex");
}

function gitBlobSha(text){
  const bytes=Buffer.from(text,"utf8");
  const header=Buffer.from("blob "+bytes.length+"\0","utf8");
  return crypto.createHash("sha1").update(Buffer.concat([header,bytes])).digest("hex");
}

function normalizeInstruction(text,version){
  if(version==="trim_v1") return text.trim();
  throw new Error("Unsupported instruction normalization version: "+version);
}

function fail(errors, json){
  const result={valid:false,eligible_for_scoring:false,errors};
  if(json) console.log(JSON.stringify(result,null,2));
  else{
    console.error("Participation calibration request integrity: FAIL");
    for(const e of errors) console.error("- "+e);
    console.error("Run rejected: do not score this calibration attempt.");
  }
  process.exit(1);
}

const args=parseArgs(process.argv);
const baselinePath=args.baseline||"tests/fixtures/v3/participation-calibration-request-integrity.v2.1.json";
const baseline=JSON.parse(fs.readFileSync(baselinePath,"utf8"));
const request=JSON.parse(fs.readFileSync(args.request,"utf8"));
const errors=[];

function expect(label,actual,expected){
  if(actual!==expected) errors.push(label+" mismatch: expected "+JSON.stringify(expected)+", got "+JSON.stringify(actual));
}

if(!/^[0-9a-f]{40}$/i.test(args.expectedDeploymentCommit)){
  errors.push("Expected deployment commit must be a full 40-character Git SHA");
}
if(request.deployment_commit==="UNRECORDED"||!request.deployment_commit){
  errors.push("Deployment commit is not recorded");
}
expect("deployment_commit",request.deployment_commit,args.expectedDeploymentCommit);
expect("request schema",request.schema,baseline.request_schema);
expect("run_type",request.run_type,baseline.run_type);
expect("advisory_mode",request.advisory_mode,baseline.advisory_mode);
expect("director_id",request.director_id,baseline.director_id);
expect("instruction_commit",request.instruction_commit,baseline.instruction_commit);
expect("instruction_file",request.instruction_file,baseline.instruction_file);
expect("instruction_normalization_version",request.instruction_normalization_version,baseline.instruction_normalization_version);

let sourceInstruction="";
try{
  sourceInstruction=fs.readFileSync(baseline.instruction_file,"utf8");
}catch(e){
  errors.push("Pinned instruction source file could not be read from checkout: "+baseline.instruction_file);
}

if(sourceInstruction){
  expect("instruction source SHA-256",sha256(sourceInstruction),baseline.instruction_source_sha256);
  expect("instruction source Git blob SHA",gitBlobSha(sourceInstruction),baseline.instruction_source_blob_sha);
}

if(typeof request.instruction_content!=="string"||request.instruction_content.length===0){
  errors.push("Captured instruction_content is missing or empty");
}else{
  const actualRuntimeHash=sha256(request.instruction_content);
  expect("instruction_runtime_sha256 self-check",request.instruction_runtime_sha256,actualRuntimeHash);
  expect("instruction_runtime_sha256 baseline",actualRuntimeHash,baseline.instruction_runtime_sha256);
  if(sourceInstruction){
    let normalized="";
    try{
      normalized=normalizeInstruction(sourceInstruction,baseline.instruction_normalization_version);
    }catch(e){
      errors.push(e.message);
    }
    if(normalized&&normalized!==request.instruction_content){
      errors.push("Captured runtime instruction does not exactly equal normalized pinned source");
    }
    if(normalized){
      expect("normalized source SHA-256",sha256(normalized),baseline.instruction_runtime_sha256);
    }
  }
}

if(typeof request.system_prompt!=="string"||request.system_prompt.length===0){
  errors.push("Captured system_prompt is missing or empty");
}else{
  expect("system_prompt_sha256 self-check",request.system_prompt_sha256,sha256(request.system_prompt));
  if(typeof request.instruction_content==="string"&&!request.system_prompt.startsWith(request.instruction_content)){
    errors.push("Composed system prompt does not begin with the captured Director instruction content");
  }
  if(!request.system_prompt.includes("**Participation & Representation Status**")){
    errors.push("Composed Lived Experience system prompt is missing Participation & Representation Status");
  }
}

if(typeof request.user_message!=="string"||request.user_message.length===0){
  errors.push("Captured user_message is missing or empty");
}else{
  expect("user_message_sha256 self-check",request.user_message_sha256,sha256(request.user_message));
}

if(errors.length) fail(errors,args.json);

const result={
  valid:true,
  eligible_for_scoring:true,
  deployment_commit:request.deployment_commit,
  instruction_commit:request.instruction_commit,
  instruction_file:request.instruction_file,
  instruction_source_sha256:baseline.instruction_source_sha256,
  instruction_normalization_version:baseline.instruction_normalization_version,
  instruction_runtime_sha256:request.instruction_runtime_sha256,
  system_prompt_sha256:request.system_prompt_sha256,
  user_message_sha256:request.user_message_sha256
};

if(args.json) console.log(JSON.stringify(result,null,2));
else{
  console.log("Participation calibration request integrity: PASS");
  console.log("Run eligible for scoring.");
  console.log("Deployment commit: "+result.deployment_commit);
  console.log("Instruction commit: "+result.instruction_commit);
  console.log("Instruction source SHA-256: "+result.instruction_source_sha256);
  console.log("Instruction normalization: "+result.instruction_normalization_version);
  console.log("Runtime instruction SHA-256: "+result.instruction_runtime_sha256);
}
