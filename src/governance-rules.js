import {
  AI_PROCUREMENT_KEYWORDS,
  DIGITAL_KEYWORDS,
  POLICY_KEYWORDS,
  ECONOMICS_KEYWORDS,
  MANDATORY_DIRECTOR_IDS,
} from "./constants.js";
import { DIRECTORS } from "./registry.js";

/**
 * Governance activation rules.
 *
 * These functions are pure, but they are not mere registry lookups: they encode
 * which governance domains participate under CORE and CHAIR_SPECIFIED modes.
 * Keeping them here makes that policy explicit and separately reviewable.
 */

export function detectAdaptiveFifth(decisionText) {
  var lower = (decisionText||"").toLowerCase();
  var hasAIProcurement = AI_PROCUREMENT_KEYWORDS.some(function(kw){ return lower.indexOf(kw)!==-1; });
  if (hasAIProcurement) return "digital";
  var hasDigital = DIGITAL_KEYWORDS.some(function(kw){ return lower.indexOf(kw)!==-1; });
  var hasEconomics = ECONOMICS_KEYWORDS.some(function(kw){ return lower.indexOf(kw)!==-1; });
  if (hasDigital && hasEconomics) return "economics";
  if (hasDigital) return "digital";
  if (POLICY_KEYWORDS.some(function(kw){ return lower.indexOf(kw)!==-1; })) return "policy";
  if (hasEconomics) return "economics";
  return "behaviour";
}

export function resolveCoreDirectors(decisionText) {
  var required = ["systems","safety","equity","lived"];
  var fifth = detectAdaptiveFifth(decisionText);
  var ids = required.concat([fifth]);
  return DIRECTORS.filter(function(d){ return ids.indexOf(d.id)!==-1; });
}

export function resolveChairDirectors(selectedIds) {
  var ids = MANDATORY_DIRECTOR_IDS.slice();
  selectedIds.forEach(function(id){ if(ids.indexOf(id)===-1) ids.push(id); });
  return DIRECTORS.filter(function(d){ return ids.indexOf(d.id)!==-1; });
}

export function resolveActiveDirectors(mode, decisionText, chairSelectedIds) {
  if (mode==="FULL") return DIRECTORS.slice();
  if (mode==="CORE") return resolveCoreDirectors(decisionText);
  if (mode==="CHAIR_SPECIFIED") return resolveChairDirectors(chairSelectedIds||[]);
  return DIRECTORS.slice();
}
