// L-24: one downloaded, self-contained Governance provenance bundle.
// Every component is individually hashed and indexed; no multi-download side effects.
import { sha256Text } from "./governance-provenance.js";

export const GOVERNANCE_BUNDLE_SCHEMA="phdss.governance-export-bundle.v1";
export const GOVERNANCE_INVENTORY_SCHEMA="phdss.governance-export-inventory.v1";

const safeKey=value=>String(value).replace(/[^A-Za-z0-9_-]/g,"_");
export async function createGovernanceExportBundle(input) {
  const manifest=input&&input.manifest;
  if(!manifest||manifest.schema!=="phdss.governance-provenance.v2")throw new Error("RC2 bundle requires v2 Governance manifest");
  const stages=input.stages||{};
  const events=input.compression_events||[];
  const ledger=input.ledger_record;
  if(!ledger||ledger.decision_id!==manifest.decision_id)throw new Error("matching ledger record required");
  if(manifest.final_ledger_sha256!==await sha256Text(JSON.stringify(ledger)))throw new Error("ledger provenance hash mismatch");
  const files={};
  function insert(path,content) {
    if(Object.prototype.hasOwnProperty.call(files,path))throw new Error("duplicate bundle file: "+path);
    files[path]=content;
  }
  insert("manifest.json",manifest);
  insert("ledger.json",{decisions:[ledger]});
  const stageValues=Array.isArray(stages)?stages:Object.values(stages);
  for(const stage of stageValues)insert("stages/"+safeKey(stage.stage_id)+".json",stage);
  for(const event of events)insert("compression/"+safeKey(event.event_id)+".json",event);

  const expectedStages=(manifest.stages||[]).map(x=>"stages/"+safeKey(x.stage_id)+".json");
  const expectedEvents=(manifest.compression_events||[]).map(x=>"compression/"+safeKey(x.event_id)+".json");
  const expected=["manifest.json","ledger.json",...expectedStages,...expectedEvents];
  if(new Set(expected).size!==expected.length)throw new Error("duplicate manifest identity in bundle");
  const actual=Object.keys(files).sort();
  if(JSON.stringify(actual)!==JSON.stringify(expected.slice().sort()))throw new Error("missing, extra or duplicated manifest files");

  // Reproduce source-to-manifest references before constructing the inventory.
  for(const ref of manifest.stages||[]){
    const stage=files["stages/"+safeKey(ref.stage_id)+".json"];
    if(stage.stage_id!==ref.stage_id||stage.status!==ref.status||stage.output_sha256!==(ref.output_sha256||null))
      throw new Error("stage reference mismatch: "+ref.stage_id);
  }
  for(const ref of manifest.compression_events||[]){
    const event=files["compression/"+safeKey(ref.event_id)+".json"];
    if(event.event_id!==ref.event_id||event.parent_stage_id!==ref.parent_stage_id||event.status!==ref.status||event.selected!==ref.selected)
      throw new Error("compression reference mismatch: "+ref.event_id);
    if(await sha256Text(JSON.stringify(event))!==ref.event_sha256)throw new Error("compression event hash mismatch: "+ref.event_id);
  }

  const entries=[];
  for(const path of actual){
    const json=JSON.stringify(files[path]);
    entries.push({path,sha256:await sha256Text(json),utf8_bytes:new TextEncoder().encode(json).length});
  }
  const inventory={schema:GOVERNANCE_INVENTORY_SCHEMA,decision_id:manifest.decision_id,file_count:entries.length,files:entries};
  return {schema:GOVERNANCE_BUNDLE_SCHEMA,decision_id:manifest.decision_id,files,inventory,inventory_sha256:await sha256Text(JSON.stringify(inventory))};
}
