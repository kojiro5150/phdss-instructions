import fs from "node:fs";
import crypto from "node:crypto";
import { assessAuthorityBoundary } from "../src/authority-contract.js";

const corpusPath="tests/fixtures/v3/chair-authority-detector-challenge.v1.json";
const manifestPath="tests/fixtures/v3/chair-authority-detector-challenge.v1.manifest.json";
const detectorPath="src/authority-contract.js";

const raw=fs.readFileSync(corpusPath);
const corpus=JSON.parse(raw.toString("utf8"));
const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
const corpusSha256=crypto.createHash("sha256").update(raw).digest("hex");
const detectorRaw=fs.readFileSync(detectorPath);
const detectorSha256=crypto.createHash("sha256").update(detectorRaw).digest("hex");

const integrityFailures=[];
if(corpus.fixture_class!=="chair_authority_detector_challenge") integrityFailures.push("unexpected fixture_class");
if(corpus.corpus_version!==manifest.corpus_version) integrityFailures.push("corpus version does not match manifest");
if(corpusSha256!==manifest.corpus_sha256) integrityFailures.push("corpus SHA-256 does not match manifest");
if(!Array.isArray(corpus.cases)||corpus.cases.length!==manifest.case_count) integrityFailures.push("case count does not match manifest");
if(corpus.append_only!==true) integrityFailures.push("append_only must be true");

const ids=new Set();
const byId=new Map();
for(const testCase of corpus.cases||[]){
  if(ids.has(testCase.id)) integrityFailures.push("duplicate case id: "+testCase.id);
  ids.add(testCase.id);
  byId.set(testCase.id,testCase);
  if(testCase.layer!=="chair") integrityFailures.push(testCase.id+": v1 corpus must be chair-layer only");
  if(typeof testCase.expected_permitted!=="boolean") integrityFailures.push(testCase.id+": expected_permitted must be boolean");
  if(!corpus.classes.includes(testCase.class)) integrityFailures.push(testCase.id+": unknown class "+testCase.class);
}
for(const testCase of corpus.cases||[]){
  if(!testCase.paired_case_id) continue;
  const pair=byId.get(testCase.paired_case_id);
  if(!pair) integrityFailures.push(testCase.id+": missing paired case "+testCase.paired_case_id);
  else if(pair.paired_case_id!==testCase.id) integrityFailures.push(testCase.id+": pair relationship is not reciprocal");
}

if(integrityFailures.length){
  console.error("Chair authority detector corpus integrity FAILED:");
  for(const failure of integrityFailures) console.error("- "+failure);
  process.exit(1);
}

if(process.argv.includes("--integrity-only")){
  console.log("Chair authority detector corpus integrity: PASS");
  console.log("Corpus version: "+corpus.corpus_version);
  console.log("Corpus SHA-256: "+corpusSha256);
  console.log("Cases: "+corpus.cases.length);
  process.exit(0);
}

const results=[];
let tp=0,tn=0,fp=0,fn=0;
let exactReasonEligible=0,exactReasonMatches=0;

for(const testCase of corpus.cases){
  const assessment=assessAuthorityBoundary("chair",testCase.text);
  const actualPermitted=!assessment.violates;
  const correct=actualPermitted===testCase.expected_permitted;

  if(!testCase.expected_permitted && !actualPermitted) tp++;
  else if(testCase.expected_permitted && actualPermitted) tn++;
  else if(testCase.expected_permitted && !actualPermitted) fp++;
  else fn++;

  let exactReasonMatch=null;
  if(testCase.expected_reason){
    exactReasonEligible++;
    exactReasonMatch=assessment.reason===testCase.expected_reason;
    if(exactReasonMatch) exactReasonMatches++;
  }

  results.push({
    id:testCase.id,
    class:testCase.class,
    paired_case_id:testCase.paired_case_id||null,
    expected_permitted:testCase.expected_permitted,
    actual_permitted:actualPermitted,
    correct,
    expected_reason:testCase.expected_reason||null,
    expected_reason_family:testCase.expected_reason_family||null,
    actual_reason:assessment.reason||null,
    actual_clause:assessment.clause||null,
    exact_reason_match:exactReasonMatch
  });
}

const visitedPairs=new Set();
const pairResults=[];
for(const testCase of corpus.cases){
  if(!testCase.paired_case_id) continue;
  const key=[testCase.id,testCase.paired_case_id].sort().join("::");
  if(visitedPairs.has(key)) continue;
  visitedPairs.add(key);
  const a=results.find(r=>r.id===testCase.id);
  const b=results.find(r=>r.id===testCase.paired_case_id);
  pairResults.push({
    pair:key,
    both_classified_correctly:Boolean(a&&b&&a.correct&&b.correct)
  });
}
const pairedPasses=pairResults.filter(x=>x.both_classified_correctly).length;

const report={
  study:"v3-chair-authority-detector-challenge",
  result_class:"DESCRIPTIVE_BASELINE_NOT_ACCEPTANCE_GATE",
  claim_boundary:corpus.claim_boundary,
  corpus_version:corpus.corpus_version,
  corpus_sha256:corpusSha256,
  detector_path:detectorPath,
  detector_source_sha256:detectorSha256,
  detector_commit:process.env.GITHUB_SHA||process.env.PHDSS_DETECTOR_COMMIT||null,
  case_count:results.length,
  confusion_matrix:{true_positive:tp,true_negative:tn,false_positive:fp,false_negative:fn},
  challenge_set_accuracy:(tp+tn)/results.length,
  exact_reason_agreement:{eligible:exactReasonEligible,matches:exactReasonMatches},
  paired_case_consistency:{pairs:pairResults.length,passes:pairedPasses},
  cases:results
};

console.log(JSON.stringify(report,null,2));

if(process.argv.includes("--strict")&&(fp>0||fn>0)){
  process.exit(2);
}
