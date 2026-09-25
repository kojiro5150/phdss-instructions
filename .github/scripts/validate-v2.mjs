import fs from "node:fs";
import { parse } from "@babel/parser";

const source = fs.readFileSync("App_FINAL.jsx", "utf8");
const compressionSource = fs.readFileSync("src/runtime/governance-compression.js", "utf8");
const promptSource = fs.readFileSync("src/prompt-builders.js", "utf8");
const coverageSource = fs.readFileSync("src/coverage.js", "utf8");
const pipelineSource = fs.readFileSync("src/pipeline.js", "utf8");
const requiredSource = source + "\n" + compressionSource + "\n" + promptSource + "\n" + coverageSource + "\n" + pipelineSource;

parse(source, {
  sourceType: "module",
  plugins: ["jsx"],
  errorRecovery: false,
});

parse(compressionSource, {
  sourceType: "module",
  errorRecovery: false,
});

parse(promptSource, {
  sourceType: "module",
  errorRecovery: false,
});

parse(coverageSource, {
  sourceType: "module",
  errorRecovery: false,
});

parse(pipelineSource, {
  sourceType: "module",
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
  "./runtime/governance-compression.js",
  "./src/prompt-builders.js",
  "./src/coverage.js",
  "./src/pipeline.js",
  "runGovernancePipeline",
  "buildLedgerRecord",
  "authorityViolationMessage",
  "required upstream stage chair failed",
  "SYNTHESIS EXECUTION",
  "loadAllInstructions",
  "callClaude_synthesis",
];

const failures = [];
for (const token of forbidden) {
  if (source.includes(token)) failures.push(`retired contract remains: ${token}`);
}
for (const token of required) {
  if (!requiredSource.includes(token)) failures.push(`required recovery contract missing: ${token}`);
}

if (failures.length) {
  console.error("PHDSS v2 recovery validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("PHDSS v2 recovery validation passed.");
console.log("JSX/runtime parse: PASS");
console.log("Retired contract scan: PASS");
console.log("Required recovery contract scan: PASS");
