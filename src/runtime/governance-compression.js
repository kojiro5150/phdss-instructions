import {
  safeMatch,
  extractBulletLines,
  extractSection,
  dedupItems,
} from "../parsers.js";
import {
  SYNTHESIS_VERDICT_FIELDS,
  isValidDirectorBriefText,
  isValidSynthesisBriefText,
} from "../governance-record-contract.js";
import {
  authorityBoundaryPrompt,
  assessAuthorityBoundary,
} from "../authority-contract.js";
import { apiCall as defaultApiCall } from "./anthropic-client.js";

export function compressionSystem() {
  return "You are the Governance Brief Extractor for a Public Health Decision Stewardship Board.\n\nYou receive the full output of a single Director and compress it into a structured Governance Brief JSON object. This JSON serves two consumers: the synthesis pipeline (which reads the technical fields) and a board-readable Governance Record display (which reads the governance_record fields). Populate both fully from the same source output — do not treat either as optional.\n\nRULES — TECHNICAL FIELDS:\n1. Extract, do not paraphrase, any named legal/regulatory/statutory blockers verbatim in regulatory_blockers.\n2. signal must exactly match the Director's Recommendation Signal (PROCEED / CAUTION / HALT). If the output contains a failure error, use FAILED.\n3. confidence must match the Director's stated or implied confidence level (HIGH / MEDIUM / LOW).\n4. core_judgment must stand alone.\n5. overflow_flags must capture any finding too nuanced to compress.\n6. prerequisites are non-negotiable conditions that must be met before the decision is defensible.\n\nRULES — GOVERNANCE RECORD FIELDS:\n8. key_discovery: the single most important finding from this Director, in plain language. 1-2 sentences.\n9. primary_tension: the core trade-off or conflict this domain surfaces, framed as 'X versus Y'. One sentence.\n10. signal_rationale: why this Director landed on its signal, in plain language. 1-2 sentences.\n11. room_should_discuss: 3-5 questions the board should actually discuss.\n12. most_likely_to_benefit: 1-4 short phrases naming who benefits if this domain's concerns are heeded.\n13. most_exposed_to_failure: 1-4 short phrases naming who bears the cost if this domain's concerns are ignored.\n14. non_negotiable_conditions: source-grounded conditions in plain language.\n15. governance_implication: the single takeaway sentence for the decision as a whole.\n16. Do not invent content. Empty source fields must stay empty.\n\nReturn ONLY valid JSON in this exact shape:\n{\"director\":\"\",\"signal\":\"\",\"confidence\":\"\",\"core_judgment\":\"\",\"critical_risks\":[],\"assumptions\":[],\"prerequisites\":[],\"view_change_triggers\":[],\"coverage_limit\":\"\",\"regulatory_blockers\":[],\"overflow_flags\":[],\"governance_record\":{\"key_discovery\":\"\",\"primary_tension\":\"\",\"signal_rationale\":\"\",\"room_should_discuss\":[],\"most_likely_to_benefit\":[],\"most_exposed_to_failure\":[],\"non_negotiable_conditions\":[],\"governance_implication\":\"\"}}\n\nNo preamble, no commentary, no markdown fences.";
}

