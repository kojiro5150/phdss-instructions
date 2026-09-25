import assert from "node:assert/strict";
import fs from "node:fs";

import { DIRECTORS } from "../src/registry.js";
import { RUNTIME_CONTRACT, LEDGER_SCHEMA } from "../src/constants.js";
import { buildCoverageNote } from "../src/coverage.js";
import {
  buildEmbeddedDocs,
  buildSessionEvidence,
  buildWebNote,
  ctxBlocks,
  buildCoveragePreamble,
  OUTPUT_CALIBRATION_RULE,
  directorSystem,
  metaSystem,
  surfaceMapperSystem,
  realityAnchorSystem,
  stressSystem,
  chairSystem,
  chairDialogueSystem,
  epistemicAuditorSystem,
  adversarialProbeSystem,
  directorBriefSystem,
  lensComparatorSystem,
  comparatorJsonSystem,
} from "../src/prompt-builders.js";
import {
  promptBuilderExpected,
  promptBuilderFixture,
} from "./fixtures/prompt-builder-equivalence.js";

function fnv1a(str){
  let h=0x811c9dc5;
  for(let i=0;i<str.length;i++){
    h^=str.charCodeAt(i);
    h=Math.imul(h,0x01000193)>>>0;
  }
  return h.toString(16).padStart(8,"0");
}
function fingerprint(label,out){
  return {label,length:out.length,fnv1a:fnv1a(out)};
}

const f=promptBuilderFixture;
const active=f.activeIds.map(id=>DIRECTORS.find(d=>d.id===id));
const instructions=f.instructionValues;
const omittedForCalibration=DIRECTORS.slice(5).map(d=>d.label);

const actual=[
  fingerprint("buildEmbeddedDocs",buildEmbeddedDocs(f.entries)),
  fingerprint("buildSessionEvidence",buildSessionEvidence(f.session)),
  fingerprint("buildWebNoteTrusted",buildWebNote(true,false)),
  fingerprint("buildWebNotePublic",buildWebNote(false,true)),
  fingerprint("ctxBlocks",ctxBlocks(f.ctx)),
  fingerprint("buildCoveragePreambleCore",buildCoveragePreamble("CORE",active,DIRECTORS)),
  fingerprint("outputCalibrationCore",OUTPUT_CALIBRATION_RULE("CORE",5,13,"Systems & Dynamics",omittedForCalibration)),
  fingerprint("directorSystemInstruction",directorSystem(DIRECTORS[0],f.entries,true,f.ctx,false,f.session,"CORE",active,instructions)),
  fingerprint("metaSystem",metaSystem(f.entries,true,false,f.session,"CORE",active,instructions)),
  fingerprint("surfaceMapperSystem",surfaceMapperSystem("CORE",active,instructions)),
  fingerprint("realityAnchorSystem",realityAnchorSystem("CORE",active,instructions)),
  fingerprint("stressSystem",stressSystem(f.entries,true,false,f.session,"CORE",active,instructions)),
  fingerprint("chairSystemPartial",chairSystem(f.entries,true,false,f.session,"CORE",active,["Safety, Quality & Harm"],instructions)),
  fingerprint("chairDialogueSystem",chairDialogueSystem(f.entries,"Decision X","Director Summary","Meta","Stress","Chair")),
  fingerprint("epistemicAuditorSystem",epistemicAuditorSystem("CORE",active,instructions)),
  fingerprint("adversarialProbeSystem",adversarialProbeSystem("CAUTION","CORE",active,instructions)),
  fingerprint("directorBriefSystem",directorBriefSystem(DIRECTORS[0],f.entries,true,false,f.session,f.ctx,instructions)),
  fingerprint("lensComparatorSystem",lensComparatorSystem(DIRECTORS[0],DIRECTORS[1],f.entries,true,false,f.session,f.ctx,instructions)),
  fingerprint("comparatorJsonSystem",comparatorJsonSystem("DR-TEST","Synthetic signal",[{label:"Systems & Dynamics",output:"Output A"}],"CORE",active,"Chair output",instructions,0,4,1)),
];

assert.deepStrictEqual(actual,promptBuilderExpected);
assert.equal(
  buildCoverageNote("FULL",DIRECTORS,DIRECTORS),
  "Full coverage: all 13 directors invoked."
);
assert.match(
  buildCoverageNote("CORE",active,DIRECTORS),
  /^Partial coverage \(CORE mode\): 5 of 13 directors invoked\. Omitted:/
);
assert.equal(RUNTIME_CONTRACT,"2.0-recovery");
assert.equal(LEDGER_SCHEMA,"3.0.0-alpha.1");

const app=fs.readFileSync("App_FINAL.jsx","utf8");
const moved=[
  "buildCoverageNote",
  "buildEmbeddedDocs",
  "buildSessionEvidence",
  "buildWebNote",
  "ctxBlocks",
  "buildCoveragePreamble",
  "OUTPUT_CALIBRATION_RULE",
  "directorSystem",
  "metaSystem",
  "surfaceMapperSystem",
  "realityAnchorSystem",
  "stressSystem",
  "chairSystem",
  "chairDialogueSystem",
  "epistemicAuditorSystem",
  "adversarialProbeSystem",
  "directorBriefSystem",
  "lensComparatorSystem",
  "comparatorJsonSystem",
];
for(const name of moved){
  if(new RegExp("(?:function|var|const)\\s+"+name+"\\b").test(app)){
    throw new Error(name+" remains locally defined in App_FINAL.jsx");
  }
}
assert.ok(app.includes("./src/prompt-builders.js"));
assert.ok(app.includes("./src/coverage.js"));
assert.ok(/async function\s+enforceSynthesisAuthority\s*\(/.test(app));
assert.ok(/async function\s+callGovernedSynthesis\s*\(/.test(app));
assert.ok(/function\s+commitToLedger\s*\(/.test(app));
assert.ok(/function\s+parseDashboard\s*\(/.test(app));

console.log("PHDSS prompt-builder equivalence verification passed.");
console.log("Pre-extraction prompt fingerprints: "+actual.length+" PASS");
console.log("Shared coverage helper: PASS");
console.log("Runtime/ledger constants: PASS");
console.log("Prompt-builder scope guards: PASS");
