// Strip instruction/calibration bleed from synthesis output before export.
// Matches the CALIBRATION NOTE pattern that some instruction files reproduce verbatim.
function stripCalibrationBleed(text) {
  if (!text) return text;
  // Find the earliest occurrence of any known calibration marker and truncate there.
  var markers = [
    "\n[ANALYTICAL CONTEXT — governance instruction only, do not reproduce in output]",
    "\n## CALIBRATION NOTE",
    "\n**CALIBRATION NOTE**",
    "\nCALIBRATION NOTE",
    "\n---\n## CALIBRATION NOTE",
    "\n---\n**CALIBRATION NOTE**",
    "\n---\n\n## CALIBRATION NOTE",
    "\n---\n\n**CALIBRATION NOTE**",
    "\n---\nAnalytical standard:",
    "\n---\n\nAnalytical standard:",
    "\n---\nAnalysis Mode: FULL",
    "\n---\nAnalysis Mode: CORE",
    "\n---\nAnalysis Mode: CHAIR_SPECIFIED",
    "\nAnalytical standard: red-team",
    "\nAnalytical standard: safety-critical",
    "\nAnalytical standard: senior cross-domain",
    "\nThis is a FULL-mode run.",
    "\nThis is a CORE-mode run.",
    "\nThis is a CHAIR_SPECIFIED-mode run.",
    "\nApply full analytical depth",
    "\nCOVERAGE: Full Board active",
    "\nCOVERAGE: Core directors",
    "\nAnalysis Mode: FULL coverage",
    "\nAnalysis Mode: CORE coverage",
    "\n## CALIBRATION NOTE\nAnalysis Mode:",
    "\n## Coverage\nAnalysis Mode:",
    "\nCoverage Mode:",
  ];
  var cutAt = -1;
  for (var mi = 0; mi < markers.length; mi++) {
    var idx = text.indexOf(markers[mi]);
    if (idx !== -1 && (cutAt === -1 || idx < cutAt)) cutAt = idx;
  }
  return cutAt !== -1 ? text.slice(0, cutAt).trim() : text.trim();
}


// Fix P1-4: Remove verbatim-duplicated section blocks from Director outputs.
// Some instruction files emit a continuation block with the same heading twice
// (e.g. "**Likely Failure Modes**" in Behaviour, "**Goodhart / Gaming Risks**" in Measurement,
// "**Multi-Hypothesis Frame**" in Sovereignty).
// Strategy: split on heading boundaries, fingerprint each block, drop duplicates.
function deduplicateSections(text) {
  if (!text) return text;
  // Split on **Bold Heading** or ## Heading boundaries.
  // Keep delimiter in the result so we can reconstruct.
  var parts = text.split(/(?=\n\*\*[^*\n]{4,60}\*\*|\n##\s+[A-Za-z])/);
  var seen = {};
  var out = [];
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    // Extract heading text from the start of this part
    var hm = part.match(/^\n(\*\*([^*\n]{4,60})\*\*|##\s+([^\n]{4,60}))/);
    if (!hm) {
      // No heading — always keep (preamble text)
      out.push(part);
      continue;
    }
    var headingText = (hm[2] || hm[3] || "").trim().toLowerCase();
    // Fingerprint: heading + first substantive content line after the heading
    var bodyLines = part.split("\n").slice(2); // skip blank + heading line
    var firstContent = "";
    for (var j = 0; j < bodyLines.length; j++) {
      var bl = bodyLines[j].trim();
      if (bl.length > 5) { firstContent = bl.substring(0, 80).toLowerCase(); break; }
    }
    var fingerprint = headingText + "|||" + firstContent;
    if (seen[fingerprint]) {
      // Duplicate block — drop it
      continue;
    }
    seen[fingerprint] = true;
    out.push(part);
  }
  return out.join("");
}


import { useState, useRef, useEffect } from "react";

// =============================================================================
// API KEY GATE
// =============================================================================

function installApiKeyInterceptor(apiKey) {
  if (window.__phdssApiKeyInterceptorInstalled) return;
  const _originalFetch = window.fetch.bind(window);
  window.fetch = async function(url, options = {}) {
    if (typeof url === "string" && url.startsWith("https://api.anthropic.com/")) {
      const headers = Object.assign({}, options.headers || {}, {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      });
      return _originalFetch(url, Object.assign({}, options, { headers }));
    }
    return _originalFetch(url, options);
  };
  window.__phdssApiKeyInterceptorInstalled = true;
}

function ApiKeyGate({ onUnlock }) {
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { setTimeout(() => inputRef.current && inputRef.current.focus(), 120); }, []);
  async function handleSubmit() {
    const trimmed = key.trim();
    if (!trimmed.startsWith("sk-ant-")) { setError("Key must start with sk-ant-"); setShake(true); setTimeout(()=>setShake(false),500); return; }
    setTesting(true); setError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json","x-api-key":trimmed,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:10,messages:[{role:"user",content:"hi"}]}),
      });
      const data = await res.json();
      if (data.error) { setError(data.error.message||"Invalid API key."); setShake(true); setTimeout(()=>setShake(false),500); }
      else { installApiKeyInterceptor(trimmed); onUnlock(); }
    } catch(e) { setError("Could not reach Anthropic API."); setShake(true); setTimeout(()=>setShake(false),500); }
    setTesting(false);
  }
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#060E1C 0%,#0D1A2E 50%,#071224 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif",padding:24}}>
      <style>{`@keyframes gateIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}} @keyframes shake{0%,100%{transform:translateX(0)}18%{transform:translateX(-8px)}36%{transform:translateX(8px)}54%{transform:translateX(-5px)}72%{transform:translateX(5px)}} @keyframes spinGate{to{transform:rotate(360deg)}}`}</style>
      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:440,animation:"gateIn 0.5s cubic-bezier(0.16,1,0.3,1) both"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:40}}>
          <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#0EA5E9,#0369A1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"#FFFFFF",boxShadow:"0 0 24px rgba(14,165,233,0.35)"}}>P</div>
          <div><div style={{fontSize:18,fontWeight:800,color:"#F0F9FF"}}>PHDSS</div><div style={{fontSize:10,color:"#38BDF8",letterSpacing:2.5,textTransform:"uppercase",fontWeight:600}}>Public Health Decision Stewardship</div></div>
        </div>
        <div style={{background:"rgba(15,23,42,0.85)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:20,padding:"32px 36px",backdropFilter:"blur(20px)",animation:shake?"shake 0.45s ease":"none"}}>
          <div style={{marginBottom:28}}><div style={{fontSize:16,fontWeight:700,color:"#E2F1FF",marginBottom:8}}>Enter your Anthropic API key</div><div style={{fontSize:12,color:"#64748B",lineHeight:1.65}}>Your key is used only for direct API calls from this browser session. Never stored or transmitted elsewhere.</div></div>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:600,color:"#7DD3FC",marginBottom:7}}>API KEY</div>
            <div style={{position:"relative"}}>
              <input ref={inputRef} type={show?"text":"password"} value={key} onChange={e=>{setKey(e.target.value);setError("");}} onKeyDown={e=>{if(e.key==="Enter")handleSubmit();}} placeholder="sk-ant-api03-..." spellCheck={false} autoComplete="off" style={{width:"100%",background:"rgba(14,165,233,0.06)",border:"1px solid "+(error?"rgba(239,68,68,0.5)":"rgba(56,189,248,0.2)"),borderRadius:10,padding:"11px 44px 11px 14px",color:"#E2F1FF",fontSize:13,fontFamily:"monospace",outline:"none",boxSizing:"border-box"}}/>
              <button onClick={()=>setShow(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#4B5563",fontSize:13}}>{show?"🙈":"👁"}</button>
            </div>
            {error&&<div style={{marginTop:8,fontSize:11,color:"#F87171"}}>⚠ {error}</div>}
          </div>
          <button onClick={handleSubmit} disabled={testing||!key.trim()} style={{width:"100%",padding:"12px 0",borderRadius:10,border:"none",fontSize:13,fontWeight:700,cursor:testing||!key.trim()?"not-allowed":"pointer",background:testing||!key.trim()?"rgba(14,165,233,0.15)":"linear-gradient(135deg,#0EA5E9,#0369A1)",color:testing||!key.trim()?"#334155":"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {testing?(<><span style={{display:"inline-block",width:13,height:13,border:"2px solid rgba(14,165,233,0.3)",borderTopColor:"#0EA5E9",borderRadius:"50%",animation:"spinGate 0.7s linear infinite"}}/>Verifying...</>):"Unlock PHDSS →"}
          </button>
          <div style={{marginTop:22,paddingTop:18,borderTop:"1px solid rgba(56,189,248,0.1)",fontSize:10,color:"#334155",lineHeight:1.7}}>
            <span style={{color:"#38BDF8",fontWeight:600}}>Need a key?</span>{" "}<a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" style={{color:"#38BDF8",textDecoration:"underline"}}>console.anthropic.com</a>{" "}→ API Keys → Create Key.
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:20,fontSize:10,color:"#1E3A4A",letterSpacing:1,fontWeight:600,textTransform:"uppercase"}}>Governance In Confidence · Australian Public Health Context · All values AUD</div>
      </div>
    </div>
  );
}




// --- GITHUB INSTRUCTION FILE FETCH LAYER -------------------------------------
const GITHUB_BASE = "https://cdn.jsdelivr.net/gh/kojiro5150/phdss-instructions@main/";


const INSTRUCTION_FILES = {
  // Directors
  systems:        "systems.md",
  economics:      "economics.md",
  behaviour:      "behaviour.md",
  policy:         "policy.md",
  equity:         "equity.md",
  lived:          "lived.md",
  digital:        "digital.md",
  ethics:         "ethics.md",
  sovereignty:    "sovereignty.md",
  safety:         "safety.md",
  physics:        "physics.md",
  measurement:    "measurement.md",
  innovation:     "innovation.md",
  // Synthesis
  surfacemap:     "surfacemap.md",
  epistemic:      "epistemic.md",
  meta:           "meta.md",
  reality:        "reality.md",
  probe:          "probe.md",
  stress:         "stress.md",
  chair:          "chair.md",
  comparator:     "comparator.md",
};


async function fetchInstructionFile(key) {
  var url = GITHUB_BASE + INSTRUCTION_FILES[key];
  try {
    var res = await fetch(url);
    if (!res.ok) return null;
    var text = await res.text();
    return text && text.trim() ? text.trim() : null;
  } catch(e) { return null; }
}


async function loadAllInstructions(onProgress) {
  var keys = Object.keys(INSTRUCTION_FILES);
  var loaded = {};
  var failed = [];
  await Promise.all(keys.map(async function(key) {
    var content = await fetchInstructionFile(key);
    if (content) { loaded[key] = content; }
    else { failed.push(key); }
    if (onProgress) onProgress(Object.keys(loaded).length + failed.length, keys.length);
  }));
  return { loaded, failed };
}


// --- HELPERS ------------------------------------------------------------------
function makeDecisionId() {
  var d = new Date();
  var pad = function(n) { return String(n).padStart(2,"0"); };
  var y=d.getFullYear(), m=pad(d.getMonth()+1), day=pad(d.getDate());
  var hh=pad(d.getHours()), mm=pad(d.getMinutes()), ss=pad(d.getSeconds());
  var rand;
  try { var a=new Uint8Array(3); crypto.getRandomValues(a); rand=[].map.call(a,function(b){return b.toString(16).padStart(2,"0");}).join(""); }
  catch(e) { rand=Math.random().toString(16).slice(2,8).padEnd(6,"0"); }
  return "DR-"+y+m+day+"-"+hh+mm+ss+"-"+rand;
}


function safeMatch(text, re, idx) {
  if (!text) return null;
  var m = text.match(re);
  return (m && m[idx]) ? m[idx] : null;
}


function extractFirstJsonObject(text) {
  if (!text) return null;
  var fenced = text.match(/```json\s*([\s\S]*?)\s*```/i);
  var candidate = fenced ? fenced[1].trim() : text.trim();
  var first = candidate.indexOf("{"), last = candidate.lastIndexOf("}");
  if (first===-1||last===-1||last<=first) return null;
  try { return JSON.parse(candidate.slice(first,last+1)); } catch(e) { return null; }
}


function exportAsText(filename, content) {
  // FIX 4: always use hyphenated decisionId in filename — strip non-alphanumeric except hyphens/underscores
  var safeFilename = filename.replace(/[^\w\-_.]/g, "_");
  var blob = new Blob([content], {type:"text/markdown;charset=utf-8"});
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a"); a.href=url; a.download=safeFilename;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}


function downloadJson(filename, dataObj) {
  var blob = new Blob([JSON.stringify(dataObj,null,2)], {type:"application/json;charset=utf-8"});
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a"); a.href=url; a.download=filename;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}


function govHeader(decisionId, title, decision, decisionSignal, orgContext) {
  var now = new Date().toLocaleString("en-AU",{hour12:true});
  var lines = [
    "===================================================================",
    "  PHDSS - PUBLIC HEALTH DECISION STEWARDSHIP SYSTEM",
    "  "+title,
    "===================================================================",
    "  Document ID:    "+decisionId,
    "  Generated:      "+now+" AEST",
    "  Classification: GOVERNANCE IN CONFIDENCE",
    "  Currency:       Australian Dollars (AUD)",
    "-------------------------------------------------------------------",
    "  Decision:       "+(decision||"(not specified)"),
  ];
  if (decisionSignal) lines.push("  Signal:         "+decisionSignal);
  if (orgContext) lines.push("  Context:        "+orgContext);
  lines.push("===================================================================","");
  return lines.join("\n");
}


function exportDirector(dir, output, decisionId, decision, decisionSignal, orgContext) {
  var hdr = govHeader(decisionId,"DIRECTOR ANALYSIS - "+dir.label.toUpperCase(),decision,decisionSignal,orgContext);
  var body = "DIRECTOR:  "+dir.label+"\nDOMAIN:    "+dir.desc+"\n\n"+deduplicateSections(stripCalibrationBleed(output||"(no output yet)"));
  var ftr = "\n\n-------------------------------------------------------------------\nPHDSS - "+dir.label+" Director - "+decisionId+"\nAI-generated. Requires human expert review before governance use.\n";
  exportAsText("PHDSS_"+decisionId+"_"+dir.id+".md", hdr+body+ftr);
}


function exportPanel(role, content, decisionId, decision, decisionSignal, orgContext) {
  var hdr = govHeader(decisionId, role.toUpperCase(), decision, decisionSignal, orgContext);
  var ftr = "\n\n-------------------------------------------------------------------\nPHDSS - "+role+" - "+decisionId+"\nAI-generated. Currency: AUD. Requires human expert review.\n";
  // Fix P1-2: Strip META-AUTHOR heading that leaks architecture layer into governance exports.
  // Matches "# META-AUTHOR Integration Analysis\n\n" at start of content.
  var cleaned = (content||"(no output)").replace(/^#\s+META-AUTHOR[^\n]*\n+/i, "");
  exportAsText("PHDSS_"+decisionId+"_"+role.replace(/[\s/]+/g,"_")+".md", hdr+stripCalibrationBleed(cleaned)+ftr);
}



function exportFullDashboard(d, decision, decisionId, decisionSignal, orgContext, comparator, stressTestResult) {
  var hdr = govHeader(decisionId,"TRANSPARENCY DASHBOARD - FULL EXPORT",decision,decisionSignal,orgContext);
  var stressRan = stressTestResult ? stressTestResult.run : d.stress_test_ran;
  var stressReason = stressTestResult ? stressTestResult.reason : d.stress_test_reason;
  var rows = [
    "GOVERNANCE SCORECARD","--------------------",
    "  Analysis Mode:          "+d.analysisMode,
    "  Stress Test:            "+(stressRan?"TRIGGERED — "+(stressReason||"triggered"):"SKIPPED — "+(stressReason||"threshold not met")),
    "  Coverage Ratio:         "+d.coverageRatio,
    "  Coverage Note:          "+d.coverageNote,
    "  Governance Level:       "+d.governanceLevel,
    "  Active Dir. Fidelity:   "+d.coverageScore+"%  ("+d.covered+"/"+d.activeDirectorCount+" active domains completed)",
    "  Traceability Score:     "+d.traceabilityScore+"%",
    "  Fragility Score:        "+(d.fragScore!=="-"?d.fragScore+"/10":stressRan?"Not extracted from Stress Test output":"N/A (Stress Test not run)"),
    "  Conflicts Detected:     "+d.conflictCount,
    "  Assumptions Exposed:    "+d.assumptionCount+(d.assumptions.length>0?"\n"+d.assumptions.map(function(a,i){return "    "+(i+1)+". "+a.replace(/^\d+\.\s*/,"");}).join("\n"):""),
    "  Integration Signal:     "+d.integrationSignal+(d.integrationRationale?" — "+d.integrationRationale:""),
    "  Chair Recommendation:   "+d.chairRec,
  ];
  if (d.aiIntegrityScore!==null && d.aiIntegrityScore!==undefined) rows.push("  AI Integrity Score:     "+d.aiIntegrityScore+"% (composite: Epistemic health 60% + Adversarial Probe 40%)");
  var aiModeNote = (d.analysisMode!=="FULL")
    ? " Score is structurally depressed on partial runs ("+d.activeDirectorCount+"/13 directors) — compare against FULL mode baseline, not an absolute threshold."
    : "";
  rows.push("  AI Integrity Note:      "+( d.aiIntegrityScore!==null ? (d.aiIntegrityScore>=70?"Adequate analytical confidence":d.aiIntegrityScore>=40?"Moderate uncertainty — review epistemic gaps":"High uncertainty — analytical limitations likely reflect coverage or evidence gaps")+aiModeNote : "Not calculated" ));
  rows.push("","ACTIVE DIRECTORS","----------------");
  d.signals.forEach(function(s) { rows.push("  "+s.label.padEnd(34)+" "+s.signal); });
  if (d.omittedDirectors && d.omittedDirectors.length) {
    rows.push("","OMITTED DIRECTORS","------------------");
    d.omittedDirectors.forEach(function(name) { rows.push("  "+name+" (not included in this run)"); });
  }
  rows.push("","CROSS-DOMAIN CONFLICTS","----------------------");
  (d.conflicts.length ? d.conflicts : ["None detected"]).forEach(function(c,i) { rows.push("  "+(i+1)+". "+c); });
  rows.push("","HIDDEN ASSUMPTIONS","------------------");
  (d.assumptions.length ? d.assumptions : ["None detected"]).forEach(function(a,i) { rows.push("  "+(i+1)+". "+a); });
  rows.push("","CHAIR CONDITIONS","----------------");
  (d.conditions.length ? d.conditions : ["None specified"]).forEach(function(c,i) { rows.push("  "+(i+1)+". "+c); });
  rows.push("","===================================================================","  PHDSS Transparency Dashboard - "+decisionId,"  AI-generated governance analysis. Currency: AUD.","  Generated: "+d.timestamp);
  exportAsText("PHDSS_"+decisionId+"_Transparency_Dashboard.md", hdr+rows.join("\n"));
}


// --- CONSTANTS ----------------------------------------------------------------
var TRUSTED_DOMAINS = [
  "aihw.gov.au","health.gov.au","tga.gov.au","ahpra.gov.au","legislation.gov.au",
  "austlii.edu.au","digitalhealth.gov.au","nhmrc.gov.au","safetyandquality.gov.au",
  "servicesaustralia.gov.au","who.int","cochrane.org","nice.org.uk","cdc.gov",
  "pubmed.ncbi.nlm.nih.gov","bmj.com","thelancet.com","nejm.org","hl7.org","healthit.gov"
];


var DIRECTORS = [
  { id:"systems",        label:"Systems & Dynamics",                 icon:"*", color:"#06B6D4", desc:"Complex system behaviour, feedback loops, unintended consequences" },
  { id:"economics",      label:"Health Economics",                   icon:"$", color:"#FFB347", desc:"Cost-effectiveness, resource allocation, economic equity, incentive alignment" },
  { id:"behaviour",      label:"Behaviour & Implementation",         icon:"@", color:"#FF6B9D", desc:"Adoption engineering, behavioural failure modes, implementation realism, COM-B diagnosis" },
  { id:"policy",         label:"Policy & Power",                     icon:"#", color:"#A78BFA", desc:"Political feasibility, stakeholder power, regulatory landscape, coalition dynamics" },
  { id:"equity",         label:"Equity & Human Rights",              icon:"=", color:"#34D399", desc:"Global health equity, human rights and dignity - rights-based governance" },
  { id:"lived",          label:"Lived Experience",                   icon:"o", color:"#F87171", desc:"Lived and living expertise, community legitimacy, trust and agency" },
  { id:"digital",        label:"Digital & AI Governance",            icon:"~", color:"#60A5FA", desc:"AI safety, data governance, SaMD classification, algorithmic bias" },
  { id:"ethics",         label:"Ethics & Influence Risk",            icon:"^", color:"#FBBF24", desc:"Ethical influence, integrity, manipulation risk, foreign interference" },
  { id:"sovereignty",    label:"Sovereignty & Containment",          icon:"+", color:"#F472B6", desc:"Decision integrity, affective containment, reflective capacity" },
  { id:"safety",         label:"Safety, Quality & Harm",             icon:"!", color:"#EF4444", desc:"Clinical safety, harm pathways, regulatory obligations, quality systems" },
  { id:"physics",        label:"Capacity & Constraints",             icon:"%", color:"#A3E635", desc:"Physics-based constraints, entropy, scaling limits, finite capacity" },
  { id:"measurement",    label:"Measurement & Evidence Integrity",   icon:"&", color:"#C084FC", desc:"Theory of change, evaluation design, indicator governance, Goodhart risks" },
  { id:"innovation",     label:"Innovation & Improvement",           icon:"/", color:"#22D3EE", desc:"Improvement pathways, learning architecture, responsible experimentation" },
];


// --- FIX 1: ADAPTIVE FIFTH DIRECTOR SELECTION --------------------------------
// AI/SaMD/algorithm procurement carve-out: when decision text contains explicit AI
// or clinical decision support keywords, Digital & AI Governance always wins as
// adaptive fifth regardless of economics keyword co-occurrence.
var AI_PROCUREMENT_KEYWORDS = [
  "artificial intelligence","machine learning","clinical decision support","samd",
  "software as a medical device","algorithmic","ai-powered","ai powered",
  "ai platform","ai system","ai tool","ai solution","ai governance",
  "ai procurement","ai clinical","deep learning","neural network",
  "predictive model","decision support system","clinical ai"
];


var DIGITAL_KEYWORDS = [
  "ai","artificial intelligence","machine learning","algorithm","automation",
  "automated","software","platform","app","technology","data","model",
  "clinical decision support","analytics","electronic","online","virtual","robot",
  "emr","integration","digital workflow","digital"
];
var POLICY_KEYWORDS = [
  "minister","ministerial","government","legislation","regulation","statutory",
  "compliance","public accountability","parliament","parliamentary",
  "mandated change","policy reform","governance obligation"
];
var ECONOMICS_KEYWORDS = [
  "budget","cost","savings","affordability","efficiency","return on investment",
  "roi","value for money","funding","expenditure","allocation","business case",
  "financial pressure","procurement","investment"
];


function detectAdaptiveFifth(decisionText) {
  var lower = (decisionText||"").toLowerCase();
  // FIX 1: AI procurement carve-out — check for explicit AI/SaMD keywords first.
  // If present, Digital & AI Governance wins regardless of economics co-occurrence.
  var hasAIProcurement = AI_PROCUREMENT_KEYWORDS.some(function(kw){ return lower.indexOf(kw)!==-1; });
  if (hasAIProcurement) return "digital";
  var hasDigital = DIGITAL_KEYWORDS.some(function(kw){ return lower.indexOf(kw)!==-1; });
  var hasEconomics = ECONOMICS_KEYWORDS.some(function(kw){ return lower.indexOf(kw)!==-1; });
  // Original override retained for non-AI digital+economics decisions
  if (hasDigital && hasEconomics) return "economics";
  if (hasDigital) return "digital";
  if (POLICY_KEYWORDS.some(function(kw){ return lower.indexOf(kw)!==-1; })) return "policy";
  if (hasEconomics) return "economics";
  return "behaviour";
}


var ANALYSIS_MODES = ["CORE","FULL","CHAIR_SPECIFIED"];


function resolveCoreDirectors(decisionText) {
  var required = ["systems","safety","equity"];
  var fifth = detectAdaptiveFifth(decisionText);
  var ids = required.concat([fifth]);
  return DIRECTORS.filter(function(d){ return ids.indexOf(d.id)!==-1; });
}


var MANDATORY_DIRECTOR_IDS = ["systems","safety"];


function resolveChairDirectors(selectedIds) {
  var ids = MANDATORY_DIRECTOR_IDS.slice();
  selectedIds.forEach(function(id){ if(ids.indexOf(id)===-1) ids.push(id); });
  return DIRECTORS.filter(function(d){ return ids.indexOf(d.id)!==-1; });
}


function resolveActiveDirectors(mode, decisionText, chairSelectedIds) {
  if (mode==="FULL") return DIRECTORS.slice();
  if (mode==="CORE") return resolveCoreDirectors(decisionText);
  if (mode==="CHAIR_SPECIFIED") return resolveChairDirectors(chairSelectedIds||[]);
  return DIRECTORS.slice();
}


var STRESS_KEYWORDS = [
  "patient safety","patient harm","clinical","vulnerable","children","aged care",
  "disability","indigenous","mental health","workforce","staff","workforce role",
  "redundan","job","redeployment","clinical workflow","irreversible","difficult to reverse",
  "cannot be undone","permanent","minister","ministerial","media","public confidence",
  "reputational","political","parliament","scrutiny","community","automation","ai system",
  "algorithm","emergency","critical care","surgical","medication","prescrib"
];


function shouldRunStressTest(mode, decisionText, activeDirectorOutputs, surfaceMapOut, epistemicOut, probeVerdict, realityAnchorOut) {
  if (mode === "FULL") return { run: true, reason: "FULL mode — stress test always runs" };
  var lower = (decisionText||"").toLowerCase();
  for (var i = 0; i < STRESS_KEYWORDS.length; i++) {
    if (lower.indexOf(STRESS_KEYWORDS[i]) !== -1) {
      return { run: true, reason: "Decision text contains stress trigger: '" + STRESS_KEYWORDS[i] + "'" };
    }
  }
  var haltCount = 0, cautionCount = 0;
  (activeDirectorOutputs||[]).forEach(function(r) {
    var sig = "";
    var patterns = [
      /\*\*Recommendation Signal\*\*:?\s*\[?\*{0,2}(PROCEED|CAUTION|HALT)\*{0,2}\]?/i,
      /Recommendation Signal[^:]*:?\s*\[?\*{0,2}(PROCEED|CAUTION|HALT)\*{0,2}\]?/i,
      /\*\*(PROCEED|CAUTION|HALT)\*\*/
    ];
    for (var pi = 0; pi < patterns.length; pi++) {
      var m = (r.output||"").match(patterns[pi]);
      if (m) { sig = (m[1]||"").toUpperCase(); break; }
    }
    if (sig === "HALT") haltCount++;
    if (sig === "CAUTION") cautionCount++;
  });
  if (haltCount >= 1) return { run: true, reason: haltCount + " director(s) signalled HALT" };
  if (cautionCount >= 2) return { run: true, reason: cautionCount + " directors signalled CAUTION" };
  if (realityAnchorOut && /capability mismatch|capacity gap|implementation gap|not ready|insufficient capacity/i.test(realityAnchorOut)) {
    return { run: true, reason: "Reality Anchor detected capability mismatch" };
  }
  if (surfaceMapOut && /high tension|highly contested|significant fragility|fragility hotspot/i.test(surfaceMapOut)) {
    return { run: true, reason: "Decision Surface Map detected high tension" };
  }
  if (epistemicOut && /(WEAK|COMPROMISED)/i.test(epistemicOut)) {
    return { run: true, reason: "Epistemic Audit detected major uncertainty" };
  }
  if (probeVerdict === "SIGNIFICANT GAPS" || probeVerdict === "CONCLUSION CHALLENGED") {
    return { run: true, reason: "Adversarial Probe verdict: " + probeVerdict };
  }
  return { run: false, reason: "No stress triggers detected" };
}


function buildCoverageNote(mode, activeDirectors, allDirectors) {
  var active = activeDirectors.map(function(d){return d.label;});
  var omitted = allDirectors.filter(function(d){return active.indexOf(d.label)===-1;}).map(function(d){return d.label;});
  if (mode==="FULL") return "Full coverage: all "+allDirectors.length+" directors invoked.";
  if (mode==="CORE") return "Partial coverage (CORE mode): "+active.length+" of "+allDirectors.length+" directors invoked. Omitted: "+omitted.join(", ")+".";
  if (mode==="CHAIR_SPECIFIED") return "Custom coverage (CHAIR_SPECIFIED): "+active.length+" of "+allDirectors.length+" directors invoked. Omitted: "+(omitted.length?omitted.join(", "):"none")+".";
  return "";
}


var SYNTHESIS_ROLES = [
  { id:"surfacemap",  label:"Decision Surface Map",      icon:"⊕", color:"#0891B2" },
  { id:"epistemic",   label:"Epistemic Confidence Audit",icon:"E", color:"#DC2626" },
  { id:"meta",        label:"Cross-Domain Tension Analysis", icon:"M", color:"#A78BFA" },
  { id:"reality",     label:"Reality Anchor",            icon:"A", color:"#0369A1" },
  { id:"probe",       label:"Adversarial Bias Probe",    icon:"P", color:"#7C3AED" },
  { id:"stress",      label:"Decision Stress Test",      icon:"S", color:"#F87171" },
  { id:"chair",       label:"Chair Recommendation",      icon:"C", color:"#0369A1" },
  { id:"comparator",  label:"Governance Comparator",     icon:"G", color:"#64748B" },
];


var ALL_ROLES = DIRECTORS.concat(SYNTHESIS_ROLES);


var STAGE_META = [
  {id:"directors",  short:"Directors"},
  {id:"surfacemap", short:"Surface Map"},
  {id:"epistemic",  short:"Epistemic"},
  {id:"meta",       short:"META"},
  {id:"reality",    short:"Reality"},
  {id:"probe",      short:"Probe"},
  {id:"stress",     short:"Stress"},
  {id:"chair",      short:"Chair"},
];


var SUGGESTED_PUSHBACKS = [
  "The cost of disparate systems, clinical risk, and workforce dissatisfaction make me want to still proceed - what conditions would make that defensible?",
  "The equity concerns are serious but we have mitigation plans - does that change your recommendation?",
  "What if we phased the rollout over 3 years instead of the proposed timeline?",
  "The Equity Director said HALT but Economics said PROCEED - help me resolve that tension.",
  "What additional evidence would shift your recommendation to PROCEED?",
  "Who bears the most risk if we proceed, and what safeguards are non-negotiable?",
];


function makeDocEntry() {
  return { id: Math.random().toString(36).slice(2), label:"", url:"", content:"", status:"empty" };
}
function initDocs() {
  var d = {};
  ALL_ROLES.forEach(function(r){ d[r.id]=[makeDocEntry()]; });
  return d;
}


// --- API ----------------------------------------------------------------------
async function fetchGoogleDoc(url) {
  if (!url||!url.trim()) return null;
  var m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!m) return null;
  try {
    var res = await fetch("https://docs.google.com/document/d/"+m[1]+"/export?format=txt");
    if (!res.ok) return null;
    return await res.text();
  } catch(e){ return null; }
}


async function apiCall(systemPrompt, userMessage, useWebSearch) {
  var body = { model:"claude-sonnet-4-20250514", max_tokens:16000, system:systemPrompt, messages:[{role:"user", content:userMessage}] };
  if (useWebSearch) body.tools = [{type:"web_search_20250305", name:"web_search"}];
  var response = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)
  });
  var data = await response.json();
  if (data.error) throw new Error(data.error.message||JSON.stringify(data.error));
  if (!data.content) throw new Error("No content. Keys: "+Object.keys(data).join(","));
  return { text: data.content.map(function(b){return b.text||"";}).join("\n").trim(), stopReason: data.stop_reason||"end_turn" };
}


