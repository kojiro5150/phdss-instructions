/**
 * PHDSS Governance Record structural contracts.
 *
 * This module defines the shape of records already emitted by the v2 runtime.
 * It does not add fields to runtime JSON and does not adjudicate semantic quality.
 * Authority semantics remain governed by authority-contract.js.
 */

export const GOVERNANCE_RECORD_CONTRACT_VERSION = "1.0.0";

export const DIRECTOR_SIGNALS = Object.freeze(["PROCEED","CAUTION","HALT","FAILED"]);
export const CONFIDENCE_LEVELS = Object.freeze(["HIGH","MEDIUM","LOW"]);

export const SYNTHESIS_VERDICT_FIELDS = Object.freeze({
  "Decision Surface Map":"Dominant Signal",
  "Epistemic Confidence Audit":"Epistemic Health Score",
  "Cross-Domain Tension Analysis":"Integration Signal",
  "Reality Anchor":"Operational Confidence",
  "Adversarial Probe":"Probe Verdict",
  "Decision Stress Test":"Fragility Score",
  "Chair Decision":"Decision Brief Status",
});

export const DIRECTOR_GOVERNANCE_RECORD_FIELDS = Object.freeze([
  "key_discovery",
  "primary_tension",
  "signal_rationale",
  "room_should_discuss",
  "most_likely_to_benefit",
  "most_exposed_to_failure",
  "non_negotiable_conditions",
  "governance_implication",
]);

export const DIRECTOR_BRIEF_FIELDS = Object.freeze([
  "director",
  "signal",
  "confidence",
  "core_judgment",
  "critical_risks",
  "assumptions",
  "prerequisites",
  "view_change_triggers",
  "coverage_limit",
  "regulatory_blockers",
  "overflow_flags",
  "governance_record",
]);

export const SYNTHESIS_BRIEF_FIELDS = Object.freeze([
  "module",
  "verdict_label",
  "verdict",
  "key_discovery",
  "primary_tension",
  "signal_rationale",
  "room_should_discuss",
  "most_likely_to_benefit",
  "most_exposed_to_failure",
  "non_negotiable_conditions",
  "governance_implication",
]);

export const BOARD_RECORD_FIELDS = Object.freeze([
  "headlineLabel",
  "headline",
  "headlineColor",
  "headlineRationale",
  "keyDiscoveryLabel",
  "keyDiscovery",
  "primaryTension",
  "roomShouldDiscuss",
  "mostLikelyToBenefit",
  "mostExposedToFailure",
  "nonNegotiableConditions",
  "governanceImplication",
  "extractionFlags",
]);

/**
 * @typedef {Object} DirectorGovernanceRecord
 * @property {string} key_discovery
 * @property {string} primary_tension
 * @property {string} signal_rationale
 * @property {string[]} room_should_discuss
 * @property {string[]} most_likely_to_benefit
 * @property {string[]} most_exposed_to_failure
 * @property {string[]} non_negotiable_conditions
 * @property {string} governance_implication
 */

/**
 * @typedef {Object} DirectorBrief
 * @property {string} director
 * @property {"PROCEED"|"CAUTION"|"HALT"|"FAILED"} signal
 * @property {"HIGH"|"MEDIUM"|"LOW"} confidence
 * @property {string} core_judgment
 * @property {string[]} critical_risks
 * @property {string[]} assumptions
 * @property {string[]} prerequisites
 * @property {string[]} view_change_triggers
 * @property {string} coverage_limit
 * @property {string[]} regulatory_blockers
 * @property {string[]} overflow_flags
 * @property {DirectorGovernanceRecord} governance_record
 */

/**
 * @typedef {Object} SynthesisBrief
 * @property {string} module
 * @property {string} verdict_label
 * @property {string} verdict
 * @property {string} key_discovery
 * @property {string} primary_tension
 * @property {string} signal_rationale
 * @property {string[]} room_should_discuss
 * @property {string[]} most_likely_to_benefit
 * @property {string[]} most_exposed_to_failure
 * @property {string[]} non_negotiable_conditions
 * @property {string} governance_implication
 * @property {string=} _fallback_reason
 */

/**
 * @typedef {Object} BoardGovernanceRecord
 * @property {string} headlineLabel
 * @property {string} headline
 * @property {{fg:string,bg:string,border:string}} headlineColor
 * @property {string} headlineRationale
 * @property {string} keyDiscoveryLabel
 * @property {string} keyDiscovery
 * @property {string} primaryTension
 * @property {string[]} roomShouldDiscuss
 * @property {string[]} mostLikelyToBenefit
 * @property {string[]} mostExposedToFailure
 * @property {string[]} nonNegotiableConditions
 * @property {string} governanceImplication
 * @property {string[]} extractionFlags
 */

function isObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isString(value) {
  return typeof value === "string";
}

function isStringArray(value) {
  return Array.isArray(value) && value.every(isString);
}

function requireFields(value, fields, errors, prefix) {
  fields.forEach(function(field) {
    if (!Object.prototype.hasOwnProperty.call(value, field)) {
      errors.push((prefix ? prefix+"." : "")+field+" is required");
    }
  });
}

