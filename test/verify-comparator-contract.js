import assert from "node:assert/strict";
import fs from "node:fs";

import { DIRECTORS } from "../src/registry.js";
import { LEDGER_SCHEMA } from "../src/constants.js";
import {
  lensComparatorSystem,
  comparatorJsonSystem,
} from "../src/prompt-builders.js";

const source=fs.readFileSync("comparator.md","utf8");
const active=source.replace(/<!--[\s\S]*?-->/g,"");

assert.equal(LEDGER_SCHEMA,"3.0.0-alpha.2");

assert.doesNotMatch(source,/chair_resolution\.recommendation/i);
assert.doesNotMatch(source,/["']recommendation["']\s*:/i);
assert.doesNotMatch(source,/next_actions_30_60_90/i);
assert.doesNotMatch(source,/how the Chair resolved/i);
assert.doesNotMatch(source,/Chair has already issued the governance position/i);

assert.match(source,/decision_brief_status/i);
assert.match(source,/monitoring_triggers_30_60_90/i);
assert.match(source,/difference visibility/i);
assert.match(source,/human decision-maker/i);
assert.match(source,/observable/i);
assert.match(source,/30[\s/-]*60[\s/-]*90/i);

const activeDirectors=DIRECTORS.slice(0,5);
const instructions={comparator:"GOVERNANCE COMPARATOR SENTINEL"};
const lens=lensComparatorSystem(
  DIRECTORS[0],DIRECTORS[1],[],false,false,[],
  {decisionSignal:"Synthetic decision"},instructions
);
assert.doesNotMatch(lens,/GOVERNANCE COMPARATOR SENTINEL/);
assert.match(lens,/Dual Lens Comparator/);
assert.doesNotMatch(lens,/Decision Ledger|chair_resolution|monitoring_triggers_30_60_90/i);

const prompt=comparatorJsonSystem(
  "DR-TEST","Synthetic signal",
  [{label:"Systems & Dynamics",output:"Output A"}],
  "CORE",activeDirectors,"Chair output",instructions,0,4,1
);
assert.match(prompt,/GOVERNANCE COMPARATOR SENTINEL/);
assert.match(prompt,/"schema_version":"3\.0\.0-alpha\.2"/);
assert.match(prompt,/"decision_brief_status":"string"/);
assert.match(prompt,/"monitoring_triggers_30_60_90"/);
assert.doesNotMatch(prompt,/"next_actions_30_60_90"/);
assert.doesNotMatch(prompt,/"recommendation"\s*:/);
assert.match(prompt,/observable evidence, condition, or threshold/i);
assert.match(prompt,/must not prescribe institutional actions/i);

console.log("PHDSS Comparator contract verification passed.");
console.log("Comparator difference-visibility boundary: PASS");
console.log("Comparator schema migration: PASS");
console.log("Dual Lens advisory separation: PASS");
