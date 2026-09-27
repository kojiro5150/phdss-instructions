import fs from "node:fs";

const app=fs.readFileSync("App_FINAL.jsx","utf8");
const failures=[];

const required=[
  'schema:"phdss.advisory-request.v1"',
  'run_type:"ADVISORY"',
  'advisory_mode:"DIRECTOR_BRIEF"',
  'deployment_commit:(import.meta.env&&import.meta.env.VITE_GIT_COMMIT)||"UNRECORDED"',
  'instruction_commit:INSTRUCTION_COMMIT',
  'model:SYNTHESIS_MODEL',
  'system_prompt:advisorySystemPrompt',
  'user_message:advisoryUserMessage',
  'session_evidence_count:sessionEvidence.length',
  'director_embedded_evidence_count:',
  'downloadJson("PHDSS_"+decisionId+"_"+dir.id+"_request.json",advisoryRequestRecords[dir.id])'
];

for(const phrase of required){
  if(!app.includes(phrase)) failures.push("Missing Advisory request provenance element: "+phrase);
}

const buildBeforeCall=app.indexOf("var advisoryRequestRecord={") < app.indexOf("callClaude_synthesis(advisorySystemPrompt,advisoryUserMessage");
if(!buildBeforeCall) failures.push("Request provenance record is not constructed before the synthesis call");

if(failures.length){
  console.error("Advisory request provenance verification failed:");
  for(const failure of failures) console.error("- "+failure);
  process.exit(1);
}

console.log("Advisory request provenance verification passed.");