function requireString(value, field, errors, prefix) {
  if (!isString(value[field])) errors.push((prefix ? prefix+"." : "")+field+" must be a string");
}

function requireStringArray(value, field, errors, prefix) {
  if (!isStringArray(value[field])) errors.push((prefix ? prefix+"." : "")+field+" must be an array of strings");
}

export function validateDirectorGovernanceRecord(value) {
  var errors=[];
  if (!isObject(value)) return {ok:false,errors:["governance_record must be an object"]};
  requireFields(value,DIRECTOR_GOVERNANCE_RECORD_FIELDS,errors,"governance_record");
  ["key_discovery","primary_tension","signal_rationale","governance_implication"].forEach(function(field){
    requireString(value,field,errors,"governance_record");
  });
  ["room_should_discuss","most_likely_to_benefit","most_exposed_to_failure","non_negotiable_conditions"].forEach(function(field){
    requireStringArray(value,field,errors,"governance_record");
  });
  return {ok:errors.length===0,errors:errors};
}

export function validateDirectorBriefObject(value) {
  var errors=[];
  if (!isObject(value)) return {ok:false,errors:["Director brief must be an object"]};
  requireFields(value,DIRECTOR_BRIEF_FIELDS,errors,"");
  ["director","signal","confidence","core_judgment","coverage_limit"].forEach(function(field){
    requireString(value,field,errors,"");
  });
  ["critical_risks","assumptions","prerequisites","view_change_triggers","regulatory_blockers","overflow_flags"].forEach(function(field){
    requireStringArray(value,field,errors,"");
  });
  if (isString(value.signal) && DIRECTOR_SIGNALS.indexOf(value.signal.toUpperCase())===-1) {
    errors.push("signal must be PROCEED, CAUTION, HALT, or FAILED");
  }
  if (isString(value.confidence) && CONFIDENCE_LEVELS.indexOf(value.confidence.toUpperCase())===-1) {
    errors.push("confidence must be HIGH, MEDIUM, or LOW");
  }
  var governance=validateDirectorGovernanceRecord(value.governance_record);
  governance.errors.forEach(function(error){ errors.push(error); });
  return {ok:errors.length===0,errors:errors};
}

export function validateSynthesisBriefObject(value,moduleLabel) {
  var errors=[];
  if (!isObject(value)) return {ok:false,errors:["Synthesis brief must be an object"]};
  requireFields(value,SYNTHESIS_BRIEF_FIELDS,errors,"");
  ["module","verdict_label","verdict","key_discovery","primary_tension","signal_rationale","governance_implication"].forEach(function(field){
    requireString(value,field,errors,"");
  });
  ["room_should_discuss","most_likely_to_benefit","most_exposed_to_failure","non_negotiable_conditions"].forEach(function(field){
    requireStringArray(value,field,errors,"");
  });
  if (moduleLabel && value.module !== moduleLabel) errors.push("module must equal "+moduleLabel);
  var expectedLabel=moduleLabel ? SYNTHESIS_VERDICT_FIELDS[moduleLabel] : SYNTHESIS_VERDICT_FIELDS[value.module];
  if (expectedLabel && value.verdict_label !== expectedLabel) {
    errors.push("verdict_label must equal "+expectedLabel);
  }
  if (Object.prototype.hasOwnProperty.call(value,"_fallback_reason") && !isString(value._fallback_reason)) {
    errors.push("_fallback_reason must be a string when present");
  }
  return {ok:errors.length===0,errors:errors};
}

export function validateBoardGovernanceRecord(value) {
  var errors=[];
  if (!isObject(value)) return {ok:false,errors:["Board Governance Record must be an object"]};
  requireFields(value,BOARD_RECORD_FIELDS,errors,"");
  ["headlineLabel","headline","headlineRationale","keyDiscoveryLabel","keyDiscovery","primaryTension","governanceImplication"].forEach(function(field){
    requireString(value,field,errors,"");
  });
  ["roomShouldDiscuss","mostLikelyToBenefit","mostExposedToFailure","nonNegotiableConditions","extractionFlags"].forEach(function(field){
    requireStringArray(value,field,errors,"");
  });
  if (!isObject(value.headlineColor)) {
    errors.push("headlineColor must be an object");
  } else {
    ["fg","bg","border"].forEach(function(field){
      if (!isString(value.headlineColor[field])) errors.push("headlineColor."+field+" must be a string");
    });
  }
  return {ok:errors.length===0,errors:errors};
}

export function isValidDirectorBriefText(text) {
  try {
    return validateDirectorBriefObject(JSON.parse(text)).ok;
  } catch(e) {
    return false;
  }
}

export function isValidSynthesisBriefText(text,moduleLabel) {
  try {
    return validateSynthesisBriefObject(JSON.parse(text),moduleLabel).ok;
  } catch(e) {
    return false;
  }
}

export function assertBoardGovernanceRecord(value) {
  var result=validateBoardGovernanceRecord(value);
  if (!result.ok) throw new Error("Invalid Board Governance Record: "+result.errors.join("; "));
  return value;
}
