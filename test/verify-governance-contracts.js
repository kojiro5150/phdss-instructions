import assert from "node:assert/strict";
import {
  GOVERNANCE_RECORD_CONTRACT_VERSION,
  SYNTHESIS_VERDICT_FIELDS,
  DIRECTOR_GOVERNANCE_RECORD_FIELDS,
  DIRECTOR_BRIEF_FIELDS,
  SYNTHESIS_BRIEF_FIELDS,
  BOARD_RECORD_FIELDS,
  validateDirectorBriefObject,
  validateSynthesisBriefObject,
  validateBoardGovernanceRecord,
  isValidDirectorBriefText,
  isValidSynthesisBriefText,
} from "../src/governance-record-contract.js";
import {
  validDirectorBrief,
  validFailedDirectorBrief,
  validSurfaceBrief,
  validChairBrief,
  validBoardRecord,
  invalidContractCases,
} from "./fixtures/governance-record-contracts.js";

const failures=[];

function expectOk(label,result){
  if(!result.ok) failures.push(label+": "+result.errors.join("; "));
}

expectOk("valid Director brief",validateDirectorBriefObject(validDirectorBrief));
expectOk("valid FAILED Director brief",validateDirectorBriefObject(validFailedDirectorBrief));
expectOk("valid Surface Map brief",validateSynthesisBriefObject(validSurfaceBrief,"Decision Surface Map"));
expectOk("valid Chair brief",validateSynthesisBriefObject(validChairBrief,"Chair Decision"));
expectOk("valid board Governance Record",validateBoardGovernanceRecord(validBoardRecord));

assert.equal(isValidDirectorBriefText(JSON.stringify(validDirectorBrief)),true);
assert.equal(isValidSynthesisBriefText(JSON.stringify(validSurfaceBrief),"Decision Surface Map"),true);

for(const testCase of invalidContractCases){
  let result;
  if(testCase.kind==="director") result=validateDirectorBriefObject(testCase.value);
  else if(testCase.kind==="synthesis") result=validateSynthesisBriefObject(testCase.value,testCase.moduleLabel);
  else result=validateBoardGovernanceRecord(testCase.value);
  if(result.ok) failures.push(testCase.label+": invalid case was accepted");
}

const requiredSynthesisLabels={
  "Decision Surface Map":"Dominant Signal",
  "Epistemic Confidence Audit":"Epistemic Health Score",
  "Cross-Domain Tension Analysis":"Integration Signal",
  "Reality Anchor":"Operational Confidence",
  "Adversarial Probe":"Probe Verdict",
  "Decision Stress Test":"Fragility Score",
  "Chair Decision":"Decision Brief Status",
};
assert.deepStrictEqual(SYNTHESIS_VERDICT_FIELDS,requiredSynthesisLabels);

if(GOVERNANCE_RECORD_CONTRACT_VERSION!=="1.0.0") failures.push("unexpected contract version");
if(DIRECTOR_GOVERNANCE_RECORD_FIELDS.length!==8) failures.push("Director governance field count changed");
if(DIRECTOR_BRIEF_FIELDS.length!==12) failures.push("Director brief field count changed");
if(SYNTHESIS_BRIEF_FIELDS.length!==11) failures.push("Synthesis brief field count changed");
if(BOARD_RECORD_FIELDS.length!==13) failures.push("Board record field count changed");

if(failures.length){
  console.error("PHDSS Governance Record contract verification failed:");
  failures.forEach(function(failure){console.error("- "+failure);});
  process.exit(1);
}

console.log("PHDSS Governance Record contract verification passed.");
console.log("Contract version: "+GOVERNANCE_RECORD_CONTRACT_VERSION);
console.log("Valid contract shapes: 5 PASS");
console.log("Invalid contract cases: "+invalidContractCases.length+" REJECTED");