async function callClaude_synthesis(systemPrompt, userMessage, autoContinue, useWebSearch) {
  // Retry up to 2 times on transient errors (overload, timeout, network)
  // with exponential backoff: 3s then 8s delay between attempts.
  var lastError;
  for (var attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      var delay = attempt === 1 ? 3000 : 8000;
      await new Promise(function(r){setTimeout(r, delay);});
    }
    try {
      var result = await apiCall(systemPrompt, userMessage, !!useWebSearch);
      var passCount = 0;
      while (result.stopReason==="max_tokens" && autoContinue && passCount < 2) {
        passCount++;
        var contBody = {
          model:"claude-sonnet-4-20250514", max_tokens:16000,
          system: systemPrompt,
          messages: [
            {role:"user",      content: userMessage},
            {role:"assistant", content: result.text},
            {role:"user",      content: "Continue your analysis from exactly where you stopped. Do not restate or summarise what you have already written — continue the document directly."}
          ]
        };
        if (useWebSearch) contBody.tools = [{type:"web_search_20250305", name:"web_search"}];
        var contResponse = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(contBody)
        });
        var contRaw = await contResponse.text();
        if (!contRaw||!contRaw.trim().startsWith("{")) throw new Error("Continuation non-JSON: "+contRaw.substring(0,200));
        var contData = JSON.parse(contRaw);
        if (contData.error) throw new Error(contData.error.message||JSON.stringify(contData.error));
        var contText = (contData.content||[]).map(function(b){return b.text||"";}).join("\n").trim();
        result = { text: result.text+"\n"+contText, stopReason: contData.stop_reason||"end_turn" };
      }
      if (result.stopReason==="max_tokens") return result.text+"\n\n⚠ PARTIAL - token limit reached after "+passCount+" continuation pass"+(passCount===1?"":"es")+".";
      return result.text;
    } catch(e) {
      lastError = e;
      // Don't retry on definitive errors (bad request, auth failure)
      var msg = (e&&e.message)||"";
      if (msg.indexOf("invalid_api_key")!==-1 || msg.indexOf("400")!==-1) throw e;
      // Retry on overload, timeout, network errors
    }
  }
  throw lastError;
}


async function callClaudeChat(systemPrompt, messages) {
  var body = {model:"claude-sonnet-4-20250514", max_tokens:2000, system:systemPrompt, messages:messages};
  var response = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)
  });
  var rawText = await response.text();
  if (!rawText||!rawText.trim().startsWith("{")) throw new Error("Non-JSON (HTTP "+response.status+"): "+rawText.substring(0,200));
  var data = JSON.parse(rawText);
  if (data.error) throw new Error(data.error.message||JSON.stringify(data.error));
  if (!data.content) throw new Error("No content in response");
  return data.content.map(function(b){return b.text||"";}).join("\n").trim();
}


// --- PROMPT BUILDERS ----------------------------------------------------------
function buildEmbeddedDocs(entries) {
  var loaded = entries.filter(function(e){ return e.content&&e.content.trim(); });
  if (!loaded.length) return "";
  var sections = loaded.map(function(e,i){
    return "--- DOCUMENT "+(i+1)+": "+((e.label&&e.label.trim())||"Document "+(i+1)).toUpperCase()+" ---\n"+e.content.trim()+"\n--- END DOCUMENT "+(i+1)+" ---";
  }).join("\n\n");
  return "\n\n========== EMBEDDED REFERENCE LIBRARY ("+loaded.length+" document"+(loaded.length>1?"s":"")+" ) ==========\n"+sections+"\n========== END REFERENCE LIBRARY ==========";
}


function buildSessionEvidence(entries) {
  var loaded = (entries||[]).filter(function(e){ return e.content&&e.content.trim(); });
  if (!loaded.length) return "";
  var sections = loaded.map(function(e,i){
    var lbl = (e.label&&e.label.trim()) || (e.type==="paste"?"Pasted Evidence "+(i+1):"Document "+(i+1));
    return "--- SESSION EVIDENCE "+(i+1)+": "+lbl.toUpperCase()+" ---\n"+e.content.trim()+"\n--- END SESSION EVIDENCE "+(i+1)+" ---";
  }).join("\n\n");
  return "\n\n========== SESSION EVIDENCE ("+loaded.length+" item"+(loaded.length>1?"s":"")+" — provided by decision-maker for this run) ==========\n"+sections+"\n========== END SESSION EVIDENCE ==========";
}


function buildWebNote(useWeb, publicWeb) {
  if (!useWeb && !publicWeb) return "";
  if (publicWeb) return "\n\nWEB SEARCH: You have full public web access. Search broadly for current, authoritative evidence. Prioritise peer-reviewed, government, and WHO/AIHW sources. Cite every source.";
  return "\n\nWEB SEARCH: Restrict to these trusted domains only: "+TRUSTED_DOMAINS.join(", ")+". Cite every source.";
}


function ctxBlocks(ctx) {
  var dc = ctx||{};
  var out = "";
  if ((dc.decisionSignal||"").trim()) out+="\n\n**Decision Signal**\n"+dc.decisionSignal.trim();
  if ((dc.orgContext||"").trim()) out+="\n\n**Operational Context**\n"+dc.orgContext.trim();
  if ((dc.constraints||[]).length) out+="\n\n**Constraints**\n"+(dc.constraints||[]).map(function(c){return "- "+c;}).join("\n");
  if ((dc.evidenceLinks||[]).length) out+="\n\n**Evidence Links**\n"+(dc.evidenceLinks||[]).map(function(l){return "- "+l;}).join("\n");
  return out;
}


function buildCoveragePreamble(analysisMode, activeDirectors, allDirectors) {
  var note = buildCoverageNote(analysisMode, activeDirectors, allDirectors);
  var omitted = allDirectors.filter(function(d){
    return !activeDirectors.some(function(a){return a.id===d.id;});
  }).map(function(d){return d.label;});
  var lines = [
    "\n\n========== COVERAGE CONTEXT ==========",
    "Analysis Mode: "+analysisMode,
    "Active Directors ("+activeDirectors.length+"/"+allDirectors.length+"): "+activeDirectors.map(function(d){return d.label;}).join(", "),
  ];
  if (omitted.length) lines.push("Omitted Directors: "+omitted.join(", "));
  lines.push("Coverage Note: "+note);
  if (analysisMode!=="FULL") {
    lines.push("IMPORTANT: Coverage is partial or custom. You MUST explicitly acknowledge which director domains are absent from this analysis and state any limitations this creates for your synthesis.");
  }
  lines.push("========================================");
  return lines.join("\n");
}


var FRAGILITY_RULE = "\n\n**Fragility Signals** (Mandatory)\nSurface where assumptions fail under fatigue, constrained capacity, low trust, political pressure, or uneven power. Conclude with exactly one of:\nA) Fragility signals identified: [list]\nOR\nB) No fragility signals detected in this domain under current assumptions.\n\n";


var EXEC_SUMMARY_RULE = "\n\n## EXECUTIVE LAYER (mandatory — placed FIRST, 3–5 sentences maximum)\nWrite for a time-pressured executive who may read nothing else. Cover: (1) your domain's headline verdict on this decision in plain language, (2) the single most critical concern or opportunity, (3) your recommendation signal and the one condition or caveat that most shapes it. No jargon. No hedging. Stand-alone clarity.\n\n---\n\n## DIRECTOR ANALYSIS\n(Your full domain analysis follows here, structured per your REQUIRED OUTPUT FORMAT below. Each section: 2–4 sentences of substance unless depth is warranted by genuine complexity. Prioritise precision over completeness.)\n\n";


function OUTPUT_CALIBRATION_RULE(analysisMode, activeCount, totalCount, directorLabel, omittedLabels) {
  var depthNote = analysisMode === "FULL"
    ? "This is a FULL-mode run. Apply full analytical depth across all sections."
    : analysisMode === "CORE"
    ? "This is a CORE-mode run ("+activeCount+"/"+totalCount+" directors). Write concisely — your output will be synthesised with fewer domains than a full Board. Weight depth toward your highest-impact sections."
    : "This is a CHAIR SPECIFIED run ("+activeCount+"/"+totalCount+" directors selected). Apply depth proportionate to the decision stakes and your domain's centrality to this question.";
  var coverageNote = omittedLabels && omittedLabels.length > 0
    ? "\n\nCOVERAGE AWARENESS: You are "+directorLabel+", one of "+activeCount+" active directors. The following domains are NOT represented in this run: "+omittedLabels.join(", ")+". Where your analysis touches on these absent domains, briefly flag the gap rather than attempting to substitute for them."
    : "\n\nCOVERAGE: Full Board active (all "+totalCount+" directors). Confine your analysis to your own domain mandate.";
  return "\n\n---\n\n## TECHNICAL APPENDIX (optional)\nInclude only if there is genuinely technical detail (regulatory specifics, model parameters, legislative citations, statistical caveats) that a governance reader does not need in the main analysis but that should be on record. Omit this section entirely if no such detail exists.\n\n---\n\n[ANALYTICAL CONTEXT — governance instruction only, do not reproduce in output]\n"+depthNote+coverageNote+"\n\n";
}


var SIGNAL_RULE = "**Recommendation Signal**: [PROCEED / CAUTION / HALT] - one sentence domain-grounded rationale.";
var CONTEXT_TRANSLATION = "\n\n**Context Translation**\nTranslate your domain analysis into implications appropriate for the scale and capability of the organisation described. If no organisation context is provided, state: 'No organisational context provided; analysis defaults to mid-sized public sector health organisation.'";


// --- SYSTEM PROMPT BUILDERS — now read from GitHub instruction files ----------
// Each builder appends dynamic runtime context (coverage, web, docs, session evidence)
// to the base instruction file content fetched from GitHub.


function directorSystem(director, entries, useWeb, ctx, publicWeb, sessionEntries, analysisMode, activeDirectors, instructions) {
  var activeCount = (activeDirectors || []).length || 14;
  var totalCount = DIRECTORS.length;
  var omittedLabels = DIRECTORS
    .filter(function(d) { return !(activeDirectors || DIRECTORS).some(function(a) { return a.id === d.id; }); })
    .map(function(d) { return d.label; });


  // Use fetched instruction file if available, otherwise fall back to inline mandate
  var instructionContent = instructions && instructions[director.id];
  var base = instructionContent
    ? instructionContent + "\n\n"
    : "You are the "+director.label+" Director on a Public Health Decision Stewardship Board (Australian public health context). All financial figures must be in AUD.\n\n";


  // Append dynamic runtime context
  base += buildEmbeddedDocs(entries) + buildSessionEvidence(sessionEntries) + buildWebNote(useWeb, publicWeb) + ctxBlocks(ctx);


  // If using instruction file, only append calibration + signal rule (mandate already in file)
  if (instructionContent) {
    return base + CONTEXT_TRANSLATION + FRAGILITY_RULE + OUTPUT_CALIBRATION_RULE(analysisMode||"FULL", activeCount, totalCount, director.label, omittedLabels) + SIGNAL_RULE;
  }


  // Fallback inline mandates (unchanged from v8)
  var mandate = {
    systems:      "MANDATE: Make system structure visible so the Board can see beyond symptoms, understand why problems persist, anticipate unintended consequences.\n\nREQUIRED OUTPUT FORMAT:\n\n**System Definition & Boundaries**\n\n**Key Structural Elements**\n\n**Dominant Feedback Loops**\n\n**Relevant System Archetypes**\n\n**Structural Leverage Zones**\n\n**Unintended Consequence Risks**",
    economics:    "MANDATE: Ensure decisions are economically coherent, sustainable, and incentive-aligned.\n\nREQUIRED OUTPUT FORMAT:\n\n**Economic Frame**\n\n**Dominant Costs & Resource Constraints**\n\n**Benefits and Where They Accrue**\n\n**Cost Shifting & Hidden Costs**\n\n**Incentive Distortions / Gaming Risks**\n\n**Uncertainty & Sensitivity**\n\n**Minimum Data Needed to Raise Confidence**",
    behaviour:    "MANDATE: Ensure decisions survive real-world behavioural contact.\n\nREQUIRED OUTPUT FORMAT:\n\n**Target Behaviours at the Point of Work**\n\n**COM-B Diagnosis**\n\n**Likely Failure Modes**\n\n**High-Leverage Mechanism Categories Required**\n\n**Implementation Viability Conditions**\n\n**Early Warning & Measurement**\n\n**Ethics & Equity Flags**",
    policy:       "MANDATE: Ensure decisions are politically and institutionally feasible.\n\nREQUIRED OUTPUT FORMAT:\n\n**Policy Context & Jurisdiction**\n\n**Stakeholder & Power Map**\n\n**Policy Alignment & Coherence**\n\n**Political & Institutional Incentives**\n\n**Coalition & Trust Risks**\n\n**Strategic Policy Trade-offs**\n\n**Conditions for Policy Viability**",
    equity:       "MANDATE: Ensure Board decisions are rights-aligned, equity-protective, dignity-preserving, and accountable.\n\nREQUIRED OUTPUT FORMAT:\n\n**Rights Engaged & Duty Bearers**\n\n**Minimum Core Obligations & Red Lines**\n\n**Equity & Non-Discrimination Risk**\n\n**Participation, Transparency & Accountability Conditions**\n\n**Digital / AI Rights Risks**\n\n**Legitimacy Assessment**: [Legitimacy likely / Legitimacy uncertain / Legitimacy unlikely]",
    lived:        "MANDATE: Ensure Board decisions reflect how systems are actually experienced.\n\nREQUIRED OUTPUT FORMAT:\n\n**Lived Experience Framing**\n\n**Human Impact & Burden**\n\n**Trust, Agency & Legitimacy Assessment**\n\n**Trauma & Recovery Risks**\n\n**Diversity & Inclusion Considerations**\n\n**Non-Negotiable Lived Experience Conditions**",
    digital:      "MANDATE: Ensure digital health or AI proposals are technically credible, interoperable, and governed to safety-critical standards.\n\nREQUIRED OUTPUT FORMAT:\n\n**Use-Case Classification & Safety Criticality**\n\n**Data & Integration Reality Check**\n\n**Evidence & Validation Adequacy**\n\n**Model Risk & Failure Modes**\n\n**Governance & Assurance Conditions**\n\n**Vendor / Lock-in / Sustainability Risks**\n\n**Confidence & Minimum Missing Inputs**",
    ethics:       "MANDATE: Ensure Board decisions do not enable manipulation, coercion, or covert behavioural control.\n\nREQUIRED OUTPUT FORMAT:\n\n**Influence & Information Environment Assessment**\n\n**Ethical Legitimacy Check**\n\n**Manipulation / Interference Risks**\n\n**Defensive & Governance Controls**\n\n**Non-Negotiable Ethical Guardrails**\n\n**Early-Warning & Monitoring Signals**",
    sovereignty:  "MANDATE: Ensure Board decisions are made under conditions of psychological containment.\n\nREQUIRED OUTPUT FORMAT:\n\n**Affective Context Assessment**\n\n**Risks to Reflective Capacity**\n\n**Affect-Meaning-Action Separation**\n\n**Multi-Hypothesis Frame**\n\n**Containment & Decision Hygiene Conditions**\n\n**Early Warning Signals**",
    safety:       "MANDATE: Protect patients, staff, and systems from preventable harm.\n\nREQUIRED OUTPUT FORMAT:\n\n**Safety & Regulatory Obligations**\n\n**Credible Harm Scenarios**\n\n**Risk Severity & Likelihood**\n\n**Residual Risk**\n\n**Non-Negotiable Safety Conditions**",
    physics:      "MANDATE: Ground Board deliberations in first principles — physical, informational, energetic, or network constraints.\n\nREQUIRED OUTPUT FORMAT:\n\n**First-Principles Framing**\n\n**Hard Constraints Identified**\n\n**Entropy / Friction Sources**\n\n**Scaling Implications**\n\n**Non-Negotiable Warnings**",
    measurement:  "MANDATE: Ensure Board decisions are informed by a defensible Theory of Change.\n\nREQUIRED OUTPUT FORMAT:\n\n**Theory of Change (Draft)**\n\n**Decision-Grade Evidence Requirements**\n\n**Minimal Indicator Set (5-10 max)**\n\n**Data Feasibility & Quality Risks**\n\n**Evaluation Design Options (1-3)**\n\n**Goodhart / Gaming Risks**\n\n**Confidence & Key Uncertainties**",
    innovation:   "MANDATE: Ensure governance does not become structurally biased toward preserving the status quo.\n\nREQUIRED OUTPUT FORMAT:\n\n**Status Quo Baseline Examination**\n\n**Improvement Opportunity Assessment**\n\n**Learning Architecture Potential**\n\n**Responsible Experimentation Boundaries**\n\n**Capability Building Implications**\n\n**Innovation Risk vs Inaction Risk**\n\n**Confidence & Minimum Missing Inputs**",
  };
  return base + EXEC_SUMMARY_RULE + (mandate[director.id]||"Analyse the decision from your domain perspective.") + CONTEXT_TRANSLATION + FRAGILITY_RULE + OUTPUT_CALIBRATION_RULE(analysisMode||"FULL", activeCount, totalCount, director.label, omittedLabels) + SIGNAL_RULE;
}


function compressionSystem() {
  return "You are the Governance Brief Extractor for a Public Health Decision Stewardship Board.\n\nYou receive the full output of a single Director and compress it into a structured Governance Brief JSON object.\n\nRULES:\n1. Extract, do not paraphrase, any named legal/regulatory/statutory blockers verbatim in regulatory_blockers.\n2. signal must exactly match the Director's Recommendation Signal (PROCEED / CAUTION / HALT). If the output contains a failure error, use FAILED.\n3. confidence must match the Director's stated or implied confidence level (HIGH / MEDIUM / LOW).\n4. core_judgment must stand alone.\n5. overflow_flags must capture any finding too nuanced to compress.\n6. prerequisites are non-negotiable conditions that must be met before the decision is defensible.\n7. Do not invent content. If a field has no content, use empty array [] or empty string \"\".\n\nReturn ONLY valid JSON. No preamble, no commentary, no markdown fences.";
}


