// Advisory, pattern-based detector. Never determines the factual participation state.
export const LIVED_NEGATIVE_SCOPE_GUARDRAIL_VERSION = "1.0.0";
const RULES = Object.freeze([
  { id: "NS_TEMPORAL_ABSENCE", pattern: /\b(?:have|has|had|were|was|are|is)?\s*not\s+yet\s+(?:been\s+)?(?:reached|asked|consulted|engaged|invited)\b/gi, question: "Does the supplied record establish this temporal non-occurrence?" },
  { id: "NS_EXCLUSION", pattern: /\b(?:effectively\s+)?excluded\s+from\s+(?:the\s+)?(?:formal\s+)?(?:consultation|participation|engagement|review)(?:\s+(?:mechanism|process))?\b/gi, question: "Does evidence establish exclusion at this specific process stage?" },
  { id: "NS_UNINCORPORATED", pattern: /\b(?:unincorporated|not\s+(?:yet\s+)?incorporated)\s+(?:\w+\s+){0,2}(?:proposals?|changes?|suggestions?|recommendations?)\b/gi, question: "Does the record establish non-incorporation for each claimed proposal?" },
  { id: "NS_PROPOSALS_NOT_INCORPORATED", pattern: /\b(?:proposals?|changes?|suggestions?|recommendations?)\s+(?:were|have\s+been|are)\s+not\s+(?:yet\s+)?incorporated\b/gi, question: "Is non-incorporation established rather than merely undocumented?" }
]);
const SECTION = /^\s{0,3}(?:#{1,6}\s+|\*\*|__)?Participation\s*(?:&|and)\s*Representation\s*Status\b/i;
const HEADING = /^\s{0,3}(?:#{1,6}\s+|\*\*[^*]+\*\*\s*$|__[^_]+__\s*$)/;
const UNKNOWN = /\b(?:unknown|not\s+(?:established|documented|verified)|no\s+(?:supplied\s+)?evidence\s+(?:in\s+the\s+record\s+)?(?:establishes|confirms)|record\s+does\s+not\s+(?:establish|confirm))\b/i;
// 'could not open' describes an inability, not a hypothetical 'could' scenario.
const HYPOTHETICAL = /\b(?:if|could\b(?!\s+not\b)|might|may|would|risk\s+of|potential(?:ly)?|hypothetical|for\s+example|should\s+the)\b/i;
const RECORD_SCOPED = /\b(?:the\s+)?(?:supplied|available|provided|reviewed)\s+(?:record|material|evidence|documents?)\s+(?:says|states|establishes|confirms|documents)\b|\bnot\s+documented\b|\bno\s+evidence\s+(?:of|that)\b/i;
function lineAt(text, offset) {
  const before = text.slice(0, offset);
  return before.split("\n").length;
}
function canonicalSection(text) {
  const lines = text.split("\n");
  let start = -1, end = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (start < 0 && SECTION.test(lines[i])) { start = i; continue; }
    if (start >= 0 && i > start && HEADING.test(lines[i]) && lines[i].trim()) { end = i; break; }
  }
  return start < 0 ? null : { startLine: start + 1, endLine: end, body: lines.slice(start + 1, end).join("\n") };
}
export function scanLivedNegativeScope(output) {
  const text = typeof output === "string" ? output : "";
  const section = canonicalSection(text);
  const unknown = !!section && UNKNOWN.test(section.body);
  const flags = [];
  const seen = new Set();
  for (const rule of RULES) {
    const re = new RegExp(rule.pattern.source, rule.pattern.flags);
    for (const match of text.matchAll(re)) {
      const start = match.index, end = start + match[0].length;
      const lineStart = text.lastIndexOf("\n", start - 1) + 1;
      const lineEndIndex = text.indexOf("\n", end);
      const line = text.slice(lineStart, lineEndIndex < 0 ? text.length : lineEndIndex);
      const prefix = line.slice(0, start - lineStart);
      // Suppression applies only to the clause containing the matched claim.
      // An unrelated "may" or "supplied record" earlier in a long line must
      // not silence a later categorical assertion or presupposition.
      const clauseStart = Math.max(prefix.lastIndexOf("."), prefix.lastIndexOf(";"), prefix.lastIndexOf("—"), prefix.lastIndexOf("–"));
      const clausePrefix = prefix.slice(clauseStart + 1);
      const clauseEndCandidates = [line.indexOf(".", end - lineStart), line.indexOf(";", end - lineStart), line.indexOf("—", end - lineStart), line.indexOf("–", end - lineStart)].filter(i => i >= 0);
      const clauseEnd = clauseEndCandidates.length ? Math.min(...clauseEndCandidates) : line.length;
      const clause = line.slice(clauseStart + 1, clauseEnd);
      // This is an advisory pattern heuristic, not a grammar or evidence parser.
      // Suppress explicit conditional framing and directly attributed assertions,
      // but not generic "the record is silent" preceding an unqualified noun phrase.
      if (HYPOTHETICAL.test(clausePrefix) || RECORD_SCOPED.test(clause)) continue;
      const key = rule.id + ":" + start;
      if (seen.has(key)) continue;
      seen.add(key);
      flags.push({
        rule_id: rule.id, start, end, line: lineAt(text, start),
        match: match[0], section_relation: section && lineAt(text, start) > section.endLine ? "after_status" : "other",
        cross_section_unknown: unknown && !!section && lineAt(text, start) > section.endLine,
        review_question: rule.question
      });
    }
  }
  return {
    version: LIVED_NEGATIVE_SCOPE_GUARDRAIL_VERSION,
    status: flags.length ? "review_suggested" : "no_known_pattern_detected",
    coverage: section ? "limited" : "partial",
    canonical_status_unknown: unknown,
    flags
  };
}
