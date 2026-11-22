// L-24: preserve complete and defective-run evidence in one JSON download.
// Construction records integrity problems; the independent verifier decides VALID/INVALID.
import { sha256Text } from "./governance-provenance.js";

export const GOVERNANCE_BUNDLE_SCHEMA="phdss.governance-export-bundle.v1";
export const GOVERNANCE_INVENTORY_SCHEMA="phdss.governance-export-inventory.v1";
const safeKey=value=>String(value==null?"UNRECORDED":value).replace(/[^A-Za-z0-9_-]/g,"_");

export async function createGovernanceExportBundle(input) {
  const source=input||{};
  const manifest=source.manifest||null;
  const stages=source.stages||{};
  const events=Array.isArray(source.compression_events)?source.compression_events:[];
  const ledger=source.ledger_record||null;
  const decisionId=manifest&&manifest.decision_id||ledger&&ledger.decision_id||"UNRECORDED";
  const files={};
  const problems=[];
  const problem=(code,detail)=>problems.push({code,detail:String(detail)});
  function insert(path,content) {
    let actual=path,index=0;
    while(Object.prototype.hasOwnProperty.call(files,actual)){
      index++;actual=path.replace(/\.json$/,"__duplicate_"+index+".json");
    }
    if(index)problem("DUPLICATE_COMPONENT",path+" preserved as "+actual);
    files[actual]=content;
  }
  // Preserve original bytes/objects, including missing or mismatched source records.
  insert("manifest.json",manifest);
  insert("ledger.json",{decisions:ledger?[ledger]:[]});
  const stageValues=Array.isArray(stages)?stages:Object.values(stages);
  stageValues.forEach((stage,i)=>{
    const id=stage&&stage.stage_id||"missing_stage_id_"+i;
    if(!stage||!stage.stage_id)problem("STAGE_ID_MISSING","stage at index "+i);
    insert("stages/"+safeKey(id)+".json",stage);
  });
  events.forEach((event,i)=>{
    const id=event&&event.event_id||"missing_event_id_"+i;
    if(!event||!event.event_id)problem("EVENT_ID_MISSING","compression event at index "+i);
    insert("compression/"+safeKey(id)+".json",event);
  });

  if(!manifest||manifest.schema!=="phdss.governance-provenance.v2")
    problem("MANIFEST_MISSING_OR_UNSUPPORTED","RC2 v2 manifest unavailable");
  if(!ledger)problem("LEDGER_MISSING","matching Ledger record unavailable");
  else if(ledger.decision_id!==decisionId)
    problem("LEDGER_DECISION_MISMATCH",ledger.decision_id+" vs "+decisionId);
  if(manifest&&ledger&&manifest.final_ledger_sha256!==await sha256Text(JSON.stringify(ledger)))
    problem("LEDGER_HASH_MISMATCH","Ledger differs from manifest final_ledger_sha256");
  if(!manifest||!Array.isArray(manifest.compression_events)||!Array.isArray(manifest.compression_results))
    problem("COMPRESSION_INVENTORY_MISSING","RC2 compression refs/results absent");

  const byParent=new Map();
  for(const event of events){
    if(!event||!event.parent_stage_id)continue;
    if(!byParent.has(event.parent_stage_id))byParent.set(event.parent_stage_id,[]);
    byParent.get(event.parent_stage_id).push(event);
  }
  for(const stage of stageValues){
    if(!stage)continue;
    if(stage.schema!=="phdss.governance-stage-provenance.v3")
      problem("STAGE_SCHEMA_MISMATCH",stage.stage_id||"unknown");
    if(stage.status!=="success"||stage.stage_id==="comparator")continue;
    const selected=(byParent.get(stage.stage_id)||[]).filter(x=>x.selected);
    const refs=manifest&&Array.isArray(manifest.compression_results)?
      manifest.compression_results.filter(x=>x.parent_stage_id===stage.stage_id):[];
    if(selected.length!==1||refs.length!==1
      ||selected[0].final_response_sha256!==refs[0].brief_sha256
      ||selected[0].source_output_sha256!==stage.output_sha256)
      problem("SELECTED_BRIEF_CHAIN_INCOMPLETE",stage.stage_id);
  }

  const stageRefs=manifest&&Array.isArray(manifest.stages)?manifest.stages:[];
  const eventRefs=manifest&&Array.isArray(manifest.compression_events)?manifest.compression_events:[];
  const expected=["manifest.json","ledger.json",
    ...stageRefs.map(x=>"stages/"+safeKey(x.stage_id)+".json"),
    ...eventRefs.map(x=>"compression/"+safeKey(x.event_id)+".json")];
  if(new Set(expected).size!==expected.length)
    problem("DUPLICATE_MANIFEST_REF","one or more reference paths collide");
  const actual=Object.keys(files).sort();
  if(JSON.stringify(actual)!==JSON.stringify(expected.slice().sort()))
    problem("BUNDLE_FILE_SET_MISMATCH","actual component set differs from manifest references");
  for(const ref of stageRefs){
    const stage=files["stages/"+safeKey(ref.stage_id)+".json"];
    if(!stage||stage.stage_id!==ref.stage_id||stage.status!==ref.status
      ||stage.output_sha256!==(ref.output_sha256||null))
      problem("STAGE_REF_MISMATCH",ref.stage_id);
  }
  for(const ref of eventRefs){
    const event=files["compression/"+safeKey(ref.event_id)+".json"];
    if(!event||event.event_id!==ref.event_id||event.parent_stage_id!==ref.parent_stage_id
      ||event.status!==ref.status||event.selected!==ref.selected)
      problem("COMPRESSION_REF_MISMATCH",ref.event_id);
    else if(await sha256Text(JSON.stringify(event))!==ref.event_sha256)
      problem("COMPRESSION_HASH_MISMATCH",ref.event_id);
  }

  // The inventory still hashes what was ACTUALLY exported, even when incomplete.
  const entries=[];
  for(const path of actual){
    const json=JSON.stringify(files[path]);
    entries.push({path,sha256:await sha256Text(json),utf8_bytes:new TextEncoder().encode(json).length});
  }
  const inventory={schema:GOVERNANCE_INVENTORY_SCHEMA,decision_id:decisionId,file_count:entries.length,files:entries};
  const status=problems.length?"INCOMPLETE/INVALID":"COMPLETE_UNVERIFIED";
  return {
    schema:GOVERNANCE_BUNDLE_SCHEMA,
    decision_id:decisionId,
    status,
    files,
    inventory,
    inventory_sha256:await sha256Text(JSON.stringify(inventory)),
    export_validation:{status,checks:problems}
  };
}
