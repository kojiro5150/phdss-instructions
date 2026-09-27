import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"phdss-scorer-v3-2-"));
try{
  const raw=[
    "**Participation & Representation Status**",
    "",
    "**Model-generated analytical representation:** Inference only.",
    "",
    "**Human-supplied lived-experience evidence:** Five people attended a documented workshop about this proposal.",
    "",
    "**Actual participation status:** The supplied record does not establish representative sampling, formal co-design authority, or decision-making authority for workshop participants. It does not document consent by all affected people. The five participants attended a facilitated workshop and their feedback was recorded — this constitutes structured engagement input, not co-design authority or governance representation. Scoped to what the supplied record states: the five participants engaged in a documented, purposive design conversation about this specific proposal.",
    "",
    "**Watch Points**",
    "",
    "**Later section:** must not be classified as part of Participation & Representation Status.",
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
    "scripts/score-participation-calibration-v3-2.mjs",
    "--fixture","C",
    "--raw",rawPath,
    "--annotation",annPath,
    "--json"
  ],{encoding:"utf8"});

  assert.equal(run.status,0,run.stderr||run.stdout);
  const result=JSON.parse(run.stdout);
  assert.equal(result.scorer_version,"participation_calibration_scorer_v3_2");
  assert.equal(result.status_classifier_version,"status_classifier_v3_1");
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
}finally{
  fs.rmSync(tmp,{recursive:true,force:true});
}

console.log("Participation calibration scorer v3.2 property-binding verification passed.");
