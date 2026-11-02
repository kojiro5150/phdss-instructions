// Single source of truth for Director signal extraction and the Board's
// dominant signal (L-18). Every synthesis stage that is told the dominant
// signal or the signal counts must take them from tallyDirectorSignals so that
// no two stages in one run can be given different values.

const SIGNAL_PATTERN = /\*\*Recommendation Signal\*\*:?[^A-Z]*(PROCEED|CAUTION|HALT)/;
// NOT APPLICABLE is counted only when no signal is present in any letter case,
// matching the pre-L-18 Surface Map tally exactly.
const SIGNAL_PATTERN_ANY_CASE = /\*\*Recommendation Signal\*\*:?[^A-Z]*(PROCEED|CAUTION|HALT)/i;

export function extractDirectorSignal(output) {
  const match = String(output || "").match(SIGNAL_PATTERN);
  return match ? match[1] : null;
}

// Dominant-signal rule. Preserves the rule previously supplied to the Surface
// Map as authoritative: HALT only if strictly greater than both other counts;
// otherwise CAUTION if greater than or equal to both; otherwise PROCEED if any
// PROCEED was signalled; otherwise MIXED. Because 0 >= 0, a run with no parsed
// signals returns CAUTION, so MIXED is unreachable. Tie and no-signal semantics
// are a Protocol Authority decision recorded under L-18; this function
// preserves them and does not change them.
export function dominantSignalFromCounts(proceed, caution, halt) {
  if (halt > caution && halt > proceed) return "HALT";
  if (caution >= halt && caution >= proceed) return "CAUTION";
  if (proceed > 0) return "PROCEED";
  return "MIXED";
}

export function tallyDirectorSignals(results) {
  let proceed = 0, caution = 0, halt = 0, notApplicable = 0;
  (results || []).forEach(function (r) {
    const output = r && r.output;
    const signal = extractDirectorSignal(output);
    if (signal === "PROCEED") proceed++;
    else if (signal === "CAUTION") caution++;
    else if (signal === "HALT") halt++;
    else if (/NOT APPLICABLE/i.test(String(output || "")) && !SIGNAL_PATTERN_ANY_CASE.test(String(output || ""))) notApplicable++;
  });
  const total = (results || []).length;
  return Object.freeze({
    proceed,
    caution,
    halt,
    notApplicable,
    undefinedCount: total - proceed - caution - halt - notApplicable,
    total,
    dominant: dominantSignalFromCounts(proceed, caution, halt),
  });
}
