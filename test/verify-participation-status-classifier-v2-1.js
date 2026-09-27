import assert from "node:assert/strict";
import fs from "node:fs";
import {
  STATUS_CLASSIFIER_VERSION,
  classifyParticipationStatusV21
} from "../src/calibration/participation-status-classifier-v2-1.js";

const fixture=JSON.parse(fs.readFileSync("tests/fixtures/v3/participation-status-classifier-v2-1.cases.json","utf8"));
assert.equal(fixture.classifier_version,STATUS_CLASSIFIER_VERSION);

for(const c of fixture.cases){
  const observed=classifyParticipationStatusV21(c.text);
  assert.equal(observed,c.expected,c.id+": expected "+c.expected+", got "+observed);
}

console.log("Participation status classifier v2.1 structured-case verification passed.");
console.log("Classifier version: "+STATUS_CLASSIFIER_VERSION);
console.log("Cases: "+fixture.cases.length+" PASS");
