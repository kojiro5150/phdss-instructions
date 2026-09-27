import fs from "node:fs";

const app=fs.readFileSync("App_FINAL.jsx","utf8");
const failures=[];

const required=[
  'schema:"phdss.advisory-request.v4"',
  'run_type:"ADVISORY"',
  'advisory_mode:"DIRECTOR_BRIEF"',
  'deployment_commit:(import.meta.env&&import.meta.env.VITE_GIT_COMMIT)||"UNRECORDED"',
  'instruction_commit:INSTRUCTION_COMMIT',
  'instruction_file:dir.id+".md"',
  'instruction_normalization_version:"trim_v1"',
  'instruction_content:directorInstruction',
  'instruction_runtime_sha256:instructionContentSha256',
  'model:SYNTHESIS_MODEL',
  'system_prompt:advisorySystemPrompt',
  'system_prompt_sha256:systemPromptSha256',
  'user_message:advisoryUserMessage',
  'user_message_sha256:userMessageSha256',
  'raw_output:null',
  'raw_output_sha256:null',
  'output:null',
  'output_sha256:null',
  'output_transform:"stripCalibrationBleed_v1"',
  'output_capture_stage:"post_stripCalibrationBleed_v1"',
  'status:"pending"',
  'session_evidence_count:sessionEvidence.length',
  'director_embedded_evidence_count:',
  'downloadJson("PHDSS_"+decisionId+"_"+dir.id+"_request.json",advisoryRequestRecords[dir.id])'
];

for(const phrase of required){
  if(!app.includes(phrase)) failures.push("Missing Advisory request provenance element: "+phrase);
}

const buildBeforeCall=app.indexOf("var advisoryRequestRecord={") < app.indexOf("callClaude_synthesis(advisorySystemPrompt,advisoryUserMessage");
const hashesBeforeRecord=
  app.indexOf("var instructionContentSha256=await sha256Text(directorInstruction);") <
  app.indexOf("var advisoryRequestRecord={") &&
  app.indexOf("var systemPromptSha256=await sha256Text(advisorySystemPrompt);") <
  app.indexOf("var advisoryRequestRecord={") &&
  app.indexOf("var userMessageSha256=await sha256Text(advisoryUserMessage);") <
  app.indexOf("var advisoryRequestRecord={");
if(!hashesBeforeRecord) failures.push("Request hashes are not computed before provenance record construction");
if(!buildBeforeCall) failures.push("Request provenance record is not constructed before the synthesis call");

const responseHashAfterCall=
  app.indexOf("var rawBriefOutSha256=await sha256Text(rawBriefOut);") >
  app.indexOf("callClaude_synthesis(advisorySystemPrompt,advisoryUserMessage") &&
  app.indexOf("var briefOutSha256=await sha256Text(briefOut);") >
  app.indexOf("var rawBriefOutSha256=await sha256Text(rawBriefOut);") &&
  app.includes("raw_output_sha256:rawBriefOutSha256") &&
  app.includes("output_sha256:briefOutSha256") &&
  app.includes('status:"success"');
if(!responseHashAfterCall) failures.push("Advisory response hash/status are not finalized after synthesis");

if(!app.includes('status:"failed"')||!app.includes("error:e&&e.message?e.message:String(e)")){
  failures.push("Advisory failed response is not preserved in provenance");
}

if(failures.length){
  console.error("Advisory request provenance verification failed:");
  for(const failure of failures) console.error("- "+failure);
  process.exit(1);
}

console.log("Advisory request provenance verification passed.");
