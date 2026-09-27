import assert from "node:assert/strict";
import crypto from "node:crypto";
import {verifyAdvisoryProvenance} from "../scripts/verify-advisory-provenance-v4.mjs";

const sha=v=>crypto.createHash("sha256").update(Buffer.from(String(v),"utf8")).digest("hex");
const instruction="LIVED INSTRUCTION\n**Participation & Representation Status**\n";
const user="Advisory request: Synthetic probe";
const output="Synthetic output";
const record={
  schema:"phdss.advisory-request.v4",
  captured_at:"2026-09-27T00:00:00.000Z",
  response_captured_at:"2026-09-27T00:00:01.000Z",
  decision_id:"DR-PROBE-TEST",
  run_type:"ADVISORY",
  advisory_mode:"DIRECTOR_BRIEF",
  director_id:"lived",
  director_label:"Lived Experience",
  deployment_commit:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  instruction_commit:"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  instruction_file:"lived.md",
  instruction_normalization_version:"trim_v1",
  instruction_content:instruction.trim(),
  instruction_runtime_sha256:sha(instruction.trim()),
  model:"claude-sonnet-4-6",
  model_settings:{max_tokens:16000,temperature:0.8,auto_continue:true},
  web_search:false,
  public_web_search:false,
  session_evidence_count:0,
  director_embedded_evidence_count:0,
  system_prompt:instruction.trim()+"\n\nSYSTEM WRAPPER",
  system_prompt_sha256:sha(instruction.trim()+"\n\nSYSTEM WRAPPER"),
  user_message:user,
  user_message_sha256:sha(user),
  output,
  output_sha256:sha(output),
  output_capture_stage:"post_stripCalibrationBleed_v1",
  status:"success",
  error:null
};

const sourceLoader=async(commit,file)=>{
  assert.equal(commit,record.instruction_commit);
  assert.equal(file,"lived.md");
  return instruction;
};

{
  const out=await verifyAdvisoryProvenance({record,expectedDeployment:record.deployment_commit,sourceLoader});
  assert.equal(out.provenance_status,"VALID");
  assert.equal(out.instruction_source_status,"VALID");
}
{
  const bad={...record,output_sha256:sha("wrong")};
  const out=await verifyAdvisoryProvenance({record:bad,expectedDeployment:record.deployment_commit,sourceLoader});
  assert.equal(out.provenance_status,"INVALID");
  assert.match(out.failures.join("\n"),/output_sha256 self-check failed/);
}
{
  const bad={...record,deployment_commit:"cccccccccccccccccccccccccccccccccccccccc"};
  const out=await verifyAdvisoryProvenance({record:bad,expectedDeployment:record.deployment_commit,sourceLoader});
  assert.equal(out.provenance_status,"INVALID");
  assert.match(out.failures.join("\n"),/deployment commit mismatch/);
}
{
  const bad={...record,instruction_runtime_sha256:sha("wrong")};
  const out=await verifyAdvisoryProvenance({record:bad,expectedDeployment:record.deployment_commit,sourceLoader});
  assert.equal(out.provenance_status,"INVALID");
  assert.match(out.failures.join("\n"),/instruction_runtime_sha256 self-check failed|instruction source hash mismatch/);
}
console.log("Advisory provenance v4 regressions passed.");