export function executiveDiscovery(text) {
  if (!text) return "";
  var kd=safeMatch(text,/\*\*Key Discovery:?\*\*\s*([\s\S]*?)(?=\n\s*\n|\n\*\*[A-Za-z]|$)/i,1);
  if (kd) return kd.trim();
  var exec=safeMatch(text,/##\s+EXECUTIVE LAYER\s*\n+([\s\S]*?)(?=\n---|\n##\s+|\n\*\*[A-Za-z]|$)/i,1);
  if (exec) return exec.replace(/\*\*[^*]+\*\*:?\s*/g,"").trim().split(/\n{2,}/)[0].trim();
  return (text||"").replace(/^#+[^\n]*\n+/,"").trim().split(/\n{2,}/)[0].substring(0,700).trim();
}

export function stripJsonFenceText(text) {
  return (text||"").replace(/^\x60{3}json\s*/i,"").replace(/^\x60{3}\s*/,"").replace(/\x60{3}\s*$/,"").trim();
}

export function deterministicDirectorBrief(directorLabel, fullOutput, reason) {
  var sigMatch=(fullOutput||"").match(/\*\*Recommendation Signal\*\*:?[^A-Z]*(PROCEED|CAUTION|HALT)/i);
  var sig=sigMatch?sigMatch[1].toUpperCase():"CAUTION";
  var confidence=safeMatch(fullOutput,/(?:Confidence|Overall Confidence)\s*:?\s*\*{0,2}(HIGH|MEDIUM|LOW)\*{0,2}/i,1)||"LOW";
  var conditions=dedupItems(extractBulletLines(fullOutput,"Non-Negotiable Conditions").concat(extractBulletLines(fullOutput,"Prerequisites")).concat(extractBulletLines(fullOutput,"Non-Negotiable Safety Conditions"))).slice(0,8);
  var risks=dedupItems(extractBulletLines(fullOutput,"Credible Harm Scenarios").concat(extractBulletLines(fullOutput,"Likely Failure Modes")).concat(extractBulletLines(fullOutput,"Unintended Consequence Risks"))).slice(0,8);
  var assumptions=dedupItems(extractBulletLines(fullOutput,"Assumptions Used (Explicit)").concat(extractBulletLines(fullOutput,"Key Assumptions"))).slice(0,8);
  var key=executiveDiscovery(fullOutput);
  var tension=extractSection(fullOutput,"Primary Tension")||"";
  var rationale=safeMatch(fullOutput,/\*\*Recommendation Signal\*\*:?[^A-Z]*(?:PROCEED|CAUTION|HALT)[^\n]*[—-]\s*([^\n]+)/i,1)||"";
  return JSON.stringify({
    director:directorLabel,signal:sig,confidence:String(confidence).toUpperCase(),core_judgment:key||"See full Director analysis.",
    critical_risks:risks,assumptions:assumptions,prerequisites:conditions,view_change_triggers:extractBulletLines(fullOutput,"View Change Triggers").slice(0,6),
    coverage_limit:extractSection(fullOutput,"Coverage Limitations")||extractSection(fullOutput,"Coverage Limit")||"",
    regulatory_blockers:extractBulletLines(fullOutput,"Regulatory Blockers").slice(0,8),
    overflow_flags:["DETERMINISTIC_FALLBACK"+(reason?": "+reason:"")],
    governance_record:{key_discovery:key||"See full Director analysis.",primary_tension:tension,signal_rationale:rationale,room_should_discuss:extractBulletLines(fullOutput,"What the Room Should Discuss").slice(0,5),most_likely_to_benefit:extractBulletLines(fullOutput,"Most Likely to Benefit").slice(0,4),most_exposed_to_failure:extractBulletLines(fullOutput,"Most Exposed to Failure").slice(0,4),non_negotiable_conditions:conditions.slice(0,8),governance_implication:extractSection(fullOutput,"Governance Implication")||""}
  });
}

function apiCallFor(runtime) {
  return runtime && runtime.apiCallImpl ? runtime.apiCallImpl : defaultApiCall;
}

export async function compressDirectorOutput(directorLabel, fullOutput, runtime) {
  if (/^\[Director failed:/i.test((fullOutput||"").trim())) {
    var failedBrief=JSON.stringify({director:directorLabel,signal:"FAILED",confidence:"LOW",core_judgment:"Director failed to complete. Full error: "+fullOutput,critical_risks:[],assumptions:[],prerequisites:[],view_change_triggers:[],coverage_limit:"Director did not complete.",regulatory_blockers:[],overflow_flags:["DIRECTOR_FAILED"],governance_record:{key_discovery:"Director did not complete.",primary_tension:"",signal_rationale:"",room_should_discuss:[],most_likely_to_benefit:[],most_exposed_to_failure:[],non_negotiable_conditions:[],governance_implication:""}});
    if(!isValidDirectorBriefText(failedBrief)) throw new Error("invalid failed Director Governance Brief schema");
    return failedBrief;
  }
  var lastError="";
  for (var attempt=0;attempt<2;attempt++) {
    try {
      var suffix=attempt===0?"":"\n\nYour previous extraction attempt was unusable. Return the complete JSON object with every governance_record field present. Do not truncate it.";
      var raw=await apiCallFor(runtime)(compressionSystem(),"Director: "+directorLabel+"\n\nFull Director Output:\n"+fullOutput+suffix,false);
      var txt=stripJsonFenceText(raw.text);
      if(!isValidDirectorBriefText(txt)) throw new Error("invalid Director Governance Brief schema");
      return txt;
    } catch(e) { lastError=e.message||String(e); }
  }
  var fallbackBrief=deterministicDirectorBrief(directorLabel,fullOutput,lastError);
  if(!isValidDirectorBriefText(fallbackBrief)) throw new Error("invalid deterministic Director Governance Brief schema");
  return fallbackBrief;
}

export function synthesisLayerForModule(moduleLabel) {
  var map={
    "Decision Surface Map":"surface_map",
    "Epistemic Confidence Audit":"epistemic_audit",
    "Cross-Domain Tension Analysis":"cross_domain_tension_analysis",
    "Reality Anchor":"reality_anchor",
    "Adversarial Probe":"adversarial_probe",
    "Decision Stress Test":"stress_test",
    "Chair Decision":"chair",
    "Governance Comparator":"comparator"
  };
  return map[moduleLabel]||"chair";
}

export function synthesisBriefSystem(moduleLabel) {
  var verdictLabel=SYNTHESIS_VERDICT_FIELDS[moduleLabel]||"Verdict";
  return "You are the Governance Brief Extractor for a Public Health Decision Stewardship Board.\n\nYou receive the full output of the "+moduleLabel+" synthesis module and compress it into a structured Governance Brief JSON object for board-readable display. This is a board-readable extraction only — it does not feed the synthesis pipeline.\n\nRULES:\n1. verdict_label must be exactly '"+verdictLabel+"'.\n2. verdict must be the literal value of that field from the source output. Do not reinterpret it.\n3. key_discovery: the single most important finding, in plain language, 1-2 sentences.\n4. primary_tension: the core trade-off or conflict, framed as 'X versus Y'. Empty string if none.\n5. signal_rationale: why the module landed on its verdict, 1-2 sentences.\n6. room_should_discuss: 3-5 board questions grounded only in the source.\n7. most_likely_to_benefit: 1-4 short phrases; empty if not applicable.\n8. most_exposed_to_failure: 1-4 short phrases; empty if not applicable.\n9. non_negotiable_conditions: source-grounded conditions; empty if none.\n10. governance_implication: one source-grounded takeaway sentence.\n11. Do not invent content.\n\nReturn ONLY valid JSON in this exact shape:\n{\"module\":\""+moduleLabel+"\",\"verdict_label\":\""+verdictLabel+"\",\"verdict\":\"\",\"key_discovery\":\"\",\"primary_tension\":\"\",\"signal_rationale\":\"\",\"room_should_discuss\":[],\"most_likely_to_benefit\":[],\"most_exposed_to_failure\":[],\"non_negotiable_conditions\":[],\"governance_implication\":\"\"}\n\nNo preamble, commentary, or markdown fences."+authorityBoundaryPrompt(synthesisLayerForModule(moduleLabel));
}

export function deterministicSynthesisBrief(moduleLabel,fullOutput,reason) {
  var verdictLabel=SYNTHESIS_VERDICT_FIELDS[moduleLabel]||"Verdict",verdict="";
  if(verdictLabel==="Dominant Signal") verdict=safeMatch(fullOutput,/\*\*Dominant Signal\*\*[^A-Z\n]*\n?\s*\[?(?:PRELIMINARY[^—\n]*—\s*)?(PROCEED|CAUTION|HALT|MIXED)/i,1)||"";
  else if(verdictLabel==="Epistemic Health Score") verdict=safeMatch(fullOutput,/\*\*Epistemic Health Score\*\*:?\s*(STRONG|ADEQUATE|WEAK|COMPROMISED)/i,1)||"";
  else if(verdictLabel==="Integration Signal") verdict=safeMatch(fullOutput,/\*\*Integration Signal\*\*:?\s*\*{0,2}(HIGH|MEDIUM|LOW)\*{0,2}/i,1)||"";
  else if(verdictLabel==="Operational Confidence") verdict=safeMatch(fullOutput,/\*\*Operational Confidence\*\*:?\s*\*{0,2}(HIGH|MEDIUM|LOW)\*{0,2}/i,1)||"";
  else if(verdictLabel==="Probe Verdict") verdict=safeMatch(fullOutput,/\*\*Probe Verdict\*\*:?\s*(BOARD REASONING SOUND|SIGNIFICANT GAPS|CONCLUSION CHALLENGED)/i,1)||"";
  else if(verdictLabel==="Fragility Score") verdict=safeMatch(fullOutput,/\*\*Fragility Score\*\*:?\s*([0-9]+(?:\.[0-9]+)?\s*\/\s*10)/i,1)||"";
  else if(verdictLabel==="Decision Brief Status") verdict=safeMatch(fullOutput,/\*\*Decision Brief Status\*\*:?\s*\*{0,2}([^\n]+)/i,1)||"";
  return JSON.stringify({module:moduleLabel,verdict_label:verdictLabel,verdict:String(verdict).replace(/\*\*/g,"").trim(),key_discovery:executiveDiscovery(fullOutput)||"See Technical Analysis.",primary_tension:extractSection(fullOutput,"Primary Tension")||"",signal_rationale:"",room_should_discuss:extractBulletLines(fullOutput,"What the Room Should Discuss").slice(0,5),most_likely_to_benefit:extractBulletLines(fullOutput,"Most Likely to Benefit").slice(0,4),most_exposed_to_failure:extractBulletLines(fullOutput,"Most Exposed to Failure").slice(0,4),non_negotiable_conditions:extractBulletLines(fullOutput,"Non-Negotiable Conditions").slice(0,8),governance_implication:extractSection(fullOutput,"Governance Implication")||"",_fallback_reason:reason||""});
}

export async function compressSynthesisOutput(moduleLabel,fullOutput,runtime) {
  if(!fullOutput||fullOutput.length<10) {
    var emptyFallback=deterministicSynthesisBrief(moduleLabel,fullOutput,"module did not produce output");
    if(!isValidSynthesisBriefText(emptyFallback,moduleLabel)) throw new Error("invalid empty synthesis Governance Brief schema");
    return emptyFallback;
  }
  var lastError="";
  for(var attempt=0;attempt<2;attempt++) {
    try {
      var suffix=attempt===0?"":"\n\nYour previous extraction attempt was unusable. Return the complete JSON object exactly as requested.";
      var raw=await apiCallFor(runtime)(synthesisBriefSystem(moduleLabel),"Module: "+moduleLabel+"\n\nFull Module Output:\n"+fullOutput+suffix,false);
      var txt=stripJsonFenceText(raw.text);
      if(!isValidSynthesisBriefText(txt,moduleLabel)) throw new Error("invalid synthesis Governance Brief schema");
      var authorityAssessment=assessAuthorityBoundary(synthesisLayerForModule(moduleLabel),txt);
      if(authorityAssessment.violates) throw new Error("synthesis Governance Brief authority violation: "+authorityAssessment.reason);
      return txt;
    } catch(e) { lastError=e.message||String(e); }
  }
  var fallbackBrief=deterministicSynthesisBrief(moduleLabel,fullOutput,lastError);
  if(!isValidSynthesisBriefText(fallbackBrief,moduleLabel)) throw new Error("invalid deterministic synthesis Governance Brief schema");
  return fallbackBrief;
}

export function formatBriefForSynthesis(briefJson, fallbackFullOutput) {
  try {
    var b = JSON.parse(briefJson);
    var lines = [
      "DIRECTOR: "+b.director,
      "Signal: "+b.signal+" | Confidence: "+b.confidence,
      "Core Judgment: "+b.core_judgment,
    ];
    if (b.critical_risks&&b.critical_risks.length) lines.push("Critical Risks:\n"+b.critical_risks.map(function(r){return "  — "+r;}).join("\n"));
    if (b.assumptions&&b.assumptions.length) lines.push("Key Assumptions:\n"+b.assumptions.map(function(a){return "  — "+a;}).join("\n"));
    if (b.prerequisites&&b.prerequisites.length) lines.push("Prerequisites:\n"+b.prerequisites.map(function(p){return "  — "+p;}).join("\n"));
    if (b.regulatory_blockers&&b.regulatory_blockers.length) lines.push("⚠ Regulatory Blockers:\n"+b.regulatory_blockers.map(function(r){return "  — "+r;}).join("\n"));
    if (b.view_change_triggers&&b.view_change_triggers.length) lines.push("View Change Triggers:\n"+b.view_change_triggers.map(function(v){return "  — "+v;}).join("\n"));
    if (b.coverage_limit) lines.push("Coverage Limit: "+b.coverage_limit);
    if (b.overflow_flags&&b.overflow_flags.length) lines.push("⚑ Overflow: "+b.overflow_flags.join("; "));
    return lines.join("\n");
  } catch(e) { return fallbackFullOutput||briefJson; }
}
