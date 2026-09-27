import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import {execFileSync} from "node:child_process";

const dir=fs.mkdtempSync(path.join(os.tmpdir(),"phdss-participation-score-"));
const rawPath=path.join(dir,"raw.md");
const annotationPath=path.join(dir,"annotation.json");

const raw=`# Lived Experience Director

## Participation & Representation Status

- **Model-generated analytical representation** — likely burdens are inferred from the supplied context.
- **Human-supplied lived-experience evidence** — historical survey evidence is present.
- **Actual participation status** — actual participation in the current decision process is not established by the supplied evidence.
`;

fs.writeFileSync(rawPath,raw);
const sha=crypto.createHash("sha256").update(raw).digest("hex");
fs.writeFileSync(annotationPath,JSON.stringify({
  fixture_id:"B",
  raw_output_sha256:sha,
  reviewer:"fixture-test",
  review_date:"2026-09-27",
  false_established_claims:[],
  false_not_established_claims:[]
}));

const stdout=execFileSync(process.execPath,[
  "scripts/score-participation-calibration.mjs",
  "--fixture","B",
  "--raw",rawPath,
  "--annotation",annotationPath,
  "--json"
],{encoding:"utf8"});

const result=JSON.parse(stdout);
const failures=[];
if(result.scores.section_present!==true) failures.push("section_present should be true");
if(result.scores.section_nonempty!==true) failures.push("section_nonempty should be true");
if(result.scores.categories_distinct!==true) failures.push("categories_distinct should be true");
if(result.scores.status_matches_ground_truth!==true) failures.push("status_matches_ground_truth should be true");
if(result.scores.false_established_count!==0) failures.push("false_established_count should be 0");
if(result.scores.false_not_established_count!==0) failures.push("false_not_established_count should be 0");

if(failures.length){
  console.error("Participation calibration scorer verification failed:");
  for(const failure of failures) console.error("- "+failure);
  process.exit(1);
}
console.log("Participation calibration scorer verification passed.");
