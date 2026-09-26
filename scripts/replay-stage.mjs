#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  REPLAY_ENTRY_STAGES,
  buildReplayPlan,
  replayFrozenStages,
  unwrapReplayDecision,
  validateReplayDecision,
} from "../src/stage-replay.js";
import { INSTRUCTION_COMMIT } from "../src/runtime/instruction-loader.js";

function argValue(args,name) {
  var i=args.indexOf(name);
  return i>=0&&i+1<args.length?args[i+1]:null;
}

function usage() {
  console.log("PHDSS stage replay");
  console.log("");
  console.log("Dry-run (no API calls):");
  console.log("  npm run replay:stage -- --fixture tests/fixtures/calibration/DR-... --from comparator");
  console.log("");
  console.log("Execute:");
  console.log("  ANTHROPIC_API_KEY=... npm run replay:stage -- --fixture tests/fixtures/calibration/DR-... --from comparator --execute");
  console.log("");
  console.log("Supported --from values: "+REPLAY_ENTRY_STAGES.join(", "));
}

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file,"utf8"));
}

function loadInstructions(repoRoot) {
  return {
    chair:fs.readFileSync(path.join(repoRoot,"chair.md"),"utf8"),
    comparator:fs.readFileSync(path.join(repoRoot,"comparator.md"),"utf8"),
  };
}

function installAnthropicAuth(apiKey) {
  if(typeof globalThis.fetch!=="function") throw new Error("Global fetch is unavailable; Node 18+ is required");
  var original=globalThis.fetch.bind(globalThis);
  globalThis.fetch=function(url,options){
    options=options||{};
    if(typeof url==="string"&&url.startsWith("https://api.anthropic.com/")) {
      options=Object.assign({},options,{
        headers:Object.assign({},options.headers||{},{
          "x-api-key":apiKey,
          "anthropic-version":"2023-06-01",
        })
      });
    }
    return original(url,options);
  };
}

function safeTimestamp() {
  return new Date().toISOString().replace(/[:.]/g,"-");
}

const args=process.argv.slice(2);
if(args.includes("--help")||args.includes("-h")) {
  usage();
  process.exit(0);
}

const fixtureArg=argValue(args,"--fixture");
const from=argValue(args,"--from");
const requestedPin=argValue(args,"--instruction-pin");
const execute=args.includes("--execute");
const outArg=argValue(args,"--out");

if(!fixtureArg||!from) {
  usage();
  process.exit(2);
}
if(REPLAY_ENTRY_STAGES.indexOf(from)===-1) {
  throw new Error("Unsupported --from "+from+". Supported: "+REPLAY_ENTRY_STAGES.join(", "));
}
if(requestedPin&&requestedPin!==INSTRUCTION_COMMIT) {
  throw new Error("--instruction-pin does not match current INSTRUCTION_COMMIT. Requested "+requestedPin+", current "+INSTRUCTION_COMMIT);
}

const thisFile=fileURLToPath(import.meta.url);
const repoRoot=path.resolve(path.dirname(thisFile),"..");
const fixtureDir=path.resolve(repoRoot,fixtureArg);
const manifest=loadJson(path.join(fixtureDir,"manifest.json"));
const ledgerDocument=loadJson(path.join(fixtureDir,manifest.source_ledger));
const decision=validateReplayDecision(unwrapReplayDecision(ledgerDocument,manifest.fixture_id),from);
const plan=buildReplayPlan(from);

const preview={
  fixture_id:manifest.fixture_id,
  source_instruction_commit:manifest.source_instruction_commit,
  replay_instruction_commit:INSTRUCTION_COMMIT,
  from:from,
  planned_stages:plan,
  source_session_governance_status:decision.session_governance_status,
  execute:execute,
  baseline_api_stage_calls:plan.length,
  note:"Authority repair or transport retries may add API calls beyond the baseline.",
};
console.log(JSON.stringify(preview,null,2));

if(!execute) {
  console.log("\nDRY RUN ONLY — no API calls were made. Add --execute to run the replay.");
  process.exit(0);
}

const apiKey=process.env.ANTHROPIC_API_KEY;
if(!apiKey) throw new Error("ANTHROPIC_API_KEY is required with --execute");
installAnthropicAuth(apiKey);

const result=await replayFrozenStages({
  ledgerDocument:ledgerDocument,
  decisionId:manifest.fixture_id,
  from:from,
  instructions:loadInstructions(repoRoot),
});

const outDir=outArg
  ? path.resolve(repoRoot,outArg)
  : path.join(repoRoot,".replay",manifest.fixture_id,from+"-"+safeTimestamp());
fs.mkdirSync(outDir,{recursive:true});

fs.writeFileSync(path.join(outDir,"replay-manifest.json"),JSON.stringify(Object.assign({},preview,{
  completed_at:new Date().toISOString(),
  stage_status:result.stage_status,
  stage_errors:result.stage_errors,
}),null,2)+"\n");
fs.writeFileSync(path.join(outDir,"authority-repair-events.json"),JSON.stringify(result.authority_repair_events,null,2)+"\n");

if(result.chair_output) fs.writeFileSync(path.join(outDir,"chair.md"),result.chair_output+"\n");
if(result.comparator) {
  fs.writeFileSync(path.join(outDir,"comparator.raw.txt"),result.comparator.raw+"\n");
  fs.writeFileSync(path.join(outDir,"comparator.json"),JSON.stringify(result.comparator.parsed,null,2)+"\n");
}

console.log("\nReplay output: "+path.relative(repoRoot,outDir));
console.log(JSON.stringify(result.stage_status,null,2));

const failed=Object.values(result.stage_status).some(function(s){return s&&s.status==="failed";});
if(failed) process.exitCode=1;
