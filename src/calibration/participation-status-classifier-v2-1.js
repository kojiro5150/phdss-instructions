export const STATUS_CLASSIFIER_VERSION="status_classifier_v2_1";

function sentences(text){
  return String(text||"")
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s=>s.trim())
    .filter(Boolean);
}

function hasCurrentDecisionScope(s){
  return /\bactual\s+participation\b/i.test(s) ||
    /\bparticipation\b[^.!?\n]{0,120}\b(?:current|this)\s+(?:decision|proposal|decision\s+process)\b/i.test(s) ||
    /\b(?:current|this)\s+(?:decision|proposal|decision\s+process)\b[^.!?\n]{0,120}\bparticipation\b/i.test(s) ||
    /\b(?:engagement|workshop|consultation|co-design)\b[^.!?\n]{0,120}\b(?:for|in|about|on)\s+(?:this|the\s+current)\s+(?:decision|proposal)\b/i.test(s);
}

function hasDoubleNegation(s){
  return /\bnot\s+(?:true|correct)\s+that\b[^.!?\n]{0,140}\bnot\b/i.test(s) ||
    /\bnot\b[^.!?\n]{0,80}\bnot\s+(?:established|documented|evidenced)\b/i.test(s);
}

function directStatusSignal(s){
  if(!hasCurrentDecisionScope(s)) return null;
  if(hasDoubleNegation(s)) return "ambiguous";

  const subject=/\bactual\s+participation\b|\bparticipation\b[^.!?\n]{0,120}\b(?:current|this)\s+(?:decision|proposal|decision\s+process)\b|\b(?:current|this)\s+(?:decision|proposal|decision\s+process)\b[^.!?\n]{0,120}\bparticipation\b/i;
  if(!subject.test(s)) return null;

  if(
    /\bnot\s+(?:established|documented|evidenced)\b/i.test(s) ||
    /\b(?:is|was|remains|appears)?\s*(?:unknown|unclear|absent|lacking)\b/i.test(s) ||
    /^\s*no\b/i.test(s) ||
    /\bnone\s+of\b/i.test(s) ||
    /\bwithout\b[^.!?\n]{0,100}\bparticipation\b/i.test(s)
  ) return "not_established";

  if(/\b(?:is|was|has\s+been|had\s+been)\s+(?:established|documented|evidenced)\b/i.test(s)) return "established";
  return null;
}

function mechanismSignal(s){
  if(!hasCurrentDecisionScope(s)) return null;

  const mechanism=/\b(?:engagement|workshop|consultation|co-design|participat(?:ion|ed))\b/i;
  if(!mechanism.test(s)) return null;

  const explicitNegative=
    /^\s*no\b/i.test(s) ||
    /\bnone\s+of\b/i.test(s) ||
    /\b(?:absent|lacking)\b/i.test(s) ||
    /\bwithout\b[^.!?\n]{0,140}\b(?:engagement|workshop|consultation|co-design|participation)\b/i.test(s) ||
    /\b(?:does|do|did|is|was|has|have|had)\s+not\b[^.!?\n]{0,140}\b(?:document|record|evidence|establish)\b/i.test(s) ||
    /\bno\s+documented\b[^.!?\n]{0,140}\b(?:engagement|workshop|consultation|co-design|participation)\b/i.test(s) ||
    /\bnot\s+(?:documented|recorded|evidenced|established)\b/i.test(s);

  if(explicitNegative) return "not_established";

  const explicitPositive=
    /\b(?:documented|recorded|evidenced)\b[^.!?\n]{0,120}\b(?:engagement|workshop|consultation|co-design|participation)\b/i.test(s) ||
    /\b(?:engagement|workshop|consultation|co-design|participation)\b[^.!?\n]{0,120}\b(?:documented|recorded|evidenced|occurred|held|conducted)\b/i.test(s) ||
    /\b(?:consumers?|carers?|affected\s+people)\b[^.!?\n]{0,100}\b(?:attended|participated)\b/i.test(s);

  if(explicitPositive) return "established";
  return null;
}

export function classifyParticipationStatusV21(text){
  if(!text) return "missing";

  const signals=[];
  for(const s of sentences(text)){
    const direct=directStatusSignal(s);
    if(direct) signals.push(direct);
    const mechanism=mechanismSignal(s);
    if(mechanism) signals.push(mechanism);
  }

  if(signals.includes("ambiguous")) return "ambiguous";
  const negative=signals.includes("not_established");
  const positive=signals.includes("established");
  if(negative&&positive) return "ambiguous";
  if(negative) return "not_established";
  if(positive) return "established";
  return "ambiguous";
}
