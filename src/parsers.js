export function safeMatch(text, re, idx) {
  if (!text) return null;
  var m = text.match(re);
  return (m && m[idx]) ? m[idx] : null;
}

export function extractFirstJsonObject(text) {
  if (!text) return null;
  var fenced = text.match(/```json\s*([\s\S]*?)\s*```/i);
  var candidate = fenced ? fenced[1].trim() : text.trim();
  var first = candidate.indexOf("{"), last = candidate.lastIndexOf("}");
  if (first===-1||last===-1||last<=first) return null;
  try { return JSON.parse(candidate.slice(first,last+1)); } catch(e) { return null; }
}

export function escRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); }

export function extractBulletLines(text, heading) {
  if (!text) return [];
  var re = new RegExp("\\*\\*"+escRe(heading)+"\\*\\*[^\\n]*\\n([\\s\\S]*?)(?=\\n\\*\\*[A-Za-z][^*\\n]{2,}(?<!:)\\*\\*\\s*\\n|$)","i");
  var m = text.match(re);
  if (!m) return [];
  return m[1].split("\n").map(function(l){
    var s=l.trim();
    s=s.replace(/^[\s]*(?:[-•]|\*(?!\*)|\d+[.):])[\s]+/,"");
    s=s.replace(/^\*\*([^*]{1,80})\*\*:?\s*/,"$1 - ");
    s=s.replace(/^\*+\s*/,"").trim();
    return s;
  }).filter(function(l){return l.length>5;});
}

export function extractSection(text, heading) {
  if (!text) return "";
  var re = new RegExp("\\*\\*"+escRe(heading)+"\\*\\*:?\\s*([^\\n]*)(?:\\n([\\s\\S]*?))?(?=\\n\\*\\*[A-Za-z][^*\\n]{2,}(?<!:)\\*\\*\\s*\\n|$)","i");
  var m = text.match(re);
  if (!m) return "";
  var inline=(m[1]||"").replace(/^\[.*?\]\s*[-]?\s*/,"").trim();
  var block=(m[2]||"").trim();
  return [inline,block].filter(Boolean).join("\n").trim();
}

export function findSignal(text, signals) {
  if (!text) return null;
  for (var i=0;i<signals.length;i++){ if(text.indexOf(signals[i])!==-1) return signals[i]; }
  return null;
}

export function normItem(s){
  return s
    .replace(/^\d+\.\s*/,"")
    .replace(/\*\*([^*]+)\*\*/g,"$1")
    .replace(/^[-:—]\s*/,"")
    .replace(/\s+[-:—]\s+/g," ")
    .replace(/["'""'']/g,"")
    .trim()
    .toLowerCase();
}

export function dedupItems(arr) {
  var seen=[];
  return arr.filter(function(v){
    if(!v) return false;
    var n=normItem(v);
    if(seen.indexOf(n)!==-1) return false;
    seen.push(n); return true;
  });
}
