import assert from "node:assert/strict";
import fs from "node:fs";
import {
  STATUS_CLASSIFIER_VERSION,
  classifyParticipationStatusV21
} from "../src/calibration/participation-status-classifier-v2-1.js";

const fixture=JSON.parse(fs.readFileSync("tests/fixtures/v3/participation-status-classifier-v2-1.cases.json","utf8"));
assert.equal(fixture.classifier_version,STATUS_CLASSIFIER_VERSION);

const knownHistoricalMismatches=new Map([
  ["genuine_conflict_records",{
    expected:"ambiguous",
    actual:"not_established",
    reason:"v2.1 does not recognize the second sentence's workshop-record wording as a positive current-decision mechanism signal"
  }]
]);

let matched=0;
for(const c of fixture.cases){
  const observed=classifyParticipationStatusV21(c.text);
  const known=knownHistoricalMismatches.get(c.id);
  if(known){
    assert.equal(c.expected,known.expected,c.id+": frozen expected value changed");
    assert.equal(observed,known.actual,c.id+": historical mismatch changed unexpectedly");
    continue;
  }
  assert.equal(observed,c.expected,c.id+": expected "+c.expected+", got "+observed);
  matched++;
}

console.log("Participation status classifier v2.1 frozen-behavior verification passed.");
console.log("Classifier version: "+STATUS_CLASSIFIER_VERSION);
console.log("Exact corpus matches: "+matched+"/"+fixture.cases.length);
console.log("Known historical mismatch preserved: genuine_conflict_records expected ambiguous -> actual not_established.");
