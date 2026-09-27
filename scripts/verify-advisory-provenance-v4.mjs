#!/usr/bin/env node
import fs from "node:fs";
import crypto from "node:crypto";
import {pathToFileURL} from "node:url";

const sha=v=>crypto.createHash("sha256").update(Buffer.from(String(v??""),"utf8")).digest("hex");

export async function verifyAdvisoryProvenance({record,expectedDeployment=null,repoSlug="kojiro5150/phdss-instructions",sourceLoader=null}){
  const failures=[],fail=m=>failures.push(m);
  if(record.schema!=="phdss.advisory-request.v4") fail("unsupported Advisory provenance schema");
  if(record.run_type!=="ADVISORY") fail("run_type must be ADVISORY");
  if(record.advisory_mode!=="DIRECTOR_BRIEF") fail("advisory_mode must be DIRECTOR_BRIEF");
  if(record.director_id!=="lived") fail("director_id must be lived for this probe tranche");
  if(expectedDeployment&&record.deployment_commit!==expectedDeployment) fail("deployment commit mismatch");
  if(!/^[0-9a-f]{40}$/i.test(String(record.deployment_commit||""))) fail("deployment commit missing or invalid");
  if(!/^[0-9a-f]{40}$/i.test(String(record.instruction_commit||""))) fail("instruction commit missing or invalid");
  if(record.instruction_normalization_version!=="trim_v1") fail("unsupported instruction normalization");
  if(record.instruction_file!=="lived.md") fail("instruction_file must be lived.md");

  if(typeof record.instruction_content!=="string"||!record.instruction_content.length) fail("instruction_content missing");
  else if(record.instruction_runtime_sha256!==sha(record.instruction_content)) fail("instruction_runtime_sha256 self-check failed");

  if(typeof record.system_prompt!=="string"||!record.system_prompt.length) fail("system_prompt missing");
  else{
    if(record.system_prompt_sha256!==sha(record.system_prompt)) fail("system_prompt_sha256 self-check failed");
    if(typeof record.instruction_content==="string"&&!record.system_prompt.startsWith(record.instruction_content)) fail("system prompt does not begin with captured instruction content");
    if(!record.system_prompt.includes("**Participation & Representation Status**")) fail("participation status section missing from system prompt");
  }

  if(typeof record.user_message!=="string"||!record.user_message.length) fail("user_message missing");
  else if(record.user_message_sha256!==sha(record.user_message)) fail("user_message_sha256 self-check failed");

  if(record.output_capture_stage!=="post_stripCalibrationBleed_v1") fail("unexpected output capture stage");
  if(record.status!=="success") fail("Advisory run status is not success");
  if(typeof record.output!=="string"||!record.output.length) fail("output missing");
  else if(record.output_sha256!==sha(record.output)) fail("output_sha256 self-check failed");

  let sourceStatus="NOT_CHECKED",sourceComputed=null;
  if(typeof record.instruction_commit==="string"&&record.instruction_file){
    try{
      let text;
      if(sourceLoader) text=await sourceLoader(record.instruction_commit,record.instruction_file);
      else{
        const res=await fetch("https://raw.githubusercontent.com/"+repoSlug+"/"+record.instruction_commit+"/"+record.instruction_file);
        if(!res.ok) throw new Error("source unavailable");
        text=await res.text();
      }
      sourceComputed=sha(String(text).trim());
      sourceStatus=sourceComputed===record.instruction_runtime_sha256?"VALID":"INVALID";
      if(sourceStatus!=="VALID") fail("instruction source hash mismatch");
    }catch(e){
      sourceStatus="INVALID";
      fail("instruction source unavailable at declared commit");
    }
  }

  return {
    schema:"phdss.advisory-provenance-verification.v4",
    decision_id:record.decision_id||null,
    provenance_status:failures.length?"INVALID":"VALID",
    deployment_commit:record.deployment_commit||null,
    instruction_commit:record.instruction_commit||null,
    instruction_file:record.instruction_file||null,
    instruction_source_status:sourceStatus,
    instruction_runtime_sha256:record.instruction_runtime_sha256||null,
    instruction_source_computed_sha256:sourceComputed,
    system_prompt_sha256:record.system_prompt_sha256||null,
    user_message_sha256:record.user_message_sha256||null,
    output_sha256:record.output_sha256||null,
    output_capture_stage:record.output_capture_stage||null,
    failures
  };
}

const invoked=process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href;
if(invoked){
  const recordPath=process.argv[2],expectedDeployment=process.argv[3]||null,repoSlug=process.argv[4]||"kojiro5150/phdss-instructions";
  if(!recordPath){
    console.error("Usage: node scripts/verify-advisory-provenance-v4.mjs <sidecar.json> [expected-deployment-sha] [repo-slug]");
    process.exit(2);
  }
  const record=JSON.parse(fs.readFileSync(recordPath,"utf8"));
  const result=await verifyAdvisoryProvenance({record,expectedDeployment,repoSlug});
  console.log(JSON.stringify(result,null,2));
  if(result.failures.length) process.exit(1);
}
