const LAYER_TERMINI = Object.freeze({
  surface_map: "landscape legibility",
  epistemic_audit: "confidence in the reasoning record",
  cross_domain_tension_analysis: "structured unresolved tension",
  reality_anchor: "operational availability and feasibility characterisation",
  adversarial_probe: "mandatory adversarial challenge",
  stress_test: "failure visibility under stress",
  chair: "integrated Decision Brief for human judgment",
  comparator: "difference visibility",
});

const LAYER_PROHIBITIONS = Object.freeze({
  surface_map: "Do not convert signal convergence, landscape structure, or a Dominant Signal into approval, rejection, deferral, ranking, or pathway selection.",
  epistemic_audit: "Do not convert evidence quality or an Epistemic Health Score into an institutional course of action.",
  cross_domain_tension_analysis: "Do not resolve material tensions, choose which domain should dominate, or instruct the institution which pathway to take.",
  reality_anchor: "You may report evidenced external constraints or infeasibility. Do not select the alternative, and do not turn inferred capability gaps into institutional foreclosure.",
  adversarial_probe: "Challenge the dominant case without substituting a preferred counter-pathway or institutional decision.",
  stress_test: "Report failure, fragility, threshold breaches, and irreversibility without selecting an alternative institutional course.",
  chair: "Integrate the record without selecting, approving, rejecting, deferring, piloting, or declaring a preferred course.",
  comparator: "Compare differences without declaring an overall winner, preferred pathway, or institutional choice.",
});

export function authorityBoundaryPrompt(layer) {
  const terminus=LAYER_TERMINI[layer]||"analytical characterisation";
  const prohibition=LAYER_PROHIBITIONS[layer]||"Do not adjudicate the institutional decision.";
  return "\n\nPHDSS AUTHORITY CONTRACT: Analytical authority terminates at adjudication. You may describe, characterise, map, challenge, compare, condition, and report evidenced constraints. You must preserve material tension for human judgment. "+prohibition+" Your authority terminates at "+terminus+".";
}

function externalConstraintClause(clause) {
  return /\b(?:law|legal(?:ly)?|regulat(?:ion|ory|or)|statut(?:e|ory)|court order|licen[cs]e|authorisation|authorization|physical(?:ly)? impossible|technical dependency|pre[- ]specified safety (?:rule|threshold)|mandatory safety (?:rule|threshold))\b/i.test(clause)
    && /\b(?:require[sd]?|prohibit(?:s|ed)?|unavailable|not legally available|cannot legally|must not legally|foreclose[sd]? by)\b/i.test(clause);
}

function splitClauses(text) {
  return String(text||"")
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s=>s.trim())
    .filter(Boolean);
}

