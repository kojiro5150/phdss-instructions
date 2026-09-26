import fs from "node:fs";
import assert from "node:assert/strict";
import {
  PHDSS_NORTH_STAR,
  ORIENTATION_AUTHORITY_CHAIN,
  ORIENTATION_FLOW,
  ORIENTATION_USE_WHEN,
  ORIENTATION_DO_NOT_USE_AS,
  ORIENTATION_MODES,
  ORIENTATION_ADVISORY_NOTE,
  ORIENTATION_LEGITIMACY_NOTE,
} from "../src/orientation.js";

const expectedNorthStar="PHDSS is designed to make the decision space larger and more legible before humans decide — surfacing assumptions, tensions, missing evidence, affected perspectives, operational constraints and plausible alternatives that may otherwise remain hidden.";
assert.equal(PHDSS_NORTH_STAR,expectedNorthStar);

assert.deepStrictEqual(
  ORIENTATION_AUTHORITY_CHAIN.map(function(item){return item.label+":"+item.action;}),
  [
    "AI:enlarge + interrogate",
    "Code:constrain + validate + preserve",
    "Chair:organise + expose",
    "Human:judge + decide",
  ]
);
assert.match(ORIENTATION_AUTHORITY_CHAIN.find(function(item){return item.id==="chair";}).detail,/without adjudicating/i);
assert.match(ORIENTATION_AUTHORITY_CHAIN.find(function(item){return item.id==="human";}).detail,/decision authority/i);

assert.deepStrictEqual(
  ORIENTATION_FLOW.map(function(item){return item.id;}),
  ["inputs","directors","synthesis","decision_brief","transparency","ledger"]
);
assert.match(ORIENTATION_FLOW.find(function(item){return item.id==="decision_brief";}).detail,/does not select a preferred course/i);
assert.match(ORIENTATION_FLOW.find(function(item){return item.id==="ledger";}).detail,/without rewriting history/i);

assert.ok(ORIENTATION_USE_WHEN.length>=3);
assert.ok(ORIENTATION_DO_NOT_USE_AS.length>=3);
assert.match(ORIENTATION_DO_NOT_USE_AS.join(" "),/automated approval, rejection, ranking or recommendation/i);

assert.deepStrictEqual(ORIENTATION_MODES.map(function(item){return item.id;}),["CORE","FULL","CHAIR_SPECIFIED"]);
assert.match(ORIENTATION_MODES[0].coverage,/5 adaptive/i);
assert.match(ORIENTATION_MODES[0].cost,/Lower/i);
assert.match(ORIENTATION_MODES[0].detail,/not be treated as equivalent to FULL/i);
assert.match(ORIENTATION_MODES[1].coverage,/13/);
assert.match(ORIENTATION_MODES[1].cost,/Highest/i);
assert.match(ORIENTATION_MODES[2].detail,/Systems & Safety remain mandatory/i);
assert.match(ORIENTATION_MODES[2].detail,/accountable/i);

assert.match(ORIENTATION_ADVISORY_NOTE,/do not run the governance synthesis chain/i);
assert.match(ORIENTATION_ADVISORY_NOTE,/Decision Brief/);
assert.match(ORIENTATION_LEGITIMACY_NOTE,/does not confer decision authority or institutional legitimacy/i);
assert.match(ORIENTATION_LEGITIMACY_NOTE,/authorised human process/i);

const app=fs.readFileSync("App_FINAL.jsx","utf8");
assert.match(app,/from "\.\/src\/orientation\.js"/);
assert.match(app,/function OrientationPanel\(/);
assert.match(app,/<OrientationPanel/);
assert.match(app,/PHDSS_NORTH_STAR/);
assert.match(app,/ORIENTATION_AUTHORITY_CHAIN/);
assert.match(app,/ORIENTATION_FLOW/);
assert.match(app,/ORIENTATION_MODES/);

console.log("PHDSS orientation contract verification passed.");
console.log("North Star: exact PASS");
console.log("Authority chain: AI → Code → Chair → Human PASS");
console.log("Product flow: Inputs → Directors → Synthesis → Decision Brief → Transparency → Ledger PASS");
console.log("Mode / cost / legitimacy guidance: PASS");
