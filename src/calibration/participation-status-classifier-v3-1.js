export const STATUS_CLASSIFIER_VERSION="status_classifier_v3_1";

export const PARTICIPATION_STATE_FIELDS=[
  "participation_occurred",
  "representativeness",
  "all_affected_consent",
  "formal_codesign_authority",
  "decision_authority"
];

const STATES=["established","not_established","ambiguous","not_addressed"];

function splitSentences(text){
  return String(text||"")
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s=>s.trim())
    .filter(Boolean);
}

function reduceSignals(signals){
  if(!signals.length) return "not_addressed";
  if(signals.includes("ambiguous")) return "ambiguous";
  const pos=signals.includes("established");
  const neg=signals.includes("not_established");
  if(pos&&neg) return "ambiguous";
  if(pos) return "established";
  if(neg) return "not_established";
  return "not_addressed";
}

function doubleNegative(s){
  return /\bnot\s+(?:true|correct)\s+that\b[^.!?\n]{0,180}\bnot\b/i.test(s) ||
    /\bnot\b[^.!?\n]{0,100}\bnot\s+(?:established|documented|evidenced)\b/i.test(s);
}

function isHistoricalOnly(s){
  return /\b(?:prior|earlier|previous|historical|before\s+this\s+proposal)\b/i.test(s) &&
    !/\b(?:current|this)\s+(?:decision|proposal|decision\s+process)\b/i.test(s);
}

function participationSignal(s){
  if(doubleNegative(s)&&/\bparticipation\b/i.test(s)) return "ambiguous";

  const currentParticipation=/\bactual\s+participation\b|\bparticipation\b[^.!?\n]{0,120}\b(?:current|this)\s+(?:decision|proposal|decision\s+process)\b|\b(?:current|this)\s+(?:decision|proposal|decision\s+process)\b[^.!?\n]{0,120}\bparticipation\b/i.test(s);
  const mechanismCurrent=/\b(?:participated|attended|engaged|workshop|consultation|engagement)\b[^.!?\n]{0,160}\b(?:for|in|about|on|with)\s+(?:this|the\s+current)\s+(?:decision|proposal)\b/i.test(s) ||
    /\b(?:this|the\s+current)\s+(?:decision|proposal)\b[^.!?\n]{0,160}\b(?:participated|attended|engaged|workshop|consultation|engagement)\b/i.test(s);

  if(currentParticipation){
    const participationNegative=
      /\b(?:actual\s+)?participation\b[^.!?\n]{0,100}\b(?:is|was|remains|appears)?\s*(?:not\s+established|not\s+documented|not\s+evidenced|unknown|unclear)\b/i.test(s) ||
      /\b(?:does|do|did|is|was|has|have|had)\s+not\b[^.!?\n]{0,120}\b(?:establish|document|record|evidence)\b[^.!?\n]{0,80}\bparticipation\b/i.test(s);

    const participationPositive=
      /\b(?:actual\s+)?participation\b[^.!?\n]{0,100}\b(?:is|was|has\s+been|had\s+been)\s+(?:established|documented|evidenced)\b/i.test(s);

    if(participationNegative&&participationPositive) return "ambiguous";
    if(participationNegative) return "not_established";
    if(participationPositive) return "established";
  }

  if(/^\s*no\b/i.test(s)&&mechanismCurrent) return "not_established";
  if(/\bno\s+documented\b[^.!?\n]{0,140}\b(?:engagement|consultation|workshop|participation)\b/i.test(s)&&mechanismCurrent) return "not_established";

  if(!isHistoricalOnly(s)){
    if(/\b(?:consumers?|carers?|affected\s+people|people\s+with\s+direct\s+service\s+experience)\b[^.!?\n]{0,140}\b(?:participated|attended|engaged)\b/i.test(s) &&
       (mechanismCurrent||/\bspecifically\s+about\s+this\s+proposal\b/i.test(s))) return "established";
    if(/\bwhat\s+is\s+established\s+is\s+that\b[^.!?\n]{0,220}\b(?:participated|attended|engaged)\b/i.test(s)) return "established";
    if(/\b(?:documented|recorded)\b[^.!?\n]{0,120}\b(?:workshop|consultation|engagement|participation)\b/i.test(s)&&mechanismCurrent) return "established";
  }

  return null;
}

function targetSignal(s,targetPatterns,positivePatterns=[],negativePatterns=[]){
  if(!targetPatterns.some(p=>p.test(s))) return null;
  if(doubleNegative(s)) return "ambiguous";
  if(/\bdoes\s+not\s+address\s+whether\b/i.test(s)) return null;

  const negative=
    negativePatterns.some(p=>p.test(s)) ||
    /\bnot\s+(?:established|documented|evidenced|recorded)\b/i.test(s) ||
    /\b(?:does|do|did|is|was|has|have|had)\s+not\b[^.!?\n]{0,100}\b(?:establish|document|evidence|record|show)\b/i.test(s) ||
    /^\s*no\b/i.test(s) ||
    /\bnone\s+of\b/i.test(s) ||
    /\b(?:absent|lacking|unknown|unclear)\b/i.test(s);

  const positive=positivePatterns.some(p=>p.test(s));

  const explicitConflict=
    /\bwhile\s+another\b/i.test(s) ||
    /\bone\s+(?:supplied\s+)?record\b[^.!?\n]{0,180}\banother\b/i.test(s) ||
    /\bseparate\s+(?:supplied\s+)?(?:record|note)\b/i.test(s);

  if(negative&&positive&&explicitConflict) return "ambiguous";
  if(negative) return "not_established";
  if(positive) return "established";
  return null;
}

