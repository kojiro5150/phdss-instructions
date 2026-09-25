import fs from "node:fs";
import { parse } from "@babel/parser";

const source = fs.readFileSync("App_FINAL.jsx", "utf8");

parse(source, {
  sourceType: "module",
  plugins: ["jsx"],
  errorRecovery: false,
});

const forbidden = [
  "LivedGovernanceRecord",
  "ProbeGovernanceRecord",
  "RealityGovernanceRecord",
  "chair_recommendation",
  "FULL_VERDICT",
  "Current Governance Position",
  "Consensus Departure",
  "Chair Recommendation",
  "/13 directors",
];

const required = [
  "Decision Brief Status",
  "Director Signal Distribution",
  "INSTRUCTION_COMMIT",
  "RUNTIME_CONTRACT",
  "LEDGER_SCHEMA",
  "governance_record",
  "GovernanceRecord",
  "repairChairDecisionBoundary",
  "instruction_commit",
  "structured_records",
  "callGovernedSynthesis",
  "assessAuthorityBoundary",
  "authorityBoundaryPrompt",
  "isValidDirectorBriefText",
  "isValidSynthesisBriefText",
  "assertBoardGovernanceRecord",
  "./src/governance-rules.js",
  "./src/governance-record-contract.js",
  "./src/runtime/instruction-loader.js",
  "./src/runtime/anthropic-client.js",
  "./src/runtime/governance-compression.js",
  "loadAllInstructions",
  "callClaude_synthesis",
];

const failures = [];
for (const token of forbidden) {
  if (source.includes(token)) failures.push(`retired contract remains: ${token}`);
}
for (const token of required) {
  if (!source.includes(token)) failures.push(`required recovery contract missing: ${token}`);
}

if (failures.length) {
  console.error("PHDSS v2 recovery validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("PHDSS v2 recovery validation passed.");
console.log("JSX parse: PASS");
console.log("Retired contract scan: PASS");
console.log("Required recovery contract scan: PASS");
