import fs from "node:fs";

const app=fs.readFileSync("App_FINAL.jsx","utf8");
const failures=[];

const required=[
  'schema:"phdss.advisory-request.v3"',
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

if(failures.length){
  console.error("Advisory request provenance verification failed:");
  for(const failure of failures) console.error("- "+failure);
  process.exit(1);
}

console.log("Advisory request provenance verification passed.");
