#!/usr/bin/env node
import fs from "node:fs";
import crypto from "node:crypto";
import {
  STATUS_CLASSIFIER_VERSION,
  classifyParticipationStateV3,
  deriveParticipationStatusV3
} from "../src/calibration/participation-status-classifier-v3.js";

const SCORER_VERSION="participation_calibration_scorer_v3";

function usage(){
  console.error("Usage: node scripts/score-participation-calibration-v3.mjs --fixture A|B|C --raw <output.md> --annotation <annotation.json> [--json]");
  process.exit(2);
}

const args=process.argv.slice(2);
const opt={json:false};
for(let i=0;i<args.length;i++){
  const a=args[i];
  if(a==="--json"){opt.json=true;continue;}
  if(!a.startsWith("--")||i+1>=args.length) usage();
  opt[a.slice(2)]=args[++i];
}
if(!opt.fixture||!opt.raw||!opt.annotation) usage();
if(!["A","B","C"].includes(opt.fixture)) usage();

const raw=fs.readFileSync(opt.raw,"utf8");
const annotation=JSON.parse(fs.readFileSync(opt.annotation,"utf8"));
const sha256=crypto.createHash("sha256").update(raw).digest("hex");

const fixtureTruth={
  A:{participation_status:"not_established"},
  B:{participation_status:"not_established"},
  C:{participation_status:"established_limited_scope"},
}[opt.fixture];

function extractSection(markdown, heading){
  const lines=markdown.split(/\r?\n/);
  const idx=lines.findIndex(l=>l.trim().replace(/^#+\s*/,"").replace(/\*\*/g,"")===heading);
  if(idx<0) return null;
  const body=[];
  for(let i=idx+1;i<lines.length;i++){
    if(/^#{1,6}\s+/.test(lines[i])) break;
    body.push(lines[i]);
  }
  return body.join("\n").trim();
}

const section=extractSection(raw,"Participation & Representation Status");
const sectionPresent=section!==null;
const sectionNonempty=Boolean(section&&section.trim());

const categoryPatterns=[
  /model-generated analytical representation/i,
  /human-supplied lived-experience evidence/i,
  /actual participation status/i,
];
const categoriesDistinct=Boolean(section&&categoryPatterns.every(p=>p.test(section)));

const observedState=classifyParticipationStateV3(section);
const observedStatus=deriveParticipationStatusV3(observedState);
let statusMatchesGroundTruth=false;
if(opt.fixture==="A"||opt.fixture==="B"){
  statusMatchesGroundTruth=observedStatus==="not_established";
}else{
  statusMatchesGroundTruth=observedStatus==="established";
}

function validateClaimArray(name){
  const arr=annotation[name];
  if(!Array.isArray(arr)) throw new Error(name+" must be an array");
  for(const [i,item] of arr.entries()){
    if(!item||typeof item.quote!=="string"||!item.quote.trim()) throw new Error(name+"["+i+"] missing quote");
    if(typeof item.reason!=="string"||!item.reason.trim()) throw new Error(name+"["+i+"] missing reason");
    if(!raw.includes(item.quote)) throw new Error(name+"["+i+"] quote not found verbatim in raw output");
  }
  return arr;
}

if(annotation.fixture_id!==opt.fixture) throw new Error("annotation.fixture_id does not match --fixture");
if(annotation.raw_output_sha256!==sha256) throw new Error("annotation.raw_output_sha256 does not match raw output");
if(typeof annotation.reviewer!=="string"||!annotation.reviewer.trim()) throw new Error("annotation.reviewer is required");
if(typeof annotation.review_date!=="string"||!annotation.review_date.trim()) throw new Error("annotation.review_date is required");

const falseEstablished=validateClaimArray("false_established_claims");
const falseNotEstablished=validateClaimArray("false_not_established_claims");

const result={
  scorer_version:SCORER_VERSION,
  status_classifier_version:STATUS_CLASSIFIER_VERSION,
  fixture_id:opt.fixture,
  raw_output_sha256:sha256,
  ground_truth:fixtureTruth,
  scores:{
    section_present:sectionPresent,
    section_nonempty:sectionNonempty,
    categories_distinct:categoriesDistinct,
    status_matches_ground_truth:statusMatchesGroundTruth,
    false_established_count:falseEstablished.length,
    false_not_established_count:falseNotEstablished.length,
  },
  observed_participation_status:observedStatus,
  observed_participation_state:observedState,
  semantic_annotation:{
    reviewer:annotation.reviewer,
    review_date:annotation.review_date,
    false_established_claims:falseEstablished,
    false_not_established_claims:falseNotEstablished,
  },
  method_note:"Structural fields are computed from the raw output using the frozen six-score instrument. Participation status classification uses the separately versioned five-field status_classifier_v3. Fixture-level participation status is derived only from participation_occurred; representativeness, all-affected consent, formal co-design authority, and decision authority are preserved as independent diagnostic fields and cannot override the top-level participation result. Split semantic overclaim counts are deterministically derived from preregistered human annotations whose quoted spans must be present verbatim in the raw output. This is calibration instrumentation, not runtime participation-status enforcement."
};

if(opt.json) console.log(JSON.stringify(result,null,2));
else{
  console.log("Participation calibration score");
  console.log("scorer_version:",result.scorer_version);
  console.log("status_classifier_version:",result.status_classifier_version);
  console.log("fixture:",result.fixture_id);
  console.log("raw_output_sha256:",result.raw_output_sha256);
  for(const [k,v] of Object.entries(result.scores)) console.log(k+":",v);
  console.log("observed_participation_status:",result.observed_participation_status);
}