async function compressDirectorOutput(directorLabel, fullOutput) {
  if (/^\[Director failed:/i.test((fullOutput||"").trim())) {
    return JSON.stringify({
      director: directorLabel, signal: "FAILED", confidence: "LOW",
      core_judgment: "Director failed to complete. Full error: "+fullOutput,
      critical_risks: [], assumptions: [], prerequisites: [],
      view_change_triggers: [], coverage_limit: "Director did not complete.",
      regulatory_blockers: [], overflow_flags: []
    });
  }
  try {
    var raw = await apiCall(compressionSystem(), "Director: "+directorLabel+"\n\nFull Director Output:\n"+fullOutput, false);
    var txt = raw.text.replace(/^```json\s*/i,"").replace(/^```\s*/,"").replace(/```\s*$/,"").trim();
    JSON.parse(txt);
    return txt;
  } catch(e) {
    var sigMatch = (fullOutput||"").match(/\*\*Recommendation Signal\*\*:?[^A-Z]*(PROCEED|CAUTION|HALT)/i);
    var sig = sigMatch ? sigMatch[1].toUpperCase() : "CAUTION";
    return JSON.stringify({
      director: directorLabel, signal: sig, confidence: "LOW",
      core_judgment: "Compression failed. Full output preserved. First 300 chars: "+(fullOutput||"").substring(0,300),
      critical_risks: [], assumptions: [], prerequisites: [],
      view_change_triggers: [], coverage_limit: "Compression unavailable — see full Director record.",
      regulatory_blockers: [], overflow_flags: ["COMPRESSION_FAILED"]
    });
  }
}


function formatBriefForSynthesis(briefJson, fallbackFullOutput) {
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


// --- SYNTHESIS SYSTEM PROMPTS — GitHub instruction files with runtime context ---
function metaSystem(entries, useWeb, publicWeb, sessionEntries, analysisMode, activeDirectors, instructions) {
  var cov = buildCoveragePreamble(analysisMode, activeDirectors, DIRECTORS);
  var base = (instructions && instructions.meta)
    ? instructions.meta + "\n\n"
    : "You are the META-AUTHOR of a Public Health Decision Stewardship Board. All financial figures should be in AUD. Synthesise all Director outputs into an integrated reasoning map.\n\nRespond in exactly this format:\n**Cross-Domain Conflicts**\n\n**Hidden Assumptions**\n\n**Reasoning Gaps**\n\n**Coverage Limitations**\nExplicitly name any absent director domains and state what governance blind spots this creates.\n\n**Unresolved Tensions**\n\n**Integration Signal**: [HIGH / MEDIUM / LOW] coherence - one sentence rationale.\n\n";
  return base + buildEmbeddedDocs(entries) + buildSessionEvidence(sessionEntries) + buildWebNote(useWeb, publicWeb) + cov;
}


function surfaceMapperSystem(analysisMode, activeDirectors, instructions) {
  var cov = buildCoveragePreamble(analysisMode, activeDirectors, DIRECTORS);
  var activeCount = (activeDirectors||[]).length;
  var isFullMode = analysisMode==="FULL";
  var signalInstructions = isFullMode
    ? "\n\nSIGNAL ANALYSIS INSTRUCTIONS (FULL mode — "+activeCount+" directors):\n1. Tally Recommendation Signals only from directors you have received.\n2. Report exact counts.\n3. Interpret the distribution.\n4. Note whether HALT signals cluster in a single domain type or span diverse domains.\n5. Identify the two or three most governance-consequential director signals."
    : "\n\nSIGNAL ANALYSIS: Tally Recommendation Signals only from directors you have received. Report exact counts. Do not infer or project signals for absent directors.";
  var structure = isFullMode
    ? "\n\nRespond only in this structure:\n\n**Signal Tally**\n\n**Consensus Signals**\n\n**Conflict Zones**\n\n**Trade-off Axes**\n\n**Fragility Hotspots**\n\n**Cross-Domain Convergence**\n\n**Decision-Determinative Signals**\n\n**Coverage Limitations**\n\n**Dominant Signal**\n[PROCEED / CAUTION / HALT / MIXED]\n\n**Landscape Summary**\nThree sentences."
    : "\n\nRespond only in this structure:\n\n**Consensus Signals**\n\n**Conflict Zones**\n\n**Trade-off Axes**\n\n**Fragility Hotspots**\n\n**Decision Pressures**\n\n**Coverage Limitations**\n\n**Dominant Signal**\n[PROCEED / CAUTION / HALT / MIXED]\n\n**Landscape Summary**\nTwo sentences.";
  var base = (instructions && instructions.surfacemap)
    ? instructions.surfacemap + "\n\n"
    : "You are the Decision Surface Mapper for a Public Health Decision Stewardship Board.\n\n";
  return base + cov + signalInstructions + structure;
}


function realityAnchorSystem(analysisMode, activeDirectors, instructions) {
  var cov = buildCoveragePreamble(analysisMode, activeDirectors, DIRECTORS);
  var base = (instructions && instructions.reality)
    ? instructions.reality + "\n\n"
    : "You are the Reality Anchor Module for a Public Health Decision Stewardship Board.\n\nPURPOSE: Ensure governance reasoning remains anchored to real operating conditions.\n\nRespond only in this structure:\n\n**Baseline Reality**\n\n**Capability Reality**\n\n**Monitoring & Measurement Reality**\n\n**Reversibility Reality**\n\n**Accountability Reality**\n\n**Falsification Conditions**\n\n**Coverage Limitations**\n\n**Confidence & Minimum Missing Inputs**\n\n**Reality Friction Signals** (Mandatory)\nConclude with exactly one:\nA) Reality friction signals identified: [list]\nOR\nB) No material reality frictions detected under current assumptions.\n\n";
  return base + cov;
}


function stressSystem(entries, useWeb, publicWeb, sessionEntries, analysisMode, activeDirectors, instructions) {
  var cov = buildCoveragePreamble(analysisMode, activeDirectors, DIRECTORS);
  var base = (instructions && instructions.stress)
    ? instructions.stress + "\n\n"
    : "You are the Decision Stress Test, Counterfactuals & Cascades Director on a Public Health Decision Stewardship Board (Australian public health context - all costs in AUD).\n\nRespond only in this structure:\n\n**Decision Under Test**\n\n**Assumptions Used (Explicit)**\n\n**Plausible Failure Cascade (Worst-Case, Stepwise)**\n\n**Second-Order & Delayed Consequences**\n\n**Reversal Test (Risks if the opposite decision is taken)**\n\n**Impact Surface (Who/where/when harms or benefits concentrate)**\n\n**Unknown-Unknown Prompts (Decision-sensitive questions)**\n\n**Coverage Limitations**\n\n**Fragility Signals** (Mandatory)\nConclude with exactly one:\nA) Fragility signals identified: [list]\nOR\nB) No fragility signals detected in this domain under current assumptions.\n\n**Fragility Score**: [1-10] - rationale. (10 = extremely fragile)\n\n";
  return base + buildEmbeddedDocs(entries) + buildSessionEvidence(sessionEntries) + buildWebNote(useWeb, publicWeb) + cov;
}


function chairSystem(entries, useWeb, publicWeb, sessionEntries, analysisMode, activeDirectors, failedDirectorLabels, instructions) {
  var cov = buildCoveragePreamble(analysisMode, activeDirectors, DIRECTORS);
  var partialWarning = (failedDirectorLabels&&failedDirectorLabels.length>0)
    ? "\n\n⚠ PARTIAL EVIDENCE BASE WARNING: The following directors failed to complete and their analyses are absent from your synthesis: "+failedDirectorLabels.join(", ")+". You must explicitly flag in your Coverage Limitations that your recommendation rests on a partial evidence base."
    : "";
  var base = (instructions && instructions.chair)
    ? instructions.chair + "\n\n"
    : "You are the Chair of the Public Health Decision Stewardship Board (Australian context). Integrate all findings into a governance-grade decision frame. All financial references should use AUD.\n\nRespond only in this structure:\n\n## EXECUTIVE LAYER\nWrite 3–5 sentences for a time-pressured Board member who may read nothing else.\n\n---\n\n**Decision Framing**\n\n**Key Trade-offs**\n\n**Decision Conditions**\n\n**Irreducible Uncertainties**\n\n**Coverage Limitations** (2–3 sentences maximum)\n\n**Chair Recommendation**: [PROCEED WITH CONDITIONS / PROCEED WITH CAUTION / CONDITIONAL APPROVAL / PILOT / DEFER / DO NOT PROCEED]\n\nUse CONDITIONAL APPROVAL when the pilot or proposal is sound in principle but requires a bounded verification phase before expenditure is authorised.\n\n**Verification Phase (if CONDITIONAL APPROVAL selected)**\n\n**Pilot Pathway (if PILOT selected)**\n\n**Reasoning Transparency**\nOne paragraph.\n\n";
  return base + buildEmbeddedDocs(entries) + buildSessionEvidence(sessionEntries) + buildWebNote(useWeb, publicWeb) + cov + partialWarning;
}


function chairDialogueSystem(entries, decision, directorSummary, metaOut, stressOut, chairOut) {
  return "You are the Chair of the Public Health Decision Stewardship Board, now in a governance dialogue with the decision-maker following your initial recommendation.\n\nDECISION UNDER REVIEW:\n"+decision+"\n\nDIRECTOR ANALYSES:\n"+directorSummary+"\n\nMETA-AUTHOR SYNTHESIS:\n"+metaOut+"\n\nSTRESS TEST OUTPUT:\n"+stressOut+"\n\nYOUR INITIAL CHAIR RECOMMENDATION:\n"+chairOut+buildEmbeddedDocs(entries)+"\n\nRespond as the Chair - with authority, nuance, and governance rigour.";
}


function epistemicAuditorSystem(analysisMode, activeDirectors, instructions) {
  var cov = buildCoveragePreamble(analysisMode, activeDirectors, DIRECTORS);
  var base = (instructions && instructions.epistemic)
    ? instructions.epistemic + "\n\n"
    : "You are the Epistemic Confidence Auditor for a Public Health Decision Stewardship Board.\n\nRespond in exactly this format:\n**Per-Director Confidence Ratings**\nFor each ACTIVE Director: [Director Name] - [HIGH / MEDIUM / LOW / UNCERTAIN] confidence. One sentence.\n\n**Overconfidence Flags**\n\n**Systematic Bias Signals**\n\n**Epistemic Gaps**\n\n**Coverage Impact on Epistemic Quality**\n\n**Epistemic Health Score**: [STRONG / ADEQUATE / WEAK / COMPROMISED]\nOne paragraph.\n\n";
  return base + cov;
}


function adversarialProbeSystem(dominantSignal, analysisMode, activeDirectors, instructions) {
  var cov = buildCoveragePreamble(analysisMode, activeDirectors, DIRECTORS);
  var base = (instructions && instructions.probe)
    ? instructions.probe + "\n\n"
    : "You are the Adversarial Bias Probe for a Public Health Decision Stewardship Board.\n\nRespond in exactly this format:\n**The Strongest Counter-Argument**\n\n**What the Board Missed**\n\n**Whose Perspective Is Absent**\n\n**Where AI Limitation Is Most Visible**\n\n**Coverage-Induced Blind Spots**\n\n**Probe Verdict**: [BOARD REASONING SOUND / SIGNIFICANT GAPS / CONCLUSION CHALLENGED]\nOne paragraph.\n\n";
  return base + cov + "\n\nThe Board's dominant signal is: "+dominantSignal;
}


function directorBriefSystem(director, entries, useWeb, publicWeb, sessionEntries, ctx, instructions) {
  var base = (instructions && instructions[director.id])
    ? instructions[director.id] + "\n\n[ADVISORY MODE — This is an advisory briefing, not a governance decision analysis.]\n\n"
    : "You are the "+director.label+" Director providing an executive briefing for a Public Health advisory request (Australian context, AUD).\n\nThis is an ADVISORY BRIEFING — not a governance decision analysis.\n\n";
  return base + buildEmbeddedDocs(entries) + buildSessionEvidence(sessionEntries) + buildWebNote(useWeb, publicWeb) + ctxBlocks(ctx) + "\n\nProvide a concise, expert briefing structured as:\n\n**Domain Perspective**\n\n**Key Observations**\n\n**Watch Points**\n\n**Domain Confidence**\n[HIGH / MEDIUM / LOW]\n\n**Fragility Signals**\nA) Fragility signals identified: [list]\nOR\nB) No fragility signals detected under current assumptions.\n\nNote: This is an advisory perspective only. For governance-grade decision analysis, run a Governance mode session.";
}


function lensComparatorSystem(directorA, directorB, entries, useWeb, publicWeb, sessionEntries, ctx, instructions) {
  var base = (instructions && instructions.comparator)
    ? instructions.comparator + "\n\n"
    : "You are the Dual Lens Comparator for a Public Health advisory session (Australian context, AUD).\n\n";
  return base + buildEmbeddedDocs(entries) + buildSessionEvidence(sessionEntries) + buildWebNote(useWeb, publicWeb) + ctxBlocks(ctx) + "\n\nRespond in exactly this structure:\n\n**Where the Lenses Agree**\n\n**Where the Lenses Diverge**\n\n**What Each Lens Misses**\n\n**Decision Tensions**\nIdentify 3–6 structural trade-offs.\n\n**Combined Insight**\n\n**Advisory Signal**\nWrite exactly one of: ALIGNED / TENSION / COMPLEMENTARY\n\n**For Escalation**\n\nNote: This is a dual-lens advisory briefing. It does not constitute a governance decision analysis.";
}


function comparatorJsonSystem(decisionId, decisionSignal, directorOutputs, analysisMode, activeDirectors, chairOutput, instructions, proceedCount, cautionCount, haltCount) {
  var bundle = directorOutputs.map(function(d){ return "---\nDIRECTOR: "+d.label+"\n"+d.output+"\n"; }).join("\n");
  var signalBlock = (decisionSignal&&decisionSignal.trim()) ? "\n## Decision Signal\n"+decisionSignal.trim()+"\n" : "";
  var tallyLine = (typeof cautionCount==="number")
    ? "\nSignal Tally (authoritative — use these exact figures in decision_signal_interpretation): "+proceedCount+" PROCEED / "+cautionCount+" CAUTION / "+haltCount+" HALT\n"
    : "";
  var covBlock = "\n## Coverage\nAnalysis Mode: "+analysisMode+tallyLine+"Active Directors: "+activeDirectors.map(function(d){return d.label;}).join(", ")+"\n";
  var chairBlock = chairOutput ? "\n## Chair Governance Position\n"+chairOutput+"\n" : "";
  var base = (instructions && instructions.comparator)
    ? instructions.comparator + "\n\n"
    : "### PHDSS COMPARATOR JSON\n### DECISION_ID: "+decisionId+"\n\nYou are the Governance Comparator. Produce a structured governance record.\n";
  return base + signalBlock + covBlock + chairBlock + "\n## Director Outputs\n" + bundle + "\n\n## Output Format (STRICT)\nReturn ONLY valid JSON. No markdown fences.\n\n{\"decision_id\":\""+decisionId+"\",\"schema_version\":\"2.5.0\",\"analysis_mode\":\""+analysisMode+"\",\"coverage_ratio\":\""+activeDirectors.length+"/"+DIRECTORS.length+"\",\"summary\":{\"one_paragraph\":\"string\",\"dominant_frame\":\"string\",\"decision_signal_interpretation\":\"string\"},\"consensus\":[{\"point\":\"string\",\"why_it_matters\":\"string\",\"supporting_directors\":[\"string\"]}],\"dissensus\":[{\"tension\":\"string\",\"what_would_resolve\":\"string\",\"directors\":[\"string\"]}],\"tradeoffs\":[{\"option_a\":\"string\",\"option_b\":\"string\",\"tradeoff\":\"string\",\"who_pays\":\"string\"}],\"key_risks\":[{\"risk\":\"string\",\"pathway\":\"string\",\"mitigations\":[\"string\"],\"residual_risk\":\"low|medium|high\"}],\"chair_resolution\":{\"recommendation\":\"string\",\"conditions\":[\"string\"],\"irreducible_uncertainties\":[\"string\"],\"kill_switches\":[\"string\"],\"success_metrics\":[\"string\"]},\"next_actions_30_60_90\":{\"days_0_30\":[\"string\"],\"days_31_60\":[\"string\"],\"days_61_90\":[\"string\"]},\"coverage_limitations\":\"string\"}\n\nThe chair_resolution object must reflect the Chair output above. CRITICAL for kill_switches: The kill_switches array must ONLY contain measurable operational triggers from Director early warning indicators and fragility signals. NEVER use Verification Phase forced-choice text or governance pathway descriptions as kill switches. Each kill_switch must follow this format: [indicator] exceeds/falls below [threshold] within [timeframe]. Example correct kill switch: Coordinator clinical duty time exceeds 60 percent within 6 months triggers program suspension. Example wrong (do not use): At the end of the verification window forced-choice options are PROCEED WITH CONDITIONS.";
}


// --- PARSING ------------------------------------------------------------------
function escRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); }


function extractBulletLines(text, heading) {
  if (!text) return [];
  var re = new RegExp("\\*\\*"+escRe(heading)+"\\*\\*[^\\n]*\\n([\\s\\S]*?)(?=\\n\\*\\*[A-Za-z][^*\\n]{2,}(?<!:)\\*\\*\\s*\\n|$)","i");
  var m = text.match(re);
  if (!m) return [];
  return m[1].split("\n").map(function(l){
    var s=l.trim();
    s=s.replace(/^[\s]*(?:[-•]|\*(?!\*)|\d+[.):])[\s]+/,"");
    s=s.replace(/^\*\*([^*]{1,80})\*\*:?\s*/,"$1 - ");
    s=s.replace(/^\*+\s*/,"").trim();
    return s;
  }).filter(function(l){return l.length>5;});
}


function extractSection(text, heading) {
  if (!text) return "";
  var re = new RegExp("\\*\\*"+escRe(heading)+"\\*\\*:?\\s*([^\\n]*)(?:\\n([\\s\\S]*?))?(?=\\n\\*\\*[A-Za-z][^*\\n]{2,}(?<!:)\\*\\*\\s*\\n|$)","i");
  var m = text.match(re);
  if (!m) return "";
  var inline=(m[1]||"").replace(/^\[.*?\]\s*[-]?\s*/,"").trim();
  var block=(m[2]||"").trim();
  return [inline,block].filter(Boolean).join("\n").trim();
}


function findSignal(text, signals) {
  if (!text) return null;
  for (var i=0;i<signals.length;i++){ if(text.indexOf(signals[i])!==-1) return signals[i]; }
  return null;
}


// FIX 2: tightened normItem strips separator variants before comparison
function normItem(s){
  return s
    .replace(/^\d+\.\s*/,"")
    .replace(/\*\*([^*]+)\*\*/g,"$1")
    .replace(/^[-:—]\s*/,"")
    .replace(/\s+[-:—]\s+/g," ")   // collapse " - " and " : " separators
    .replace(/["'""'']/g,"")        // strip quotes
    .trim()
    .toLowerCase();
}


function dedupItems(arr) {
  var seen=[];
  return arr.filter(function(v){
    if(!v) return false;
    var n=normItem(v);
    if(seen.indexOf(n)!==-1) return false;
    seen.push(n); return true;
  });
}


function parseDashboard(decision, dirOutputs, meta, stress, chair, dialogueHistory, totalLoadedDocs, webSearch, epistemic, probe, analysisMode, activeDirectors, omittedDirectors) {
  var active = activeDirectors || DIRECTORS;
  var signals = active.map(function(d){
    var out=dirOutputs[d.id]||"";
    var sig = "PENDING";
    if (out && out.length > 10) {
      if (/^\[Director failed:/i.test(out.trim())) { sig = "FAILED"; }
      else {
        var sigPatterns = [
          /\*\*Recommendation Signal\*\*:?\s*\[?\*{0,2}(PROCEED|CAUTION|HALT|NOT APPLICABLE)\*{0,2}\]?/i,
          /Recommendation Signal[^:]*:?\s*\[?\*{0,2}(PROCEED|CAUTION|HALT|NOT APPLICABLE)\*{0,2}\]?/i,
          /\*\*(PROCEED|CAUTION|HALT)\*\*/i,
        ];
        for (var si=0; si<sigPatterns.length; si++) {
          var sm = out.match(sigPatterns[si]);
          if (sm && sm[1]) { sig = sm[1].toUpperCase(); break; }
        }
      }
    }
    var frags=extractBulletLines(out,"Fragility Signals");
    return { id:d.id, label:d.label, icon:d.icon, color:d.color, signal:sig, fragility:frags };
  });


  var covered=signals.filter(function(s){return s.signal!=="PENDING"&&s.signal!=="FAILED";}).length;
  var failedCount=signals.filter(function(s){return s.signal==="FAILED";}).length;
  var coverageScore=Math.round((covered/active.length)*100);
  var proceedCount=signals.filter(function(s){return s.signal==="PROCEED";}).length;
  var cautionCount=signals.filter(function(s){return s.signal==="CAUTION";}).length;
  var haltCount=signals.filter(function(s){return s.signal==="HALT";}).length;


  var metaText=meta||"", stressText=stress||"", chairText=chair||"", epistemicText=epistemic||"", probeText=probe||"";


  function extractMetaItems(text, heading) {
    if (!text) return [];
    var raw = [];

    // Pass 1: standard bullet-line extraction under **Heading**
    raw = raw.concat(extractBulletLines(text, heading));

    // Pass 2: extractSection prose lines — preserve SOURCED/INFERRED tags.
    // Bold-headed paragraph items (e.g. "**Clinical Safety vs Economic Viability** (sourced): ...")
    // must have their bold prefix stripped BEFORE the length/startsWith filter runs.
    extractSection(text, heading).split("\n").forEach(function(l){
      var s = l.trim();
      s = s.replace(/^\d+\.\s*\*\*(SOURCED|INFERRED)\*\*\*?\*?:?\s*/i, "$1: ");
      s = s.replace(/^\d+\.\s*\*\*([^*]+)\*\*:?\s*/, "$1: ");
      s = s.replace(/^\*\*(SOURCED|INFERRED)\*\*\*?\*?:?\s*/i, "$1: ");
      s = s.replace(/^\*\*([^*]+)\*\*:?\s*/, "$1: ");
      s = s.replace(/^[-•]\s*/, "").trim();
      // Do NOT filter on startsWith("**") here — bold prefixes have already been
      // stripped above. Filtering on remaining "**" would drop valid items.
      if (s.length > 10) raw.push(s);
    });

    // Pass 3: ## heading variant
    var h2re = new RegExp("##\\s+" + escRe(heading) + "[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s+[A-Za-z]|$)", "i");
    var h2m = text.match(h2re);
    if (h2m) {
      h2m[1].split("\n").forEach(function(l){
        var s = l.trim();
        if (!s || s.length < 10) return;
        s = s.replace(/^\d+\.\s*\*\*(SOURCED|INFERRED)\*\*\*?\*?:?\s*/i, "$1: ");
        s = s.replace(/^\d+\.\s*\*\*([^*]{10,})\*\*:?\s*/, "$1: ");
        var titleMatch = s.match(/^\*\*([^*]{10,})\*\*/);
        if (titleMatch) {
          // If the bold title is a generic label (e.g. "Sourced conflict", "Inferred conflict"),
          // use the full line text instead of just the title — otherwise dedup collapses
          // multiple "Sourced conflict" items into one.
          var title = titleMatch[1].trim();
          var GENERIC_LABELS = /^(sourced|inferred|verified|speculative)\s+(conflict|assumption|finding|hypothesis)$/i;
          if (GENERIC_LABELS.test(title) && s.length > title.length + 4) {
            // Use the full line, stripping the bold wrapper
            raw.push(s.replace(/^\*\*[^*]+\*\*\s*[-—:]?\s*/, "").trim() || s);
          } else {
            raw.push(title);
          }
        }
        else if (s.length > 15 && !s.startsWith("#")) {
          s = s.replace(/^[-•\d.]+\s*/, "").replace(/^\*+\s*/, "").trim();
          if (s.length > 10) raw.push(s);
        }
      });
    }

    // Pass 4: numbered paragraph items — META-AUTHOR often writes multi-line numbered entries.
    // e.g. "1. **SOURCED**: Safety vs Counterfactual on X. Long explanation..."
    // Grab the full section block and split on numbered-item boundaries.
    var numRe = new RegExp("\\*\\*" + escRe(heading) + "\\*\\*[^\\n]*\\n([\\s\\S]*?)(?=\\n\\*\\*[A-Za-z]|$)", "i");
    var nm = text.match(numRe);
    if (nm) {
      var block = nm[1];
      var items = block.split(/\n(?=\d+\.\s)/);
      items.forEach(function(item){
        var joined = item.replace(/\n/g, " ").trim();
        joined = joined.replace(/^\d+\.\s*/, "");
        joined = joined.replace(/\*\*(SOURCED|INFERRED)\*\*\*?\*?:?\s*/gi, "$1: ");
        joined = joined.replace(/\*\*([^*]+)\*\*/g, "$1");
        joined = joined.trim();
        if (joined.length > 20) raw.push(joined);
      });
    }

    // Filter items that are purely section-label lines — e.g. "Sourced conflicts:" or
    // "Inferred (reasonable given context):" — these are structural headings, not content.
    // Pattern: short line (under 60 chars) that ends with a colon and contains no sentence.
    var LABEL_ONLY = /^(sourced|inferred|verified|speculative)[^.!?]{0,55}:\s*$/i;
    raw = raw.filter(function(item){ return !LABEL_ONLY.test(item.trim()); });

    return dedupItems(raw).filter(function(c){ return c.length > 10; });
  }


  // Filter framing/preamble sentences from conflict extraction.
  // META-AUTHOR opens conflict sections with framing text that is not itself a conflict.
  // Filter preamble/header lines from conflict extraction.
  // Catches: framing text, section-header lines ending in colon, short lines that are
  // structural labels not analytical content (e.g. "Major analytical conflicts...:").
  var CONFLICT_FRAMING = /^(no\s+sub|sourced\s+find|potential\s+conflict\s+masked|the\s+apparent|all\s+directors|no\s+conflict|no\s+substantial|the\s+director\s+anal|the\s+board|the\s+analysis\s+reveal|major\s+analytical|shared\s+premises|hidden\s+assumptions|sourced\s*[*:$]|inferred\s*[*:$]|sourced\s+assumption|inferred\s+assumption|speculative\s+extension|sourced\s+conflict|inferred\s+conflict|this\s+rare|when\s+directors|directors\s+reach\s+unified|no\s+substantive\s+analytical)/i;
  // Also filter lines that are pure section preambles (under 120 chars, end with colon, no sentence period)
  var PREAMBLE_LINE = /^[^.!?]{10,120}:\s*$/;
  // Extended: catch framing labels used as assumption names in rare-consensus outputs
  // e.g. "Sourced assumption across multiple Directors", "Speculative extension"
  var ASSUMPTION_FRAMING = /^(sourced\s+assumption|inferred\s+assumption|speculative\s+extension|sourced\s+conflict|inferred\s+conflict|speculative\s+assumption|verified\s+assumption|this\s+analysis\s+assumes|collective\s+analysis\s+assumes)/i;
  // Deduplicate extracted items by content fingerprint (first 80 normalised chars).
  // Prevents doubled blocks where Cross-Domain output renders items twice
  // (dash separator + colon separator variants), which PREAMBLE_LINE doesn't catch.
  function dedupExtracted(items) {
    var seen = {};
    return items.filter(function(item) {
      var fp = item.trim().toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,80);
      if (seen[fp]) return false;
      seen[fp] = true;
      return true;
    });
  }
  var conflicts = dedupExtracted(
    extractMetaItems(metaText, "Cross-Domain Conflicts")
      .filter(function(c){ return !CONFLICT_FRAMING.test(c.trim()) && !PREAMBLE_LINE.test(c.trim()); })
  ).slice(0,8);
  var assumptions = dedupExtracted(
    extractMetaItems(metaText, "Hidden Assumptions")
      .filter(function(a){ return !PREAMBLE_LINE.test(a.trim()) && !ASSUMPTION_FRAMING.test(a.trim()); })
  ).slice(0,8);
  // P2.1: post-extraction validation — warn if source has more items than extracted
  (function(){
    var sourcedBlocks=(metaText.match(/\*\*(SOURCED|INFERRED)\*\*/gi)||[]).length;
    if(sourcedBlocks>2&&conflicts.length+assumptions.length<2){
      console.warn("PHDSS extraction: META has "+sourcedBlocks+" SOURCED/INFERRED blocks but only "+(conflicts.length+assumptions.length)+" conflicts+assumptions extracted — possible under-extraction");
    }
  })();
  var gaps=extractBulletLines(metaText,"Reasoning Gaps");
  var tensions=dedupItems(extractBulletLines(metaText,"Unresolved Tensions").concat(
    extractSection(metaText,"Unresolved Tensions").split("\n").filter(function(l){return l.trim();}))
  ).slice(0,5);
  var integrationSignal=safeMatch(metaText,/Integration Signal\*?\*?:?\s*\*{0,2}(HIGH|MEDIUM|LOW)\*{0,2}/i,1)||"-";
  // FIX 5: Extract the rationale that follows the Integration Signal label (up to end of line)
  var integrationRationale=(function(){
    var m=metaText.match(/Integration Signal\*?\*?:?\s*\*{0,2}(?:HIGH|MEDIUM|LOW)\*{0,2}[^—\n]*[—-]\s*([^\n]{10,})/i);
    if(m) return m[1].trim();
    // Fallback: grab the sentence immediately after the signal line
    var m2=metaText.match(/Integration Signal[^\n]*\n+([^\n*#]{20,})/i);
    return m2?m2[1].trim():"";
  })();
  var allFragility=[];
  signals.forEach(function(s){s.fragility.forEach(function(f){allFragility.push({text:f,source:s.label,color:s.color});});});
  var fragScore=safeMatch(stressText,/Fragility Score[^0-9]*(\d+(?:\.\d+)?)(?:\s*\/\s*10)?/,1)||null;


  // FIX 3: Extended Chair recommendation regex to match CONDITIONAL APPROVAL
  var chairRec=safeMatch(chairText,/\*\*Chair Recommendation[^*]*\*\*:?\s*\*?\*?\s*(HALT[^.\n]*|CONDITIONAL APPROVAL[^.\n]*|PROCEED WITH CONDITIONS|PROCEED WITH CAUTION|PILOT[^.\n]*|DEFER[^.\n]*|DO NOT PROCEED)/i,1)
    ||safeMatch(chairText,/Chair Recommendation[:\s]+\*{0,2}(CONDITIONAL APPROVAL[^.\n*]*|DO NOT PROCEED|PROCEED WITH CONDITIONS|PROCEED WITH CAUTION|PILOT|DEFER|HALT)\*{0,2}/i,1)
    ||safeMatch(chairText,/\*\*Chair Recommendation\*\*[^a-zA-Z\n]*\n\s*(CONDITIONAL APPROVAL|DO NOT PROCEED|PROCEED WITH CONDITIONS|PROCEED WITH CAUTION|PILOT|DEFER|HALT)/i,1)
    ||"-";
  if(chairRec!=="-"){
    if(/HALT/i.test(chairRec)&&!/CONDITIONAL/i.test(chairRec)) chairRec="DO NOT PROCEED";
    else if(/CONDITIONAL APPROVAL/i.test(chairRec)) chairRec="CONDITIONAL APPROVAL";
    else if(/PILOT/i.test(chairRec)) chairRec="PILOT";
    else if(/DEFER/i.test(chairRec)) chairRec="DEFER";
  }


  function extractConditionLines(text) {
    if (!text) return [];
    var raw = [];

    // --- Primary: **Decision Conditions** section ---
    raw = raw.concat(extractBulletLines(text, "Decision Conditions"));
    var section = extractSection(text, "Decision Conditions");

    // Detect prose condition blocks and split on sentence boundaries.
    // When Chair writes Decision Conditions as prose (multiple conditions in one paragraph),
    // split at ". " followed by capital letter so each condition becomes a separate item.
    var bulletCount = raw.length; // count BEFORE prose section processing

    // JSX Fix B: multi-condition prose splitting.
    // Fires when: no bullets, no numbered list.
    // Priority order: (0) parenthetical-number list, (1) paragraph breaks,
    // (1.5) em-dash, (1.6) responsible-party grouping, (2) responsibility attribution,
    // (3) sentence boundary fallback.

    // Priority 0: parenthetical-number list split.
    // Chair sometimes writes conditions as inline parenthetical list:
    // "Four conditions: (1) Condition text. (2) Condition text. (3) ..."
    // Split the section on each "(N)" occurrence, keeping conditions only.
    if (bulletCount === 0 && section.length > 30 && /\(\d+\)/.test(section)) {
      var parenRaw = section.replace(/^[^(]*([(]1[)])/, "$1"); // trim preamble before (1)
      var parenParts = parenRaw.split(/\s*\(\d+\)\s*/);
      if (parenParts.length > 2) { // >2 means at least (1) (2) found
        parenParts.forEach(function(part) {
          var s = part.trim();
          if (s.length > 20) raw.push(s);
        });
        bulletCount = raw.length;
      }
    }

    // Numbered-bold split — runs BEFORE the outer prose guard.
    // Handles: "1. **Condition Name** — description text."
    // The outer guard below blocks when numbered items are present, so this
    // must fire first to extract conditions in that format.
    if (bulletCount === 0 && section.length > 30 && /^\s*\d+\.\s*\*\*/m.test(section)) {
      var numberedBoldLines = section.split(/(?=^\s*\d+\.\s*\*\*)/m);
      if (numberedBoldLines.length > 1) {
        numberedBoldLines.forEach(function(part) {
          var s = part.trim();
          s = s.replace(/^\d+\.\s*\*\*([^*]+)\*\*\s*[—\-–]\s*/, "$1: ").trim();
          s = s.replace(/^\d+\.\s*\*\*([^*]+)\*\*:?\s*/, "$1: ").trim();
          if (s.length > 15) raw.push(s);
        });
        bulletCount = raw.length;
      }
    }

    if (bulletCount === 0 && section.length > 30
      && !/^\s*[-•]\s/m.test(section)
      && !/^\s*\d+\.\s/m.test(section)) {

      // Priority 1: paragraph-break split.
      // Chair often writes each condition as a separate paragraph (blank line between).
      // Split on double-newline before a capitalised word — each paragraph = one condition.
      var paragraphParts = section.split(/\n{2,}(?=[A-Z])/);
      if (paragraphParts.length > 1) {
        paragraphParts.forEach(function(part) {
          var s = part.trim().replace(/^However,?\s*/i, "").trim();
          if (s.length > 20) raw.push(s);
        });
        bulletCount = raw.length;
      }

      // Priority 1.5: em-dash condition split.
      // Fires when paragraph split didn't fire and conditions use "Condition — description." pattern.
      // DEFER/CONDITIONAL APPROVAL chairs often write multi-sentence prose where each condition
      // sentence contains an em-dash: "Secured recurrent funding — desc. Clinical backfill — desc."
      // Two-step: (1) split on sentence boundary ". Capital", (2) keep only sentences with em-dash.
      // Trailing non-condition sentences ("These conditions are non-negotiable...") are excluded.
      if (bulletCount === 0) {
        var emSentences = section.split(/(?<=\.)\s+(?=[A-Z])/);
        var emConditions = emSentences.filter(function(s){ return /[—–]/.test(s) && s.length > 20; });
        if (emConditions.length > 1) {
          emConditions.forEach(function(part) {
            var s = part.trim().replace(/^However,?\s*/i, "").trim();
            if (s.length > 20) raw.push(s);
          });
          bulletCount = raw.length;
        }
      }

      // Priority 1.6: responsible-party grouping.
      // Fires when P1/P1.5 didn't split but section has pattern:
      // [Condition statement.] [X is responsible for Y.] [Condition2.] [Z is responsible for W.]
      // Group each condition with its trailing "is responsible" attribution sentence.
      // Conditions without an explicit responsible sentence are kept as-is.
      if (bulletCount === 0) {
        var respSentences = section.split(/(?<=\.)\s+(?=[A-Z])/);
        if (respSentences.length > 2) {
          var grouped = [];
          var ri = 0;
          while (ri < respSentences.length) {
            var rs = respSentences[ri];
            // If next sentence is a "is responsible" attribution, merge it with current
            if (ri + 1 < respSentences.length && /\bis responsible\b|\bresponsible for\b/i.test(respSentences[ri+1])) {
              grouped.push(rs + ' ' + respSentences[ri+1]);
              ri += 2;
            } else if (/^\s*[\w][\w\s]*\bis responsible\b/i.test(rs) && grouped.length > 0) {
              // Standalone responsible sentence not merged above — merge with previous
              grouped[grouped.length-1] = grouped[grouped.length-1] + ' ' + rs;
              ri += 1;
            } else {
              grouped.push(rs);
              ri += 1;
            }
          }
          if (grouped.length > 1 && grouped.length < respSentences.length) {
            grouped.forEach(function(part) {
              var s = part.trim().replace(/^However,?\s*/i, "").trim();
              if (s.length > 20) raw.push(s);
            });
            bulletCount = raw.length;
          }
        }
      }

      // Priority 2: responsibility-attribution sentence split.
      // Fires when paragraph split didn't fire (conditions in single paragraph).
      var sentenceCount = (section.match(/\.\s+[A-Z]/g)||[]).length;
      if (bulletCount === 0 && sentenceCount >= 2) {
        // Extended named-party list covers DEFER-style conditions starting with
        // "Secured recurrent funding", "Formal Aboriginal", "Cultural supervision" etc.
        var responsibilitySplit = section.split(
          /(?<=\.\s{0,3})(?=(?:Commonwealth|WACHS|Department|KAMS|ACCHO|Workforce|Cultural|Regional|Community|Implementation|Recurrent|All staff|Training|Baseline|Site|Vendor|TGA|A confirmed|A clear|An independent|Confirmed|Established|Documented|Aboriginal|Torres|TCHHS|Each|Program|Services|Staff|Clinical|Dual|Data|Before|No|Any|Role|Supervision|NSW Health|LHD|Coordinator|Secured|Formal|Genuine|Written|Explicit|Independent|Dedicated|Protected|Verified|Funded)[^a-z])/
        );
        if (responsibilitySplit.length > 1) {
          responsibilitySplit.forEach(function(part) {
            var s = part.trim().replace(/^However,?\s*/i, "").trim();
            if (s.length > 20) raw.push(s);
          });
          bulletCount = raw.length;
        }
        // Priority 3: sentence-boundary fallback
        if (bulletCount === 0) {
          var sentenceParts = section.split(/(?<=\.\s{1,3})(?=[A-Z][a-z])/);
          if (sentenceParts.length > 1) {
            sentenceParts.forEach(function(part) {
              var s = part.trim().replace(/^However,?\s*/i, "").trim();
              if (s.length > 20) raw.push(s);
            });
            bulletCount = raw.length;
          }
        }
      }
    }

    var isProseBlock = bulletCount === 0 && section.length > 30
      && !/^\s*[-•]\s/m.test(section)
      && !/^\s*\d+\.\s/m.test(section)
      && (section.match(/[.!?]/g)||[]).length >= 1;

    // Split inline bold-heading conditions before prose-block detection.
    // Chair often writes: "**Condition A** — text. **Condition B** — text."
    // all on one line. Split into individual conditions at each **Bold** boundary.
    // Also handles numbered bold: "1. **Condition A** text. 2. **Condition B** text."
    if (bulletCount === 0 && section.length > 30) {
      // Try em-dash separated bold headings first
      var boldSplit = section.split(/(?=\*\*[A-Z][^*]+\*\*\s*[—\-–])/);
      if (boldSplit.length > 1) {
        boldSplit.forEach(function(part) {
          var s = part.trim();
          s = s.replace(/^\*\*([^*]+)\*\*\s*[—\-–]\s*/, "$1: ").trim();
          if (s.length > 15) raw.push(s);
        });
        bulletCount = raw.length;
      }
      // Also try numbered bold: "1. **text**..." or "1. **text**: ..."
      if (bulletCount === 0) {
        var numberedBoldSplit = section.split(/(?=\d+\.\s*\*\*)/);
        if (numberedBoldSplit.length > 1) {
          numberedBoldSplit.forEach(function(part) {
            var s = part.trim();
            s = s.replace(/^\d+\.\s*\*\*([^*]+)\*\*:?\s*/, "$1: ").trim();
            if (s.length > 15) raw.push(s);
          });
          bulletCount = raw.length;
        }
      }
    }

    // Only push the prose block when extractBulletLines found nothing.
    // If bullets were found, the prose block would duplicate them — the Chair
    // writes conditions as a prose block AND a Verification Phase numbered list
    // on CONDITIONAL APPROVAL outputs. Pushing both creates visible duplication.
    if (isProseBlock && bulletCount === 0) {
      var cleaned = section
        .replace(/^The recommendation requires no conditions[^.]*\.\s*/i, "")
        .replace(/^(Conditions are not applicable[^.]*\.\s*)/i, "")
        .replace(/^However,?\s*/i, "")
        .trim();
      if (cleaned.length > 15) raw.push(cleaned);
    } else if (!isProseBlock && section.length > 0) {
      var splitLines = section
        .replace(/\.\s*(\d+\.\s)/g, ".\n$1")
        .split("\n");
      splitLines.forEach(function(l){
        var s = l.trim();
        s = s.replace(/^\d+\.\s*/, "").replace(/^[-•]\s*/, "").trim();
        if (s && !s.startsWith("**") && s.length > 15) raw.push(s);
      });
    }

    // --- Fallback 1: Verification Phase (CONDITIONAL APPROVAL) ---
    // Handles both ## Verification Phase and **Verification Phase** heading styles.
    var vpRe = /(?:##\s+|\*\*)\s*Verification Phase[^*\n]*(?:\*\*)?\s*\n([\s\S]*?)(?=\n##\s+[A-Za-z]|\n\*\*[A-Za-z]|$)/i;
    var vpm = text.match(vpRe);
    if (vpm && raw.length === 0) {
      var nbRe = /^\s*(?:\(\d+\)|\d+[.):])\s*\*{0,2}([^*\n]{8,})/gm;
      var nbm;
      while ((nbm = nbRe.exec(vpm[1])) !== null) { raw.push(nbm[1].trim()); }
    }

    // --- Fallback 2: DO NOT PROCEED minimum conditions buried in Reasoning Transparency ---
    // When Chair writes DO NOT PROCEED, minimum override conditions are often placed here.
    if (raw.length === 0) {
      var isDNP = /DO NOT PROCEED/i.test(text);
      if (isDNP) {
        var rtSection = extractSection(text, "Reasoning Transparency");
        if (!rtSection) {
          // Also try the ## variant
          var rtM = text.match(/##\s+Reasoning Transparency[^\n]*\n([\s\S]*?)(?=\n##\s+[A-Za-z]|\n\*\*[A-Za-z]|$)/i);
          rtSection = rtM ? rtM[1].trim() : "";
        }
        if (rtSection && rtSection.length > 30) {
          // Look for "if the decision-maker proceeds" or "minimum conditions" sub-block
          var minM = rtSection.match(/(?:if.*?proceed[^.]*|minimum (?:conditions|requirements)[^.]*)[.:]\s*([\s\S]{20,})/i);
          if (minM) {
            raw.push("Minimum override conditions: " + minM[1].replace(/\n/g," ").trim().substring(0,400));
          } else if (/minimum|if.*proceed|override|notwithstanding/i.test(rtSection)) {
            // Fallback: preserve the first substantive sentence from Reasoning Transparency
            var firstSent = rtSection.match(/([A-Z][^.!?]{30,}[.!?])/);
            if (firstSent) raw.push(firstSent[1].trim());
          }
        }
      }
    }

    // --- Fallback 3: inline conditions after the recommendation line ---
    // Some Chair outputs write: "**Chair Recommendation**: DO NOT PROCEED\n\nIf overridden, conditions include..."
    if (raw.length === 0) {
      var afterRec = text.match(/\*\*Chair Recommendation\*\*[^\n]*DO NOT PROCEED[^\n]*\n([\s\S]{20,200})/i);
      if (afterRec) {
        var inline = afterRec[1].replace(/\n/g," ").trim();
        inline = inline.replace(/^\*\*[^*]+\*\*\s*/, "").trim();
        if (inline.length > 20) raw.push(inline.substring(0,400));
      }
    }

    return dedupItems(raw).filter(function(s){ return s.length > 10; });
  }
  var conditions = extractConditionLines(chairText).slice(0,6);
  // P2.1: warn if chair text has numbered condition blocks but we extracted very few
  (function(){
    var numberedItems=(chairText.match(/^\s*\d+\.\s+\*\*/gm)||[]).length;
    if(numberedItems>2&&conditions.length<2){
      console.warn("PHDSS extraction: Chair has "+numberedItems+" numbered bold items but only "+conditions.length+" conditions extracted — possible under-extraction");
    }
  })();
  var tradeoffs=dedupItems(extractBulletLines(chairText,"Key Trade-offs").concat(
    extractSection(chairText,"Key Trade-offs").split("\n").filter(function(l){return l.trim()&&!l.startsWith("**");}))
  ).slice(0,5);
  var conflictCount=conflicts.filter(function(c){return c.length>10;}).length;
  var assumptionCount=assumptions.filter(function(a){return a.length>10;}).length;
  var traceabilityScore=Math.round(((covered>0?25:0)+(metaText?25:0)+(stressText?25:0)+(chairText?25:0)));
  // Extract epistemic score from the Health Score line specifically, not body text.
  // findSignal scans whole text and hits "STRONG" in body text (e.g. "STRONG evidence")
  // before reaching the actual "**Epistemic Health Score**: ADEQUATE" line.
  var epistemicScore=(function(){
    var m=epistemicText.match(/\*\*Epistemic Health Score\*\*:?\s*(STRONG|ADEQUATE|WEAK|COMPROMISED)/i);
    if(m) return m[1].toUpperCase();
    var m2=epistemicText.match(/Epistemic Health Score[:\s]+(STRONG|ADEQUATE|WEAK|COMPROMISED)/i);
    if(m2) return m2[1].toUpperCase();
    return findSignal(epistemicText,["STRONG","ADEQUATE","COMPROMISED","WEAK"]);
  })();
  // Governance Level: completion gates (traceability + coverage) are necessary
  // but not sufficient. WEAK or COMPROMISED epistemic health caps at MEDIUM
  // because analytical rigour cannot be inferred from completion alone.
  var epistemicHealthGate = epistemicScore==="WEAK"||epistemicScore==="COMPROMISED";
  var governanceLevel=(!epistemicHealthGate&&traceabilityScore>=75&&coverageScore>=77)?"HIGH":traceabilityScore>=50?"MEDIUM":"LOW";
  var overconfidenceFlags=dedupItems(extractBulletLines(epistemicText,"Overconfidence Flags").concat(
    extractSection(epistemicText,"Overconfidence Flags").split("\n").filter(function(l){return l.trim()&&!l.startsWith("**");}))
  ).slice(0,6);
  var biasSignals=extractSection(epistemicText,"Systematic Bias Signals");
  var epistemicGaps=extractBulletLines(epistemicText,"Epistemic Gaps").slice(0,5);
  var dirConfidence={};
  if(epistemicText){
    active.forEach(function(d){
      var re=new RegExp(d.label+"[^-]*-\\s*(HIGH|MEDIUM|LOW|UNCERTAIN)","i");
      var cm=epistemicText.match(re);
      if(cm) dirConfidence[d.id]=cm[1];
    });
  }
  var probeVerdict=findSignal(probeText,["BOARD REASONING SOUND","SIGNIFICANT GAPS","CONCLUSION CHALLENGED"]);
  var boardMissed=dedupItems(extractBulletLines(probeText,"What the Board Missed").concat(
    extractSection(probeText,"What the Board Missed").split("\n").filter(function(l){return l.trim()&&!l.startsWith("**");}))
  ).slice(0,5);
  var absentPerspectives=extractSection(probeText,"Whose Perspective Is Absent");
  var esNum=epistemicScore==="STRONG"?100:epistemicScore==="ADEQUATE"?65:epistemicScore==="WEAK"?30:epistemicScore==="COMPROMISED"?0:null;
  // Probe score: scale CONCLUSION CHALLENGED floor by coverage ratio.
  // On partial runs the Probe is expected to challenge — penalise less than on FULL.
  var coverageRatioNum = active.length / DIRECTORS.length;
  // Probe score: BOARD REASONING SOUND=100, SIGNIFICANT GAPS=50, CONCLUSION CHALLENGED=60.
  // CONCLUSION CHALLENGED scores higher than SIGNIFICANT GAPS because the probe found the
  // Board's dominant signal itself was wrong — a stronger analytical finding. Low scores
  // reflected a misread of the verdict as indicating system failure rather than analytical depth.
  var pvRaw=probeVerdict==="BOARD REASONING SOUND"?100:probeVerdict==="SIGNIFICANT GAPS"?50:probeVerdict==="CONCLUSION CHALLENGED"?60:null;
  var pvNum = pvRaw !== null
    ? (probeVerdict==="CONCLUSION CHALLENGED"
        ? Math.round(Math.max(pvRaw, 40 * (1 - coverageRatioNum) + pvRaw * coverageRatioNum))
        : pvRaw)
    : null;
  var aiIntegrityScore=(esNum!==null&&pvNum!==null)?Math.round(esNum*0.6+pvNum*0.4):(esNum!==null?esNum:(pvNum!==null?pvNum:null));
  var coverageNote = buildCoverageNote(analysisMode||"FULL", active, DIRECTORS);
  var coverageRatio = active.length+"/"+DIRECTORS.length;
  return {
    signals, covered, failedCount, coverageScore, proceedCount, cautionCount, haltCount,
    conflicts, assumptions, gaps, tensions, integrationSignal,
    allFragility,
    fragScore: fragScore !== null ? fragScore : "-",
    fragScoreRan: fragScore !== null,
    // Three-state fragility: 'scored' | 'ran-no-score' | 'not-run'
    // resolved downstream using stressTestResult.run — see TransparencyDashboard and exportFullDashboard
    chairRec, conditions, tradeoffs,
    conflictCount, assumptionCount, traceabilityScore, governanceLevel,
    totalLoadedDocs, webSearch,
    epistemicScore, overconfidenceFlags, biasSignals, epistemicGaps, dirConfidence,
    probeVerdict, boardMissed, absentPerspectives, aiIntegrityScore,
    analysisMode: analysisMode||"FULL",
    activeDirectorCount: active.length,
    omittedDirectors: (omittedDirectors||[]).map(function(d){return d.label;}),
    coverageNote, coverageRatio,
    integrationRationale,
    timestamp: new Date().toLocaleString("en-AU"),
  };
}


// --- RENDER MD ----------------------------------------------------------------
function renderMd(text, accent) {
  if (!text) return "";
  var ac=accent||"#0369A1";
  return text
    .replace(/\*\*(.*?)\*\*/g,"<strong style=\"color:"+ac+";font-weight:700\">$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,"<a href=\"$2\" target=\"_blank\" style=\"color:"+ac+";text-decoration:underline\">$1</a>")
    .replace(/(https?:\/\/[^\s<>"]+)/g,"<a href=\"$1\" target=\"_blank\" style=\"color:"+ac+";text-decoration:underline;word-break:break-all\">$1</a>");
}


// --- SMALL COMPONENTS ---------------------------------------------------------
function Spinner({color="#0EA5E9", size=12}) {
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:6,color:"#64748B",fontSize:11}}>
      <span style={{display:"inline-block",width:size,height:size,border:"2px solid #E2E8F0",borderTopColor:color,borderRadius:"50%",animation:"spin 0.8s linear infinite"}} />
      Thinking...
    </span>
  );
}


// --- INFOTIP ------------------------------------------------------------------
// Shared tooltip component using getBoundingClientRect for reliable fixed positioning.
// Replaces the previous inline position:fixed pattern which had no top/left coords.
function InfoTip({text}) {
  var [visible, setVisible] = useState(false);
  var [pos, setPos] = useState({top:0, left:0});
  var btnRef = useRef(null);
  function show(e) {
    e.stopPropagation();
    if (btnRef.current) {
      var r = btnRef.current.getBoundingClientRect();
      // Prefer showing below; shift left if too close to right edge
      var left = Math.min(r.left, window.innerWidth - 296);
      setPos({ top: r.bottom + 6, left: Math.max(4, left) });
    }
    setVisible(true);
  }
  function hide() { setVisible(false); }
  return (
    <span ref={btnRef}
      onMouseEnter={show} onMouseLeave={hide}
      onClick={function(e){e.stopPropagation(); visible?hide():show(e);}}
      style={{display:"inline-flex",alignItems:"center",justifyContent:"center",
        width:14,height:14,borderRadius:"50%",background:"#E2E8F0",color:"#64748B",
        fontSize:9,fontWeight:700,cursor:"help",flexShrink:0,verticalAlign:"middle",
        marginLeft:4,userSelect:"none"}}>?
      {visible&&<span style={{position:"fixed",top:pos.top,left:pos.left,
        background:"#0F172A",color:"#F8FAFC",fontSize:11,padding:"8px 12px",
        borderRadius:8,whiteSpace:"normal",width:280,lineHeight:1.6,zIndex:99999,
        fontWeight:400,boxShadow:"0 4px 16px rgba(0,0,0,0.35)",pointerEvents:"none"}}>
        {text}
      </span>}
    </span>
  );
}


function SignalPill({signal, small}) {
  var col,bg;
  if(signal==="PROCEED"){col="#059669";bg="#D1FAE5";}
  else if(signal==="CAUTION"){col="#D97706";bg="#FEF3C7";}
  else if(signal==="HALT"){col="#DC2626";bg="#FEE2E2";}
  else if(signal&&signal.indexOf("CONDITIONS")!==-1){col="#059669";bg="#D1FAE5";}
  else if(signal&&signal.indexOf("CAUTION")!==-1){col="#D97706";bg="#FEF3C7";}
  else if(signal==="DEFER"){col="#7C3AED";bg="#EDE9FE";}
  else if(signal==="DO NOT PROCEED"){col="#DC2626";bg="#FEE2E2";}
  else if(signal==="CONDITIONAL APPROVAL"){col="#0891B2";bg="#ECFEFF";}
  else if(signal==="BOARD REASONING SOUND"){col="#059669";bg="#D1FAE5";}
  else if(signal==="SIGNIFICANT GAPS"){col="#D97706";bg="#FEF3C7";}
  else if(signal==="CONCLUSION CHALLENGED"){col="#DC2626";bg="#FEE2E2";}
  else if(signal==="FAILED"){col="#DC2626";bg="#FEF2F2";}
  else{col="#64748B";bg="#F1F5F9";}
  return <span style={{fontSize:small?9:10,fontWeight:700,padding:small?"2px 7px":"3px 10px",borderRadius:20,background:bg,color:col,border:"1px solid "+col+"33",letterSpacing:0.4,whiteSpace:"nowrap"}}>{signal||"-"}</span>;
}


function ModeBadge({mode}) {
  var col=mode==="FULL"?"#059669":mode==="CORE"?"#0369A1":"#7C3AED";
  var bg=mode==="FULL"?"#D1FAE5":mode==="CORE"?"#DBEAFE":"#EDE9FE";
  return <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:bg,color:col,border:"1px solid "+col+"33",letterSpacing:0.4,whiteSpace:"nowrap"}}>{mode}</span>;
}


function ExpandRow({label,count,items,color="#64748B",emptyMsg="None detected",bg="#F8FAFC",border="#E2E8F0",textColor="#334155"}) {
  var [open,setOpen]=useState(false);
  var hasItems=items&&items.length>0;
  return (
    <div style={{borderBottom:"1px solid #F1F5F9"}}>
      <div onClick={function(){if(hasItems)setOpen(!open);}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",cursor:hasItems?"pointer":"default"}}>
        <span style={{fontSize:12,color:"#475569"}}>{label}</span>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:12,fontWeight:700,color:color}}>{count}</span>
          {hasItems&&<span style={{fontSize:10,color:"#94A3B8"}}>{open?"▾":"▸"}</span>}
        </div>
      </div>
      {open&&hasItems&&
        <div style={{paddingBottom:10,display:"flex",flexDirection:"column",gap:5}}>
          {items.map(function(item,i){
            return <div key={i} style={{fontSize:11,padding:"6px 10px",borderRadius:7,background:bg,border:"1px solid "+border,color:textColor,lineHeight:1.55}}>{item.text||item}</div>;
          })}
        </div>
      }
    </div>
  );
}


function SectionHead({title,color="#0F172A",pending}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,paddingBottom:8,borderBottom:"2px solid "+color+"22"}}>
      <span style={{fontSize:13,fontWeight:700,color:color}}>{title}</span>
      {pending&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:8,background:"#FEF3C7",color:"#92400E",fontWeight:600}}>Awaiting data</span>}
    </div>
  );
}


function PartialFailureButton({onSave}) {
  var [tip,setTip]=useState(false);
  return (
    <div style={{position:"relative",display:"inline-block"}}>
      <button onClick={onSave} onMouseEnter={function(){setTip(true);}} onMouseLeave={function(){setTip(false);}}
        style={{padding:"9px 16px",borderRadius:8,border:"1px solid #FDE68A",background:"#FFFBEB",color:"#92400E",fontSize:12,fontWeight:600,cursor:"pointer"}}>
        ⚠ Save partial session
      </button>
      {tip&&<div style={{position:"fixed",background:"#0F172A",color:"#F8FAFC",fontSize:11,padding:"8px 12px",borderRadius:8,width:280,lineHeight:1.6,zIndex:9999,boxShadow:"0 4px 16px rgba(0,0,0,0.35)",fontWeight:400,pointerEvents:"none",whiteSpace:"normal"}}>
        Saves whichever directors finished to the Ledger. Does not resume the run.
      </div>}
    </div>
  );
}


function PendingNote({stage,running,notStarted}) {
  if(notStarted) return (
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px",borderRadius:10,background:"#F8FAFC",border:"1px solid #E2E8F0"}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:"#CBD5E0",flexShrink:0}}/>
      <div><div style={{fontSize:11,fontWeight:700,color:"#64748B",marginBottom:2}}>No session data yet</div><div style={{fontSize:11,color:"#94A3B8"}}>Run a Board session first.</div></div>
    </div>
  );
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px",borderRadius:10,background:"#FFFBEB",border:"1px solid #FDE68A"}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:"#F97316",flexShrink:0,animation:"pulse 1.2s infinite"}}/>
      <div><div style={{fontSize:11,fontWeight:700,color:"#92400E",marginBottom:2}}>{running?"Waiting for "+stage+"...":stage+" not yet run"}</div></div>
    </div>
  );
}


// --- TRANSPARENCY DASHBOARD ---------------------------------------------------
function TransparencyDashboard({decision,dirOutputs,meta,stress,chair,epistemic,probe,dialogueHistory,totalLoadedDocs,webSearch,decisionId,decisionSignal,orgContext,comparator,running,done,surfaceMap,realityAnchor,analysisMode,activeDirectors,omittedDirectors,stressTestResult}) {
  var d=parseDashboard(decision,dirOutputs,meta,stress,chair,dialogueHistory,totalLoadedDocs,webSearch,epistemic,probe,analysisMode,activeDirectors,omittedDirectors);
  var govColor=d.governanceLevel==="HIGH"?"#059669":d.governanceLevel==="MEDIUM"?"#D97706":"#DC2626";
  var govBg=d.governanceLevel==="HIGH"?"#D1FAE5":d.governanceLevel==="MEDIUM"?"#FEF3C7":"#FEE2E2";
  var fragNum=parseInt(d.fragScore)||0;
  var fragColor=fragNum>=7?"#DC2626":fragNum>=4?"#D97706":"#059669";
  var isPartial=d.analysisMode!=="FULL";
  var stages=[
    {label:"Directors",done:Object.keys(dirOutputs).length>=(activeDirectors||DIRECTORS).length},
    {label:"Surface Map",done:!!surfaceMap},{label:"META",done:!!meta},{label:"Reality",done:!!realityAnchor},
    {label:"Probe",done:!!probe},{label:"Stress",done:!!stress},{label:"Epistemic",done:!!epistemic},{label:"Chair",done:!!chair},
  ];
  var stagesComplete=stages.filter(function(s){return s.done;}).length;
  var highConf=[],lowConf=[];
  if(d.dirConfidence){
    (activeDirectors||DIRECTORS).forEach(function(dir){
      var conf=d.dirConfidence[dir.id];
      if(conf==="HIGH") highConf.push(dir.label);
      else if(conf==="LOW"||conf==="UNCERTAIN") lowConf.push(dir.label);
    });
  }
  var biasSummary=d.biasSignals?d.biasSignals.split(/[.!?]/)[0].trim():"";
  var absentSummary=d.absentPerspectives?d.absentPerspectives.split(/[.!?]/)[0].trim():"";
  var proceedNow=d.chairRec==="PROCEED WITH CONDITIONS"||d.chairRec==="PROCEED WITH CAUTION";
  var noGo=d.chairRec==="DO NOT PROCEED";
  var proceedLater=d.chairRec==="DEFER"||d.chairRec==="PROCEED WITH CONDITIONS";
  var isConditional=d.chairRec==="CONDITIONAL APPROVAL";


  return (
    <div style={{animation:"fadeIn 0.4s ease"}}>
      {running&&
        <div style={{marginBottom:16,padding:"14px 20px",borderRadius:14,background:"#FFFBEB",border:"1px solid #FDE68A"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10,marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:"#F97316",animation:"pulse 1.2s infinite"}}/>
              <span style={{fontSize:12,fontWeight:700,color:"#92400E"}}>Board session in progress — dashboard updating live</span>
            </div>
            <span style={{fontSize:11,color:"#B45309"}}>{stagesComplete}/8 stages complete</span>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {stages.map(function(s){
              return <div key={s.label} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:20,background:s.done?"#F0FDF4":"#FFF7ED",border:"1px solid "+(s.done?"#BBF7D0":"#FED7AA")}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:s.done?"#22C55E":"#F97316",animation:s.done?"none":"pulse 1.2s infinite"}}/>
                <span style={{fontSize:11,fontWeight:600,color:s.done?"#15803D":"#C2410C"}}>{s.label}</span>
              </div>;
            })}
          </div>
        </div>
      }
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:"#0F172A",marginBottom:3}}>Transparency Dashboard</div>
          <div style={{fontSize:11,color:"#64748B"}}>{decisionId} — {d.timestamp}</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <ModeBadge mode={d.analysisMode}/>
          <span style={{fontSize:11,padding:"4px 10px",borderRadius:20,background:"#F1F5F9",color:"#475569",fontWeight:600,border:"1px solid #E2E8F0"}}>{d.coverageRatio} directors</span>
          <span style={{fontSize:11,padding:"4px 12px",borderRadius:20,background:govBg,color:govColor,fontWeight:700,border:"1px solid "+govColor+"33"}}>{d.governanceLevel} GOVERNANCE</span>
          {(done||Object.keys(dirOutputs||{}).length>0)&&<button onClick={function(){exportFullDashboard(d,decision,decisionId,decisionSignal,orgContext,comparator,stressTestResult);}} style={{padding:"7px 16px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#0EA5E9,#0369A1)",color:"#FFFFFF",fontSize:11,fontWeight:700,cursor:"pointer"}}>Export .md</button>}
        </div>
      </div>
      {isPartial&&
        <div style={{marginBottom:14,padding:"12px 16px",borderRadius:10,background:"#FFFBEB",border:"1px solid #FDE68A",display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{fontSize:16,flexShrink:0}}>⚠</span>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#92400E",marginBottom:3}}>Partial Coverage — {d.analysisMode} Mode</div>
            <div style={{fontSize:11,color:"#78350F",lineHeight:1.6}}>{d.coverageNote}</div>
            {d.omittedDirectors&&d.omittedDirectors.length>0&&
              <div style={{marginTop:6,display:"flex",flexWrap:"wrap",gap:5}}>
                {d.omittedDirectors.map(function(name,i){return <span key={i} style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:"rgba(220,38,38,0.08)",color:"#B91C1C",border:"1px solid rgba(220,38,38,0.2)"}}>{name}</span>;})}
              </div>
            }
          </div>
        </div>
      }
      <div style={{background:"#FFFFFF",border:"1px solid #E2E8F0",borderRadius:14,padding:"18px 20px",marginBottom:14,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
        <SectionHead title="Governance Scorecard" color="#0F172A"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
          <ExpandRow label={"Active dir. fidelity ("+d.analysisMode+")"} count={d.covered+"/"+d.activeDirectorCount+" invoked directors"+(d.failedCount?" ("+d.failedCount+" failed)":"")} color={d.coverageScore===100?"#059669":d.coverageScore>=77?"#D97706":"#DC2626"} items={d.signals.filter(function(s){return s.signal==="PENDING"||s.signal==="FAILED";}).map(function(s){return s.label+(s.signal==="FAILED"?" — API FAILED":" — pending");})} bg="#F0FDF4" border="#BBF7D0" textColor="#065F46"/>
          <ExpandRow label="Signal balance" count={d.proceedCount+"P / "+d.cautionCount+"C / "+d.haltCount+" HALT"+(d.failedCount?" / "+d.failedCount+" ERR":"")} color={d.haltCount>3?"#DC2626":d.haltCount>0?"#D97706":"#059669"} items={d.signals.filter(function(s){return s.signal!=="PENDING"&&s.signal!=="FAILED";}).map(function(s){return s.label+": "+s.signal;})} bg="#F8FAFC" border="#E2E8F0" textColor="#334155"/>
          <ExpandRow label="Integration coherence" count={d.integrationSignal||"-"} color={d.integrationSignal==="HIGH"?"#059669":d.integrationSignal==="MEDIUM"?"#D97706":d.integrationSignal==="LOW"?"#DC2626":"#94A3B8"} items={(d.integrationRationale?["Rationale: "+d.integrationRationale]:[]).concat(d.tensions)} bg="#FFF7ED" border="#FED7AA" textColor="#92400E"/>
          <ExpandRow label="Epistemic health" count={d.epistemicScore||"-"} color={d.epistemicScore==="STRONG"?"#059669":d.epistemicScore==="ADEQUATE"?"#D97706":(d.epistemicScore==="WEAK"||d.epistemicScore==="COMPROMISED")?"#DC2626":"#94A3B8"} items={d.overconfidenceFlags} bg="#FFF5F5" border="#FECACA" textColor="#7F1D1D"/>
          <ExpandRow label="Adversarial gap finding" count={d.probeVerdict||"-"} color={d.probeVerdict==="BOARD REASONING SOUND"?"#059669":d.probeVerdict==="SIGNIFICANT GAPS"?"#D97706":d.probeVerdict==="CONCLUSION CHALLENGED"?"#DC2626":"#94A3B8"} items={d.boardMissed} bg="#F5F3FF" border="#DDD6FE" textColor="#5B21B6"/>
          <ExpandRow label="Chair recommendation" count={d.chairRec||"-"} color={d.chairRec==="CONDITIONAL APPROVAL"?"#0891B2":d.chairRec&&d.chairRec.indexOf("CONDITIONS")!==-1?"#059669":d.chairRec&&d.chairRec.indexOf("CAUTION")!==-1?"#D97706":d.chairRec==="DEFER"?"#7C3AED":d.chairRec==="DO NOT PROCEED"?"#DC2626":"#94A3B8"} items={d.conditions} bg="#EFF6FF" border="#BFDBFE" textColor="#1E3A5F"/>
          <ExpandRow label="Fragility score" count={d.fragScore!=="-"?d.fragScore+"/10":(stressTestResult&&stressTestResult.run?"Not extracted":"N/A — not run")} color={d.fragScore!=="-"?fragColor:"#94A3B8"} items={d.allFragility.map(function(f){return "["+f.source+"] "+f.text;})} bg="#FFF5F5" border="#FECACA" textColor="#7F1D1D"/>
          <ExpandRow label="AI Integrity score ⓘ" count={d.aiIntegrityScore!==null&&d.aiIntegrityScore!==undefined?d.aiIntegrityScore+"%":"-"} color={d.aiIntegrityScore>=70?"#059669":d.aiIntegrityScore>=40?"#D97706":"#DC2626"} items={d.epistemicGaps.concat(d.aiIntegrityScore!==null?["Composite: Epistemic health (60%) + Adversarial Probe (40%). Low scores indicate analytical uncertainty, not a system error."+(d.analysisMode!=="FULL"?" Expected range for "+d.analysisMode+" mode ("+d.activeDirectorCount+"/13 directors) is lower than FULL mode — score is structurally depressed by partial coverage.":"")]:[])} bg="#FFF5F5" border="#FECACA" textColor="#7F1D1D"/>
        </div>
      </div>
      <div style={{background:"#FFFFFF",border:"1px solid #E2E8F0",borderRadius:14,padding:"18px 20px",marginBottom:14,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,paddingBottom:12,borderBottom:"2px solid #7C3AED22"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,borderRadius:8,background:"#7C3AED18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}><span style={{color:"#7C3AED"}}>M</span></div>
            <span style={{fontSize:13,fontWeight:700,color:"#0F172A"}}>Cross-Domain Tension Analysis</span>
            <span style={{fontSize:10,padding:"2px 8px",borderRadius:8,background:"#EDE9FE",color:"#7C3AED",fontWeight:600,letterSpacing:0.3}}>Cross-domain synthesis</span>
          </div>
          {!meta&&<PendingNote stage="Cross-Domain Tension Analysis" running={running} notStarted={!running&&!meta}/>}
          {meta&&<span style={{fontSize:11,color:"#64748B"}}>{d.assumptionCount} assumption{d.assumptionCount!==1?"s":""} · {d.conflictCount} conflict{d.conflictCount!==1?"s":""} · {d.gaps.length} gap{d.gaps.length!==1?"s":""}</span>}
        </div>
        {meta ? (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            <div style={{background:"#F5F3FF",borderRadius:10,padding:"12px 14px",border:"1px solid #DDD6FE"}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
                <div style={{width:22,height:22,borderRadius:6,background:"#EDE9FE",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>⚠️</div>
                <div><div style={{fontSize:10,fontWeight:700,color:"#5B21B6",textTransform:"uppercase",letterSpacing:0.8}}>Hidden Assumptions</div><div style={{fontSize:10,color:"#7C3AED",marginTop:1}}>{d.assumptionCount>0?d.assumptionCount+" surfaced":"None detected"}</div></div>
              </div>
              {d.assumptions.length>0?<div style={{display:"flex",flexDirection:"column",gap:5}}>{d.assumptions.map(function(a,i){return <div key={i} style={{padding:"6px 9px",borderRadius:7,background:"#FFFFFF",border:"1px solid #DDD6FE"}}><div style={{display:"flex",alignItems:"flex-start",gap:6}}><span style={{fontSize:9,fontWeight:700,color:"#7C3AED",flexShrink:0,marginTop:2}}>{i+1}</span><span style={{fontSize:11,color:"#334155",lineHeight:1.55}}>{a.replace(/^\d+\.\s*/,"")}</span></div></div>;})}</div>:<div style={{fontSize:11,color:"#94A3B8",fontStyle:"italic",padding:"6px 0"}}>No assumptions extracted.</div>}
            </div>
            <div style={{background:"#FFF7ED",borderRadius:10,padding:"12px 14px",border:"1px solid #FED7AA"}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
                <div style={{width:22,height:22,borderRadius:6,background:"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>⚡</div>
                <div><div style={{fontSize:10,fontWeight:700,color:"#92400E",textTransform:"uppercase",letterSpacing:0.8}}>Cross-Domain Conflicts</div><div style={{fontSize:10,color:"#D97706",marginTop:1}}>{d.conflictCount>0?d.conflictCount+" detected":"None detected"}</div></div>
              </div>
              {d.conflicts.length>0?<div style={{display:"flex",flexDirection:"column",gap:5}}>{d.conflicts.map(function(c,i){return <div key={i} style={{padding:"6px 9px",borderRadius:7,background:"#FFFFFF",border:"1px solid #FED7AA"}}><div style={{display:"flex",alignItems:"flex-start",gap:6}}><span style={{fontSize:9,fontWeight:700,color:"#D97706",flexShrink:0,marginTop:2}}>{i+1}</span><span style={{fontSize:11,color:"#334155",lineHeight:1.55}}>{c.replace(/^\d+\.\s*/,"")}</span></div></div>;})}</div>:<div style={{fontSize:11,color:"#94A3B8",fontStyle:"italic",padding:"6px 0"}}>No conflicts extracted.</div>}
            </div>
            <div style={{background:"#F0FDF4",borderRadius:10,padding:"12px 14px",border:"1px solid #BBF7D0"}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
                <div style={{width:22,height:22,borderRadius:6,background:"#D1FAE5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>🧩</div>
                <div><div style={{fontSize:10,fontWeight:700,color:"#065F46",textTransform:"uppercase",letterSpacing:0.8}}>Reasoning Gaps</div><div style={{fontSize:10,color:"#059669",marginTop:1}}>{d.gaps.length>0?d.gaps.length+" found":"None identified"}</div></div>
              </div>
              {d.gaps.length>0&&<div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:d.tensions.length>0?10:0}}>{d.gaps.slice(0,4).map(function(g,i){return <div key={i} style={{padding:"6px 9px",borderRadius:7,background:"#FFFFFF",border:"1px solid #BBF7D0"}}><div style={{display:"flex",alignItems:"flex-start",gap:6}}><span style={{fontSize:9,fontWeight:700,color:"#059669",flexShrink:0,marginTop:2}}>{i+1}</span><span style={{fontSize:11,color:"#334155",lineHeight:1.55}}>{g.replace(/^\d+\.\s*/,"")}</span></div></div>;})}</div>}
              {d.tensions.length>0&&<div><div style={{fontSize:9,fontWeight:700,color:"#059669",textTransform:"uppercase",letterSpacing:0.6,marginBottom:6,marginTop:d.gaps.length>0?4:0}}>Unresolved Tensions ({d.tensions.length})</div>{d.tensions.slice(0,3).map(function(t,i){return <div key={i} style={{fontSize:11,color:"#334155",padding:"5px 8px",borderRadius:6,background:"#FFFFFF",border:"1px solid #BBF7D0",marginBottom:4,lineHeight:1.5}}>{t.replace(/^\d+\.\s*/,"")}</div>;})}</div>}
              {d.gaps.length===0&&d.tensions.length===0&&<div style={{fontSize:11,color:"#94A3B8",fontStyle:"italic",padding:"6px 0"}}>No gaps or tensions extracted.</div>}
            </div>
          </div>
        ) : <div style={{fontSize:11,color:"#94A3B8",fontStyle:"italic",padding:"16px 0",textAlign:"center"}}>Cross-Domain Tension Analysis has not run yet.</div>}
      </div>
      <div style={{background:"#FFFFFF",border:"1px solid #E2E8F0",borderRadius:14,padding:"18px 20px",marginBottom:14,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
        <SectionHead title="Decision Status" color="#0F172A" pending={!chair&&!done}/>
        {!chair?<PendingNote stage="Chair" running={running} notStarted={!running&&!done}/>:
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
              <div style={{padding:"12px 14px",borderRadius:10,background:isConditional?"#ECFEFF":(proceedNow&&!noGo?"#F0FDF4":"#FEF2F2"),border:"1px solid "+(isConditional?"#67E8F9":(proceedNow&&!noGo?"#BBF7D0":"#FECACA")),textAlign:"center"}}>
                <div style={{fontSize:11,color:"#64748B",marginBottom:4}}>Proceed now?</div>
                <div style={{fontSize:20,fontWeight:700,color:isConditional?"#0891B2":(proceedNow&&!noGo?"#059669":"#DC2626")}}>{noGo?"No":isConditional?"Verify first":proceedNow?"Conditional":"No"}</div>
              </div>
              <div style={{padding:"12px 14px",borderRadius:10,background:proceedLater&&!noGo?"#EFF6FF":"#F8FAFC",border:"1px solid "+(proceedLater&&!noGo?"#BFDBFE":"#E2E8F0"),textAlign:"center"}}>
                <div style={{fontSize:11,color:"#64748B",marginBottom:4}}>If conditions met?</div>
                <div style={{fontSize:20,fontWeight:700,color:proceedLater&&!noGo?"#0369A1":(isConditional?"#0369A1":"#94A3B8")}}>{noGo?"Unlikely":(proceedLater||isConditional)?"Yes":"Unclear"}</div>
              </div>
              <div style={{padding:"12px 14px",borderRadius:10,background:"#FAFAFA",border:"1px solid #E2E8F0",textAlign:"center"}}>
                <div style={{fontSize:11,color:"#64748B",marginBottom:4}}>Fragility exposure</div>
                <div style={{fontSize:20,fontWeight:700,color:d.fragScore!=="-"?fragColor:"#94A3B8"}}>{d.fragScore!=="-"?d.fragScore+"/10":(stressTestResult&&stressTestResult.run?"—":"N/A")}</div>
              </div>
            </div>
            {d.conditions.length>0&&<div><div style={{fontSize:10,fontWeight:700,color:"#0369A1",marginBottom:6,textTransform:"uppercase",letterSpacing:0.6}}>Critical Preconditions</div><div style={{display:"flex",flexDirection:"column",gap:5}}>{d.conditions.map(function(c,i){return <div key={i} style={{fontSize:11,padding:"6px 10px",borderRadius:8,background:"#F8FAFC",border:"1px solid #E2E8F0",color:"#334155",lineHeight:1.55}}><span style={{fontWeight:700,color:"#0369A1",marginRight:6}}>{i+1}.</span>{c.replace(/^\d+\.\s*/,"")}</div>;})}</div></div>}
            {d.tradeoffs.length>0&&<div style={{marginTop:12}}><div style={{fontSize:10,fontWeight:700,color:"#7C3AED",marginBottom:6,textTransform:"uppercase",letterSpacing:0.6}}>Key Trade-offs</div><div style={{display:"flex",flexDirection:"column",gap:5}}>{d.tradeoffs.map(function(t,i){return <div key={i} style={{fontSize:11,padding:"6px 10px",borderRadius:8,background:"#F5F3FF",border:"1px solid #DDD6FE",color:"#5B21B6",lineHeight:1.55}}><span style={{fontWeight:700,marginRight:6}}>{i+1}.</span>{t.replace(/^\d+\.\s*/,"")}</div>;})}</div></div>}
          </div>
        }
      </div>
      <div style={{background:"#FFFFFF",border:"1px solid #E2E8F0",borderRadius:14,padding:"18px 20px",marginBottom:14,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
        {stressTestResult&&<div style={{marginBottom:12,padding:"9px 14px",borderRadius:9,background:stressTestResult.run?"#FFFBEB":"#F8FAFC",border:"1px solid "+(stressTestResult.run?"#FDE68A":"#E2E8F0"),display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:8,background:stressTestResult.run?"#FEF3C7":"#F1F5F9",color:stressTestResult.run?"#92400E":"#64748B"}}>STRESS TEST {stressTestResult.run?"TRIGGERED":"SKIPPED"}</span>
          <span style={{fontSize:11,color:stressTestResult.run?"#92400E":"#64748B"}}>{stressTestResult.reason}</span>
        </div>}
        <SectionHead title="Confidence-Calibrated Ensemble" color="#0F172A" pending={!epistemic}/>
        {!epistemic?<PendingNote stage="Epistemic Audit" running={running} notStarted={!running&&!done}/>
        :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
          <div><div style={{fontSize:10,fontWeight:700,color:"#059669",textTransform:"uppercase",letterSpacing:0.6,marginBottom:8}}>Best-Grounded</div>{highConf.length>0?highConf.map(function(name,i){return <div key={i} style={{fontSize:11,padding:"5px 9px",borderRadius:7,background:"#F0FDF4",border:"1px solid #BBF7D0",color:"#065F46",marginBottom:4}}>{name}</div>;}): <span style={{fontSize:11,color:"#94A3B8",fontStyle:"italic"}}>None rated HIGH</span>}</div>
          <div><div style={{fontSize:10,fontWeight:700,color:"#DC2626",textTransform:"uppercase",letterSpacing:0.6,marginBottom:8}}>Most Speculative</div>{lowConf.length>0?lowConf.map(function(name,i){return <div key={i} style={{fontSize:11,padding:"5px 9px",borderRadius:7,background:"#FEF2F2",border:"1px solid #FECACA",color:"#991B1B",marginBottom:4}}>{name}</div>;}): <span style={{fontSize:11,color:"#94A3B8",fontStyle:"italic"}}>None rated LOW</span>}</div>
          <div><div style={{fontSize:10,fontWeight:700,color:"#7C3AED",textTransform:"uppercase",letterSpacing:0.6,marginBottom:8}}>Bias Signal</div>{biasSummary?<div style={{fontSize:11,padding:"7px 10px",borderRadius:8,background:"#F5F3FF",border:"1px solid #DDD6FE",color:"#5B21B6",lineHeight:1.55}}>{biasSummary}</div>:<span style={{fontSize:11,color:"#94A3B8",fontStyle:"italic"}}>No bias signal</span>}{absentSummary&&<div style={{marginTop:8}}><div style={{fontSize:10,fontWeight:700,color:"#D97706",marginBottom:4}}>Absent Perspective</div><div style={{fontSize:11,padding:"6px 9px",borderRadius:7,background:"#FFFBEB",border:"1px solid #FDE68A",color:"#92400E",lineHeight:1.5}}>{absentSummary}</div></div>}</div>
        </div>}
      </div>
      <div style={{background:"#FFFFFF",border:"1px solid #E2E8F0",borderRadius:14,padding:"18px 20px",marginBottom:14,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
        <SectionHead title={"Director Signals ("+d.covered+"/"+d.activeDirectorCount+" active)"} color="#0369A1"/>
        {!d.covered?<PendingNote stage="Directors" running={running} notStarted={!running&&!done}/>:
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:d.omittedDirectors&&d.omittedDirectors.length?10:0}}>
              {d.signals.map(function(s){
                return (
                  <div key={s.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:9,background:"#F8FAFC",border:"1px solid "+s.color+"22"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:22,height:22,borderRadius:6,background:s.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}><span style={{color:s.color}}>{s.icon}</span></div>
                      <span style={{fontSize:11,fontWeight:600,color:"#0F172A"}}>{s.label}</span>
                    </div>
                    <SignalPill signal={s.signal} small={true}/>
                  </div>
                );
              })}
            </div>
            {d.omittedDirectors&&d.omittedDirectors.length>0&&
              <div style={{paddingTop:8,borderTop:"1px solid #F1F5F9"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:0.6,marginBottom:6}}>Not Invoked in This Run</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {d.omittedDirectors.map(function(name,i){return <span key={i} style={{fontSize:10,padding:"3px 9px",borderRadius:10,background:"#F1F5F9",color:"#94A3B8",border:"1px solid #E2E8F0"}}>{name}</span>;})}
                </div>
              </div>
            }
          </div>
        }
      </div>
      {comparator&&comparator.parsed&&
        <div style={{background:"#FFFFFF",border:"1px solid #BBF7D0",borderRadius:14,padding:"18px 20px",marginBottom:14}}>
          <SectionHead title="Comparator Synthesis" color="#059669"/>
          {comparator.parsed.summary&&comparator.parsed.summary.one_paragraph&&<div style={{fontSize:12,color:"#334155",lineHeight:1.7,padding:"10px 12px",borderRadius:8,background:"#F0FDF4",border:"1px solid #BBF7D0",marginBottom:12}}>{comparator.parsed.summary.one_paragraph}</div>}
          {comparator.parsed.coverage_limitations&&<div style={{fontSize:11,color:"#92400E",padding:"7px 10px",borderRadius:8,background:"#FFFBEB",border:"1px solid #FDE68A",marginBottom:10}}><span style={{fontWeight:700}}>Coverage note: </span>{comparator.parsed.coverage_limitations}</div>}
        </div>
      }
    </div>
  );
}


// --- TOGGLE -------------------------------------------------------------------
function Toggle({value,onChange,label,sublabel,color="#0EA5E9"}) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"#FFFFFF",borderRadius:9,border:"1px solid #E2E8F0"}}>
      <div><div style={{fontSize:12,fontWeight:600,color:"#334155"}}>{label}</div>{sublabel&&<div style={{fontSize:11,color:"#64748B",marginTop:2}}>{sublabel}</div>}</div>
      <div onClick={function(){onChange(!value);}} style={{width:40,height:22,borderRadius:11,cursor:"pointer",background:value?color:"#0F172A",border:"1px solid "+(value?color+"88":"#334155"),position:"relative",transition:"all 0.2s",flexShrink:0}}>
        <div style={{position:"absolute",top:3,left:value?20:3,width:14,height:14,borderRadius:"50%",background:value?"#FFFFFF":"#94A3B8",transition:"left 0.2s"}}/>
      </div>
    </div>
  );
}


// --- DOC MANAGER --------------------------------------------------------------
function DocManager({roleId,color,entries,onUpdate,onFetchAll,fetchingIds}) {
  function addEntry(){ onUpdate(roleId,entries.concat([makeDocEntry()])); }
  function removeEntry(id){ var n=entries.filter(function(e){return e.id!==id;}); onUpdate(roleId,n.length?n:[makeDocEntry()]); }
  function updateEntry(id,f,v){ onUpdate(roleId,entries.map(function(e){return e.id===id?Object.assign({},e,{[f]:v}):e;})); }
  var loadedCount=entries.filter(function(e){return e.content;}).length;
  var totalWithUrl=entries.filter(function(e){return e.url&&e.url.trim();}).length;
  return (
    <div style={{marginTop:10}}>
      {entries.map(function(entry,idx){
        var isFetching=fetchingIds&&fetchingIds.has(entry.id);
        var statusEl=isFetching?<Spinner color={color}/>:entry.content?<span style={{color:"#34D399",fontSize:10}}>Loaded</span>:(entry.url&&entry.url.trim()?<span style={{color:"#FBBF24",fontSize:10}}>Pending</span>:<span style={{color:"#334155",fontSize:10}}>Empty</span>);
        return (
          <div key={entry.id} style={{display:"flex",gap:8,alignItems:"center",marginBottom:7}}>
            <div style={{fontSize:11,color:"#94A3B8",width:20,textAlign:"center",flexShrink:0}}>{idx+1}</div>
            <input value={entry.label} onChange={function(e){updateEntry(entry.id,"label",e.target.value);}} placeholder="Label..." style={{width:140,flexShrink:0,background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:7,padding:"5px 9px",color:"#64748B",fontSize:11,outline:"none"}}/>
            <input value={entry.url} onChange={function(e){updateEntry(entry.id,"url",e.target.value);}} placeholder="Google Doc URL..." style={{flex:1,background:"#F8FAFC",border:"1px solid "+(entry.content?color+"44":"#E2E8F0"),borderRadius:7,padding:"5px 9px",color:"#334155",fontSize:11,outline:"none"}}/>
            <div style={{width:64,textAlign:"right",flexShrink:0}}>{statusEl}</div>
            <button onClick={function(){removeEntry(entry.id);}} style={{background:"transparent",border:"none",color:"#94A3B8",fontSize:14,cursor:"pointer",padding:"0 2px"}}>×</button>
          </div>
        );
      })}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}>
        <button onClick={addEntry} style={{fontSize:11,padding:"4px 10px",borderRadius:7,background:"transparent",border:"1px dashed "+color+"44",color:color,cursor:"pointer"}}>+ Add document</button>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {loadedCount>0&&<span style={{fontSize:10,color:"#34D399"}}>{loadedCount}/{entries.length} loaded</span>}
          {totalWithUrl>0&&<button onClick={function(){onFetchAll(roleId);}} style={{fontSize:11,padding:"4px 12px",borderRadius:7,background:color+"22",border:"1px solid "+color+"44",color:color,cursor:"pointer"}}>Fetch {totalWithUrl} doc{totalWithUrl>1?"s":""}</button>}
        </div>
      </div>
    </div>
  );
}


function RoleConfigBlock({role,entries,onUpdate,onFetchAll,fetchingIds}) {
  var [open,setOpen]=useState(false);
  var loaded=entries.filter(function(e){return e.content;}).length;
  return (
    <div style={{background:"#FFFFFF",border:"1px solid "+(open?role.color+"33":"#E2E8F0"),borderRadius:10,marginBottom:8}}>
      <div onClick={function(){setOpen(!open);}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 14px",cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <span style={{fontSize:14,color:role.color}}>{role.icon}</span>
          <span style={{fontSize:12,fontWeight:600,color:"#0F172A"}}>{role.label}</span>
          {role.desc&&<span style={{fontSize:11,color:"#94A3B8"}}>— {role.desc}</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {loaded>0&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:role.color+"18",color:role.color}}>{loaded} loaded</span>}
          <span style={{color:"#94A3B8",fontSize:11}}>{open?"▾":"▸"}</span>
        </div>
      </div>
      {open&&<div style={{padding:"0 14px 14px"}}><DocManager roleId={role.id} color={role.color} entries={entries} onUpdate={onUpdate} onFetchAll={onFetchAll} fetchingIds={fetchingIds}/></div>}
    </div>
  );
}


// --- DIRECTOR CARD ------------------------------------------------------------
function DirectorCard({director,output,loading,expanded,onToggle,confidence,onExport}) {
  var signal = null;
  if (output && output.length > 10) {
    if (/^\[Director failed:/i.test(output.trim())) { signal = "FAILED"; }
    else {
      var dcPatterns = [
        /\*\*Recommendation Signal\*\*:?\s*\[?\*{0,2}(PROCEED|CAUTION|HALT)\*{0,2}\]?/i,
        /Recommendation Signal[^:]*:?\s*\[?\*{0,2}(PROCEED|CAUTION|HALT)\*{0,2}\]?/i,
        /\*\*(PROCEED|CAUTION|HALT)\*\*/i,
      ];
      for (var dci=0; dci<dcPatterns.length; dci++) {
        var dcm = output.match(dcPatterns[dci]);
        if (dcm && dcm[1]) { signal = dcm[1].toUpperCase(); break; }
      }
    }
  }
  var isFailed = signal === "FAILED";
  var sigColor=signal==="PROCEED"?"#059669":signal==="CAUTION"?"#D97706":signal==="HALT"?"#DC2626":signal==="NOT APPLICABLE"?"#64748B":isFailed?"#DC2626":null;
  var sigBg=signal==="PROCEED"?"#D1FAE5":signal==="CAUTION"?"#FEF3C7":signal==="HALT"?"#FEE2E2":signal==="NOT APPLICABLE"?"#F1F5F9":isFailed?"#FEF2F2":null;
  var hasOutput=typeof output==="string"&&output.length>10;
  var isClickable=hasOutput&&!loading;
  return (
    <div style={{background:expanded?"#FAFBFF":"#FFFFFF",border:"1px solid "+(expanded?director.color+"66":hasOutput?"#CBD5E1":"#E2E8F0"),borderRadius:12,padding:"12px 15px",marginBottom:8,transition:"all 0.2s"}}>
      <div onClick={isClickable?onToggle:undefined} style={{display:"flex",alignItems:"center",justifyContent:"space-between",cursor:isClickable?"pointer":"default"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:9,background:director.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}><span style={{color:director.color}}>{director.icon}</span></div>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#0F172A",display:"flex",alignItems:"center",gap:4}}>
              {director.label}
              <InfoTip text={director.desc}/>
            </div>
            <div style={{fontSize:11,color:loading?"#F97316":hasOutput?director.color:"#94A3B8",marginTop:1}}>{loading?"Analysing...":hasOutput?(expanded?"Click to collapse":"Click to expand"):director.desc}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {loading&&<Spinner color={director.color}/>}
          {isFailed&&<span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FECACA"}}>FAILED</span>}
          {sigColor&&!isFailed&&isClickable&&<span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:sigBg,color:sigColor}}>{signal}</span>}
          {isClickable&&typeof onExport==="function"&&<button onClick={function(e){e.stopPropagation();onExport();}} style={{fontSize:10,padding:"3px 10px",borderRadius:7,border:"1px solid #E2E8F0",background:"#FFFFFF",color:"#64748B",cursor:"pointer"}}>Export</button>}
          {isClickable&&<span style={{color:director.color,fontSize:13,fontWeight:700,width:14,textAlign:"center",display:"inline-block",transform:expanded?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▶</span>}
        </div>
      </div>
      {expanded&&hasOutput&&<div style={{marginTop:12,paddingTop:12,borderTop:"2px solid "+director.color+"22",fontSize:12,lineHeight:1.8,color:"#334155",whiteSpace:"pre-wrap"}} dangerouslySetInnerHTML={{__html:renderMd(output,director.color)}}/>}
    </div>
  );
}


function OmittedDirectorCard({director}) {
  return (
    <div style={{background:"#FAFAFA",border:"1px dashed #E2E8F0",borderRadius:12,padding:"10px 15px",marginBottom:8,display:"flex",alignItems:"center",gap:10,opacity:0.6}}>
      <div style={{width:32,height:32,borderRadius:9,background:"#F1F5F9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}><span style={{color:"#94A3B8"}}>{director.icon}</span></div>
      <div><div style={{fontSize:12,fontWeight:600,color:"#94A3B8"}}>{director.label}</div><div style={{fontSize:11,color:"#CBD5E0"}}>Not invoked in this run</div></div>
      <span style={{marginLeft:"auto",fontSize:10,padding:"2px 8px",borderRadius:10,background:"#F1F5F9",color:"#94A3B8",border:"1px solid #E2E8F0"}}>OMITTED</span>
    </div>
  );
}


function extractStatusBadge(content, type) {
  if (!content || content.length < 10) return null;
  var text = content;
  var label = null, col = null, bg = null;
  if (type === "reality") {
    if (/Reality friction signals identified/i.test(text)) label = "FRICTION ⚠";
    else if (/No material reality frictions/i.test(text)) label = "GROUNDED";
  } else if (type === "meta") {
    var m2 = text.match(/Integration Signal\*?\*?:?\s*\*{0,2}(HIGH|MEDIUM|LOW)\*{0,2}/i);
    if (m2) label = m2[1].toUpperCase();
  } else if (type === "surfacemap") {
    var domM = text.match(/\*\*Dominant Signal\*\*[^A-Z\n]*\n?\s*\[?(PRELIMINARY[^—\n]*—\s*)?(PROCEED|CAUTION|HALT|MIXED)/i);
    if (domM) label = domM[2].toUpperCase();
    else if (/high tension|highly contested/i.test(text)) label = "HIGH TENSION";
    else if (/low tension|minimal tension/i.test(text)) label = "LOW TENSION";
  } else if (type === "epistemic") {
    if (/\bSTRONG\b/.test(text)) label = "STRONG";
    else if (/\bADEQUATE\b/.test(text)) label = "ADEQUATE";
    else if (/\bWEAK\b/.test(text)) label = "WEAK";
    else if (/\bCOMPROMISED\b/.test(text)) label = "COMPROMISED";
  } else if (type === "probe") {
    if (/BOARD REASONING SOUND/i.test(text)) label = "SOUND";
    else if (/SIGNIFICANT GAPS/i.test(text)) label = "REASONING GAPS";
    else if (/CONCLUSION CHALLENGED/i.test(text)) label = "CHALLENGED";
  } else if (type === "stress") {
    var m3 = text.match(/Fragility Score[^0-9]*(\d+(?:\.\d+)?)(?:\s*\/\s*10)?/);
    if (m3) { label = "FRAGILITY "+m3[1]+"/10"; }
  } else if (type === "chair") {
    if (/CONDITIONAL APPROVAL/i.test(text)) label = "CONDITIONAL ✓";
    else if (/PROCEED WITH CONDITIONS/i.test(text)) label = "PROCEED ✓";
    else if (/PROCEED WITH CAUTION/i.test(text)) label = "CAUTION ⚠";
    else if (/DO NOT PROCEED/i.test(text)) label = "HALT ✗";
    else if (/\bPILOT\b/i.test(text)) label = "PILOT →";
    else if (/\bDEFER\b/i.test(text)) label = "DEFER ⏸";
  }
  if (!label) return null;
  if (label === "STRONG" || label === "SOUND" || label === "PROCEED ✓" || label === "LOW TENSION" || label === "GROUNDED") { col="#059669"; bg="#D1FAE5"; }
  else if (label === "CONDITIONAL ✓") { col="#0891B2"; bg="#ECFEFF"; }
  else if (label === "ADEQUATE" || label === "CAUTION ⚠" || label === "PILOT →" || label === "CAUTION" || label === "MIXED" || label === "FRICTION ⚠") { col="#D97706"; bg="#FEF3C7"; }
  else if (label === "WEAK" || label === "REASONING GAPS" || label === "DEFER ⏸") { col="#DC2626"; bg="#FEE2E2"; }
  else if (label === "COMPROMISED" || label === "CHALLENGED" || label === "HALT ✗" || label === "HIGH TENSION" || label === "HALT") { col="#7C3AED"; bg="#EDE9FE"; }
  else if (/FRAGILITY/.test(label)) { var fnum=parseInt(label); col=fnum>=7?"#DC2626":fnum>=4?"#D97706":"#059669"; bg=fnum>=7?"#FEE2E2":fnum>=4?"#FEF3C7":"#D1FAE5"; }
  if (!col) { col="#64748B"; bg="#F1F5F9"; }
  return <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:8,background:bg,color:col,flexShrink:0}}>{label}</span>;
}


function Panel({title,icon,color,content,loading,onExport,badge,children,tooltip}) {
  var [open,setOpen]=useState(false);
  var hasContent=!!((typeof content==="string"&&content.length>5)||children);
  return (
    <div style={{background:"#FFFFFF",border:"1px solid "+(content?color+"40":"#E2E8F0"),borderRadius:14,marginBottom:12,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"+(content?", 0 0 0 1px "+color+"10":"")}}>
      <div onClick={hasContent?function(){setOpen(!open);}:undefined} style={{display:"flex",alignItems:"center",gap:8,padding:"14px 16px",cursor:hasContent?"pointer":"default",userSelect:"none",position:"relative"}}>
        <div style={{width:28,height:28,borderRadius:8,background:color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}><span style={{color:color}}>{icon}</span></div>
        <span style={{fontSize:13,fontWeight:700,color:"#0F172A",flex:1,display:"inline-flex",alignItems:"center"}}>
          {title}
          {tooltip&&<InfoTip text={tooltip}/>}
        </span>
        {loading&&<Spinner color={color}/>}
        {badge}
        {hasContent&&!loading&&onExport&&<button onClick={function(e){e.stopPropagation();onExport();}} style={{fontSize:10,padding:"3px 10px",borderRadius:7,border:"1px solid #E2E8F0",background:"#FFFFFF",color:"#64748B",cursor:"pointer"}}>Export</button>}
        {hasContent&&!loading&&<span style={{color:color,fontSize:13,fontWeight:700,display:"inline-block",transform:open?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.2s",flexShrink:0}}>▶</span>}
      </div>
      {open&&hasContent&&<div style={{padding:"0 16px 16px",borderTop:"1px solid "+color+"18"}}>
        {content&&<div style={{paddingTop:14,fontSize:12,lineHeight:1.85,color:"#334155",whiteSpace:"pre-wrap"}} dangerouslySetInnerHTML={{__html:renderMd(content,color)}}/>}
        {children&&<div style={{paddingTop:content?12:14}}>{children}</div>}
      </div>}
      {!hasContent&&!loading&&<div style={{padding:"0 16px 12px",fontSize:12,color:"#94A3B8",fontStyle:"italic"}}>Awaiting prior stage...</div>}
    </div>
  );
}


function ChairDialogue({dialogueSystem,dialogueHistory,onDialogueHistory}) {
  var [input,setInput]=useState("");
  var [responding,setResponding]=useState(false);
  var [dialogError,setDialogError]=useState("");
  var bottomRef=useRef(null);
  async function send(text){
    var msg=(text||input).trim();
    if(!msg||responding) return;
    setInput(""); setDialogError("");
    var userMsg={role:"user",content:msg};
    var next=dialogueHistory.concat([userMsg]);
    onDialogueHistory(next);
    setResponding(true);
    try {
      var reply=await callClaudeChat(dialogueSystem,next);
      onDialogueHistory(next.concat([{role:"assistant",content:reply}]));
      setTimeout(function(){if(bottomRef.current) bottomRef.current.scrollIntoView({behavior:"smooth"});},100);
    } catch(e){ setDialogError(e.message); }
    setResponding(false);
  }
  return (
    <div style={{marginTop:18,borderTop:"1px solid rgba(14,165,233,0.18)",paddingTop:16}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <span style={{fontSize:12,color:"#0369A1",fontWeight:700}}>Chair Dialogue</span>
        <span style={{fontSize:11,color:"#94A3B8"}}>— push back, ask follow-ups, present new information</span>
      </div>
      {dialogueHistory.length===0&&<div style={{marginBottom:12}}>
        <div style={{fontSize:11,color:"#94A3B8",marginBottom:7}}>Suggested questions:</div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {SUGGESTED_PUSHBACKS.map(function(s,i){return <button key={i} onClick={function(){send(s);}} style={{fontSize:11,padding:"7px 12px",borderRadius:8,background:"transparent",border:"1px solid rgba(14,165,233,0.15)",color:"#64748B",cursor:"pointer",textAlign:"left",lineHeight:1.5}}>{s}</button>;})}
        </div>
      </div>}
      {dialogueHistory.length>0&&<div style={{maxHeight:460,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,marginBottom:12}}>
        {dialogueHistory.map(function(msg,i){
          return <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start"}}>
            <div style={{width:26,height:26,borderRadius:7,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,background:msg.role==="user"?"#F1F5F9":"rgba(14,165,233,0.1)",border:msg.role==="user"?"1px solid #E2E8F0":"1px solid #BFDBFE",color:msg.role==="user"?"#334155":"#0369A1"}}>{msg.role==="user"?"U":"C"}</div>
            <div style={{flex:1,borderRadius:10,padding:"9px 12px",background:msg.role==="user"?"#FFFFFF":"rgba(14,165,233,0.03)",border:"1px solid "+(msg.role==="user"?"#F1F5F9":"rgba(14,165,233,0.12)")}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:0.6,marginBottom:5,color:msg.role==="user"?"#94A3B8":"#0369A1"}}>{msg.role==="user"?"DECISION-MAKER":"CHAIR"}</div>
              <div style={{fontSize:12,lineHeight:1.75,color:"#334155",whiteSpace:"pre-wrap"}} dangerouslySetInnerHTML={{__html:renderMd(msg.content,msg.role==="user"?"#64748B":"#0EA5E9")}}/>
            </div>
          </div>;
        })}
        {responding&&<div style={{display:"flex",gap:9}}><div style={{width:26,height:26,borderRadius:7,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#DBEAFE",border:"1px solid #BFDBFE",color:"#0369A1",fontSize:11}}>C</div><div style={{padding:"10px 12px",background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:10}}><Spinner color="#0EA5E9"/></div></div>}
        <div ref={bottomRef}/>
      </div>}
      {dialogError&&<div style={{marginBottom:8,padding:"7px 11px",borderRadius:7,background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)",color:"#F87171",fontSize:11}}>⚠ {dialogError}</div>}
      <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
        <textarea value={input} onChange={function(e){setInput(e.target.value);}} disabled={responding}
          placeholder="Challenge the recommendation, present new information, or ask the Chair to resolve tensions..."
          onKeyDown={function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
          style={{flex:1,minHeight:58,maxHeight:120,background:"#F8FAFC",border:"1px solid rgba(14,165,233,0.18)",borderRadius:9,padding:"8px 12px",color:"#334155",fontSize:12,lineHeight:1.6,resize:"vertical",outline:"none",fontFamily:"inherit"}}/>
        <button onClick={function(){send();}} disabled={responding||!input.trim()} style={{padding:"10px 18px",borderRadius:9,border:"none",fontSize:12,fontWeight:600,flexShrink:0,alignSelf:"flex-end",background:(responding||!input.trim())?"#F1F5F9":"linear-gradient(135deg,#0EA5E9,#0369A1)",color:(responding||!input.trim())?"#94A3B8":"#FFFFFF"}}>{responding?"...":"Send"}</button>
      </div>
      <div style={{marginTop:4,fontSize:10,color:"#334155"}}>Enter to send · Shift+Enter for new line</div>
    </div>
  );
}


// --- MAIN APP -----------------------------------------------------------------
function PHDSS() {
  var [tab,setTab]=useState("board");
  var [decision,setDecision]=useState("");
  var [decisionSignal,setDecisionSignal]=useState("");
  var [orgContext,setOrgContext]=useState("");
  var [sessionEvidence,setSessionEvidence]=useState([]);
  var [sessionEvidenceOpen,setSessionEvidenceOpen]=useState(false);
  var [constraintsText,setConstraintsText]=useState("");
  var [evidenceLinksText,setEvidenceLinksText]=useState("");
  var [webSearch,setWebSearch]=useState(false);
  var [publicWebSearch,setPublicWebSearch]=useState(false);
  var [modeFamily,setModeFamily]=useState("GOVERNANCE");
  var [analysisMode,setAnalysisMode]=useState("FULL");
  var [advisoryMode,setAdvisoryMode]=useState("DIRECTOR_BRIEF");
  var [briefDirectorId,setBriefDirectorId]=useState("digital");
  var [lensAId,setLensAId]=useState("digital");
  var [lensBId,setLensBId]=useState("safety");
  var [chairSelectedIds,setChairSelectedIds]=useState([]);
  var [advisoryOutput,setAdvisoryOutput]=useState({});
  var [lensComparator,setLensComparator]=useState("");
  var [lensComparatorLoading,setLensComparatorLoading]=useState(false);
  var [advisoryDone,setAdvisoryDone]=useState(false);
  var [docs,setDocs]=useState(initDocs);
  var [fetchingIds,setFetchingIds]=useState(new Set());
  var [running,setRunning]=useState(false);
  var [done,setDone]=useState(false);
  var [partialFailure,setPartialFailure]=useState(false);
  var [dirOutputs,setDirOutputs]=useState({});
  var [dirLoading,setDirLoading]=useState({});
  var [meta,setMeta]=useState(""); var [metaLoading,setMetaLoading]=useState(false);
  var [surfaceMap,setSurfaceMap]=useState(""); var [surfaceMapLoading,setSurfaceMapLoading]=useState(false);
  var [realityAnchor,setRealityAnchor]=useState(""); var [realityAnchorLoading,setRealityAnchorLoading]=useState(false);
  var [stress,setStress]=useState(""); var [stressLoading,setStressLoading]=useState(false);
  var [stressTestResult,setStressTestResult]=useState(null);
  var [chair,setChair]=useState(""); var [chairLoading,setChairLoading]=useState(false);
  var [epistemic,setEpistemic]=useState(""); var [epistemicLoading,setEpistemicLoading]=useState(false);
  var [probe,setProbe]=useState(""); var [probeLoading,setProbeLoading]=useState(false);
  // Synthesis output refs — always hold latest value regardless of React state flush timing.
  // Export buttons read these refs to avoid stale-closure empty-export bug (Run 12 Epistemic).
  var epistemicRef=useRef(""); var probeRef=useRef(""); var chairRef=useRef("");
  var metaRef=useRef(""); var realityAnchorRef=useRef(""); var stressRef=useRef("");
  var surfaceMapRef=useRef("");
  var [comparator,setComparator]=useState(null);
  var [ledger,setLedger]=useState([]);
  var [autoContinue,setAutoContinue]=useState(true);
  var [stagesDone,setStagesDone]=useState(0);
  var [expandedDirs,setExpandedDirs]=useState({});
  var [error,setError]=useState("");
  var [configSection,setConfigSection]=useState("directors");
  var [dialogueHistory,setDialogueHistory]=useState([]);
  var [directorResultsRef,setDirectorResultsRef]=useState([]);
  var [activeDirectorsRef,setActiveDirectorsRef]=useState(DIRECTORS);
  var [omittedDirectorsRef,setOmittedDirectorsRef]=useState([]);
  var [decisionId,setDecisionId]=useState(function(){return makeDecisionId();});


  // --- INSTRUCTION FILE STATE ---
  var [instructions,setInstructions]=useState({});
  var [instrLoadState,setInstrLoadState]=useState("idle"); // idle | loading | ready | partial | failed
  var [instrProgress,setInstrProgress]=useState({loaded:0,total:22,failed:[]});


  // Load instruction files on mount
  useEffect(function(){
    setInstrLoadState("loading");
    loadAllInstructions(function(done, total){
      setInstrProgress(function(p){ return Object.assign({},p,{loaded:done,total:total}); });
    }).then(function(result){
      setInstructions(result.loaded);
      setInstrProgress(function(p){ return Object.assign({},p,{failed:result.failed}); });
      if(result.failed.length===0) setInstrLoadState("ready");
      else if(Object.keys(result.loaded).length>0) setInstrLoadState("partial");
      else setInstrLoadState("failed");
    });
  },[]);


  var chairSignal=safeMatch(chair,/\*\*Chair Recommendation[^*]*\*\*:?\s*\*?\*?\s*(DO NOT PROCEED|CONDITIONAL APPROVAL|PROCEED WITH CONDITIONS|PROCEED WITH CAUTION|PILOT|DEFER|HALT)/i,1)
    ||safeMatch(chair,/Chair Recommendation[:\s]+\*{0,2}(CONDITIONAL APPROVAL[^.\n*]*|DO NOT PROCEED|PROCEED WITH CONDITIONS|PROCEED WITH CAUTION|PILOT|DEFER|HALT)\*{0,2}/i,1);
  var totalLoadedDocs=Object.values(docs).reduce(function(acc,arr){return acc+arr.filter(function(e){return e.content;}).length;},0);
  var hasAnyDocs=totalLoadedDocs>0;
  var dialogueSystem=done?chairDialogueSystem(docs.chair||[],decision,directorResultsRef.map(function(d){return "### "+d.label+"\n"+d.output;}).join("\n\n"),meta,stress,chair):"";


  var dirConfidence={};
  if(epistemic){
    activeDirectorsRef.forEach(function(d){
      var re=new RegExp(d.label+"[^-]*-\\s*(HIGH|MEDIUM|LOW|UNCERTAIN)","i");
      var cm=epistemic.match(re);
      if(cm) dirConfidence[d.id]=cm[1];
    });
  }


  var previewActive=resolveActiveDirectors(analysisMode, decision, chairSelectedIds);
  var previewOmitted=DIRECTORS.filter(function(d){return !previewActive.some(function(a){return a.id===d.id;});});


  function toggleChairDir(id){
    setChairSelectedIds(function(prev){
      if(prev.indexOf(id)!==-1) return prev.filter(function(x){return x!==id;});
      return prev.concat([id]);
    });
  }


  function updateRoleDocs(roleId,entries){ setDocs(function(p){return Object.assign({},p,{[roleId]:entries});}); }


  async function fetchRoleDocs(roleId){
    var toFetch=docs[roleId].filter(function(e){return e.url&&e.url.trim()&&!e.content;});
    if(!toFetch.length) return;
    setFetchingIds(function(p){return new Set(Array.from(p).concat(toFetch.map(function(e){return e.id;})));});
    for(var i=0;i<toFetch.length;i++){
      var entry=toFetch[i];
      var content=await fetchGoogleDoc(entry.url);
      var eid=entry.id;
      setDocs(function(p){var arr=p[roleId].map(function(e){return e.id===eid?Object.assign({},e,{content:content||"",status:content?"loaded":"error"}):e;}); return Object.assign({},p,{[roleId]:arr});});
      setFetchingIds(function(p){var n=new Set(p); n.delete(eid); return n;});
    }
  }


  function makeSessionEntry(type) { return { id:Math.random().toString(36).slice(2), label:"", url:"", content:"", status:"empty", type:type||"url" }; }
  function addSessionEntry(type) { setSessionEvidence(function(prev){ return prev.concat([makeSessionEntry(type)]); }); }
  function removeSessionEntry(id) { setSessionEvidence(function(prev){ return prev.filter(function(e){ return e.id!==id; }); }); }
  function updateSessionEntry(id, field, value) { setSessionEvidence(function(prev){ return prev.map(function(e){ return e.id===id?Object.assign({},e,{[field]:value}):e; }); }); }
  async function fetchSessionDoc(id) {
    var entry = sessionEvidence.find(function(e){ return e.id===id; });
    if (!entry||!entry.url.trim()) return;
    updateSessionEntry(id, "status", "fetching");
    var content = await fetchGoogleDoc(entry.url);
    if (content) { updateSessionEntry(id, "content", content); updateSessionEntry(id, "status", "loaded"); }
    else { updateSessionEntry(id, "status", "error"); }
  }


  function getSessionContext(){
    return {
      decisionSignal:decisionSignal, orgContext:orgContext,
      constraints:constraintsText.split("\n").map(function(s){return s.trim();}).filter(Boolean),
      evidenceLinks:evidenceLinksText.split("\n").map(function(s){return s.trim();}).filter(Boolean),
    };
  }


  function commitToLedger(results,metaOut,stressOut,chairOut,epistemicOut,probeOut,comparatorData,activeDir,omittedDir,mode,stressResult){
    var record={
      decision_id:decisionId, schema_version:"2.5.0", created_at:new Date().toISOString(),
      governance_family:"GOVERNANCE",
      session_governance_status:(function(){
        var hasChair=chairOut&&chairOut.length>50&&!/Chair failed|Director failed/i.test(chairOut);
        var failedDirs=results.filter(function(r){return /^\[Director failed:/i.test((r.output||"").trim());});
        if(hasChair&&failedDirs.length===0) return "FULL_VERDICT";
        if(hasChair||results.filter(function(r){return !/^\[Director failed:/i.test((r.output||"").trim());}).length>0) return "PARTIAL_EVIDENCE_BASE";
        return "INCOMPLETE";
      })(),
      run_intensity:mode==="FULL"?"MAXIMUM":mode==="CORE"?"MINIMUM_VIABLE":"CUSTOM",
      analysis_mode:mode||"FULL",
      coverage_ratio:(activeDir||DIRECTORS).length+"/"+DIRECTORS.length,
      coverage_note:buildCoverageNote(mode||"FULL",activeDir||DIRECTORS,DIRECTORS),
      active_directors:(activeDir||DIRECTORS).map(function(d){return d.id;}),
      omitted_directors:(omittedDir||[]).map(function(d){return d.id;}),
      question:decision, decision_signal:decisionSignal, org_context:orgContext,
      web_search_enabled:webSearch, docs_loaded:totalLoadedDocs+(sessionEvidence.filter(function(e){return e.content;}).length),
      proceed_count:results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(PROCEED)/,1)==="PROCEED";}).length,
      caution_count:results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(CAUTION)/,1)==="CAUTION";}).length,
      halt_count:results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(HALT)/,1)==="HALT";}).length,
      chair_recommendation:safeMatch(chairOut,/\*\*Chair Recommendation[^*]*\*\*:?\s*\*?\*?\s*(CONDITIONAL APPROVAL[^.\n*]*|DO NOT PROCEED|PROCEED WITH CONDITIONS|PROCEED WITH CAUTION|PILOT|DEFER|HALT)/i,1)||null,
      epistemic_score:(function(){
        var m=epistemicOut.match(/\*\*Epistemic Health Score\*\*:?\s*(STRONG|ADEQUATE|WEAK|COMPROMISED)/i);
        if(m) return m[1].toUpperCase();
        var m2=epistemicOut.match(/Epistemic Health Score[:\s]+(STRONG|ADEQUATE|WEAK|COMPROMISED)/i);
        if(m2) return m2[1].toUpperCase();
        return findSignal(epistemicOut,["STRONG","ADEQUATE","COMPROMISED","WEAK"]);
      })(),
      probe_verdict:findSignal(probeOut,["BOARD REASONING SOUND","SIGNIFICANT GAPS","CONCLUSION CHALLENGED"]),
      fragility_score:parseInt(safeMatch(stressOut,/\*\*Fragility Score\*\*:?[^\d]*(\d+)/,1))||null,
      stress_test_ran:(stressResult&&stressResult.run)||false,
      stress_test_reason:(stressResult&&stressResult.reason)||null,
      instruction_source: instrLoadState==="ready"?"github":instrLoadState==="partial"?"github_partial":"inline_fallback",
      comparator:comparatorData||null,
      outputs:{meta:metaOut,stress:stressOut,chair:stripCalibrationBleed(chairOut),epistemic:epistemicOut?stripCalibrationBleed(epistemicOut):null,probe:stripCalibrationBleed(probeOut||"")||null},      tags:[],
    };
    setLedger(function(prev){return prev.concat([record]);});
    return record;
  }


  async function runBoard(){
    if(!decision.trim()||running) return;
    var activeDir=resolveActiveDirectors(analysisMode,decision,chairSelectedIds);
    var omittedDir=DIRECTORS.filter(function(d){return !activeDir.some(function(a){return a.id===d.id;});});
    setActiveDirectorsRef(activeDir); setOmittedDirectorsRef(omittedDir);
    setRunning(true); setDone(false); setPartialFailure(false); setError("");
    setDirOutputs({}); setMeta(""); setSurfaceMap(""); setRealityAnchor(""); setStress(""); setChair("");
    setEpistemic(""); setProbe(""); setComparator(null);
    // Reset synthesis refs alongside state so stale content from previous runs cannot leak into exports
    epistemicRef.current=""; probeRef.current=""; chairRef.current=""; metaRef.current=""; realityAnchorRef.current=""; stressRef.current=""; surfaceMapRef.current="";
    setStagesDone(0); setDialogueHistory([]); setDirectorResultsRef([]); setExpandedDirs({});
    var loading={}; activeDir.forEach(function(d){loading[d.id]=true;}); setDirLoading(loading);
    var ctx=getSessionContext();
    var results=[],metaOut="",surfaceMapOut="",realityAnchorOut="",stressOut="",chairOut="";
    var epistemicOut="",probeOut="",compData=null;
    var dirBriefs={}, stageErrors=[];


    try {
      var results_seq = [];
      for (var di = 0; di < activeDir.length; di++) {
        var dirI = activeDir[di];
        var dirId_i = dirI.id;
        if (di > 0) await new Promise(function(r){ setTimeout(r, 3000); });
        try {
          var sysPrompt_i = directorSystem(dirI, docs[dirId_i]||[], webSearch, ctx, publicWebSearch, sessionEvidence, analysisMode, activeDir, instructions);
          var dirOut_i;
          var isServerErr = function(e){ return /internal server error|500|server error/i.test(e.message); };
          try { dirOut_i = await callClaude_synthesis(sysPrompt_i, "Decision under review: "+decision, autoContinue, webSearch||publicWebSearch); }
          catch(err1) {
            if (isServerErr(err1)) {
              await new Promise(function(r){ setTimeout(r, 10000); });
              try { dirOut_i = await callClaude_synthesis(sysPrompt_i, "Decision under review: "+decision, autoContinue, webSearch||publicWebSearch); }
              catch(err2) {
                if (isServerErr(err2)) {
                  await new Promise(function(r){ setTimeout(r, 15000); });
                  dirOut_i = await callClaude_synthesis(sysPrompt_i, "Decision under review: "+decision, autoContinue, webSearch||publicWebSearch);
                } else { throw err2; }
              }
            } else { throw err1; }
          }
          var cId=dirId_i+"", cOut=deduplicateSections(stripCalibrationBleed(dirOut_i+""));
          // Signal rescue: if output has no Recommendation Signal line (truncation), fire a targeted completion.
          var hasSignal = /\*\*Recommendation Signal\*\*/.test(cOut);
          if (!hasSignal && cOut.length > 500) {
            try {
              var rescueBody = {
                model:"claude-sonnet-4-20250514", max_tokens:300,
                system: sysPrompt_i,
                messages: [
                  {role:"user",      content: "Decision under review: "+decision},
                  {role:"assistant", content: cOut},
                  {role:"user",      content: "Your analysis was cut off before the closing signal line. Based solely on your analysis above, complete the output now with only: **Recommendation Signal**: [PROCEED/CAUTION/HALT] - one sentence rationale. Nothing else."}
                ]
              };
              var rescueResp = await fetch("https://api.anthropic.com/v1/messages", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(rescueBody)});
              var rescueData = await rescueResp.json();
              var rescueText = (rescueData.content||[]).map(function(b){return b.text||"";}).join("").trim();
              if (rescueText && /Recommendation Signal/i.test(rescueText)) cOut = cOut + "\n\n" + rescueText;
            } catch(rescueErr) { /* signal rescue failed — output remains without signal line */ }
          }
          setDirOutputs(function(p){var n=Object.assign({},p); n[cId]=cOut; return n;});
          setDirLoading(function(p){var n=Object.assign({},p); n[cId]=false; return n;});
          results_seq.push(Object.assign({}, dirI, {output: cOut}));
          try { var brief_i=await compressDirectorOutput(dirI.label, cOut); dirBriefs[cId]=brief_i; }
          catch(compErr) { dirBriefs[cId]=null; }
        } catch(dirErr) {
          var eId=dirId_i+""; var errMsg="[Director failed: "+dirErr.message+"]";
          setDirLoading(function(p){var n=Object.assign({},p); n[eId]=false; return n;});
          setDirOutputs(function(p){var n=Object.assign({},p); n[eId]=errMsg; return n;});
          stageErrors.push(dirI.label+" failed");
          results_seq.push(Object.assign({}, dirI, {output: errMsg}));
          dirBriefs[dirId_i]=null;
        }
      }
      results=results_seq; setDirectorResultsRef(results); setStagesDone(1);


      var briefSummary=results.map(function(d){
        var brief=dirBriefs[d.id];
        return brief?"### "+d.label+"\n"+formatBriefForSynthesis(brief, d.output):"### "+d.label+"\n"+d.output;
      }).join("\n\n");


      // Fix P1-3: Compute authoritative signal counts from results[] and inject into
      // the Surface Map user message so the LLM cannot produce a divergent tally.
      var _smProceed=results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(PROCEED)/,1)==="PROCEED";}).length;
      var _smCaution=results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(CAUTION)/,1)==="CAUTION";}).length;
      var _smHalt=results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(HALT)/,1)==="HALT";}).length;
      // NOT APPLICABLE: Directors that correctly scoped out (e.g. Digital on non-digital decisions).
      // Must be counted separately so the Surface Map does not mis-report them as PROCEED or UNDEFINED.
      var _smNotApplicable=results.filter(function(r){return /NOT APPLICABLE/i.test(r.output) && !safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(PROCEED|CAUTION|HALT)/i,1);}).length;
      var _smUndefined=results.length-_smProceed-_smCaution-_smHalt-_smNotApplicable;
      // Compute authoritative dominant signal — highest count wins; HALT overrides only if strictly > CAUTION
      var _smDominant=(_smHalt>_smCaution&&_smHalt>_smProceed)?"HALT":(_smCaution>=_smHalt&&_smCaution>=_smProceed)?"CAUTION":(_smProceed>0)?"PROCEED":"MIXED";
      var signalCountNote="\n\n[AUTHORITATIVE SIGNAL COUNTS — use these exact figures in your Signal Tally, do not recount from text: "+_smProceed+" PROCEED / "+_smCaution+" CAUTION / "+_smHalt+" HALT"+(_smNotApplicable>0?" / "+_smNotApplicable+" NOT APPLICABLE":"")+(_smUndefined>0?" / "+_smUndefined+" UNDEFINED":"")+". Total directors: "+results.length+". DOMINANT SIGNAL: "+_smDominant+" — use exactly this single word for the Dominant Signal field, not a compound like HALT/CAUTION. NOT APPLICABLE means the Director correctly determined the proposal is outside their mandate — do not count as PROCEED.]";
      try{setSurfaceMapLoading(true);surfaceMapOut=await callClaude_synthesis(surfaceMapperSystem(analysisMode,activeDir,instructions),"Decision: "+decision+"\n\nAll Director Governance Briefs:\n"+briefSummary+signalCountNote,autoContinue);setSurfaceMap(surfaceMapOut);surfaceMapRef.current=surfaceMapOut;}catch(e){stageErrors.push("Surface Mapper failed");}
      setSurfaceMapLoading(false); setStagesDone(2);


      // Epistemic Audit uses compressed briefs + confidence self-ratings to reduce token load.
      // Architecture change (Run 22): fullDirSummary caused empty outputs on 3-document runs
      // because the full Director text exceeded context budget for synthesis completion.
      // epistemicBriefSummary uses governance briefs (compressed) + appends each Director's
      // self-reported confidence level and fragility signals so the Auditor can make
      // independent assessments without requiring full Director outputs.
      var fullDirSummary=results.map(function(d){return "### "+d.label+"\n"+d.output;}).join("\n\n");
      var epistemicBriefSummary=results.map(function(r){
        var brief=dirBriefs[r.id];
        var confMatch=r.output.match(/Confidence:?\s*(HIGH|MEDIUM|LOW)/i);
        var confLabel=confMatch?"\nDirector self-rated confidence: "+confMatch[1]:"";
        var fragMatch=r.output.match(/A\)\s*Fragility signals identified:([^\n]+(?:\n[^\n*#]{0,200})*)/i);
        var fragLabel=fragMatch?"\nFragility: "+fragMatch[1].substring(0,300).replace(/\n/g," "):"";
        return brief
          ? "### "+r.label+"\n"+formatBriefForSynthesis(brief, r.output)+confLabel+fragLabel
          : "### "+r.label+"\n"+r.output.substring(0,1500)+confLabel+fragLabel;
      }).join("\n\n");
      try{
        setEpistemicLoading(true);
        epistemicOut=await callClaude_synthesis(epistemicAuditorSystem(analysisMode,activeDir,instructions),"Decision: "+decision+"\n\nDirector Governance Briefs (with confidence ratings):\n"+epistemicBriefSummary,autoContinue);
        // Guard: if output is suspiciously short, retry up to twice with fresh call.
        // Empty = ~839 bytes. Near-empty = ~1000-2000 bytes.
        if(epistemicOut && epistemicOut.length < 2000) {
          console.warn("PHDSS: Epistemic output short ("+epistemicOut.length+" chars), retry 1 of 2...");
          await new Promise(function(r){setTimeout(r,2000);});
          epistemicOut=await callClaude_synthesis(epistemicAuditorSystem(analysisMode,activeDir,instructions),"Decision: "+decision+"\n\nDirector Governance Briefs (with confidence ratings):\n"+epistemicBriefSummary,autoContinue);
          if(epistemicOut && epistemicOut.length < 2000) {
            console.warn("PHDSS: Epistemic still short ("+epistemicOut.length+" chars), retry 2 of 2...");
            await new Promise(function(r){setTimeout(r,4000);});
            epistemicOut=await callClaude_synthesis(epistemicAuditorSystem(analysisMode,activeDir,instructions),"Decision: "+decision+"\n\nDirector Governance Briefs (with confidence ratings):\n"+epistemicBriefSummary,autoContinue);
          }
        }
        var epistemicCleaned=epistemicOut?stripCalibrationBleed(epistemicOut):epistemicOut;
        setEpistemic(epistemicCleaned);epistemicRef.current=epistemicCleaned;
        epistemicOut=epistemicCleaned;
      }catch(e){stageErrors.push("Epistemic failed");}
      setEpistemicLoading(false); setStagesDone(3);


      try{setMetaLoading(true);metaOut=await callClaude_synthesis(metaSystem(docs.meta||[],webSearch,publicWebSearch,sessionEvidence,analysisMode,activeDir,instructions),"Decision: "+decision+"\n\nDecision Surface Map:\n"+surfaceMapOut+"\n\nDirector Governance Briefs:\n"+briefSummary+(epistemicOut?"\n\nEpistemic Audit:\n"+epistemicOut:""),autoContinue,webSearch||publicWebSearch);setMeta(metaOut);metaRef.current=metaOut;}catch(e){stageErrors.push("META failed");}
      setMetaLoading(false); setStagesDone(4);


      try{setRealityAnchorLoading(true);realityAnchorOut=await callClaude_synthesis(realityAnchorSystem(analysisMode,activeDir,instructions),"Decision: "+decision+"\n\nDirector Governance Briefs:\n"+briefSummary+"\n\nDecision Surface Map:\n"+surfaceMapOut+"\n\nMETA Synthesis:\n"+metaOut,autoContinue);setRealityAnchor(realityAnchorOut);realityAnchorRef.current=realityAnchorOut;}catch(e){stageErrors.push("Reality Anchor failed");}
      setRealityAnchorLoading(false); setStagesDone(5);


      try{
        setProbeLoading(true);
        var sigs=results.map(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(PROCEED|CAUTION|HALT)/,1);}).filter(Boolean);
        var sigCounts=sigs.reduce(function(a,s){return Object.assign({},a,{[s]:(a[s]||0)+1});},{});
        var dominant=Object.entries(sigCounts).sort(function(a,b){return b[1]-a[1];})[0]?.[0]||"UNKNOWN";
        probeOut=await callClaude_synthesis(adversarialProbeSystem(dominant,analysisMode,activeDir,instructions),"Decision: "+decision+"\n\nAll Director Governance Briefs:\n"+briefSummary+"\n\nMETA-AUTHOR Synthesis:\n"+metaOut+"\n\nReality Anchor:\n"+realityAnchorOut,autoContinue);
        setProbe(probeOut);probeRef.current=probeOut;
      }catch(e){stageErrors.push("Probe failed");}
      setProbeLoading(false); setStagesDone(6);


      var probeVerdict=findSignal(probeOut,["BOARD REASONING SOUND","SIGNIFICANT GAPS","CONCLUSION CHALLENGED"]);
      var stressDecision=shouldRunStressTest(analysisMode,decision,results,surfaceMapOut,epistemicOut,probeVerdict,realityAnchorOut);
      setStressTestResult(stressDecision);
      if(stressDecision.run){
        try{setStressLoading(true);stressOut=await callClaude_synthesis(stressSystem(docs.stress||[],webSearch,publicWebSearch,sessionEvidence,analysisMode,activeDir,instructions),"Decision: "+decision+"\n\nDecision Surface Map:\n"+surfaceMapOut+"\n\nMETA-AUTHOR:\n"+metaOut+"\n\nReality Anchor:\n"+realityAnchorOut,autoContinue,webSearch||publicWebSearch);setStress(stressOut);stressRef.current=stressOut;}catch(e){stageErrors.push("Stress failed");}
        setStressLoading(false);
      }
      setStagesDone(7);


      var failedDirLabels=results.filter(function(r){return /^\[Director failed:/i.test((r.output||"").trim());}).map(function(r){return r.label;});
      // Build Probe Response injection block — extracts verdict and strongest argument
      // to force the Chair to engage rather than skip the Adversarial Probe Response section.
      var probeInjection=(function(){
        if(!probeOut) return "";
        var verdict=findSignal(probeOut,["BOARD REASONING SOUND","SIGNIFICANT GAPS","CONCLUSION CHALLENGED"])||"not determined";
        // Extract the Strongest Counter-Argument section text
        var strongestMatch=probeOut.match(/\*\*The Strongest Counter-Argument\*\*[^\n]*\n([\s\S]*?)(?=\n\*\*[A-Za-z]|$)/i);
        var strongest=strongestMatch?(strongestMatch[1]||"").trim().substring(0,600):"See Adversarial Probe output.";
        return "\n\n⚠ ADVERSARIAL PROBE VERDICT: "+verdict+"\nThe Probe's strongest argument was:\n"+strongest+"\n\nYou MUST include a **Adversarial Probe Response** section in your output — between **Coverage Limitations** and **Chair Recommendation** — that either ACCEPTS this finding (explaining how it is addressed in your conditions) or REBUTS it (with explicit Director-grounded reasoning). This section is mandatory and parser-matched. Do not proceed to Chair Recommendation without writing it.";
      })();
      try{setChairLoading(true);chairOut=await callClaude_synthesis(chairSystem(docs.chair||[],webSearch,publicWebSearch,sessionEvidence,analysisMode,activeDir,failedDirLabels,instructions),"Decision: "+decision+"\n\nDecision Surface Map:\n"+surfaceMapOut+"\n\nMETA-AUTHOR:\n"+metaOut+"\n\nReality Anchor:\n"+realityAnchorOut+(stressOut?"\n\nStress Test:\n"+stressOut:"")+(probeOut?"\n\nAdversarial Bias Probe:\n"+probeOut:"")+probeInjection,autoContinue,webSearch||publicWebSearch);setChair(chairOut);chairRef.current=chairOut;}catch(e){stageErrors.push("Chair failed");}
      setChairLoading(false); setStagesDone(8);


      try{
        var _pCount=results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(PROCEED)/,1)==="PROCEED";}).length;
        var _cCount=results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(CAUTION)/,1)==="CAUTION";}).length;
        var _hCount=results.filter(function(r){return safeMatch(r.output,/\*\*Recommendation Signal\*\*:?[^A-Z]*(HALT)/,1)==="HALT";}).length;
        // Build kill switch examples from Director outputs — Measurement, Safety, Behaviour
        // provide specific measurable thresholds that should anchor kill switch wording.
        var killSwitchHints=(function(){
          var hints=[];
          var measureDir=results.find(function(r){return r.id==="measurement";});
          var safetyDir=results.find(function(r){return r.id==="safety";});
          var behaviourDir=results.find(function(r){return r.id==="behaviour";});
          [measureDir,safetyDir,behaviourDir].forEach(function(dir){
            if(!dir||!dir.output) return;
            // Extract early warning / measurement indicators with numbers
            var m=dir.output.match(/(?:override rates?|accuracy|wait time|uptake|utilisation)[^.]*?(\d+%)[^.]*\./gi);
            if(m) m.slice(0,2).forEach(function(s){hints.push(s.trim().substring(0,150));});
          });
          if(hints.length===0) return "";
          return "\n\nKILL SWITCH REQUIREMENT: Each kill_switch entry must contain a measurable indicator + specific threshold + timeframe. Examples from Director analyses:\n"+hints.map(function(h){return "- "+h;}).join("\n")+"\nFormat each kill switch as: \"[indicator] exceeds/falls below [threshold] [timeframe].\"";
        })();
        var compRaw=await callClaude_synthesis(comparatorJsonSystem(decisionId,decisionSignal,results,analysisMode,activeDir,chairOut,instructions,_pCount,_cCount,_hCount),"Run comparator now."+killSwitchHints,autoContinue);
        var compParsed=extractFirstJsonObject(compRaw);
        // P1.2b: validate signal interpretation against authoritative counts; correct if drifted
        if(compParsed&&compParsed.summary&&typeof compParsed.summary.decision_signal_interpretation==="string"){
          var interp=compParsed.summary.decision_signal_interpretation;
          if(interp.indexOf(String(_cCount))===-1||interp.indexOf(String(_hCount))===-1){
            compParsed.summary.decision_signal_interpretation=
              "[Signal tally: "+_pCount+" PROCEED / "+_cCount+" CAUTION / "+_hCount+" HALT] "+interp;
          }
        }
        compData={raw:compRaw,parsed:compParsed,created_at:new Date().toISOString()};
        setComparator(compData);
      }catch(e){stageErrors.push("Comparator failed");}


      if(results.length>0) commitToLedger(results,metaOut,stressOut,chairOut,epistemicOut,probeOut,compData,activeDir,omittedDir,analysisMode,stressDecision);
      if(stageErrors.length>0) setError("Completed with partial failures: "+stageErrors.join(", "));


    } catch(fatalErr){
      setError("Session error: "+fatalErr.message);
      setPartialFailure(Object.keys(dirOutputs).length>0);
      if(results.length>0){ try{commitToLedger(results,metaOut,stressOut,chairOut,epistemicOut,probeOut,compData,activeDir,omittedDir,analysisMode,stressTestResult);}catch(le){} }
    } finally {
      setRunning(false); setDone(true);
      setMetaLoading(false);setSurfaceMapLoading(false);setRealityAnchorLoading(false);
      setStressLoading(false);setChairLoading(false);setEpistemicLoading(false);setProbeLoading(false);
      var cl={}; activeDir.forEach(function(d){cl[d.id]=false;}); setDirLoading(cl);
    }
  }


  async function runAdvisory(){
    if(!decision.trim()||running) return;
    setRunning(true); setDone(false); setAdvisoryDone(false); setError("");
    setAdvisoryOutput({}); setLensComparator(""); setDirOutputs({}); setDirLoading({});
    setStagesDone(0); setDirectorResultsRef([]); setExpandedDirs({});
    var ctx=getSessionContext(); var stageErrors=[];
    try {
      if(advisoryMode==="DIRECTOR_BRIEF"){
        var dir=DIRECTORS.find(function(d){return d.id===briefDirectorId;})||DIRECTORS[0];
        var loadingA={}; loadingA[dir.id]=true; setDirLoading(loadingA);
        try{
          var briefOut=stripCalibrationBleed(await callClaude_synthesis(directorBriefSystem(dir,docs[dir.id]||[],webSearch,publicWebSearch,sessionEvidence,ctx,instructions),"Advisory request: "+decision,autoContinue,webSearch||publicWebSearch));
          setDirOutputs(function(p){var n=Object.assign({},p); n[dir.id]=briefOut; return n;});
          setDirectorResultsRef([Object.assign({},dir,{output:briefOut})]);
          setAdvisoryOutput(function(p){return Object.assign({},p,{[dir.id]:briefOut});});
        }catch(e){stageErrors.push(dir.label+" brief failed");}
        var cl={}; cl[dir.id]=false; setDirLoading(cl); setStagesDone(1);
      } else if(advisoryMode==="DUAL_LENS"){
        var dirA=DIRECTORS.find(function(d){return d.id===lensAId;})||DIRECTORS[0];
        var dirB=DIRECTORS.find(function(d){return d.id===lensBId;})||DIRECTORS[1];
        var loadingAB={}; loadingAB[dirA.id]=true; loadingAB[dirB.id]=true; setDirLoading(loadingAB);
        var outA="", outB="";
        try{ outA=stripCalibrationBleed(await callClaude_synthesis(directorBriefSystem(dirA,docs[dirA.id]||[],webSearch,publicWebSearch,sessionEvidence,ctx,instructions),"Advisory request: "+decision,autoContinue,webSearch||publicWebSearch)); setDirOutputs(function(p){var n=Object.assign({},p); n[dirA.id]=outA; return n;}); var clA={}; clA[dirA.id]=false; setDirLoading(function(p){return Object.assign({},p,clA);}); }catch(e){stageErrors.push(dirA.label+" failed");}
        await new Promise(function(r){setTimeout(r,500);});
        try{ outB=stripCalibrationBleed(await callClaude_synthesis(directorBriefSystem(dirB,docs[dirB.id]||[],webSearch,publicWebSearch,sessionEvidence,ctx,instructions),"Advisory request: "+decision,autoContinue,webSearch||publicWebSearch)); setDirOutputs(function(p){var n=Object.assign({},p); n[dirB.id]=outB; return n;}); var clB={}; clB[dirB.id]=false; setDirLoading(function(p){return Object.assign({},p,clB);}); }catch(e){stageErrors.push(dirB.label+" failed");}
        setDirectorResultsRef([Object.assign({},dirA,{output:outA}),Object.assign({},dirB,{output:outB})]); setStagesDone(1);
        if(outA&&outB){
          try{ setLensComparatorLoading(true); var lensOut=await callClaude_synthesis(lensComparatorSystem(dirA,dirB,docs.meta||[],webSearch,publicWebSearch,sessionEvidence,ctx,instructions),"Advisory request: "+decision+"\n\n"+dirA.label+" Briefing:\n"+outA+"\n\n"+dirB.label+" Briefing:\n"+outB,autoContinue,webSearch||publicWebSearch); setLensComparator(lensOut); }catch(e){stageErrors.push("Lens Comparator failed");} setLensComparatorLoading(false);
        }
        setStagesDone(2);
      }
      setAdvisoryDone(true);
      if(stageErrors.length>0) setError("Advisory completed with issues: "+stageErrors.join(", "));
    }catch(fatalErr){ setError("Advisory error: "+fatalErr.message); }
    finally{ setRunning(false); var cl2={}; DIRECTORS.forEach(function(d){cl2[d.id]=false;}); setDirLoading(cl2); }
  }


  function resetAdvisory(){
    setDecision(""); setDecisionSignal(""); setOrgContext(""); setConstraintsText(""); setEvidenceLinksText("");
    setAdvisoryDone(false); setRunning(false); setAdvisoryOutput({}); setLensComparator("");
    setDirOutputs({}); setStagesDone(0); setError(""); setDirectorResultsRef([]);
    setExpandedDirs({}); setDecisionId(makeDecisionId());
  }


  function rescueSession(){
    if(Object.keys(dirOutputs).length===0) return;
    var rescueResults=activeDirectorsRef.filter(function(dir){return dirOutputs[dir.id];}).map(function(dir){return Object.assign({},dir,{output:dirOutputs[dir.id]});});
    if(rescueResults.length>0){try{commitToLedger(rescueResults,meta,stress,chair,epistemic,probe,comparator,activeDirectorsRef,omittedDirectorsRef,analysisMode);}catch(e){}}
    setRunning(false);setDone(true);setPartialFailure(false);setError("");
    setMetaLoading(false);setSurfaceMapLoading(false);setRealityAnchorLoading(false);
    setStressLoading(false);setChairLoading(false);setEpistemicLoading(false);setProbeLoading(false);
    var cl={}; activeDirectorsRef.forEach(function(d){cl[d.id]=false;}); setDirLoading(cl);
  }


  function reset(){
    setDecision("");setDecisionSignal("");setOrgContext("");setConstraintsText("");setEvidenceLinksText("");
    setDone(false);setRunning(false);
    setDirOutputs({});setMeta("");setSurfaceMap("");setRealityAnchor("");setStress("");setChair("");
    setEpistemic("");setProbe("");setComparator(null);
    setStagesDone(0);setError("");setDialogueHistory([]);setDirectorResultsRef([]);setStressTestResult(null);setSessionEvidenceOpen(false);
    setActiveDirectorsRef(DIRECTORS);setOmittedDirectorsRef([]);
    setExpandedDirs({}); setDecisionId(makeDecisionId());
  }


  var hasStarted=(running||done||Object.keys(dirOutputs).length>0)&&modeFamily==="GOVERNANCE";
  var advisoryStarted=(running||advisoryDone||Object.keys(dirOutputs).length>0)&&modeFamily==="ADVISORY";
  var chairResolvedIds=resolveChairDirectors(chairSelectedIds).map(function(d){return d.id;});
  var chairAutoAdded=MANDATORY_DIRECTOR_IDS.filter(function(id){return chairSelectedIds.indexOf(id)===-1;});


  // Instruction file status banner
  var instrBanner = null;
  var instrLoadedCount = Object.keys(instructions).length;
  if(instrLoadState==="loading"){
    instrBanner = <div style={{marginBottom:12,padding:"8px 14px",borderRadius:9,background:"#EFF6FF",border:"1px solid #BFDBFE",display:"flex",alignItems:"center",gap:8,fontSize:11,color:"#0369A1"}}>
      <span style={{display:"inline-block",width:10,height:10,border:"2px solid #BFDBFE",borderTopColor:"#0369A1",borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/>
      Loading instruction files from GitHub… {instrProgress.loaded}/{instrProgress.total}
    </div>;
  } else if(instrLoadState==="ready"){
    instrBanner = <div style={{marginBottom:12,padding:"8px 14px",borderRadius:9,background:"#F0FDF4",border:"1px solid #BBF7D0",display:"flex",alignItems:"center",gap:8,fontSize:11,color:"#059669"}}>
      ✓ {instrLoadedCount}/21 instruction files loaded from GitHub
    </div>;
  } else if(instrLoadState==="partial"){
    instrBanner = <div style={{marginBottom:12,padding:"8px 14px",borderRadius:9,background:"#FFFBEB",border:"1px solid #FDE68A",fontSize:11,color:"#92400E"}}>
      ⚠ {instrLoadedCount}/22 files loaded. Fallback inline prompts for: {instrProgress.failed.join(", ")}
    </div>;
  } else if(instrLoadState==="failed"){
    instrBanner = <div style={{marginBottom:12,padding:"8px 14px",borderRadius:9,background:"#FEF2F2",border:"1px solid #FECACA",fontSize:11,color:"#DC2626"}}>
      ✗ Could not load GitHub instruction files. Using inline fallback prompts. Check that your repo is public and files are committed.
    </div>;
  }


  return (
    <div style={{minHeight:"100vh",background:"#F0F4F8",color:"#1A202C",fontFamily:"system-ui,sans-serif"}}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        *{box-sizing:border-box;margin:0;padding:0;}
        textarea,input,button{font-family:inherit;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:#F0F4F8;}
        ::-webkit-scrollbar-thumb{background:#CBD5E0;border-radius:4px;}
        textarea:focus,input:focus{outline:none;}
      `}</style>


      <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(255,255,255,0.96)",backdropFilter:"blur(16px)",borderBottom:"1px solid #E2E8F0",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56,boxShadow:"0 1px 6px rgba(0,0,0,0.06)",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0EA5E9,#0369A1)",fontSize:14,color:"#FFFFFF",fontWeight:700}}>P</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#0F172A"}}>PHDSS</div>
            <div style={{fontSize:9,color:"#94A3B8",letterSpacing:1,textTransform:"uppercase"}}>Public Health Decision Stewardship</div>
          </div>
          {instrLoadState==="ready"&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:8,background:"#D1FAE5",color:"#059669",fontWeight:600,letterSpacing:0.5}}>GitHub ✓</span>}
          {instrLoadState==="partial"&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:8,background:"#FEF3C7",color:"#92400E",fontWeight:600,letterSpacing:0.5}}>GitHub partial</span>}
          {instrLoadState==="failed"&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:8,background:"#FEE2E2",color:"#DC2626",fontWeight:600,letterSpacing:0.5}}>Inline fallback</span>}
          {instrLoadState==="loading"&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:8,background:"#DBEAFE",color:"#0369A1",fontWeight:600,letterSpacing:0.5}}>Loading…</span>}
        </div>
        <div style={{display:"flex",gap:2,background:"#F1F5F9",borderRadius:10,padding:3}}>
          {[["board","Board"],["dashboard","Transparency"],["ledger","Ledger"],["config","Configure"]].map(function(pair){
            var id=pair[0],label=pair[1];
            return <button key={id} onClick={function(){setTab(id);}} style={{padding:"6px 14px",borderRadius:8,border:"none",fontSize:11,fontWeight:600,background:tab===id?"#FFFFFF":"transparent",color:tab===id?"#0F172A":"#64748B",boxShadow:tab===id?"0 1px 4px rgba(0,0,0,0.1)":"none",transition:"all 0.15s"}}>{label}{id==="ledger"&&ledger.length>0?<span style={{marginLeft:4,fontSize:9,padding:"1px 5px",borderRadius:8,background:"#EDE9FE",color:"#6D28D9"}}>{ledger.length}</span>:null}{id==="dashboard"&&modeFamily==="GOVERNANCE"&&(done||Object.keys(dirOutputs).length>0)?<span style={{marginLeft:4,fontSize:9,padding:"1px 5px",borderRadius:8,background:"#D1FAE5",color:"#065F46"}}>LIVE</span>:null}</button>;
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {hasStarted&&modeFamily==="GOVERNANCE"&&<ModeBadge mode={analysisMode}/>}
          <span style={{fontSize:9,color:"#94A3B8",fontFamily:"monospace"}}>{decisionId}</span>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:20,background:running?"#FFF7ED":done?"#F0FDF4":"#F8FAFC",border:"1px solid "+(running?"#FED7AA":done?"#BBF7D0":"#E2E8F0")}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:running?"#F97316":done?"#22C55E":"#334155",animation:running?"pulse 1.2s infinite":"none"}}/>
            <span style={{fontSize:9,fontWeight:600,color:running?"#C2410C":done?"#15803D":"#94A3B8",letterSpacing:0.8}}>{running?(chair?"FINALISING...":"IN SESSION"):done?"COMPLETE":"READY"}</span>
          </div>
        </div>
      </div>


      <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 16px"}}>


        {tab==="dashboard"&&
          <div style={{animation:"fadeIn 0.3s ease"}}>
            {modeFamily==="ADVISORY"?
              <div style={{textAlign:"center",padding:"80px 20px"}}>
                <div style={{fontSize:13,color:"#7C3AED",fontWeight:700,marginBottom:8}}>Advisory Mode Active</div>
                <div style={{fontSize:12,color:"#334155",marginBottom:20,maxWidth:400,margin:"0 auto 20px"}}>The Transparency Dashboard is only available for Governance Runs.</div>
                <button onClick={function(){setModeFamily("GOVERNANCE");setTab("board");}} style={{padding:"9px 22px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#0EA5E9,#0369A1)",color:"#FFFFFF",fontSize:12,fontWeight:600}}>Switch to Governance Run</button>
              </div>
            :(done||Object.keys(dirOutputs).length>0)?
              <TransparencyDashboard decision={decision} dirOutputs={dirOutputs} meta={meta} stress={stress} chair={chair} epistemic={epistemic} probe={probe} dialogueHistory={dialogueHistory} totalLoadedDocs={totalLoadedDocs} webSearch={webSearch} decisionId={decisionId} decisionSignal={decisionSignal} orgContext={orgContext} comparator={comparator} running={running} done={done} surfaceMap={surfaceMap} realityAnchor={realityAnchor} analysisMode={analysisMode} activeDirectors={activeDirectorsRef} omittedDirectors={omittedDirectorsRef} stressTestResult={stressTestResult}/>
            :
              <div style={{textAlign:"center",padding:"80px 20px"}}>
                <div style={{fontSize:13,color:"#94A3B8",fontWeight:600,marginBottom:8}}>No session data yet</div>
                <button onClick={function(){setTab("board");}} style={{padding:"9px 22px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#0EA5E9,#0369A1)",color:"#FFFFFF",fontSize:12,fontWeight:600}}>Go to Board</button>
              </div>
            }
          </div>
        }


        {tab==="ledger"&&
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div><div style={{fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:3}}>Decision Ledger</div><div style={{fontSize:12,color:"#64748B"}}>{ledger.length} decision{ledger.length!==1?"s":""} recorded this session.</div></div>
              {ledger.length>0&&<button onClick={function(){downloadJson("phdss-ledger_"+new Date().toISOString().slice(0,10)+(ledger.length>1?"__"+ledger.length+"_":"")+".json",{schema_version:"2.5.0",generated_at:new Date().toISOString(),record_count:ledger.length,decisions:ledger});}} style={{padding:"8px 18px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#A78BFA,#7C3AED)",color:"#FFFFFF",fontSize:12,fontWeight:600,cursor:"pointer"}}>Export JSON</button>}
            </div>
            {ledger.length===0?<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:13,color:"#94A3B8"}}>No decisions recorded yet.</div></div>
            :ledger.map(function(rec){
              return (
                <div key={rec.decision_id} style={{background:"#FFFFFF",border:"1px solid rgba(167,139,250,0.2)",borderRadius:14,padding:18,marginBottom:14}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                        <span style={{fontSize:10,fontFamily:"monospace",color:"#A78BFA"}}>{rec.decision_id}</span>
                        <ModeBadge mode={rec.analysis_mode||"FULL"}/>
                        <span style={{fontSize:10,padding:"2px 7px",borderRadius:8,background:"#F1F5F9",color:"#64748B",fontWeight:600}}>{rec.coverage_ratio} directors</span>
                        {rec.instruction_source&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:7,background:rec.instruction_source==="github"?"#D1FAE5":rec.instruction_source==="github_partial"?"#FEF3C7":"#F1F5F9",color:rec.instruction_source==="github"?"#059669":rec.instruction_source==="github_partial"?"#92400E":"#64748B",fontWeight:600}}>{rec.instruction_source}</span>}
                        {rec.chair_recommendation&&<SignalPill signal={rec.chair_recommendation} small={true}/>}
                      </div>
                      <div style={{fontSize:13,fontWeight:600,color:"#0F172A",lineHeight:1.5,marginBottom:4}}>{rec.question}</div>
                    </div>
                    <div style={{fontSize:10,color:"#94A3B8",flexShrink:0,marginLeft:12}}>{new Date(rec.created_at).toLocaleString("en-AU")}</div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                    {[
                      {label:"Signals",val:rec.proceed_count+"P "+rec.caution_count+"C "+rec.halt_count+" HALT", col:rec.halt_count>0?"#DC2626":rec.caution_count>0?"#D97706":"#059669"},
                      {label:"Epistemic",val:rec.epistemic_score||"-", col:rec.epistemic_score==="STRONG"?"#059669":rec.epistemic_score==="ADEQUATE"?"#D97706":(rec.epistemic_score==="WEAK"||rec.epistemic_score==="COMPROMISED")?"#DC2626":"#94A3B8"},
                      {label:"Probe",val:rec.probe_verdict?rec.probe_verdict.split(" ").slice(0,2).join(" "):"-", col:rec.probe_verdict==="BOARD REASONING SOUND"?"#059669":rec.probe_verdict==="SIGNIFICANT GAPS"?"#D97706":rec.probe_verdict==="CONCLUSION CHALLENGED"?"#DC2626":"#94A3B8"},
                      {label:"Fragility",val:rec.fragility_score!==null?rec.fragility_score+"/10":"-", col:rec.fragility_score>=7?"#DC2626":rec.fragility_score>=4?"#D97706":rec.fragility_score>0?"#059669":"#94A3B8"},
                    ].map(function(m){return <div key={m.label} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:9,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:13,fontWeight:700,color:m.col||"#0F172A",marginBottom:2}}>{m.val}</div><div style={{fontSize:9,color:"#94A3B8",textTransform:"uppercase",letterSpacing:0.5}}>{m.label}</div></div>;})}
                  </div>
                </div>
              );
            })}
          </div>
        }


        {tab==="config"&&
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{marginBottom:18}}>
              <div style={{fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:4}}>Evidence Library</div>
              <div style={{fontSize:12,color:"#64748B"}}>Each role supports multiple documents — frameworks, policies, guidelines, standards.</div>
            </div>
            {instrBanner}
            <div style={{marginBottom:18}}><Toggle value={webSearch} onChange={function(v){setWebSearch(v); if(v) setPublicWebSearch(false);}} label="Tier 2 — Trusted Web Search" sublabel={webSearch?"Active — "+TRUSTED_DOMAINS.length+" whitelisted domains":"Off"} color="#60A5FA"/></div>
            <div style={{marginBottom:18}}>
              <Toggle value={publicWebSearch} onChange={function(v){setPublicWebSearch(v); if(v) setWebSearch(false);}} label="Tier 3 — Full Public Web Search" sublabel={publicWebSearch?"Active — unrestricted web access":"Off"} color="#F97316"/>
              {publicWebSearch&&<div style={{marginTop:6,padding:"7px 11px",borderRadius:8,background:"#FFF7ED",border:"1px solid #FED7AA",fontSize:11,color:"#92400E"}}>⚠ Tier 3 is unrestricted. Verify citations.</div>}
            </div>
            <div style={{display:"flex",gap:6,marginBottom:14}}>
              {[["directors","Board Directors"],["synthesis","Synthesis Roles"]].map(function(pair){return <button key={pair[0]} onClick={function(){setConfigSection(pair[0]);}} style={{padding:"6px 16px",borderRadius:8,border:"none",fontSize:12,fontWeight:600,background:configSection===pair[0]?"#EFF6FF":"transparent",color:configSection===pair[0]?"#0369A1":"#64748B"}}>{pair[1]}</button>;})}
              <button onClick={async function(){for(var i=0;i<ALL_ROLES.length;i++){await fetchRoleDocs(ALL_ROLES[i].id);}}} style={{marginLeft:"auto",padding:"6px 18px",borderRadius:8,border:"none",fontSize:12,fontWeight:600,background:"linear-gradient(135deg,#0EA5E9,#0369A1)",color:"#FFFFFF"}}>Fetch All Documents</button>
            </div>
            <div style={{fontSize:11,color:"#94A3B8",marginBottom:12}}>Documents must be Google Docs shared with "Anyone with the link can view".</div>
            {configSection==="directors"&&DIRECTORS.map(function(role){return <RoleConfigBlock key={role.id} role={role} entries={docs[role.id]||[makeDocEntry()]} onUpdate={updateRoleDocs} onFetchAll={fetchRoleDocs} fetchingIds={fetchingIds}/>;})}
            {configSection==="synthesis"&&SYNTHESIS_ROLES.map(function(role){return <RoleConfigBlock key={role.id} role={role} entries={docs[role.id]||[makeDocEntry()]} onUpdate={updateRoleDocs} onFetchAll={fetchRoleDocs} fetchingIds={fetchingIds}/>;})}
            <div style={{marginTop:16}}><button onClick={function(){setTab("board");}} style={{padding:"9px 22px",borderRadius:8,border:"1px solid #E2E8F0",background:"#FFFFFF",color:"#64748B",fontSize:12,fontWeight:600}}>Back to Board</button></div>
          </div>
        }


        {tab==="board"&&
          <div style={{animation:"fadeIn 0.3s ease"}}>
            {instrBanner}
            {hasStarted&&<div style={{display:"flex",gap:6,marginBottom:20}}>
              {STAGE_META.map(function(s,i){return <div key={s.id} style={{flex:1}}><div style={{height:4,borderRadius:4,transition:"background 0.6s",background:i<stagesDone?"#0EA5E9":i===stagesDone?(done?"#0EA5E9":"#F59E0B"):"#E2E8F0"}}/><div style={{fontSize:9,fontWeight:600,color:i<=stagesDone?"#0369A1":"#94A3B8",marginTop:4,textAlign:"center"}}>{s.short}</div></div>;})}
            </div>}


            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              <span style={{fontSize:11,padding:"4px 10px",borderRadius:20,background:hasAnyDocs?"#D1FAE5":"#F1F5F9",color:hasAnyDocs?"#065F46":"#94A3B8",border:"1px solid "+(hasAnyDocs?"#A7F3D0":"#E2E8F0")}}>Tier 1: {hasAnyDocs?totalLoadedDocs+" docs loaded":"No docs"}</span>
              {sessionEvidence.some(function(e){return e.content;})&&<span style={{fontSize:11,padding:"4px 10px",borderRadius:20,background:"#DBEAFE",color:"#1D4ED8",border:"1px solid #BFDBFE"}}>📎 {sessionEvidence.filter(function(e){return e.content;}).length} session doc{sessionEvidence.filter(function(e){return e.content;}).length>1?"s":""}</span>}
              <span style={{fontSize:11,padding:"4px 10px",borderRadius:20,background:webSearch?"#DBEAFE":"#F1F5F9",color:webSearch?"#1D4ED8":"#94A3B8",border:"1px solid "+(webSearch?"#BFDBFE":"#E2E8F0")}}>Tier 2: {webSearch?"Web ON":"Web OFF"}</span>
              <span style={{fontSize:11,padding:"4px 10px",borderRadius:20,background:publicWebSearch?"#FFF7ED":"#F1F5F9",color:publicWebSearch?"#C2410C":"#94A3B8",border:"1px solid "+(publicWebSearch?"#FDBA74":"#E2E8F0")}}>Tier 3: {publicWebSearch?"Public Web ON":"Public Web OFF"}</span>
              {stressTestResult&&<span style={{fontSize:11,padding:"4px 10px",borderRadius:20,background:stressTestResult.run?"#FEF3C7":"#F1F5F9",color:stressTestResult.run?"#92400E":"#94A3B8",border:"1px solid "+(stressTestResult.run?"#FDE68A":"#E2E8F0")}}>Stress Test: {stressTestResult.run?"TRIGGERED":"SKIPPED"}</span>}
              <span onClick={function(){setAutoContinue(function(v){return !v;});}} style={{fontSize:11,padding:"4px 10px",borderRadius:20,background:autoContinue?"#ECFDF5":"#F1F5F9",color:autoContinue?"#065F46":"#94A3B8",border:"1px solid "+(autoContinue?"#A7F3D0":"#E2E8F0"),cursor:"pointer"}}>Auto-continue {autoContinue?"ON":"OFF"}</span>
            </div>


            <div style={{background:"#FFFFFF",border:"1px solid #E2E8F0",borderRadius:16,padding:20,marginBottom:16,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontSize:10,letterSpacing:1.5,color:"#64748B",textTransform:"uppercase",fontWeight:700}}>Decision Under Review <span style={{fontSize:9,padding:"2px 7px",borderRadius:8,background:"#DBEAFE",color:"#1D4ED8",fontWeight:700,letterSpacing:0,textTransform:"none"}}>REQUIRED</span></span>
                <span style={{fontSize:9,color:"#94A3B8",fontFamily:"monospace"}}>{decisionId}</span>
              </div>
              <textarea value={decision} onChange={function(e){setDecision(e.target.value);}} disabled={running} placeholder="Describe the decision requiring governance review..." style={{width:"100%",minHeight:72,background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:9,padding:"11px 13px",color:"#334155",fontSize:13,lineHeight:1.7,resize:"vertical",outline:"none",marginBottom:10}}/>


              {!hasStarted&&!advisoryStarted&&<div style={{marginBottom:10,display:"flex",flexWrap:"wrap",gap:6}}>
                {["Deploy AI triage screening across all emergency departments nationally","Mandate electronic health records for all GP practices within 18 months","Introduce activity-based funding for mental health inpatient services"].map(function(ex){return <button key={ex} onClick={function(){setDecision(ex);}} style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"transparent",border:"1px solid #E2E8F0",color:"#94A3B8"}}>{ex}</button>;})}
              </div>}


              {/* SESSION EVIDENCE */}
              <div style={{marginBottom:16}}>
                <button onClick={function(){setSessionEvidenceOpen(function(v){return !v;});}} style={{display:"flex",alignItems:"center",gap:7,fontSize:11,fontWeight:700,color:"#475569",background:"none",border:"none",cursor:"pointer",padding:0,marginBottom:sessionEvidenceOpen?8:0}}>
                  <span style={{width:18,height:18,borderRadius:5,background:sessionEvidence.some(function(e){return e.content;})?"#DBEAFE":"#F1F5F9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:sessionEvidence.some(function(e){return e.content;})?"#1D4ED8":"#94A3B8",flexShrink:0}}>📎</span>
                  <span style={{textTransform:"uppercase",letterSpacing:0.8}}>Session Evidence</span>
                  {sessionEvidence.some(function(e){return e.content;})&&<span style={{fontSize:9,padding:"1px 7px",borderRadius:8,background:"#DBEAFE",color:"#1D4ED8",fontWeight:700}}>{sessionEvidence.filter(function(e){return e.content;}).length} loaded</span>}
                  <span style={{fontSize:11,color:"#94A3B8",marginLeft:2}}>{sessionEvidenceOpen?"▾":"▸"}</span>
                </button>
                {sessionEvidenceOpen&&<div style={{border:"1px solid #E2E8F0",borderRadius:11,padding:"12px 14px",background:"#F8FAFC"}}>
                  <div style={{fontSize:11,color:"#64748B",marginBottom:10,lineHeight:1.5}}>Attach tenders, legislation, business cases, or reference material. Broadcast to all Directors and synthesis modules for this run.</div>
                  {sessionEvidence.map(function(entry){
                    var isUrl=entry.type!=="paste";
                    var statusColor=entry.status==="loaded"?"#059669":entry.status==="error"?"#DC2626":entry.status==="fetching"?"#F97316":"#94A3B8";
                    var statusLabel=entry.status==="loaded"?"✓ Loaded":entry.status==="error"?"✗ Failed":entry.status==="fetching"?"Fetching...":"";
                    return (
                      <div key={entry.id} style={{background:"#FFFFFF",border:"1px solid "+(entry.content?"#BFDBFE":"#E2E8F0"),borderRadius:9,padding:"10px 12px",marginBottom:8}}>
                        <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:isUrl?7:0}}>
                          <span style={{fontSize:9,padding:"2px 7px",borderRadius:6,background:isUrl?"#EFF6FF":"#F5F3FF",color:isUrl?"#1D4ED8":"#7C3AED",fontWeight:700,flexShrink:0}}>{isUrl?"URL":"PASTE"}</span>
                          <input value={entry.label} onChange={function(e){updateSessionEntry(entry.id,"label",e.target.value);}} placeholder={isUrl?"Label (e.g. Business Case)":"Label"} style={{flex:1,background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:6,padding:"4px 8px",fontSize:11,color:"#334155",outline:"none"}}/>
                          {statusLabel&&<span style={{fontSize:10,color:statusColor,fontWeight:600,flexShrink:0}}>{statusLabel}</span>}
                          <button onClick={function(){removeSessionEntry(entry.id);}} style={{background:"none",border:"none",color:"#CBD5E0",fontSize:14,cursor:"pointer",padding:0,lineHeight:1,flexShrink:0}}>×</button>
                        </div>
                        {isUrl&&<div style={{display:"flex",gap:6}}>
                          <input value={entry.url} onChange={function(e){updateSessionEntry(entry.id,"url",e.target.value);}} placeholder="Google Doc URL..." style={{flex:1,background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:6,padding:"4px 8px",fontSize:11,color:"#334155",outline:"none"}}/>
                          <button onClick={function(){fetchSessionDoc(entry.id);}} disabled={!entry.url.trim()||entry.status==="fetching"} style={{padding:"4px 12px",borderRadius:6,border:"none",background:"#0369A1",color:"#FFFFFF",fontSize:11,fontWeight:600,cursor:entry.url.trim()?"pointer":"not-allowed",opacity:entry.url.trim()?1:0.5,flexShrink:0}}>Fetch</button>
                        </div>}
                        {!isUrl&&<textarea value={entry.content} onChange={function(e){updateSessionEntry(entry.id,"content",e.target.value); updateSessionEntry(entry.id,"status",e.target.value.trim()?"loaded":"empty");}} placeholder="Paste document text, data extract, or notes here..." style={{width:"100%",minHeight:80,background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:6,padding:"6px 9px",fontSize:11,lineHeight:1.6,resize:"vertical",outline:"none",marginTop:7,boxSizing:"border-box"}}/>}
                      </div>
                    );
                  })}
                  <div style={{display:"flex",gap:7,marginTop:4}}>
                    <button onClick={function(){addSessionEntry("url");setSessionEvidenceOpen(true);}} style={{flex:1,padding:"7px 10px",borderRadius:8,border:"1px dashed #BFDBFE",background:"#EFF6FF",color:"#0369A1",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Google Doc URL</button>
                    <button onClick={function(){addSessionEntry("paste");setSessionEvidenceOpen(true);}} style={{flex:1,padding:"7px 10px",borderRadius:8,border:"1px dashed #DDD6FE",background:"#F5F3FF",color:"#7C3AED",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Paste Text</button>
                  </div>
                </div>}
              </div>


              {/* MODE FAMILY SELECTOR */}
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,fontWeight:700,color:"#475569",marginBottom:8,textTransform:"uppercase",letterSpacing:0.8}}>Run Type</div>
                <div style={{display:"flex",gap:6,marginBottom:12}}>
                  {[["GOVERNANCE","Governance Run","Structured decision analysis with full synthesis pipeline","#059669","#D1FAE5"],
                    ["ADVISORY","Advisory Run","Domain briefing without governance modules","#7C3AED","#EDE9FE"]].map(function(item){
                    var id=item[0],label=item[1],desc=item[2],col=item[3],bg=item[4];
                    var active=modeFamily===id;
                    return <button key={id} onClick={function(){if(!running){setModeFamily(id);setDone(false);setAdvisoryDone(false);}}} disabled={running}
                      style={{flex:1,padding:"10px 14px",borderRadius:10,border:"2px solid "+(active?col:col+"33"),background:active?bg:"#FFFFFF",color:active?col:col+"88",fontSize:11,fontWeight:700,cursor:running?"not-allowed":"pointer",transition:"all 0.15s",textAlign:"left"}}>
                      <div style={{marginBottom:2}}>{label}</div>
                      <div style={{fontSize:10,fontWeight:400,color:active?col:col+"55"}}>{desc}</div>
                    </button>;
                  })}
                </div>


                {modeFamily==="GOVERNANCE"&&<div>
                  <div style={{fontSize:10,fontWeight:700,color:"#64748B",textTransform:"uppercase",letterSpacing:0.6,marginBottom:6}}>Analysis Mode</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                    {ANALYSIS_MODES.map(function(m){
                      var active=analysisMode===m;
                      var col=m==="FULL"?"#059669":m==="CORE"?"#0369A1":"#7C3AED";
                      var bg=m==="FULL"?"#D1FAE5":m==="CORE"?"#DBEAFE":"#EDE9FE";
                      var desc=m==="FULL"?"All 13 directors":m==="CORE"?"5 directors (adaptive)":"Custom selection";
                      var mLabel=m==="CHAIR_SPECIFIED"?"CHAIR SPECIFIED":m;
                      return <button key={m} onClick={function(){setAnalysisMode(m);}} disabled={running}
                        style={{padding:"8px 16px",borderRadius:10,border:"2px solid "+(active?col:col+"33"),background:active?bg:"#FFFFFF",color:active?col:col+"88",fontSize:11,fontWeight:700,cursor:running?"not-allowed":"pointer",transition:"all 0.15s",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:2,minWidth:120}}>
                        <span>{mLabel}</span>
                        <span style={{fontSize:10,fontWeight:400,color:active?col:col+"66"}}>{desc}</span>
                      </button>;
                    })}
                  </div>
                  {analysisMode==="CORE"&&!hasStarted&&
                    <div style={{padding:"10px 12px",borderRadius:9,background:"#EFF6FF",border:"1px solid #BFDBFE"}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#0369A1",marginBottom:6}}>Directors that will run:</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                        {previewActive.map(function(d){return <span key={d.id} style={{fontSize:10,padding:"2px 9px",borderRadius:10,background:d.color+"18",color:d.color,border:"1px solid "+d.color+"33",fontWeight:600}}>{d.icon} {d.label}</span>;})}
                      </div>
                      {previewOmitted.length>0&&<div style={{marginTop:6,fontSize:10,color:"#94A3B8"}}>Omitted: {previewOmitted.map(function(d){return d.label;}).join(", ")}</div>}
                    </div>
                  }
                  {analysisMode==="CHAIR_SPECIFIED"&&
                    <div style={{padding:"12px 14px",borderRadius:9,background:"#F5F3FF",border:"1px solid #DDD6FE"}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#7C3AED",marginBottom:8}}>Select Directors — Systems &amp; Safety always included</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:10}}>
                        {DIRECTORS.map(function(d){
                          var sel=chairResolvedIds.indexOf(d.id)!==-1;
                          var autoAdded=chairAutoAdded.indexOf(d.id)!==-1;
                          return <div key={d.id} onClick={function(){if(!running) toggleChairDir(d.id);}}
                            style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,border:"2px solid "+(sel?d.color+"66":d.color+"22"),background:sel?d.color+"10":"#FFFFFF",cursor:running?"not-allowed":"pointer",transition:"all 0.12s"}}>
                            <div style={{width:18,height:18,borderRadius:5,background:sel?d.color:"#F1F5F9",border:"2px solid "+(sel?d.color:"#E2E8F0"),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:10,color:"#FFFFFF",fontWeight:700}}>{sel?"✓":""}</div>
                            <span style={{fontSize:11,fontWeight:sel?700:400,color:sel?d.color:"#64748B"}}>{d.icon} {d.label}</span>
                            {autoAdded&&<span style={{marginLeft:"auto",fontSize:9,padding:"1px 6px",borderRadius:8,background:"#FEF3C7",color:"#92400E",fontWeight:700,flexShrink:0}}>AUTO</span>}
                          </div>;
                        })}
                      </div>
                      <div style={{fontSize:11,color:"#7C3AED",fontWeight:600}}>{chairResolvedIds.length} directors selected</div>
                    </div>
                  }
                </div>}


                {modeFamily==="ADVISORY"&&<div>
                  <div style={{padding:"10px 12px",borderRadius:9,background:"#FFF7ED",border:"1px solid #FED7AA",marginBottom:10}}>
                    <span style={{fontSize:11,color:"#92400E",fontWeight:600}}>Advisory runs produce domain briefings only. No governance modules, no Chair decision, no Transparency Dashboard.</span>
                  </div>
                  <div style={{fontSize:10,fontWeight:700,color:"#64748B",textTransform:"uppercase",letterSpacing:0.6,marginBottom:6}}>Advisory Mode</div>
                  <div style={{display:"flex",gap:8,marginBottom:12}}>
                    {[["DIRECTOR_BRIEF","Director Brief","Single domain perspective","#7C3AED"],
                      ["DUAL_LENS","Dual Lens","Two directors, one comparator","#0891B2"]].map(function(item){
                      var id=item[0],label=item[1],desc=item[2],col=item[3];
                      var active=advisoryMode===id;
                      return <button key={id} onClick={function(){if(!running)setAdvisoryMode(id);}} disabled={running}
                        style={{flex:1,padding:"8px 14px",borderRadius:10,border:"2px solid "+(active?col:col+"33"),background:active?col+"12":"#FFFFFF",color:active?col:col+"88",fontSize:11,fontWeight:700,cursor:running?"not-allowed":"pointer",transition:"all 0.15s",textAlign:"left"}}>
                        <div style={{marginBottom:2}}>{label}</div>
                        <div style={{fontSize:10,fontWeight:400,color:active?col:col+"55"}}>{desc}</div>
                      </button>;
                    })}
                  </div>
                  {advisoryMode==="DIRECTOR_BRIEF"&&<div>
                    <div style={{fontSize:10,fontWeight:700,color:"#64748B",marginBottom:6,textTransform:"uppercase",letterSpacing:0.6}}>Select Director</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                      {DIRECTORS.map(function(d){
                        var sel=briefDirectorId===d.id;
                        return <div key={d.id} onClick={function(){if(!running)setBriefDirectorId(d.id);}}
                          style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,border:"2px solid "+(sel?d.color+"66":d.color+"22"),background:sel?d.color+"10":"#FFFFFF",cursor:running?"not-allowed":"pointer",transition:"all 0.12s"}}>
                          <div style={{width:18,height:18,borderRadius:"50%",background:sel?d.color:"#F1F5F9",border:"2px solid "+(sel?d.color:"#E2E8F0"),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:10,color:"#FFFFFF",fontWeight:700}}>{sel?"✓":""}</div>
                          <span style={{fontSize:11,fontWeight:sel?700:400,color:sel?d.color:"#64748B"}}>{d.icon} {d.label}</span>
                        </div>;
                      })}
                    </div>
                  </div>}
                  {advisoryMode==="DUAL_LENS"&&<div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      {[["Lens A",lensAId,setLensAId,"#0891B2"],["Lens B",lensBId,setLensBId,"#7C3AED"]].map(function(lens){
                        var lensLabel=lens[0],lensId=lens[1],setLensId=lens[2],lensColor=lens[3];
                        return <div key={lensLabel}>
                          <div style={{fontSize:10,fontWeight:700,color:lensColor,textTransform:"uppercase",letterSpacing:0.6,marginBottom:6}}>{lensLabel}</div>
                          <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:200,overflowY:"auto"}}>
                            {DIRECTORS.map(function(d){
                              var sel=lensId===d.id;
                              return <div key={d.id} onClick={function(){if(!running)setLensId(d.id);}}
                                style={{display:"flex",alignItems:"center",gap:7,padding:"5px 9px",borderRadius:7,border:"1px solid "+(sel?d.color+"66":d.color+"22"),background:sel?d.color+"12":"#FFFFFF",cursor:running?"not-allowed":"pointer",transition:"all 0.1s"}}>
                                <div style={{width:14,height:14,borderRadius:"50%",background:sel?d.color:"#F1F5F9",flexShrink:0}}/>
                                <span style={{fontSize:10,fontWeight:sel?700:400,color:sel?d.color:"#64748B"}}>{d.icon} {d.label}</span>
                              </div>;
                            })}
                          </div>
                        </div>;
                      })}
                    </div>
                    {lensAId===lensBId&&<div style={{marginTop:8,fontSize:11,color:"#DC2626",fontWeight:600}}>⚠ Select two different directors for Dual Lens</div>}
                  </div>}
                </div>}
              </div>


              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <div>
                  <div style={{fontSize:11,color:"#475569",marginBottom:4}}><span style={{fontWeight:600}}>Decision Signal</span> <span style={{fontSize:9,padding:"1px 6px",borderRadius:7,background:"#F3F4F6",color:"#9CA3AF"}}>OPTIONAL</span></div>
                  <textarea value={decisionSignal} onChange={function(e){setDecisionSignal(e.target.value);}} disabled={running} placeholder="e.g. Budget cycle closes 30 June..." style={{width:"100%",minHeight:44,background:"#FBFAFF",border:"1px solid #DDD6FE",borderRadius:8,padding:"7px 11px",color:"#334155",fontSize:12,lineHeight:1.6,resize:"vertical",outline:"none",fontFamily:"inherit"}}/>
                </div>
                <div>
                  <div style={{fontSize:11,color:"#475569",marginBottom:4}}><span style={{fontWeight:600}}>Operational Context</span> <span style={{fontSize:9,padding:"1px 6px",borderRadius:7,background:"#F3F4F6",color:"#9CA3AF"}}>OPTIONAL</span></div>
                  <textarea value={orgContext} onChange={function(e){setOrgContext(e.target.value);}} disabled={running} placeholder="Organisation type, size, current pressures..." style={{width:"100%",minHeight:44,background:"#F0F9FF",border:"1px solid #BAE6FD",borderRadius:8,padding:"7px 11px",color:"#334155",fontSize:12,lineHeight:1.6,resize:"vertical",outline:"none",fontFamily:"inherit"}}/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                <div>
                  <div style={{fontSize:11,color:"#475569",marginBottom:4}}><span style={{fontWeight:600}}>Constraints</span> <span style={{fontSize:9,color:"#9CA3AF"}}>one per line</span></div>
                  <textarea value={constraintsText} onChange={function(e){setConstraintsText(e.target.value);}} disabled={running} placeholder={"AUD $2M cap\nTimeline: Q3 2026"} style={{width:"100%",minHeight:52,background:"#FFF5F5",border:"1px solid #FECACA",borderRadius:8,padding:"7px 11px",color:"#334155",fontSize:12,lineHeight:1.6,resize:"vertical",outline:"none",fontFamily:"inherit"}}/>
                </div>
                <div>
                  <div style={{fontSize:11,color:"#475569",marginBottom:4}}><span style={{fontWeight:600}}>Evidence Links</span> <span style={{fontSize:9,color:"#9CA3AF"}}>one per line</span></div>
                  <textarea value={evidenceLinksText} onChange={function(e){setEvidenceLinksText(e.target.value);}} disabled={running} placeholder={"https://aihw.gov.au/..."} style={{width:"100%",minHeight:52,background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:8,padding:"7px 11px",color:"#334155",fontSize:12,lineHeight:1.6,resize:"vertical",outline:"none",fontFamily:"inherit"}}/>
                </div>
              </div>


              {error&&<div style={{marginTop:10,padding:"9px 13px",borderRadius:8,background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.25)",color:"#DC2626",fontSize:12,lineHeight:1.6,marginBottom:10}}><span style={{fontWeight:700}}>Session issue: </span>{error}</div>}


              <div style={{display:"flex",justifyContent:"flex-end",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                {partialFailure&&!running&&<PartialFailureButton onSave={rescueSession}/>}
                {done&&<button onClick={reset} style={{padding:"9px 18px",borderRadius:8,border:"1px solid #E2E8F0",background:"#FFFFFF",color:"#64748B",fontSize:12,fontWeight:600}}>New Decision</button>}
                {advisoryDone&&<button onClick={resetAdvisory} style={{padding:"9px 18px",borderRadius:8,border:"1px solid #DDD6FE",background:"#F5F3FF",color:"#7C3AED",fontSize:12,fontWeight:600}}>New Briefing</button>}
                {modeFamily==="GOVERNANCE"&&<button onClick={runBoard} disabled={running||!decision.trim()} style={{padding:"9px 24px",borderRadius:8,border:"none",fontSize:13,fontWeight:600,background:(running||!decision.trim())?"#F1F5F9":"linear-gradient(135deg,#0EA5E9,#0369A1)",color:(running||!decision.trim())?"#94A3B8":"#FFFFFF",transition:"all 0.2s"}}>
                  {running?"Board in Session...":"Convene Board"}
                </button>}
                {modeFamily==="ADVISORY"&&<button onClick={runAdvisory} disabled={running||!decision.trim()||(advisoryMode==="DUAL_LENS"&&lensAId===lensBId)} style={{padding:"9px 24px",borderRadius:8,border:"none",fontSize:13,fontWeight:600,background:(running||!decision.trim())?"#F1F5F9":"linear-gradient(135deg,#7C3AED,#0891B2)",color:(running||!decision.trim())?"#94A3B8":"#FFFFFF",transition:"all 0.2s"}}>
                  {running?"Briefing in Progress...":"Run Advisory"}
                </button>}
              </div>
            </div>


            {hasStarted&&<div style={{animation:"fadeIn 0.4s ease"}}>
              {(chair||chairLoading)&&<div style={{marginBottom:18}}>
                <div style={{fontSize:10,letterSpacing:1.5,color:"#0369A1",textTransform:"uppercase",fontWeight:700,marginBottom:12,background:"#EFF6FF",padding:"4px 10px",borderRadius:8,display:"inline-block"}}>Board Decision</div>
                {(function(){
                  var failedLabels=activeDirectorsRef.filter(function(d){var out=dirOutputs[d.id]||""; return out.length>0&&/^\[Director failed:/i.test(out.trim());}).map(function(d){return d.label;});
                  if(!failedLabels.length) return null;
                  return <div style={{marginBottom:8,padding:"9px 13px",borderRadius:9,background:"#FFF7ED",border:"1px solid #FED7AA",display:"flex",gap:8,alignItems:"flex-start"}}>
                    <span style={{fontSize:13,flexShrink:0}}>⚠</span>
                    <div><span style={{fontSize:11,fontWeight:700,color:"#92400E"}}>PARTIAL EVIDENCE BASE — </span><span style={{fontSize:11,color:"#92400E"}}>Chair recommendation synthesised without: {failedLabels.join(", ")}.</span></div>
                  </div>;
                })()}
                <Panel title="Chair Recommendation" icon="C" color="#0369A1" tooltip="Synthesises all director outputs into a governance-grade recommendation. Final decision authority remains with human governance leaders." content={chair} loading={chairLoading} badge={extractStatusBadge(chair,"chair")||(chairSignal?<SignalPill signal={chairSignal}/>:null)} onExport={chair?function(){exportPanel("Chair_Decision",chairRef.current||chair,decisionId,decision,decisionSignal,orgContext);}:null}>
                  {chair&&!chairLoading&&<ChairDialogue dialogueSystem={dialogueSystem} dialogueHistory={dialogueHistory} onDialogueHistory={setDialogueHistory}/>}
                </Panel>
              </div>}


              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
              <div>
                <div style={{fontSize:10,letterSpacing:1.5,color:"#0369A1",textTransform:"uppercase",fontWeight:700,marginBottom:12,background:"#EFF6FF",padding:"4px 10px",borderRadius:8,display:"inline-flex",alignItems:"center",gap:8}}>
                  Board Directors <ModeBadge mode={analysisMode}/>
                  <span style={{fontSize:10,color:"#64748B",fontWeight:400,textTransform:"none",letterSpacing:0}}>{activeDirectorsRef.length}/{DIRECTORS.length}</span>
                </div>
                {DIRECTORS.map(function(dir){
                  var isActive=activeDirectorsRef.some(function(a){return a.id===dir.id;});
                  if(!isActive) return <OmittedDirectorCard key={dir.id} director={dir}/>;
                  return <DirectorCard key={dir.id} director={dir} output={dirOutputs[dir.id]} loading={dirLoading[dir.id]} expanded={expandedDirs[dir.id]}
                    onToggle={function(){setExpandedDirs(function(p){var n=Object.assign({},p);n[dir.id]=!p[dir.id];return n;});}}
                    confidence={dirConfidence[dir.id]}
                    onExport={dirOutputs[dir.id]?function(){exportDirector(dir,dirOutputs[dir.id],decisionId,decision,decisionSignal,orgContext);}:null}/>;
                })}
              </div>
              <div>
                <div style={{fontSize:10,letterSpacing:1.5,color:"#6D28D9",textTransform:"uppercase",fontWeight:700,marginBottom:12,background:"#EDE9FE",padding:"4px 10px",borderRadius:8,display:"inline-block"}}>Governance Synthesis</div>
                <Panel title="Decision Stress Test" icon="S" color="#EF4444" tooltip="Worst-case failure cascade analysis. Tests the decision against adverse scenarios, second-order consequences, and irreversibility. Fragility Score 1–10 (10 = extremely fragile)." content={stress} loading={stressLoading} badge={stressTestResult&&!stressTestResult.run&&done?<span style={{fontSize:9,padding:"2px 7px",borderRadius:8,background:"#F1F5F9",color:"#64748B",fontWeight:600}}>SKIPPED</span>:extractStatusBadge(stress,"stress")} onExport={stress?function(){exportPanel("Stress_Test",stressRef.current||stress,decisionId,decision,decisionSignal,orgContext);}:null}>{stressTestResult&&!stressTestResult.run&&done&&<div style={{fontSize:11,color:"#64748B",padding:"8px 0",fontStyle:"italic"}}>{stressTestResult.reason}</div>}</Panel>
                <Panel title="Adversarial Bias Probe" icon="P" color="#7C3AED" tooltip="Steelmans the strongest counter-argument and actively challenges the Board's reasoning. Identifies what was missed, whose perspective is absent, and where AI limitations are most visible." content={probe} loading={probeLoading} badge={extractStatusBadge(probe,"probe")} onExport={probe?function(){exportPanel("Adversarial_Probe",probeRef.current||probe,decisionId,decision,decisionSignal,orgContext);}:null}/>
                <Panel title="Reality Anchor" icon="A" color="#0369A1" tooltip="Grounds the analysis in operational reality — baseline conditions, implementation capability, reversibility, and accountability. Flags where the governance reasoning departs from what is actually achievable." content={realityAnchor} loading={realityAnchorLoading} badge={extractStatusBadge(realityAnchor,"reality")} onExport={realityAnchor?function(){exportPanel("Reality_Anchor",realityAnchorRef.current||realityAnchor,decisionId,decision,decisionSignal,orgContext);}:null}/>
                <Panel title="Cross-Domain Tension Analysis" icon="M" color="#7C3AED" tooltip="Synthesises all Director outputs into a cross-domain reasoning map. Surfaces conflicts, hidden assumptions, reasoning gaps, and unresolved tensions. Produces the Integration Signal (HIGH/MEDIUM/LOW)." content={meta} loading={metaLoading} badge={extractStatusBadge(meta,"meta")} onExport={meta?function(){exportPanel("Cross-Domain_Tension_Analysis",metaRef.current||meta,decisionId,decision,decisionSignal,orgContext);}:null}/>
                <Panel title="Epistemic Confidence Audit" icon="E" color="#DC2626" tooltip="Rates each Director's analytical confidence (HIGH/MEDIUM/LOW/UNCERTAIN) and flags overconfidence, systematic bias signals, and epistemic gaps. Produces the Epistemic Health Score used in AI Integrity." content={epistemic} loading={epistemicLoading} badge={extractStatusBadge(epistemic,"epistemic")} onExport={epistemic?function(){exportPanel("Epistemic_Audit",epistemicRef.current||epistemic,decisionId,decision,decisionSignal,orgContext);}:null}/>
                <Panel title="Decision Surface Map" icon="⊕" color="#0891B2" tooltip="Maps the full signal landscape across all active Directors — consensus zones, conflict zones, trade-off axes, and fragility hotspots. Produces the Dominant Signal summary." content={surfaceMap} loading={surfaceMapLoading} badge={extractStatusBadge(surfaceMap,"surfacemap")} onExport={surfaceMap?function(){exportPanel("Decision_Surface_Map",surfaceMapRef.current||surfaceMap,decisionId,decision,decisionSignal,orgContext);}:null}/>
                {done&&<div style={{marginTop:12,padding:"11px 15px",borderRadius:12,background:"#F0FDF4",border:"1px solid #BBF7D0",fontSize:11,color:"#065F46",lineHeight:1.6,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                  <span>Audit Trail: {activeDirectorsRef.length} Directors ({analysisMode}) · Surface Map · Epistemic · META · Reality · Probe{stressTestResult&&stressTestResult.run?" · Stress Test":" · Stress Test (skipped)"} · Chair{comparator?" · Comparator":""} — {decisionId}</span>
                  <button onClick={function(){setTab("dashboard");}} style={{fontSize:11,padding:"5px 14px",borderRadius:9,border:"none",background:"linear-gradient(135deg,#0EA5E9,#0369A1)",color:"#FFFFFF",fontWeight:600,cursor:"pointer"}}>View Dashboard</button>
                </div>}
              </div>
              </div>
            </div>}


            {advisoryStarted&&<div style={{animation:"fadeIn 0.4s ease"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"10px 14px",borderRadius:10,background:"#F5F3FF",border:"1px solid #DDD6FE"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:running?"#7C3AED":"#22C55E",animation:running?"pulse 1.2s infinite":"none"}}/>
                <span style={{fontSize:12,fontWeight:700,color:"#5B21B6"}}>{advisoryMode==="DIRECTOR_BRIEF"?"DIRECTOR BRIEF":"DUAL LENS BRIEF"}</span>
                <span style={{fontSize:11,color:"#7C3AED",marginLeft:4}}>Advisory Perspective — not a governance decision analysis</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:advisoryMode==="DUAL_LENS"?"1fr 1fr":"1fr",gap:18}}>
                {advisoryMode==="DIRECTOR_BRIEF"&&(function(){
                  var dir=DIRECTORS.find(function(d){return d.id===briefDirectorId;})||DIRECTORS[0];
                  return <DirectorCard key={dir.id} director={dir} output={dirOutputs[dir.id]} loading={dirLoading[dir.id]} expanded={expandedDirs[dir.id]}
                    onToggle={function(){setExpandedDirs(function(p){var n=Object.assign({},p);n[dir.id]=!p[dir.id];return n;});}}
                    onExport={dirOutputs[dir.id]?function(){exportDirector(dir,dirOutputs[dir.id],decisionId,decision,decisionSignal,orgContext);}:null}/>;
                })()}
                {advisoryMode==="DUAL_LENS"&&[lensAId,lensBId].map(function(lid){
                  var dir=DIRECTORS.find(function(d){return d.id===lid;}); if(!dir) return null;
                  return <DirectorCard key={dir.id} director={dir} output={dirOutputs[dir.id]} loading={dirLoading[dir.id]} expanded={expandedDirs[dir.id]}
                    onToggle={function(){setExpandedDirs(function(p){var n=Object.assign({},p);n[dir.id]=!p[dir.id];return n;});}}
                    onExport={dirOutputs[dir.id]?function(){exportDirector(dir,dirOutputs[dir.id],decisionId,decision,decisionSignal,orgContext);}:null}/>;
                })}
              </div>
              {advisoryMode==="DUAL_LENS"&&<div style={{marginTop:14}}>
                <Panel title="Lens Comparator" icon="⊗" color="#0891B2" content={lensComparator} loading={lensComparatorLoading}
                  onExport={lensComparator?function(){exportPanel("Lens_Comparator",lensComparator,decisionId,decision,decisionSignal,orgContext);}:null}/>
              </div>}
              {advisoryDone&&<div style={{marginTop:12,padding:"11px 15px",borderRadius:12,background:"#F5F3FF",border:"1px solid #DDD6FE",fontSize:11,color:"#5B21B6",lineHeight:1.7}}>
                <strong>Advisory only.</strong> For governance-grade analysis with Chair recommendation, switch to a Governance Run.
              </div>}
            </div>}


            {!hasStarted&&!advisoryStarted&&<div style={{textAlign:"center",padding:"60px 20px",animation:"fadeIn 0.5s ease"}}>
              <div style={{width:64,height:64,borderRadius:18,background:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",border:"1px solid #BFDBFE",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:28,fontWeight:700,color:"#0369A1"}}>P</div>
              <div style={{fontSize:16,color:"#0F172A",marginBottom:8,fontWeight:700}}>Governance-Grade Decision Intelligence</div>
              <div style={{fontSize:13,color:"#64748B",maxWidth:520,margin:"0 auto 24px",lineHeight:1.8}}><strong>Governance Runs</strong>: CORE, FULL, or CHAIR SPECIFIED — full synthesis pipeline with Chair decision. <strong>Advisory Runs</strong>: Director Brief or Dual Lens — fast domain briefings without governance modules.</div>
              <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:8}}>
                {DIRECTORS.map(function(d){return <div key={d.id} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:20,background:"#FFFFFF",border:"1px solid #E2E8F0"}}><div style={{width:20,height:20,borderRadius:6,background:d.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}><span style={{color:d.color}}>{d.icon}</span></div><span style={{fontSize:11,fontWeight:500,color:"#334155"}}>{d.label}</span></div>;})}
              </div>
            </div>}
          </div>
        }
      </div>
    </div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <ApiKeyGate onUnlock={() => setUnlocked(true)} />;
  return <PHDSS />;
}
