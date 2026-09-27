import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const fixture=JSON.parse(fs.readFileSync("tests/fixtures/v3/participation-section-extraction-v3-1.cases.json","utf8"));
assert.equal(fixture.scorer_version,"participation_calibration_scorer_v3_1");

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"phdss-scorer-v3-1-"));
try{
  for(const c of fixture.cases){
    const hash=crypto.createHash("sha256").update(c.raw_markdown).digest("hex");
    assert.equal(hash,c.raw_sha256,c.id+": frozen raw SHA-256 mismatch");

    const rawPath=path.join(tmp,c.id+".md");
    fs.writeFileSync(rawPath,c.raw_markdown);
    const annotation={
      fixture_id:"C",
      raw_output_sha256:hash,
      reviewer:"section-extraction-regression",
      review_date:"2026-09-27",
      false_established_claims:[],
      false_not_established_claims:[]
    };
    const annPath=path.join(tmp,c.id+".json");
    fs.writeFileSync(annPath,JSON.stringify(annotation));

    const run=spawnSync(process.execPath,[
      "scripts/score-participation-calibration-v3-1.mjs",
      "--fixture","C",
      "--raw",rawPath,
      "--annotation",annPath,
      "--json"
    ],{encoding:"utf8"});

    assert.equal(run.status,0,c.id+": "+(run.stderr||run.stdout));
    const result=JSON.parse(run.stdout);
    assert.equal(result.scorer_version,"participation_calibration_scorer_v3_1");
    assert.equal(result.status_classifier_version,"status_classifier_v3");
    assert.equal(result.scores.section_present,true);
    assert.equal(result.scores.section_nonempty,true);
    assert.equal(result.scores.categories_distinct,true);
    assert.equal(result.observed_participation_status,"established");
    assert.equal(result.scores.status_matches_ground_truth,true);
    assert.equal(result.observed_participation_state.participation_occurred,"established");
    assert.equal(result.observed_participation_state.representativeness,"not_established");
    assert.equal(result.observed_participation_state.formal_codesign_authority,"not_established");
    assert.equal(result.observed_participation_state.decision_authority,"not_established");
  }
}finally{
  fs.rmSync(tmp,{recursive:true,force:true});
}

console.log("Participation calibration scorer v3.1 section-boundary verification passed.");
console.log("Heading styles: "+fixture.cases.length+" PASS");
