// Independent Node verification of the single-file RC2 Governance evidence bundle.
// Does not import or trust the browser-side bundle creator.
import fs from "node:fs";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
import { verifyGovernanceProvenance } from "./verify-governance-provenance-v2.mjs";

const sha=value=>crypto.createHash("sha256").update(Buffer.from(String(value),"utf8")).digest("hex");
const safe=value=>String(value).replace(/[^A-Za-z0-9_-]/g,"_");

export async function verifyGovernanceBundle({bundle,expectedDeployment=null,sourceLoader=null,expectedInstructionSources=null}) {
  const errors=[];
  const fail=x=>errors.push(x);
  if(!bundle||bundle.schema!=="phdss.governance-export-bundle.v1")return {status:"INVALID",errors:["unsupported bundle schema"]};
  const files=bundle.files||{};
  const inventory=bundle.inventory||{};
  const keys=Object.keys(files).sort();
  if(inventory.schema!=="phdss.governance-export-inventory.v1")fail("unsupported inventory schema");
  if(inventory.file_count!==keys.length||!Array.isArray(inventory.files)||inventory.files.length!==keys.length)fail("inventory count mismatch");
  if(sha(JSON.stringify(inventory))!==bundle.inventory_sha256)fail("inventory hash mismatch");
  const recorded=new Set();
  for(const entry of inventory.files||[]){
    if(recorded.has(entry.path))fail("duplicate inventory path");
    recorded.add(entry.path);
    if(!Object.prototype.hasOwnProperty.call(files,entry.path)){fail("missing inventory file: "+entry.path);continue;}
    const json=JSON.stringify(files[entry.path]);
    if(sha(json)!==entry.sha256)fail("component hash mismatch: "+entry.path);
    if(Buffer.byteLength(json,"utf8")!==entry.utf8_bytes)fail("component byte length mismatch: "+entry.path);
  }
  for(const key of keys)if(!recorded.has(key))fail("extra unindexed bundle component: "+key);
  const manifest=files["manifest.json"];
  const ledger=files["ledger.json"];
  if(!manifest||manifest.schema!=="phdss.governance-provenance.v2")fail("missing RC2 v2 Governance manifest");
  if(!ledger||!Array.isArray(ledger.decisions)||ledger.decisions.length!==1)fail("missing single-decision Ledger");
  if(!manifest)return {status:"INVALID",errors};
  const stageRefs=manifest.stages||[],eventRefs=manifest.compression_events||[];
  const expected=["manifest.json","ledger.json",...stageRefs.map(x=>"stages/"+safe(x.stage_id)+".json"),...eventRefs.map(x=>"compression/"+safe(x.event_id)+".json")];
  if(new Set(expected).size!==expected.length)fail("colliding or duplicate manifest refs");
  if(JSON.stringify(keys)!==JSON.stringify(expected.slice().sort()))fail("bundle file set differs from manifest references");
  const stages=[];
  for(const ref of stageRefs){
    const item=files["stages/"+safe(ref.stage_id)+".json"];
    if(!item){fail("missing stage "+ref.stage_id);continue;}
    if(item.stage_id!==ref.stage_id||item.status!==ref.status||item.output_sha256!==(ref.output_sha256||null))fail("stage reference mismatch: "+ref.stage_id);
    stages.push(item);
  }
  const events=[];
  for(const ref of eventRefs){
    const item=files["compression/"+safe(ref.event_id)+".json"];
    if(!item){fail("missing compression event "+ref.event_id);continue;}
    if(item.event_id!==ref.event_id||item.parent_stage_id!==ref.parent_stage_id||item.status!==ref.status||item.selected!==ref.selected)fail("compression event reference mismatch: "+ref.event_id);
    if(sha(JSON.stringify(item))!==ref.event_sha256)fail("compression event hash mismatch: "+ref.event_id);
    events.push(item);
  }
  if(ledger&&ledger.decisions&&ledger.decisions[0]&&sha(JSON.stringify(ledger.decisions[0]))!==manifest.final_ledger_sha256)fail("Ledger record hash mismatch");
  if(errors.length)return {status:"INVALID",errors,checked_files:keys.length};
  const proof=await verifyGovernanceProvenance({
    manifest,stageRecords:stages,compressionEvents:events,
    ledgerDocument:ledger,expectedDeployment,sourceLoader,expectedInstructionSources
  });
  if(proof.run_provenance_status!=="VALID")fail("Governance provenance verifier rejected bundle: "+proof.failures.join("; "));
  return {status:errors.length?"INVALID":"VALID",errors,checked_files:keys.length,stage_count:stages.length,compression_event_count:events.length,provenance:proof};
}

const invoked=process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href;
if(invoked){
  const path=process.argv[2];
  if(!path){console.error("Usage: node scripts/verify-governance-bundle.mjs <governance-bundle.json> [expected-deployment-commit]");process.exit(2);}
  const bundle=JSON.parse(fs.readFileSync(path,"utf8"));
  const result=await verifyGovernanceBundle({bundle,expectedDeployment:process.argv[3]||null});
  console.log(JSON.stringify(result,null,2));
  if(result.status!=="VALID")process.exit(1);
}
