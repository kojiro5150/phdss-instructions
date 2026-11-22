import assert from "node:assert/strict";
import { extractChairItems,extractLogicalFindings,extractAbsentPerspectiveSummary } from "../src/runtime/dashboard-integrity.js";

// Entirely invented synthetic fixtures. Never historical RC1 case text.
const chair=[
"## Decision Conditions",
"These six conditions must be completed before any rollout.",
"1. **Oversight charter** — The board approves the authority boundary.",
"2. **Safety review** — A clinical reviewer checks risk.",
"3. **Community review** — Community advisors must be heard.",
"4. **Data access** — Custodians approve restricted access.",
"5. **Rollback** — A safe stop process is available.",
"6. **Audit trail** — Material changes are recorded.",
"",
"## Key Trade-offs",
"1. **Speed vs assurance**",
"   Faster rollout increases uncertainty.",
"2. **Coverage vs specificity**",
"   Broad coverage weakens local context.",
"3. **Automation vs review**",
"   Automation changes oversight burden.",
"4. **Cost vs resilience**",
"   Reduced cost may weaken fallback capacity.",
"5. **Consistency vs adaptation**",
"   Templates can suppress local variation.",
"6. **Transparency vs privacy**",
"   Disclosure must protect individual records.",
"",
"## Closing"
].join("\n");
const conditions=extractChairItems(chair,"Decision Conditions");
const tradeoffs=extractChairItems(chair,"Key Trade-offs");
assert.equal(conditions.length,6,"intro must not be counted");
assert.equal(tradeoffs.length,6,"all six trade-offs must survive");
assert.match(conditions.at(-1),/Audit trail/);
assert.match(tradeoffs.at(-1),/Transparency vs privacy/);
assert.match(tradeoffs[0],/Faster rollout/);

const meta=[
"## Cross-Domain Conflicts",
"1. **Safety vs throughput**",
"   Human review slows automation.",
"2. **Equity vs uniformity**",
"   Templates conceal local needs.",
"3. **Privacy vs transparency**",
"   Publishing detail exposes individuals.",
"4. **Speed vs governance**",
"   Deadlines constrain challenge.",
"",
"## Hidden Assumptions",
"1. **Reliable connectivity**",
"   Sites have a working network.",
"2. **Stable resources**",
"   Staff backfill remains available.",
"3. **Consistent literacy**",
"   Operators understand evidence labels.",
"4. **Consent continuity**",
"   Consent arrangements remain relevant.",
"",
"## Reasoning Gaps",
"1. **Missing baseline**",
"   Current state is not measured.",
"2. **Missing comparator**",
"   Alternatives are not described.",
"3. **Missing authority mapping**",
"   Responsibility is ambiguous.",
"4. **Missing failure drill**",
"   Recovery is not rehearsed.",
"",
"## Summary"
].join("\n");
for(const heading of ["Cross-Domain Conflicts","Hidden Assumptions","Reasoning Gaps"]) {
  const entries=extractLogicalFindings(meta,heading);
  assert.equal(entries.length,4,heading+" count");
  assert.match(entries.at(-1),/\w{3,}/);
}
assert.equal(extractLogicalFindings(meta.replace("4. **Speed vs governance**","3. **Speed vs governance**"),"Cross-Domain Conflicts").length,4);
const probe=[
"## Whose Perspective Is Absent",
"<!-- NOTE! This instruction guard must not displace a perspective. -->",
"Aboriginal and Torres Strait Islander community perspectives have not been supplied or independently verified.",
"## Other Finding"
].join("\n");
const absent=extractAbsentPerspectiveSummary(probe);
assert.match(absent,/Aboriginal and Torres Strait Islander/);
assert.doesNotMatch(absent,/NOTE|<!--|instruction guard/);
assert.match(absent,/independently verified/);
assert.equal(extractAbsentPerspectiveSummary("## Whose Perspective Is Absent\n<!-- NOTE! -->"),"");

// Bold-section and sub-bullet formatting variants must retain item identity.
const boldChair=[
  "**Decision Conditions**",
  "These introductory words are not conditions.",
  "**Independent sign-off** — The sign-off remains a human decision.",
  "**Accessible records** — Evidence is legible to reviewers.",
  "**Escalation process** — Teams can report exceptions.",
  "**Safe rollback** — Operations can be stopped.",
  "**Published limits** — Uncertainty remains visible.",
  "**Audit ownership** — Custodians retain review responsibility.",
  "**Key Trade-offs**",
  "**Speed vs deliberation**",
  "Deliberation is slow but improves scrutiny.",
  "**Uniformity vs local need**",
  "Local teams may need adaptations.",
  "**Privacy vs oversight**",
  "Oversight must not reveal identities.",
  "**Cost vs resilience**",
  "Redundancy costs resources.",
  "**Automation vs autonomy**",
  "Human discretion must remain.",
  "**Coverage vs accuracy**",
  "Coverage may dilute accuracy.",
  "**Accepted Residual Risk**",
  "Unknown implementation risks."
].join("\n");
assert.equal(extractChairItems(boldChair,"Decision Conditions").length,6);
assert.equal(extractChairItems(boldChair,"Key Trade-offs").length,6);
assert.match(extractChairItems(boldChair,"Key Trade-offs")[5],/Coverage vs accuracy/);

