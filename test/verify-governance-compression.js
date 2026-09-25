import assert from "node:assert/strict";
import fs from "node:fs";

import {
  compressionSystem,
  executiveDiscovery,
  stripJsonFenceText,
  deterministicDirectorBrief,
  compressDirectorOutput,
  synthesisLayerForModule,
  synthesisBriefSystem,
  deterministicSynthesisBrief,
  compressSynthesisOutput,
  formatBriefForSynthesis,
} from "../src/runtime/governance-compression.js";
import {
  validDirectorBrief,
  validSurfaceBrief,
} from "./fixtures/governance-record-contracts.js";

const failures=[];
async function check(label,fn){
  try { await fn(); }
  catch(error){ failures.push(label+": "+error.message); }
}

await check("Director compression prompt contract",async function(){
  const prompt=compressionSystem();
  assert.match(prompt,/Governance Brief Extractor/);
  assert.match(prompt,/governance_record/);
  assert.match(prompt,/Return ONLY valid JSON/);
});

await check("Executive discovery behavior",async function(){
  assert.equal(
    executiveDiscovery("**Key Discovery** Synthetic finding\n\n**Next**\nOther"),
    "Synthetic finding"
  );
  assert.equal(
    executiveDiscovery("## EXECUTIVE LAYER\nSynthetic executive finding.\n\nMore detail.\n---\n## DIRECTOR ANALYSIS"),
    "Synthetic executive finding."
  );
});

await check("JSON fence stripping behavior",async function(){
  assert.equal(stripJsonFenceText("~~~"),"~~~");
  assert.equal(stripJsonFenceText("```json\n{\"a\":1}\n```"),"{\"a\":1}");
});

await check("Deterministic Director fallback preserves extraction",async function(){
  const source=[
    "**Key Discovery** Synthetic discovery",
    "",
    "**Primary Tension**",
    "speed versus assurance",
    "",
    "**Recommendation Signal**: CAUTION — unresolved evidence remains.",
    "",
    "Confidence: MEDIUM",
    "",
    "**Non-Negotiable Conditions**",
    "- Validate locally",
    "",
    "**Credible Harm Scenarios**",
    "- Delayed care",
    "",
    "**Key Assumptions**",
    "- Data are complete",
    "",
    "**View Change Triggers**",
    "- New evidence emerges",
    "",
    "**Regulatory Blockers**",
    "- Synthetic blocker",
    "",
    "**Governance Implication**",
    "Keep the unresolved tension visible."
  ].join("\n");
  const brief=JSON.parse(deterministicDirectorBrief("Safety",source,"synthetic failure"));
  assert.equal(brief.director,"Safety");
  assert.equal(brief.signal,"CAUTION");
  assert.equal(brief.confidence,"MEDIUM");
  assert.equal(brief.governance_record.key_discovery,"Synthetic discovery");
  assert.deepStrictEqual(brief.prerequisites,["Validate locally"]);
  assert.match(brief.overflow_flags[0],/^DETERMINISTIC_FALLBACK: synthetic failure$/);
});

await check("Failed Director bypasses model compression",async function(){
  let calls=0;
  const text=await compressDirectorOutput("Safety","[Director failed: timeout]",{
    apiCallImpl:async function(){calls++; throw new Error("must not call");}
  });
  const brief=JSON.parse(text);
  assert.equal(calls,0);
  assert.equal(brief.signal,"FAILED");
  assert.deepStrictEqual(brief.overflow_flags,["DIRECTOR_FAILED"]);
});

await check("Director compression accepts valid first attempt",async function(){
  let calls=0;
  const text=await compressDirectorOutput("Safety","Synthetic completed Director output",{
    apiCallImpl:async function(){calls++; return {text:"```json\n"+JSON.stringify(validDirectorBrief)+"\n```"};}
  });
  assert.equal(calls,1);
  assert.deepStrictEqual(JSON.parse(text),validDirectorBrief);
});

await check("Director compression retries malformed extraction",async function(){
  const userMessages=[];
  let calls=0;
  const text=await compressDirectorOutput("Safety","Synthetic completed Director output",{
    apiCallImpl:async function(system,user){
      userMessages.push(user);
      calls++;
      return {text:calls===1?"{}":JSON.stringify(validDirectorBrief)};
    }
  });
  assert.equal(calls,2);
  assert.deepStrictEqual(JSON.parse(text),validDirectorBrief);
  assert.match(userMessages[1],/previous extraction attempt was unusable/);
});

await check("Director compression falls back after two invalid attempts",async function(){
  let calls=0;
  const text=await compressDirectorOutput("Safety","**Recommendation Signal**: CAUTION — synthetic rationale.",{
    apiCallImpl:async function(){calls++; return {text:"{}"};}
  });
  const brief=JSON.parse(text);
  assert.equal(calls,2);
  assert.equal(brief.signal,"CAUTION");
  assert.match(brief.overflow_flags[0],/^DETERMINISTIC_FALLBACK: invalid Director Governance Brief schema$/);
});

await check("Synthesis layer mapping remains exact",async function(){
  assert.equal(synthesisLayerForModule("Decision Surface Map"),"surface_map");
  assert.equal(synthesisLayerForModule("Epistemic Confidence Audit"),"epistemic_audit");
  assert.equal(synthesisLayerForModule("Cross-Domain Tension Analysis"),"cross_domain_tension_analysis");
  assert.equal(synthesisLayerForModule("Reality Anchor"),"reality_anchor");
  assert.equal(synthesisLayerForModule("Adversarial Probe"),"adversarial_probe");
  assert.equal(synthesisLayerForModule("Decision Stress Test"),"stress_test");
  assert.equal(synthesisLayerForModule("Chair Decision"),"chair");
  assert.equal(synthesisLayerForModule("Governance Comparator"),"comparator");
  assert.equal(synthesisLayerForModule("Unknown"),"chair");
});

