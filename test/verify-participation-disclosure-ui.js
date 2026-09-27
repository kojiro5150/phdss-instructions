import fs from "node:fs";

const app=fs.readFileSync("App_FINAL.jsx","utf8");
const contract=fs.readFileSync("docs/V3_DEVELOPMENT_CONTRACT.md","utf8");
const failures=[];

const requiredContractPhrases=[
  "participation status is currently inferred by the model from supplied evidence",
  "requires human verification against the actual engagement record",
  "a human reviewer must verify that claim against the documented engagement record"
];

for(const phrase of requiredContractPhrases){
  if(!contract.toLowerCase().includes(phrase.toLowerCase())){
    failures.push("V3 contract missing required disclosure phrase: "+phrase);
  }
}

const requiredUiPhrases=[
  "Participation verification required",
  "Participation status is currently inferred by the model from supplied evidence",
  "is not independently verified",
  "a human reviewer must verify it against the documented engagement record"
];

for(const phrase of requiredUiPhrases){
  if(!app.includes(phrase)){
    failures.push("Board UI missing participation disclosure phrase: "+phrase);
  }
}

if(!app.includes('data-governance-notice="participation-verification"')){
  failures.push("Board UI participation disclosure lacks stable governance notice marker");
}

if(!app.includes('activeDirectorsRef.some(function(d){return d.id==="lived";})')){
  failures.push("Participation disclosure is not gated to sessions invoking the Lived Experience Director");
}

if(failures.length){
  console.error("Participation disclosure UI verification failed:");
  for(const failure of failures) console.error("- "+failure);
  process.exit(1);
}

console.log("Participation disclosure UI verification passed.");
console.log("Contract-to-UI disclosure substance preserved: PASS");
console.log("Session-level notice marker present: PASS");
console.log("Notice gated to governance sessions invoking Lived Experience: PASS");
