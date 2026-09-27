import assert from "node:assert/strict";
import fs from "node:fs";
import {
  STATUS_CLASSIFIER_VERSION,
  classifyParticipationStatusV2
} from "../src/calibration/participation-status-classifier-v2.js";

const fixture=JSON.parse(fs.readFileSync("tests/fixtures/v3/participation-status-classifier-v2.cases.json","utf8"));
assert.equal(fixture.classifier_version,STATUS_CLASSIFIER_VERSION);

for(const c of fixture.cases){
  const observed=classifyParticipationStatusV2(c.text);
  assert.equal(observed,c.expected,c.id+": expected "+c.expected+", got "+observed);
}

console.log("Participation status classifier v2 paired-case verification passed.");
console.log("Classifier version: "+STATUS_CLASSIFIER_VERSION);
console.log("Cases: "+fixture.cases.length+" PASS");
