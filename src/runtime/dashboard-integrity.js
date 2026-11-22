// RC2 Phase A: lossless, dependency-free operator-facing extraction (F-6–F-8).
const SECTION_NAMES=new Set([
  "decision conditions","key trade-offs","key discovery","accepted residual risk",
  "cross-domain conflicts","hidden assumptions","reasoning gaps","unresolved tensions",
  "whose perspective is absent","what the board missed","probe verdict",
  "governance implication","decision brief status","summary","verification phase",
  "integration signal","non-negotiable conditions","board conclusion"
]);
function clean(value) { return String(value||"").replace(/\r/g,"").trim(); }
function stripMarkdown(value) { return clean(value).replace(/\*\*/g,"").replace(/^\s*#{1,6}\s*/,""); }
function title(line) { return stripMarkdown(line).replace(/:\s*$/,"").trim().toLowerCase(); }
function isSectionHeading(line) {
  const t=title(line);
  return SECTION_NAMES.has(t)&&/^\s*(?:#{1,6}\s|\*\*)/.test(line);
}
function section(text,label,strictBoldBoundary=false) {
  const lines=clean(text).split("\n");
  let start=-1,headingLevel=0;
  for(let i=0;i<lines.length;i++){
    if(title(lines[i])===label.toLowerCase()&&/^\s*(?:#{1,6}\s|\*\*)/.test(lines[i])){
      start=i+1;
      const found=lines[i].match(/^\s*(#{1,6})\s/);
      headingLevel=found?found[1].length:0;
      break;
    }
  }
  if(start<0)return "";
  const body=[];
  for(let i=start;i<lines.length;i++){
    const h=lines[i].match(/^\s*(#{1,6})\s/);
    if(h&&(!headingLevel||h[1].length<=headingLevel))break;
    // Treat recognised major bold headings as section boundaries,
    // but NEVER treat arbitrary bold item titles as boundaries.
    if(isSectionHeading(lines[i]))break;
    // F-7/F-8: model output frequently uses an unregistered bold-only
    // section name, or a bold label with an inline value (e.g. Integration
    // Signal). For logical CDTA/Probe extraction these are boundaries,
    // regardless of our legacy heading list. Chair sections retain their
    // distinct bold-title item handling.
    // Sonnet also emits numbered items as **1. Title.**; an item is NOT a new section.
    const boldNumberedItem=/^\s*\*\*\s*\d+[.)]\s+/.test(lines[i]);
    if(strictBoldBoundary && !boldNumberedItem && /^\s*\*\*[^*\n]+\*\*\s*:?\s*$/.test(lines[i]))break;
    if(strictBoldBoundary && !boldNumberedItem && /^\s*\*\*[^*\n]+\*\*\s*:\s+\S/.test(lines[i]))break;
    body.push(lines[i]);
  }
  return body.join("\n").trim();
}
function unique(items) {
  const seen=new Set();
  return items.filter(item=>{
    const key=stripMarkdown(item).toLowerCase().replace(/\s+/g," ");
    if(!key||seen.has(key))return false;
    seen.add(key);return true;
  });
}
function listEntries(block) {
  const lines=clean(block).split("\n");
  const numbered=lines.some(line=>/^\s*(?:\*\*\s*)?\d+[.)]\s+/.test(line));
  const bulleted=!numbered&&lines.some(line=>/^\s*[-•]\s+/.test(line));
  const out=[];
  for(const original of lines){
    const t=original.trim();
    if(!t||/^<!--/.test(t))continue;
    const number=/^\s*(?:\*\*\s*)?\d+[.)]\s+/.test(original);
    const topBullet=/^[-•]\s+/.test(original);
    const boldHeading=/^\*\*[^*]{3,}\*\*\s*[-—:]?/.test(t);
    const startsNew=numbered?number:(bulleted?topBullet:boldHeading);
    if(startsNew) {
      const entry=t.replace(/^(?:\*\*\s*)?\d+[.)]\s+|^[-•]\s+/,"").trim();
      out.push(entry);
    } else if(out.length&&!/^#{1,6}\s/.test(t)) {
      out[out.length-1]+=" "+t;
    }
  }
  return unique(out.map(stripMarkdown));
}
export function extractChairItems(text,heading) {
  const block=section(text,heading);
  if(!block)return [];
  const entries=listEntries(block);
  if(entries.length)return entries;
  return unique(block.split(/\n\s*\n/).map(stripMarkdown).filter(x=>x.length>15));
}
export function extractLogicalFindings(text,heading) {
  return listEntries(section(text,heading,true)).filter(x=>x.length>10
    &&!/^(sourced|inferred|speculative)\s+(conflicts?|assumptions?|gaps?):?\s*$/i.test(x));
}
export function extractAbsentPerspectiveSummary(text) {
  const block=section(text,"Whose Perspective Is Absent",true);
  if(!block)return "";
  const visible=block.replace(/<!--[\s\S]*?-->/g,"").replace(/^\s*<!--.*$/gm,"").trim();
  const summary=stripMarkdown(visible).replace(/\s+/g," ").trim();
  // Bound card copy without silently reclassifying subsequent Probe content.
  // The full source remains accessible in the technical Probe output.
  const limit=1000;
  if(summary.length<=limit)return summary;
  return summary.slice(0,limit).trimEnd()+"… [Excerpt: see full Probe output]";
}
