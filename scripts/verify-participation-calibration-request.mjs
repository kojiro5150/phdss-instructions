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
    throw new Error("Unknown argument: "+a);
  }
  if(!out.request) throw new Error("--request is required");
  if(!out.expectedDeploymentCommit) throw new Error("--expected-deployment-commit is required");
  return out;
}

function sha256(text){
  return crypto.createHash("sha256").update(text,"utf8").digest("hex");
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
const baseline=JSON.parse(fs.readFileSync("tests/fixtures/v3/participation-calibration-request-integrity.v2.json","utf8"));
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

if(typeof request.instruction_content!=="string"||request.instruction_content.length===0){
  errors.push("Captured instruction_content is missing or empty");
}else{
  const actualInstructionHash=sha256(request.instruction_content);
  expect("instruction_content_sha256 self-check",request.instruction_content_sha256,actualInstructionHash);
  expect("instruction_content_sha256 baseline",actualInstructionHash,baseline.instruction_content_sha256);
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
  instruction_content_sha256:request.instruction_content_sha256,
  system_prompt_sha256:request.system_prompt_sha256,
  user_message_sha256:request.user_message_sha256
};

if(args.json) console.log(JSON.stringify(result,null,2));
else{
  console.log("Participation calibration request integrity: PASS");
  console.log("Run eligible for scoring.");
  console.log("Deployment commit: "+result.deployment_commit);
  console.log("Instruction commit: "+result.instruction_commit);
  console.log("Instruction SHA-256: "+result.instruction_content_sha256);
}
