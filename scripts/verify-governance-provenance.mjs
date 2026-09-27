import fs from "node:fs";
import crypto from "node:crypto";

const manifestPath=process.argv[2];
const stagesDir=process.argv[3];
const expectedDeployment=process.argv[4]||null;
if(!manifestPath||!stagesDir){
  console.error("Usage: node scripts/verify-governance-provenance.mjs <manifest.json> <stages-dir> [expected-deployment-sha]");
  process.exit(2);
}

const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
const stageFiles=fs.readdirSync(stagesDir).filter(function(name){return name.endsWith(".json");});
const stageRecords=stageFiles.map(function(name){
  return JSON.parse(fs.readFileSync(stagesDir+"/"+name,"utf8"));
});

function sha256(value){
  return crypto.createHash("sha256").update(Buffer.from(String(value==null?"":value),"utf8")).digest("hex");
}

const failures=[];
const stageResults=[];

function fail(message){ failures.push(message); }

if(manifest.schema!=="phdss.governance-provenance.v1") fail("Unsupported Governance manifest schema: "+String(manifest.schema));
if(manifest.run_type!=="GOVERNANCE") fail("Manifest run_type must be GOVERNANCE");
if(expectedDeployment&&manifest.deployment_commit!==expectedDeployment){
  fail("Deployment commit mismatch: expected "+expectedDeployment+" but manifest records "+manifest.deployment_commit);
}

const byStage={};
for(const record of stageRecords){
  if(record.schema!=="phdss.governance-stage-provenance.v1"){
    stageResults.push({stage_id:record.stage_id||"UNKNOWN",stage_provenance_status:"INVALID",reason:"unsupported stage schema"});
    fail("Unsupported stage schema for "+String(record.stage_id));
    continue;
  }
  if(record.decision_id!==manifest.decision_id){
    stageResults.push({stage_id:record.stage_id,stage_provenance_status:"INVALID",reason:"decision_id mismatch"});
    fail("Stage "+record.stage_id+" decision_id mismatch");
    continue;
  }
  if(byStage[record.stage_id]){
    stageResults.push({stage_id:record.stage_id,stage_provenance_status:"INVALID",reason:"duplicate stage record"});
    fail("Duplicate stage record: "+record.stage_id);
    continue;
  }
  byStage[record.stage_id]=record;
}

const manifestStageRefs=Array.isArray(manifest.stages)?manifest.stages:[];
for(const ref of manifestStageRefs){
  const record=byStage[ref.stage_id];
  if(!record){
    stageResults.push({stage_id:ref.stage_id,stage_provenance_status:"INVALID",reason:"manifest references missing stage record"});
    fail("Manifest references missing stage record: "+ref.stage_id);
    continue;
  }

  if(record.status==="skipped"){
    if(!record.error||!String(record.error).trim()){
      stageResults.push({stage_id:ref.stage_id,stage_provenance_status:"INVALID",reason:"skipped stage missing reason"});
      fail("Skipped stage missing reason: "+ref.stage_id);
    }else{
      stageResults.push({stage_id:ref.stage_id,stage_provenance_status:"SKIPPED",reason:String(record.error)});
    }
    continue;
  }

  let reason=null;
  if(record.system_prompt_sha256!==sha256(record.system_prompt)) reason="system prompt hash mismatch";
  else if(record.user_message_sha256!==sha256(record.user_message)) reason="user message hash mismatch";
  else if(record.output_sha256!==(record.output==null?null:sha256(record.output))) reason="output hash mismatch";
  else if(ref.output_sha256!==(record.output_sha256||null)) reason="manifest output hash mismatch";
  else if(ref.status!==record.status) reason="manifest stage status mismatch";
  else if(record.stage_id==="chair"&&!record.authority_repair) reason="Chair authority repair metadata missing";

  if(reason){
    stageResults.push({stage_id:ref.stage_id,stage_provenance_status:"INVALID",reason});
    fail("Stage "+ref.stage_id+" invalid: "+reason);
  }else{
    stageResults.push({stage_id:ref.stage_id,stage_provenance_status:"VALID",reason:record.status==="failed"?"execution failed but provenance is valid":"hashes and metadata valid"});
  }
}

for(const stageId of Object.keys(byStage)){
  if(!manifestStageRefs.some(function(ref){return ref.stage_id===stageId;})){
    stageResults.push({stage_id:stageId,stage_provenance_status:"INVALID",reason:"unreferenced stage record"});
    fail("Unreferenced stage record: "+stageId);
  }
}

// Cross-field consistency for Director coverage.
// Active Directors must have invoked Director stage records; omitted Directors must not.
for(const id of (manifest.active_directors||[])){
  const stageId="director:"+id;
  if(!byStage[stageId]){
    stageResults.push({stage_id:stageId,stage_provenance_status:"INVALID",reason:"active Director missing provenance record"});
    fail("Active Director missing provenance record: "+id);
  }else if(byStage[stageId].status==="skipped"){
    fail("Active Director incorrectly marked skipped: "+id);
  }
}
for(const id of (manifest.omitted_directors||[])){
  const stageId="director:"+id;
  if(byStage[stageId]&&byStage[stageId].status!=="skipped"){
    stageResults.push({stage_id:stageId,stage_provenance_status:"INVALID",reason:"omitted Director was invoked"});
    fail("Omitted Director has invoked provenance record: "+id);
  }
}

// Mandatory synthesis stages must be present and not skipped.
for(const stageId of ["surface_map","epistemic_audit","cross_domain_tension_analysis","adversarial_probe","chair"]){
  if(!byStage[stageId]){
    stageResults.push({stage_id:stageId,stage_provenance_status:"INVALID",reason:"mandatory stage missing"});
    fail("Mandatory stage missing: "+stageId);
  }else if(byStage[stageId].status==="skipped"){
    fail("Mandatory stage incorrectly skipped: "+stageId);
  }
}

// Conditional/degradable stages may be skipped, but only with explicit stage records.
for(const stageId of ["reality_anchor","stress_test","comparator"]){
  if(!byStage[stageId]){
    stageResults.push({stage_id:stageId,stage_provenance_status:"INVALID",reason:"conditional/degradable stage missing explicit record"});
    fail("Conditional/degradable stage missing explicit record: "+stageId);
  }
}

const runStatus=failures.length?"INVALID":"VALID";
console.log(JSON.stringify({
  schema:"phdss.governance-provenance-verification.v1",
  decision_id:manifest.decision_id,
  run_provenance_status:runStatus,
  stages:stageResults,
  failures:failures
},null,2));

if(failures.length) process.exit(1);