await check("Synthesis compression prompt retains authority contract",async function(){
  const prompt=synthesisBriefSystem("Decision Surface Map");
  assert.match(prompt,/verdict_label must be exactly 'Dominant Signal'/);
  assert.match(prompt,/PHDSS AUTHORITY CONTRACT/);
  assert.match(prompt,/landscape legibility/);
});

await check("Synthesis compression accepts valid safe first attempt",async function(){
  let calls=0;
  const text=await compressSynthesisOutput("Decision Surface Map","Synthetic completed synthesis output",{
    apiCallImpl:async function(){calls++; return {text:JSON.stringify(validSurfaceBrief)};}
  });
  assert.equal(calls,1);
  assert.deepStrictEqual(JSON.parse(text),validSurfaceBrief);
});

await check("Authority violation consumes synthesis retry",async function(){
  let calls=0;
  const violating={
    ...validSurfaceBrief,
    governance_implication:"The Board should approve the proposal."
  };
  const text=await compressSynthesisOutput("Decision Surface Map","Synthetic completed synthesis output",{
    apiCallImpl:async function(){
      calls++;
      return {text:JSON.stringify(calls===1?violating:validSurfaceBrief)};
    }
  });
  assert.equal(calls,2);
  assert.deepStrictEqual(JSON.parse(text),validSurfaceBrief);
});

await check("Repeated authority violation reaches deterministic fallback",async function(){
  let calls=0;
  const violating={
    ...validSurfaceBrief,
    governance_implication:"The Board should approve the proposal."
  };
  const source=[
    "**Key Discovery** Synthetic synthesis discovery",
    "",
    "**Dominant Signal**",
    "CAUTION",
    "",
    "**Governance Implication**",
    "Keep the decision space open."
  ].join("\n");
  const text=await compressSynthesisOutput("Decision Surface Map",source,{
    apiCallImpl:async function(){calls++; return {text:JSON.stringify(violating)};}
  });
  const brief=JSON.parse(text);
  assert.equal(calls,2);
  assert.equal(brief.verdict_label,"Dominant Signal");
  assert.equal(brief.verdict,"CAUTION");
  assert.match(brief._fallback_reason,/synthesis Governance Brief authority violation/);
});

await check("Empty synthesis source uses deterministic fallback without API",async function(){
  let calls=0;
  const text=await compressSynthesisOutput("Decision Surface Map","",{
    apiCallImpl:async function(){calls++; throw new Error("must not call");}
  });
  const brief=JSON.parse(text);
  assert.equal(calls,0);
  assert.equal(brief.module,"Decision Surface Map");
  assert.equal(brief._fallback_reason,"module did not produce output");
});

await check("Deterministic synthesis verdict extraction",async function(){
  const text=deterministicSynthesisBrief(
    "Epistemic Confidence Audit",
    "**Key Discovery** Synthetic epistemic finding\n\n**Epistemic Health Score**: WEAK",
    "synthetic reason"
  );
  const brief=JSON.parse(text);
  assert.equal(brief.verdict_label,"Epistemic Health Score");
  assert.equal(brief.verdict,"WEAK");
  assert.equal(brief.key_discovery,"Synthetic epistemic finding");
  assert.equal(brief._fallback_reason,"synthetic reason");
});

await check("Synthesis formatting preserves technical brief shape",async function(){
  const text=formatBriefForSynthesis(JSON.stringify(validDirectorBrief),"fallback");
  assert.match(text,/DIRECTOR: Safety, Quality & Harm/);
  assert.match(text,/Signal: HALT \| Confidence: HIGH/);
  assert.match(text,/Critical Risks:/);
  assert.match(text,/Coverage Limit:/);
  assert.equal(formatBriefForSynthesis("{bad json","fallback"),"fallback");
});

const app=fs.readFileSync("App_FINAL.jsx","utf8");
const removedDefinitions=[
  "compressionSystem",
  "executiveDiscovery",
  "stripJsonFenceText",
  "deterministicDirectorBrief",
  "compressDirectorOutput",
  "synthesisBriefSystem",
  "deterministicSynthesisBrief",
  "compressSynthesisOutput",
  "formatBriefForSynthesis",
  "synthesisLayerForModule",
];
for(const name of removedDefinitions){
  if(new RegExp("(?:async\\s+)?function\\s+"+name+"\\s*\\(").test(app)){
    failures.push(name+" remains locally defined");
  }
}

if(!/async function\s+enforceSynthesisAuthority\s*\(/.test(app)) failures.push("main synthesis authority enforcement moved");
if(!/async function\s+callGovernedSynthesis\s*\(/.test(app)) failures.push("governed synthesis execution moved");
if(!/async function\s+storeSynthesisBrief\s*\(/.test(app)) failures.push("synthesis brief storage moved");
if(!/function\s+commitToLedger\s*\(/.test(app)) failures.push("ledger assembly moved");
if(!/function\s+parseDashboard\s*\(/.test(app)) failures.push("parseDashboard moved");

if(failures.length){
  console.error("PHDSS Governance Brief compression verification failed:");
  failures.forEach(function(failure){console.error("- "+failure);});
  process.exit(1);
}

console.log("PHDSS Governance Brief compression verification passed.");
console.log("Director compression retry/fallback: PASS");
console.log("Synthesis compression retry/fallback: PASS");
console.log("Authority-violation retry behavior: PASS");
console.log("Deterministic fallback extraction: PASS");
console.log("Compression scope guards: PASS");
