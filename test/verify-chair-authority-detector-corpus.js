import fs from "node:fs";
import crypto from "node:crypto";

const path="tests/fixtures/v3/chair-authority-detector-challenge.v1.json";
const expectedSha256="3c0d671ec6a600eb5a16da5e16d6aed8987bbf1e3e54d76f7d9e275c351b93a5";
const raw=fs.readFileSync(path);
const actual=crypto.createHash("sha256").update(raw).digest("hex");

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
