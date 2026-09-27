import fs from "node:fs";

const lived=fs.readFileSync("lived.md","utf8");
const contract=fs.readFileSync("docs/V3_DEVELOPMENT_CONTRACT.md","utf8");

const failures=[];

function normalizeWhitespace(value){
  return value.replace(/\s+/g," ").trim();
}

const normalizedLived=normalizeWhitespace(lived);
const normalizedContract=normalizeWhitespace(contract);

const invariant="Analytical representation is not participation.";
if(!normalizedContract.includes(invariant)){
  failures.push("V3 development contract missing participation non-substitution invariant");
}
if(!normalizedLived.includes(invariant)){
  failures.push("Lived Experience Director missing participation non-substitution invariant");
}

const requiredContractPhrases=[
  "model-generated analytical representation",
  "human-supplied lived-experience evidence",
  "actual participation status",
  "These categories must not collapse into one another.",
  "silently fill a participation gap with synthetic or inferred perspective-taking",
  "participation status is currently inferred by the model from supplied evidence",
  "A false claim of established participation is treated as the more serious failure mode of the two.",
  "a human reviewer must verify that claim against the documented engagement record"
];
for(const phrase of requiredContractPhrases){
  if(!normalizedContract.includes(normalizeWhitespace(phrase))) failures.push("V3 contract missing participation boundary phrase: "+phrase);
}

const requiredLivedPhrases=[
  "**Participation & Representation Status**",
  "Model-generated analytical representation",
  "Human-supplied lived-experience evidence",
  "Actual participation status",
  "Do not treat this Director's presence as evidence that affected people participated.",
  "Actual participation in this decision process is not established by the supplied evidence.",
  "DOCUMENT-WIDE NEGATIVE-SCOPE DISCIPLINE — mandatory:",
  "Any claim about whether participation, representation, engagement, consent, influence, recruitment characteristics, population coverage, or any other property of the affected population or their involvement occurred must remain bounded by what the supplied record establishes.",
  "Absence of documentation supports \"not established by the supplied record\"; it does not support an assertion that the event, property, or condition did not occur.",
  "This epistemic boundary applies across the entire document, not only the **Participation & Representation Status** section.",
  "When the record is silent, preserve that silence as uncertainty for human governance judgment."
];
for(const phrase of requiredLivedPhrases){
  if(!normalizedLived.includes(normalizeWhitespace(phrase))) failures.push("lived.md missing participation boundary phrase: "+phrase);
}

const collapsedClaims=[
  /the lived experience director (?:represents|is evidence of) affected people/i,
  /running the lived experience director (?:means|establishes) .*consult/i,
  /model-generated .* (?:is|constitutes) participation/i,
  /lived-experience evidence (?:is|constitutes) participation in the current decision process/i
];
for(const pattern of collapsedClaims){
  // The constitutional contract necessarily names prohibited formulations inside
  // an explicit "PHDSS must not" block. Treating those quoted prohibitions as
  // affirmative collapse claims is a verifier false positive. Scan the executable
  // Director instruction for affirmative collapse language; the contract's
  // prohibitions are already checked above as required boundary phrases.
  if(pattern.test(normalizedLived)){
    failures.push("Participation/representation categories collapsed by prohibited claim: "+pattern);
  }
}

const staleChairAuthority=[
  "Chair's determination",
  "Chair's arbitration function",
  "those determinations belong to the Chair"
];
for(const phrase of staleChairAuthority){
  if(lived.includes(phrase)) failures.push("lived.md retains stale Chair adjudication language: "+phrase);
}

if(failures.length){
  console.error("PHDSS participation non-substitution verification failed:");
  for(const failure of failures) console.error("- "+failure);
  process.exit(1);
}

console.log("PHDSS participation non-substitution verification passed.");
console.log("Invariant present in V3 contract and Lived Experience Director: PASS");
console.log("Representation / evidence / participation categories remain distinct: PASS");
console.log("Document-wide negative-scope discipline present: PASS");
console.log("Stale Chair adjudication language absent from lived.md: PASS");
