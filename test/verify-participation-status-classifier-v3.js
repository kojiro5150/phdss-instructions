import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import {
  STATUS_CLASSIFIER_VERSION,
  PARTICIPATION_STATE_FIELDS,
  classifyParticipationStateV3
} from "../src/calibration/participation-status-classifier-v3.js";

const fixture=JSON.parse(fs.readFileSync("tests/fixtures/v3/participation-status-classifier-v3.cases.json","utf8"));
assert.equal(fixture.classifier_version,STATUS_CLASSIFIER_VERSION);
assert.deepEqual(fixture.state_fields,PARTICIPATION_STATE_FIELDS);

for(const c of fixture.cases){
  const hash=crypto.createHash("sha256").update(c.text).digest("hex");
  assert.equal(hash,c.text_sha256,c.id+": frozen text SHA-256 mismatch");
  const observed=classifyParticipationStateV3(c.text);
  assert.deepEqual(observed,c.expected,c.id+": state mismatch");
}

console.log("Participation status classifier v3 five-field verification passed.");
console.log("Classifier version: "+STATUS_CLASSIFIER_VERSION);
console.log("Frozen cases: "+fixture.cases.length+" PASS");
