// RC2 Phase A: lossless operator-facing extraction of structured findings.
function clean(value) { return String(value || "").replace(/\r/g, "").trim(); }
function stripPrefix(value) { return clean(value).replace(/^\s*(?:[-•]\s*|\d+[.)]\s*)/, ""); }
function stripMarkdown(value) { return clean(value).replace(/\*\*/g, "").replace(/^\s*#{1,6}\s*/, ""); }
function section(text, label) {
  const lines=clean(text).split("\n");
  const heading=label.toLowerCase();
  let start=-1;
  for(let i=0;i<lines.length;i++) {
    const h=stripMarkdown(lines[i]).replace(/:$/,"").trim().toLowerCase();
    if(h===heading) {start=i+1;break;}
  }
  if(start<0) return "";
  const body=[];
  for(let i=start;i<lines.length;i++) {
    if(/^\s*(?:#{1,6}\s+[A-Za-z]|\*\*[A-Za-z][^*]*\*\*\s*:?\s*$)/.test(lines[i]))break;
    body.push(lines[i]);
  }
  return body.join("\n").trim();
}
function unique(items) {
  const seen = new Set();
  return items.filter(item => {
    const key=stripMarkdown(item).toLowerCase().replace(/\s+/g," ");
    if (!key || seen.has(key)) return false;
    seen.add(key); return true;
  });
}
function listEntries(block) {
  const out=[];
  for(const line of clean(block).split("\n")) {
    const t=line.trim();
    if(!t || /^<!--/.test(t)) continue;
    if(/^(?:[-•]\s+|\d+[.)]\s+)/.test(t)) out.push(stripPrefix(t));
    else if(out.length && !/^#{1,6}\s/.test(t)) out[out.length-1]+=" "+t;
  }
  return unique(out.map(stripMarkdown));
}
export function extractChairItems(text, heading) {
  const block=section(text,heading);
  if(!block)return [];
  const entries=listEntries(block);
  if(entries.length)return entries;
  return unique(block.split(/\n\s*\n/).map(stripMarkdown).filter(x=>x.length>15));
}
export function extractLogicalFindings(text, heading) {
  const entries=listEntries(section(text,heading));
  return entries.filter(x=>x.length>10&&!/^(sourced|inferred|speculative)\s+(conflicts?|assumptions?|gaps?):?\s*$/i.test(x));
}
export function extractAbsentPerspectiveSummary(text) {
  const block=section(text,"Whose Perspective Is Absent");
  if(!block)return "";
  const visible=block.replace(/<!--[\s\S]*?-->/g,"").replace(/^\s*<!--.*$/gm,"").trim();
  return stripMarkdown(visible).replace(/\s+/g," ").trim();
}
