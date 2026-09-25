export function buildCoverageNote(mode, activeDirectors, allDirectors) {
  var active = activeDirectors.map(function(d){return d.label;});
  var omitted = allDirectors.filter(function(d){return active.indexOf(d.label)===-1;}).map(function(d){return d.label;});
  if (mode==="FULL") return "Full coverage: all "+allDirectors.length+" directors invoked.";
  if (mode==="CORE") return "Partial coverage (CORE mode): "+active.length+" of "+allDirectors.length+" directors invoked. Omitted: "+omitted.join(", ")+".";
  if (mode==="CHAIR_SPECIFIED") return "Custom coverage (CHAIR_SPECIFIED): "+active.length+" of "+allDirectors.length+" directors invoked. Omitted: "+(omitted.length?omitted.join(", "):"none")+".";
  return "";
}