function reasonForClause(clause) {
  if(!clause) return null;
  // Questions surface decision issues without themselves adjudicating them.
  if(/\?$/.test(clause)) return null;

  if(/\b(?:best|preferred|superior|stronger)\s+(?:option|pathway|course|alternative)\b/i.test(clause)
    || /\bshould\s+be\s+preferred\b/i.test(clause)
    || /\brank(?:ed|ing)?\b[^.]{0,100}\b(?:first|second|best|worst|preferred)\b/i.test(clause)
    || /\b(?:supports?|favou?rs?|prefers?)\b[^.]{0,120}\b(?:first|second|third|fourth|pathway|option|course)\b[^.]{0,80}\bover\b[^.]{0,80}\b(?:first|second|third|fourth|pathway|option|course)\b/i.test(clause)
    || /\b(?:pathway|option|course)\b[^.]{0,80}\bis\s+(?:clearly\s+)?(?:preferable|better|safer|stronger)\s+(?:to|than)\b/i.test(clause)
    || /\bthe\s+(?:preferred|better|safer|stronger)\s+(?:pathway|option|course)\s+is\b/i.test(clause)) {
    return "PATHWAY_RANKING";
  }

  if(/\b(?:sites?|settings?|jurisdictions?|populations?)\b[^.]{0,120}\bshould\s+be\s+(?:included|excluded)\b[^.]{0,100}\b(?:pilot|deployment|rollout|scope)\b/i.test(clause)) {
    return "PATHWAY_SELECTION";
  }

  if(/\b(?:conflict|tension|trade[- ]off)\b[^.]{0,120}\b(?:is|has been|should be)\s+resolved\b/i.test(clause)
    || /\bresolved\s+in\s+favou?r\s+of\b/i.test(clause)) {
    return "TENSION_RESOLUTION";
  }

  if(/\b(?:proposal|pathway|option|decision)\b[^.]{0,80}\b(?:is|has been|should be|must be)\s+(?:approved|rejected|deferred|selected|adopted|authori[sz]ed)\b/i.test(clause)) {
    if(externalConstraintClause(clause) && /\b(?:unavailable|prohibited|cannot legally)\b/i.test(clause)) return null;
    return "INSTITUTIONAL_DISPOSITION";
  }

  if(/\b(?:institution|organisation|organization|board|chair|committee|we)\b[^.]{0,140}\b(?:should|must|ought to|will)\s+(?:now\s+)?(?:select|choose|adopt|implement|approve|reject|defer|pilot|authori[sz]e|use)\b/i.test(clause)) {
    return "INSTITUTIONAL_DIRECTIVE";
  }

  if(/\b(?:pathway|option|course|proposal)\s+[A-Z0-9-]*\b[^.]{0,100}\b(?:should|must)\s+(?:be\s+)?(?:selected|chosen|adopted|implemented|preferred|rejected|approved)\b/i.test(clause)
    || /\btherefore\b[^.]{0,120}\b(?:pathway|option|course)\b[^.]{0,100}\bmust\s+be\s+(?:implemented|adopted|selected|chosen)\b/i.test(clause)) {
    return "PATHWAY_SELECTION";
  }

  if(/\b(?:signals?|signal distribution|majority|unanim(?:ous|ity)|convergence)\b[^.]{0,140}\b(?:means?|therefore|confirms?|establishes?)\b[^.]{0,120}\b(?:proposal|pathway|option|decision)\b[^.]{0,80}\b(?:rejected|approved|selected|adopted|deferred|must not proceed|should not proceed)\b/i.test(clause)
    || /\bbecause\b[^.]{0,100}\bsignals?\b[^.]{0,120}\b(?:proposal|pathway|option)\b[^.]{0,80}\b(?:is|should be|must be)\s+(?:rejected|approved|selected|adopted|deferred)\b/i.test(clause)) {
    return "SIGNAL_TO_DECISION";
  }

  if(/\b(?:this|the)\s+(?:decision|proposal|pathway)\b[^.]{0,100}\bshould\s+not\s+(?:proceed|advance|be implemented|be approved)\b/i.test(clause)) {
    return "UNSUPPORTED_FORECLOSURE";
  }

  if(/\b(?:pathway|option|proposal)\b[^.]{0,100}\b(?:is|remains|has been)\s+(?:closed|foreclosed|ruled out|unavailable)\b/i.test(clause)) {
    if(externalConstraintClause(clause)) return null;
    return "UNSUPPORTED_FORECLOSURE";
  }

  if(/\b(?:immediate|final)\s+decision\b[^.]{0,140}\b(?:is|must be|should be)\b/i.test(clause)) {
    return "DECISION_RESOLUTION";
  }

  // Legacy Chair-style directive wording.
  if(/\b(?:the board|the chair|this analysis|these findings|the signals?|the governance record|this module|we)\b[^.]{0,180}\b(?:should|must|ought to|cannot|can not)\s+(?:not\s+)?(?:proceed|approve|reject|deploy|implement|adopt|defer|pilot)\b/i.test(clause)) {
    if(externalConstraintClause(clause)) return null;
    return "INSTITUTIONAL_DIRECTIVE";
  }

  if(/\b(PROCEED WITH CONDITIONS|PROCEED WITH CAUTION|CONDITIONAL APPROVAL|DO NOT PROCEED|CHAIR RECOMMENDATION)\b/i.test(clause)) {
    return "RETIRED_DECISION_VOCABULARY";
  }

  return null;
}

export function assessAuthorityBoundary(layer,text) {
  const clauses=splitClauses(text);
  for(const clause of clauses){
    const reason=reasonForClause(clause);
    if(reason) return {violates:true,layer,reason,clause};
  }
  return {violates:false,layer,reason:null,clause:null};
}

export function authorityBoundaryLeak(layer,text) {
  return assessAuthorityBoundary(layer,text).violates;
}

export const authorityLayerTermini=LAYER_TERMINI;
