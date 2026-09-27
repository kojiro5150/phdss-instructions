import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const baseline=JSON.parse(fs.readFileSync("tests/fixtures/v3/participation-calibration-request-integrity.v2.json","utf8"));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"phdss-request-integrity-"));
const instruction="synthetic instruction";
const syntheticBaseline={...baseline,instruction_content_sha256:crypto.createHash("sha256").update(instruction).digest("hex")};
const baselinePath=path.join(tmp,"baseline.json");
fs.writeFileSync(baselinePath,JSON.stringify(syntheticBaseline,null,2)+"\n");

function hash(s){ return crypto.createHash("sha256").update(s).digest("hex"); }
function run(file,commit){
  return spawnSync(process.execPath,[
    "scripts/verify-participation-calibration-request.mjs",
    "--request",file,
    "--expected-deployment-commit",commit,
    "--baseline",baselinePath
  ],{encoding:"utf8"});
}

try{
  const deployment="a".repeat(40);
  const systemPrompt=instruction+"\n\n**Participation & Representation Status**\nTest";
  const userMessage="Advisory request: fixture";
  const valid={
    schema:baseline.request_schema,
    run_type:baseline.run_type,
    advisory_mode:baseline.advisory_mode,
    director_id:baseline.director_id,
    deployment_commit:deployment,
    instruction_commit:baseline.instruction_commit,
    instruction_file:baseline.instruction_file,
    instruction_content:instruction,
    instruction_content_sha256:hash(instruction),
    system_prompt:systemPrompt,
    system_prompt_sha256:hash(systemPrompt),
    user_message:userMessage,
    user_message_sha256:hash(userMessage)
  };
  const validPath=path.join(tmp,"valid.json");
  fs.writeFileSync(validPath,JSON.stringify(valid));
  const good=run(validPath,deployment);
  assert.equal(good.status,0,good.stderr||good.stdout);
  assert.match(good.stdout,/eligible for scoring/i);

  const stalePath=path.join(tmp,"stale.json");
  fs.writeFileSync(stalePath,JSON.stringify({...valid,instruction_content:"stale instruction",instruction_content_sha256:hash("stale instruction")}));
  const stale=run(stalePath,deployment);
  assert.notEqual(stale.status,0);
  assert.match(stale.stderr,/Run rejected: do not score/i);

  const wrongDeployment=run(validPath,"b".repeat(40));
  assert.notEqual(wrongDeployment.status,0);

  const missingSectionPath=path.join(tmp,"missing-section.json");
  const noSection=instruction+"\n\nDomain Perspective";
  fs.writeFileSync(missingSectionPath,JSON.stringify({...valid,system_prompt:noSection,system_prompt_sha256:hash(noSection)}));
  const missingSection=run(missingSectionPath,deployment);
  assert.notEqual(missingSection.status,0);
}finally{
  fs.rmSync(tmp,{recursive:true,force:true});
}

console.log("Participation calibration request integrity fail-closed verification passed.");
