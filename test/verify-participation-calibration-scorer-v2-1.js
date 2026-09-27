import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"phdss-scorer-v2-1-"));
try{
  const raw=[
    "**Participation & Representation Status**",
    "",
    "- **Model-generated analytical representation:** inference only.",
    "- **Human-supplied lived-experience evidence:** None is present in the supplied record. No interviews, surveys, testimony, consultation records, co-design records, or documented engagement by affected consumers or carers have been provided for this decision.",
    "- **Actual participation status:** Actual participation in this decision process is not established by the supplied record. This does not constitute a claim that no engagement occurred outside the supplied material.",
    ""
  ].join("\n");
  const rawPath=path.join(tmp,"A.md");
  fs.writeFileSync(rawPath,raw);
  const sha=crypto.createHash("sha256").update(raw).digest("hex");
  const annotation={
    fixture_id:"A",
    raw_output_sha256:sha,
    reviewer:"regression-test",
    review_date:"2026-09-27",
    false_established_claims:[],
    false_not_established_claims:[]
  };
  const annPath=path.join(tmp,"annotation.json");
  fs.writeFileSync(annPath,JSON.stringify(annotation));
  const run=spawnSync(process.execPath,[
    "scripts/score-participation-calibration-v2-1.mjs",
    "--fixture","A",
    "--raw",rawPath,
    "--annotation",annPath,
    "--json"
  ],{encoding:"utf8"});
  assert.equal(run.status,0,run.stderr||run.stdout);
  const result=JSON.parse(run.stdout);
  assert.equal(result.scorer_version,"participation_calibration_scorer_v2_1");
  assert.equal(result.status_classifier_version,"status_classifier_v2_1");
  assert.equal(result.observed_participation_status,"not_established");
  assert.equal(result.scores.section_present,true);
  assert.equal(result.scores.section_nonempty,true);
  assert.equal(result.scores.categories_distinct,true);
  assert.equal(result.scores.status_matches_ground_truth,true);
  assert.equal(result.scores.false_established_count,0);
  assert.equal(result.scores.false_not_established_count,0);
}finally{
  fs.rmSync(tmp,{recursive:true,force:true});
}

console.log("Participation calibration scorer v2.1 end-to-end verification passed.");
