import assert from "node:assert/strict";
import { DIRECTORS } from "../src/registry.js";
import { directorBriefSystem } from "../src/prompt-builders.js";

const lived=DIRECTORS.find(d=>d.id==="lived");
const systems=DIRECTORS.find(d=>d.id==="systems");
const instructions={
  lived:"LIVED-INSTRUCTION-CONTENT",
  systems:"SYSTEMS-INSTRUCTION-CONTENT"
};

const livedPrompt=directorBriefSystem(lived,[],false,false,[],{
  decisionSignal:"",
  orgContext:"",
  constraints:[],
  evidenceLinks:[]
},instructions);

const systemsPrompt=directorBriefSystem(systems,[],false,false,[],{
  decisionSignal:"",
  orgContext:"",
  constraints:[],
  evidenceLinks:[]
},instructions);

assert.match(livedPrompt,/\*\*Participation & Representation Status\*\*/);
assert.match(livedPrompt,/model-generated analytical representation/i);
assert.match(livedPrompt,/human-supplied lived-experience evidence/i);
assert.match(livedPrompt,/actual participation in the current decision process is established by the supplied record/i);
assert.match(livedPrompt,/Keep negative claims scoped to the supplied record/i);
assert.match(livedPrompt,/Do not convert missing evidence into a claim that participation did not occur/i);
assert.ok(
  livedPrompt.indexOf("LIVED-INSTRUCTION-CONTENT") <
  livedPrompt.indexOf("**Participation & Representation Status**"),
  "Lived instruction content should precede the Advisory participation structure"
);
assert.doesNotMatch(systemsPrompt,/Participation & Representation Status/);

console.log("Advisory Lived Experience participation structure verification passed.");
