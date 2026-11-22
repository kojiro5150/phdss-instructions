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
console.log("RC2 dashboard integrity: PASS");
