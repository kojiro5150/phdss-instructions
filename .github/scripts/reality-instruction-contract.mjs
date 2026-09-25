import fs from "node:fs";

const source=fs.readFileSync("reality.md","utf8");
const failures=[];

function requireMatch(label,pattern,text=source){
  if(!pattern.test(text)) failures.push(label);
}

function prohibitMatch(label,pattern,text=source){
  if(pattern.test(text)) failures.push(label);
}

const headingMatches=source.match(/\*\*Falsification Conditions\*\*/g)||[];
if(headingMatches.length!==2){
  failures.push("source should contain exactly two Falsification Conditions markers: one parser-contract reference and one active output heading; got "+headingMatches.length);
}

const active=source.replace(/<!--[\s\S]*?-->/g,"");
const activeHeadingMatches=active.match(/\*\*Falsification Conditions\*\*/g)||[];
if(activeHeadingMatches.length!==1){
  failures.push("active instruction should contain exactly one Falsification Conditions output heading; got "+activeHeadingMatches.length);
}

const start=active.indexOf("**Falsification Conditions**");
const end=active.indexOf("**Coverage Limitations**",start);
const falsification=(start>=0&&end>start)?active.slice(start,end):"";

requireMatch("missing mandatory Upgrade conditions subsection",/\*Upgrade conditions\*/i,falsification);
requireMatch("missing mandatory Downgrade conditions subsection",/\*Downgrade conditions\*/i,falsification);
requireMatch("upgrade direction must increase operational feasibility or confidence",/increase[^\n.]{0,100}(?:operational\s+)?(?:feasibility|confidence)|(?:feasibility|confidence)[^\n.]{0,100}increase/i,falsification);
requireMatch("downgrade direction must decrease operational feasibility or confidence",/(?:decrease|reduce|weaken|worsen)[^\n.]{0,100}(?:operational\s+)?(?:feasibility|confidence)|(?:feasibility|confidence)[^\n.]{0,100}(?:decrease|reduce|weaken|worsen)/i,falsification);
requireMatch("downgrade direction must preserve stronger evidenced constraint possibility",/stronger evidenced (?:operational )?constraint/i,falsification);
requireMatch("Reality Anchor must terminate at human judgment",/human decision-maker/i,source);

prohibitMatch("retired PROCEED vocabulary remains in Reality instruction",/\bPROCEED\b/i,source);
prohibitMatch("retired DEFER vocabulary remains in Reality instruction",/\bDEFER\b/i,source);
prohibitMatch("retired DO NOT PROCEED vocabulary remains in Reality instruction",/\bDO NOT PROCEED\b/i,source);
prohibitMatch("recommendation-direction falsification language remains",/move the recommendation|change the recommendation/i,source);
prohibitMatch("approval-direction falsification language remains",/stronger approval/i,source);
prohibitMatch("Reality instruction still assigns decision authority to Chair",/that is the Chair['’]s function/i,source);
prohibitMatch("friction classification still assigns response authority to Chair",/Chair['’]s response/i,source);
prohibitMatch("falsification still characterises the analysis as a governance decision",/analysis that cannot be falsified is not a governance decision/i,source);

if(failures.length){
  console.error("PHDSS Reality Anchor instruction contract failed:");
  for(const failure of failures) console.error("- "+failure);
  process.exit(1);
}

console.log("PHDSS Reality Anchor instruction contract passed.");
console.log("Bidirectional falsification structure: PASS");
console.log("Retired decision-direction vocabulary absent: PASS");
console.log("Human decision authority: PASS");