const boldMeta=[
  "**Cross-Domain Conflicts**",
  "1. **Safety vs throughput**",
  "   - Supporting material concerns human review.",
  "2. **Equity vs scale**",
  "   - Supporting material concerns local context.",
  "3. **Access vs control**",
  "   - Supporting material concerns restricted access.",
  "4. **Speed vs accountability**",
  "   - Supporting material concerns challenge and sign-off.",
  "**Hidden Assumptions**",
  "1. **Staff availability** — Availability has not been established.",
  "2. **Network reliability** — Reliability has not been established.",
  "3. **Cultural safety** — Safety has not been established.",
  "4. **Ongoing funding** — Funding has not been established.",
  "**Reasoning Gaps**",
  "1. **No comparator** — There is no comparator.",
  "2. **No baseline** — There is no baseline.",
  "3. **No fallback** — There is no fallback.",
  "4. **No ownership** — There is no ownership.",
  "**Unresolved Tensions**"
].join("\n");
for(const h of ["Cross-Domain Conflicts","Hidden Assumptions","Reasoning Gaps"]){
  assert.equal(extractLogicalFindings(boldMeta,h).length,4,"bold "+h);
}
assert.match(extractLogicalFindings(boldMeta,"Cross-Domain Conflicts")[0],/Supporting material/);


// R96-1/R96-2: invented format-matched Sonnet sections. The next bold-only
// heading is intentionally unknown to the parser's historical whitelist.
const modelStyleCDTA=[
  "**Cross-Domain Conflicts**",
  "1. **Access vs oversight** — Staff require permissions.",
  "2. **Continuity vs disruption** — Changes may interrupt care.",
  "3. **Innovation vs safety** — New functions require testing.",
  "4. **Transparency vs confidentiality** — Public reporting needs limits.",
  "**Hidden Assumptions**",
  "1. **Capacity exists** — Teams can complete reviews.",
  "2. **Records are accurate** — Inputs are reconciled.",
  "3. **Consent is current** — Conditions have not changed.",
  "4. **Fallback works** — Offline processes remain available.",
  "**Reasoning Gaps**",
  "1. **Missing comparison** — No alternative approach is tested.",
  "2. **Missing evidence** — Outcomes are unknown.",
  "3. **Missing ownership** — Responsibility is not allocated.",
  "4. **Missing implementation proof** — Deployment is untested.",
  "**Coverage Limitations**",
  "1. A fictitious locality's staffing has not been inspected.",
  "2. No invented budget has been verified.",
  "3. Data availability is uncertain.",
  "4. Provider arrangements are unknown.",
  "5. Clinical supervision is not evidenced.",
  "6. Recovery drills have not occurred.",
  "7. Monitoring capacity is unknown.",
  "8. Local commissioning is hypothetical.",
  "9. Implementation dates are speculative.",
  "**Unresolved Tensions**",
  "1. **Speed vs diligence** — Proceeding quickly weakens assurance.",
  "2. **Uniformity vs equity** — A template misses local needs.",
  "3. **Scope vs resources** — Capacity constrains ambition.",
  "4. **Assurance vs flexibility** — Controls restrict adaptation.",
  "**Integration Signal**: MEDIUM — human review is still needed.",
  "**Another Unlisted Section**",
  "This must never become another tension."
].join("\n");
for(const h of ["Cross-Domain Conflicts","Hidden Assumptions","Reasoning Gaps","Unresolved Tensions"]){
  const items=extractLogicalFindings(modelStyleCDTA,h);
  assert.equal(items.length,4,"model-format "+h+" must have exactly four logical findings");
  assert.ok(items.every(x=>!x.includes("Coverage Limitations")&&!x.includes("Integration Signal")),"no boundary leakage: "+h);
}
assert.equal(extractLogicalFindings(modelStyleCDTA,"Reasoning Gaps").at(-1).includes("Missing implementation proof"),true);
assert.match(extractLogicalFindings(modelStyleCDTA,"Unresolved Tensions").at(-1),/Assurance vs flexibility/);
const modelStyleProbe=[
  "**Whose Perspective Is Absent**",
  "<!-- NOTE! This is an invented instruction-guard example. -->",
  "Aboriginal and Torres Strait Islander perspectives have not been supplied.",
  "A separate invented community workforce voice is also absent.",
  "**Where AI Limitation Is Most Visible**",
  "This non-perspective analysis should not appear in the card.",
  "**Coverage-Induced Blind Spots**",
  "Several other limitations follow.",
  "**Probe Verdict**: SIGNIFICANT GAPS",
  "Extra material that belongs to the verdict."
].join("\n");
const modelSummary=extractAbsentPerspectiveSummary(modelStyleProbe);
assert.match(modelSummary,/^Aboriginal and Torres Strait Islander/);
assert.match(modelSummary,/community workforce/);
assert.doesNotMatch(modelSummary,/Where AI Limitation|Coverage-Induced|Probe Verdict|instruction-guard/);
assert.ok(modelSummary.length<300,"model-format summary limited to its own section");
// Disclose excerpt bounds, never silently truncate in the operator card.
const oversizedProbe="**Whose Perspective Is Absent**\nAboriginal and Torres Strait Islander perspectives: "+
  "Unverified community perspectives. ".repeat(100)+"\n**Where AI Limitation Is Most Visible**";