function representativenessSignal(s){
  return targetSignal(
    s,
    [/\brepresentative(?:ness)?\b/i,/\brepresentative\s+sampling\b/i,/\bsample\b[^.!?\n]{0,80}\brepresentative\b/i],
    [
      /\bsample\b[^.!?\n]{0,80}\b(?:was|is)\s+representative\b/i,
      /\brepresentative\s+of\b/i,
      /\b(?:representativeness|representative\s+sampling)\b[^.!?\n]{0,80}\b(?:is|was|has\s+been|had\s+been)\s+(?:established|documented|evidenced|recorded)\b/i
    ],
    [
      /\b(?:representativeness|representative\s+sampling)\b[^.!?\n]{0,80}\b(?:is|was|remains|appears)?\s*(?:not\s+established|not\s+documented|not\s+evidenced|not\s+recorded)\b/i,
      /\b(?:does|do|did|is|was|has|have|had)\s+not\b[^.!?\n]{0,100}\b(?:establish|document|evidence|record|show)\b[^.!?\n]{0,120}\b(?:representativeness|representative\s+sampling)\b/i
    ]
  );
}

function consentSignal(s){
  return targetSignal(
    s,
    [/\bconsent\s+by\s+all\s+affected\s+people\b/i,/\ball\s+affected\s+people\b[^.!?\n]{0,80}\bconsent(?:ed)?\b/i,/\ball-affected\s+consent\b/i],
    [
      /\ball\s+affected\s+people\b[^.!?\n]{0,80}\bconsented\b/i,
      /\bconsent\s+by\s+all\s+affected\s+people\b[^.!?\n]{0,80}\b(?:was|is|has\s+been|had\s+been)\s+(?:documented|established|evidenced|recorded)\b/i
    ],
    [
      /\bconsent\s+by\s+all\s+affected\s+people\b[^.!?\n]{0,80}\b(?:is|was|remains|appears)?\s*(?:not\s+established|not\s+documented|not\s+evidenced|not\s+recorded)\b/i,
      /\b(?:does|do|did|is|was|has|have|had)\s+not\b[^.!?\n]{0,100}\b(?:establish|document|evidence|record|show)\b[^.!?\n]{0,120}\bconsent\s+by\s+all\s+affected\s+people\b/i
    ]
  );
}

function codesignSignal(s){
  return targetSignal(
    s,
    [/\bformal\s+co-design\s+authority\b/i,/\bco-design\s+authority\b/i],
    [
      /\b(?:held|had)\s+formal\s+co-design\s+authority\b/i,
      /\b(?:formal\s+)?co-design\s+authority\b[^.!?\n]{0,80}\b(?:was|is|has\s+been|had\s+been)\s+(?:held|granted|established|documented|evidenced|recorded)\b/i
    ],
    [
      /\b(?:formal\s+)?co-design\s+authority\b[^.!?\n]{0,80}\b(?:is|was|remains|appears)?\s*(?:not\s+established|not\s+documented|not\s+evidenced|not\s+recorded|not\s+held|not\s+granted)\b/i,
      /\b(?:does|do|did|is|was|has|have|had)\s+not\b[^.!?\n]{0,100}\b(?:establish|document|evidence|record|show|grant)\b[^.!?\n]{0,120}\b(?:formal\s+)?co-design\s+authority\b/i,
      /\bnot\s+(?:formal\s+)?co-design\s+authority\b/i
    ]
  );
}

function decisionAuthoritySignal(s){
  return targetSignal(
    s,
    [/\bdecision-making\s+authority\b/i,/\bdecision\s+authority\b/i],
    [
      /\b(?:held|had)\b[^.!?\n]{0,120}\bdecision(?:-making)?\s+authority\b/i,
      /\bdecision(?:-making)?\s+authority\b[^.!?\n]{0,80}\b(?:was|is|has\s+been|had\s+been)\s+(?:held|granted|established|documented|evidenced|recorded)\b/i
    ],
    [
      /\bdecision(?:-making)?\s+authority\b[^.!?\n]{0,80}\b(?:is|was|remains|appears)?\s*(?:not\s+established|not\s+documented|not\s+evidenced|not\s+recorded|not\s+held|not\s+granted)\b/i,
      /\b(?:does|do|did|is|was|has|have|had)\s+not\b[^.!?\n]{0,100}\b(?:establish|document|evidence|record|show|grant)\b[^.!?\n]{0,120}\bdecision(?:-making)?\s+authority\b/i,
      /\bnot\s+decision(?:-making)?\s+authority\b/i
    ]
  );
}

export function classifyParticipationStateV3(text){
  if(!text){
    return Object.fromEntries(PARTICIPATION_STATE_FIELDS.map(k=>[k,"not_addressed"]));
  }

  const signals=Object.fromEntries(PARTICIPATION_STATE_FIELDS.map(k=>[k,[]]));
  for(const s of splitSentences(text)){
    const p=participationSignal(s); if(p) signals.participation_occurred.push(p);
    const r=representativenessSignal(s); if(r) signals.representativeness.push(r);
    const c=consentSignal(s); if(c) signals.all_affected_consent.push(c);
    const co=codesignSignal(s); if(co) signals.formal_codesign_authority.push(co);
    const d=decisionAuthoritySignal(s); if(d) signals.decision_authority.push(d);
  }

  const result=Object.fromEntries(
    PARTICIPATION_STATE_FIELDS.map(k=>[k,reduceSignals(signals[k])])
  );
  for(const v of Object.values(result)){
    if(!STATES.includes(v)) throw new Error("Invalid classifier state: "+v);
  }
  return result;
}

export function deriveParticipationStatusV3(state){
  return state.participation_occurred;
}
