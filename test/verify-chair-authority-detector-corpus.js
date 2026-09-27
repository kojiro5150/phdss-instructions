import fs from "node:fs";
import crypto from "node:crypto";

const path="tests/fixtures/v3/chair-authority-detector-challenge.v1.json";
const expectedSha256="4ad92cf3d27d505593e8b753b49c457c0286fbf51bf36cd3a4c44fc2f2f02437";
const raw=fs.readFileSync(path);
const actual=crypto.createHash("sha256").update(raw).digest("hex");

// Metadata correction: the corpus bytes have not changed since PR #29 publication.
// The original published SHA-256 was incorrect; Git blob 58ae079c1e9a1f08809692b20e11b51d7860da99 is unchanged.

if(actual!==expectedSha256){
  console.error("Frozen Chair detector challenge corpus v1 changed.");
  console.error("Expected SHA-256: "+expectedSha256);
  console.error("Actual SHA-256:   "+actual);
  console.error("Do not rewrite v1. Create a new corpus version for appended failure classes.");
  process.exit(1);
}

const corpus=JSON.parse(raw.toString("utf8"));
if(corpus.corpus_version!=="1.0.0"||corpus.fixture_class!=="chair_authority_detector_challenge"){
  console.error("Unexpected Chair detector challenge corpus identity.");
  process.exit(1);
}
if(!Array.isArray(corpus.cases)||corpus.cases.length!==36){
  console.error("Unexpected Chair detector challenge corpus case count.");
  process.exit(1);
}

console.log("Frozen Chair detector challenge corpus v1 integrity: PASS");
console.log("SHA-256: "+actual);
console.log("Cases: "+corpus.cases.length);
