export function stripCalibrationBleed(text) {
  if (!text) return text;
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

export function stripInstructionArtifacts(text) {
  if (!text) return text;
  return text
    .replace(/\(DO NOT REPRODUCE THIS LINE[^)]*\)/gi, "")
    .replace(/SINGLE INSTANCE ONLY[^\n.]*/gi, "")
    .replace(/SECTION CLOSED after[^\n.]*/gi, "")
    .trim();
}

export function deduplicateSections(text) {
  if (!text) return text;
  // Parsing heuristic, not a governance rule: current Director generations can
  // repeat an identical heading/content block as an artefact. PR 1 preserves
  // the existing assumption that identical fingerprints are duplication noise.
  // PR 2 must keep this distinction visible when governance contracts are added.
  var parts = text.split(/(?=\n\*\*[^*\n]{4,60}\*\*|\n##\s+[A-Za-z])/);
  var seen = {};
  var out = [];
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    var hm = part.match(/^\n(\*\*([^*\n]{4,60})\*\*|##\s+([^\n]{4,60}))/);
    if (!hm) {
      out.push(part);
      continue;
    }
    var headingText = (hm[2] || hm[3] || "").trim().toLowerCase();
    var bodyLines = part.split("\n").slice(2);
    var firstContent = "";
    for (var j = 0; j < bodyLines.length; j++) {
      var bl = bodyLines[j].trim();
      if (bl.length > 5) { firstContent = bl.substring(0, 80).toLowerCase(); break; }
    }
    var fingerprint = headingText + "|||" + firstContent;
    if (seen[fingerprint]) continue;
    seen[fingerprint] = true;
    out.push(part);
  }
  return out.join("");
}

export function extractSignalSentence(text) {
  if (!text) return text;
  var execMatch = text.match(/([\s\S]*?## EXECUTIVE LAYER\s*)([\s\S]*?)(\n---|\n## DIRECTOR ANALYSIS)([\s\S]*)/i);
  if (!execMatch) return applySignalExtraction(text);

  var pre = execMatch[1];
  var execBody = execMatch[2];
  var divider = execMatch[3];
  var post = execMatch[4];

  var sigPattern = /\*{0,2}(?:Recommendation Signal\*{0,2}:?\s*)?\*{0,2}(PROCEED|CAUTION|HALT)\*{0,2}\s*[—\u2013\-]+\s*([^\n]{5,})/gi;
  var sigMatches = [];
  var m;
  while ((m = sigPattern.exec(execBody)) !== null) {
    sigMatches.push({ full: m[0], token: m[1].toUpperCase(), clause: m[2].trim(), index: m.index });
  }

  if (!sigMatches.length) return pre + execBody + divider + post;

  var primary = sigMatches[0];
  var cleanedExec = execBody;
  var allMatches = [];
  var sigPattern2 = /\*{0,2}(?:Recommendation Signal\*{0,2}:?\s*)?\*{0,2}(PROCEED|CAUTION|HALT)\*{0,2}\s*[—\u2013\-]+\s*[^\n]{5,}/gi;
  while ((m = sigPattern2.exec(execBody)) !== null) { allMatches.push({start:m.index, end:m.index+m[0].length}); }
  for (var i = allMatches.length - 1; i >= 0; i--) {
    cleanedExec = cleanedExec.slice(0, allMatches[i].start) + cleanedExec.slice(allMatches[i].end);
  }
  cleanedExec = cleanedExec.replace(/\n{3,}/g, "\n\n").trim();

  var col = primary.token === "HALT" ? "#DC2626" : primary.token === "CAUTION" ? "#D97706" : "#059669";
  var bg  = primary.token === "HALT" ? "#FEF2F2" : primary.token === "CAUTION" ? "#FFFBEB" : "#F0FDF4";
  var bdr = primary.token === "HALT" ? "#FECACA" : primary.token === "CAUTION" ? "#FDE68A" : "#BBF7D0";
  var sigBlock = "\n\n<div style=\"margin-top:10px;padding:9px 13px;border-radius:8px;background:"+bg+";border:1px solid "+bdr+";border-left:3px solid "+col+";font-size:12px;font-weight:600;color:"+col+";line-height:1.6\"><strong>Recommendation Signal: "+primary.token+"</strong> — "+primary.clause+"</div>";

  return pre + cleanedExec + sigBlock + "\n" + divider + post;
}

export function applySignalExtraction(text) {
  return text.replace(
    /([^\n]+?)\s(\*{0,2}(?:Recommendation Signal\*{0,2}:?\s*)?\*{0,2}(CAUTION|HALT|PROCEED)\*{0,2}\s*[—\u2013-]+\s*[^\n]{10,})/g,
    function(match, before, signalPart, token) {
      var col = token === "HALT" ? "#DC2626" : token === "CAUTION" ? "#D97706" : "#059669";
      var bg  = token === "HALT" ? "#FEF2F2" : token === "CAUTION" ? "#FFFBEB" : "#F0FDF4";
      var bdr = token === "HALT" ? "#FECACA" : token === "CAUTION" ? "#FDE68A" : "#BBF7D0";
      return before + "\n<div style=\"margin-top:10px;padding:9px 13px;border-radius:8px;background:"+bg+";border:1px solid "+bdr+";border-left:3px solid "+col+";font-size:12px;font-weight:600;color:"+col+";line-height:1.6\">"+signalPart.replace(/^\*{0,2}|\*{0,2}$/g,"").trim()+"</div>";
    }
  );
}

export function renderMd(text, accent) {
  if (!text) return "";
  var ac = accent || "#0369A1";
  var t = extractSignalSentence(text);
  return t
    .replace(/^## ([^\n]+)/gm, "<div style=\"font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#64748B;margin:10px 0 2px\">$1</div>")
    .replace(/^### ([^\n]+)/gm, "<div style=\"font-size:12px;font-weight:700;color:"+ac+";margin:8px 0 2px\">$1</div>")
    .replace(/^---$/gm, "<hr style=\"border:none;border-top:1px solid #E2E8F0;margin:8px 0\"/>")
    .replace(/\*\*(.*?)\*\*/g, "<strong style=\"color:"+ac+";font-weight:700\">$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, "<a href=\"$2\" target=\"_blank\" style=\"color:"+ac+";text-decoration:underline\">$1</a>")
    .replace(/(https?:\/\/[^\s<>"]+)/g, "<a href=\"$1\" target=\"_blank\" style=\"color:"+ac+";text-decoration:underline;word-break:break-all\">$1</a>")
    .replace(/\n\n/g, "<br/>")
    .replace(/\n/g, "<br/>");
}
