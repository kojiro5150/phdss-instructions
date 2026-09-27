import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"phdss-scorer-v3-"));
try{
  const raw=[
    "**Participation & Representation Status**",
    "",
    "- **Model-generated analytical representation:** inference only.",
    "- **Human-supplied lived-experience evidence:** Five people attended a documented workshop about this proposal.",
    "- **Actual participation status:** The supplied record does not establish consent by all affected people, representative sampling, formal co-design authority, or decision-making authority. What is established is that five people with direct service experience attended a facilitated workshop, engaged with the specific proposal, and had their feedback recorded.",
    ""
  ].join("\n");
  const rawPath=path.join(tmp,"C.md");
  fs.writeFileSync(rawPath,raw);
  const sha=crypto.createHash("sha256").update(raw).digest("hex");
  const annotation={
    fixture_id:"C",
    raw_output_sha256:sha,
    reviewer:"regression-test",
    review_date:"2026-09-27",
    false_established_claims:[],
    false_not_established_claims:[]
  };
  const annPath=path.join(tmp,"annotation.json");
  fs.writeFileSync(annPath,JSON.stringify(annotation));

  const run=spawnSync(process.execPath,[
    "scripts/score-participation-calibration-v3.mjs",
    "--fixture","C",
    "--raw",rawPath,
    "--annotation",annPath,
    "--json"
  ],{encoding:"utf8"});

  assert.equal(run.status,0,run.stderr||run.stdout);
  const result=JSON.parse(run.stdout);
  assert.equal(result.scorer_version,"participation_calibration_scorer_v3");
  assert.equal(result.status_classifier_version,"status_classifier_v3");
  assert.equal(result.observed_participation_status,"established");
  assert.deepEqual(result.observed_participation_state,{
    participation_occurred:"established",
    representativeness:"not_established",
    all_affected_consent:"not_established",
    formal_codesign_authority:"not_established",
    decision_authority:"not_established"
  });
  assert.equal(result.scores.section_present,true);
  assert.equal(result.scores.section_nonempty,true);
  assert.equal(result.scores.categories_distinct,true);
  assert.equal(result.scores.status_matches_ground_truth,true);
  assert.equal(result.scores.false_established_count,0);
  assert.equal(result.scores.false_not_established_count,0);
}finally{
  fs.rmSync(tmp,{recursive:true,force:true});
}

console.log("Participation calibration scorer v3 five-field end-to-end verification passed.");
