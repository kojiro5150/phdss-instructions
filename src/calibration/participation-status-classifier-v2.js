export const STATUS_CLASSIFIER_VERSION="status_classifier_v2";

function relevantClauses(text){
  return String(text||"")
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s=>s.trim())
    .filter(Boolean)
    .filter(s=>/participation|participated|engagement/i.test(s));
}

function isNegativeClause(clause){
  const patterns=[
    /\b(?:actual\s+)?participation\b[^.!?\n]{0,140}\b(?:is|was|has\s+been|had\s+been)?\s*not\s+(?:established|documented|evidenced)\b/i,
    /\bno\s+documented\b[^.!?\n]{0,80}\bparticipation\b/i,
    /\bparticipation\b[^.!?\n]{0,120}\b(?:not\s+documented|not\s+evidenced|not\s+established)\b/i,
    /\b(?:actual\s+)?participation\b[^.!?\n]{0,120}\b(?:is|was)?\s*(?:unknown|unclear)\b/i,
  ];
  return patterns.some(p=>p.test(clause));
}

function isPositiveClause(clause){
  if(isNegativeClause(clause)) return false;
  const patterns=[
    /\b(?:actual\s+)?participation\b[^.!?\n]{0,140}\b(?:is|was|has\s+been|had\s+been)\s+(?:established|documented|evidenced)\b/i,
    /\bdocumented\b[^.!?\n]{0,100}\b(?:workshop|engagement|participation)\b[^.!?\n]{0,100}\b(?:for|in)\s+(?:this|the\s+current)\s+decision\b/i,
    /\b(?:consumers?|carers?|affected\s+people)\b[^.!?\n]{0,100}\bparticipated\b[^.!?\n]{0,100}\b(?:in|on)\s+(?:this|the\s+current)\s+(?:decision|proposal)\b/i,
  ];
  return patterns.some(p=>p.test(clause));
}

export function classifyParticipationStatusV2(text){
  if(!text) return "missing";
  const clauses=relevantClauses(text);
  let negative=false;
  let positive=false;
  for(const clause of clauses){
    if(isNegativeClause(clause)) negative=true;
    if(isPositiveClause(clause)) positive=true;
  }
  if(negative&&positive) return "ambiguous";
  if(negative) return "not_established";
  if(positive) return "established";
  return "ambiguous";
}