const longSummary=extractAbsentPerspectiveSummary(oversizedProbe);
assert.match(longSummary,/^\bAboriginal and Torres Strait Islander/);
assert.match(longSummary,/\[Excerpt: see full Probe output\]$/);
assert.ok(longSummary.length<1100);


// R96-4: real Sonnet structure, but entirely invented content.
// Number is INSIDE the bold span: **1. Title.** followed by a body paragraph.
// Bold section boundaries and in-line label/value must terminate the list.
const nestedBoldNumberCDTA=[
  "**Cross-Domain Conflicts**",
  "**1. Safety versus throughput.**",
  "Invented conflict details for the first item.",
  "**2. Equity versus standardisation.**",
  "Invented conflict details for the second item.",
  "**3. Privacy versus transparency.**",
  "Invented conflict details for the third item.",
  "**4. Cost versus continuity.**",
  "Invented conflict details for the fourth item.",
  "**Hidden Assumptions**",
  "**1. Uniform network connectivity.**",
  "Invented assumption about remote sites.",
  "**2. Staff have spare capacity.**",
  "Invented assumption about workloads.",
  "**3. All records are accurate.**",
  "Invented assumption about measurements.",
  "**4. Consent is continuous.**",
  "Invented assumption about permissions.",
  "**Reasoning Gaps**",
  "**1. No comparator is measured.**",
  "Invented details about absent comparison evidence.",
  "**2. Current process is uncharacterised.**",
  "Invented details about baseline uncertainty.",
  "**3. Recovery is untested.**",
  "Invented details about fallback readiness.",
  "**4. Accountability mapping is incomplete.**",
  "Invented details about governance roles.",
  "**Coverage Limitations**",
  "1. First limitation unrelated to reasoning gaps.",
  "2. Second limitation unrelated to reasoning gaps.",
  "3. Third limitation unrelated to reasoning gaps.",
  "4. Fourth limitation unrelated to reasoning gaps.",
  "5. Fifth limitation unrelated to reasoning gaps.",
  "6. Sixth limitation unrelated to reasoning gaps.",
  "7. Seventh limitation unrelated to reasoning gaps.",
  "8. Eighth limitation unrelated to reasoning gaps.",
  "9. Ninth limitation unrelated to reasoning gaps.",
  "**Unresolved Tensions**",
  "**1. Consistency can conflict with choice.**",
  "Invented tension about local options.",
  "**2. Speed can conflict with assurance.**",
  "Invented tension about review time.",
  "**3. Simplicity can conflict with depth.**",
  "Invented tension about explanation quality.",
  "**4. Scale can conflict with participation.**",
  "Invented tension about input burden.",
  "**Integration Signal**: MEDIUM — further review required.",
  "**Unlisted Results Context**",
  "Nothing in this trailing section should enter the tension count."
].join("\n");
for(const h of ["Cross-Domain Conflicts","Hidden Assumptions","Reasoning Gaps","Unresolved Tensions"]){
  const parsed=extractLogicalFindings(nestedBoldNumberCDTA,h);
  assert.equal(parsed.length,4,"inside-bold model numbering in "+h);
  assert.ok(parsed.every(x=>!x.includes("Coverage Limitations")&&!x.includes("Integration Signal")),"no next-section leakage for "+h);
  assert.ok(parsed.every(x=>!x.startsWith("**")&&!/^\d+\./.test(x)),"no numbering residue for "+h);
}
const gapParsed=extractLogicalFindings(nestedBoldNumberCDTA,"Reasoning Gaps");
assert.match(gapParsed[0],/No comparator is measured/);
assert.match(gapParsed[0],/absent comparison evidence/);
assert.match(gapParsed.at(-1),/governance roles/);
const tensionParsed=extractLogicalFindings(nestedBoldNumberCDTA,"Unresolved Tensions");
assert.match(tensionParsed.at(-1),/Scale can conflict with participation/);
assert.match(tensionParsed.at(-1),/input burden/);
// Empty/new-parser failure MUST remain empty, never silently revive legacy count.
assert.deepEqual(extractLogicalFindings("**Reasoning Gaps**\n**Coverage Limitations**\n1. Not a gap.","Reasoning Gaps"),[]);

console.log("RC2 dashboard integrity: PASS");
