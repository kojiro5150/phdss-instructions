import assert from "node:assert/strict";
import crypto from "node:crypto";
import {verifyGovernanceProvenance} from "../scripts/verify-governance-provenance-v2.mjs";

const INSTRUCTION_COMMIT="fixture-instruction-commit";
const ALL=["systems","economics","behaviour","policy","equity","lived","digital","ethics","sovereignty","safety","physics","measurement","innovation"];
const FILES={systems:"systems.md",economics:"economics.md",behaviour:"behaviour.md",policy:"policy.md",equity:"equity.md",lived:"lived.md",digital:"digital.md",ethics:"ethics.md",sovereignty:"sovereignty.md",safety:"safety.md",physics:"physics.md",measurement:"measurement.md",innovation:"innovation.md",surface_map:"surfacemap.md",epistemic_audit:"epistemic.md",cross_domain_tension_analysis:"meta.md",reality_anchor:"reality.md",adversarial_probe:"probe.md",stress_test:"stress.md",chair:"chair.md",comparator:"comparator.md"};
const SYNTH=["surface_map","epistemic_audit","cross_domain_tension_analysis","reality_anchor","adversarial_probe","stress_test","chair","comparator"];
const sha=v=>crypto.createHash("sha256").update(Buffer.from(String(v),"utf8")).digest("hex");
const sourceText=file=>"INSTRUCTION "+file+"\n";
const sourceLoader=async(commit,file)=>{assert.equal(commit,INSTRUCTION_COMMIT);if(!Object.values(FILES).includes(file))throw new Error("missing");return sourceText(file);};

function stage(id,decision){
  const key=id.startsWith("director:")?id.slice(9):id;
  const file=FILES[key],system="SYS "+id,user=id.startsWith("director:")?"Decision under review: "+decision:"USER "+id,output="OUT "+id;
  return {schema:"phdss.governance-stage-provenance.v1",decision_id:"DR-TEST",run_type:"GOVERNANCE",stage_id:id,stage_kind:id.startsWith("director:")?"director":(id==="comparator"?"comparator":"synthesis"),director_id:id.startsWith("director:")?id.slice(9):null,captured_at:"2026-09-27T00:00:00.000Z",deployment_commit:"abc123",instruction_commit:INSTRUCTION_COMMIT,instruction_files:[file],instruction_normalization_version:"trim_v1",instruction_runtime_sha256:[sha(sourceText(file).trim())],model:"claude-sonnet-4-6",model_settings:{max_tokens:16000,temperature:0.8,auto_continue:true},web_search:false,system_prompt:system,system_prompt_sha256:sha(system),user_message:user,user_message_sha256:sha(user),output,output_sha256:sha(output),status:"success",error:null,authority_repair:{required:false,attempt_count:0,outcome:"not_required"}};
}
function fixture(mode="CORE"){
  const decision="Should a public service pilot an AI tool?";
  const active=mode==="FULL"?ALL.slice():["systems","safety","equity","lived","digital"];
  const records=active.map(id=>stage("director:"+id,decision)).concat(SYNTH.map(id=>stage(id,decision)));
  return {manifest:{schema:"phdss.governance-provenance.v1",decision_id:"DR-TEST",run_type:"GOVERNANCE",captured_at:"2026-09-27T00:00:00.000Z",deployment_commit:"abc123",instruction_commit:INSTRUCTION_COMMIT,instruction_normalization_version:"trim_v1",analysis_mode:mode,decision_text:decision,chair_selected_directors:[],model:"claude-sonnet-4-6",model_settings:{max_tokens:16000,temperature:0.8,auto_continue:true},web_search:false,public_web_search:false,session_evidence_count:0,director_embedded_evidence_counts:{},active_directors:active,omitted_directors:ALL.filter(x=>!active.includes(x)),stages:records.map(r=>({stage_id:r.stage_id,status:r.status,output_sha256:r.output_sha256})),final_ledger_sha256:null},records};
}
async function check(name,make,mutate,status,pattern,ledgerDocument=null){
  const d=make();mutate(d);const out=await verifyGovernanceProvenance({manifest:d.manifest,stageRecords:d.records,expectedDeployment:"abc123",sourceLoader,ledgerDocument});
  assert.equal(out.run_provenance_status,status,name);
  assert.match(JSON.stringify(out),new RegExp(pattern),name);
}
await check("valid CORE",()=>fixture("CORE"),()=>{},"VALID","\"adaptive_fifth\":\"digital\"");
await check("legacy CORE decision fallback",()=>fixture("CORE"),d=>{delete d.manifest.decision_text;},"VALID","director_request_fallback:director:systems");
await check("instruction hash corruption",()=>fixture("CORE"),d=>{d.records.find(x=>x.stage_id==="director:lived").instruction_runtime_sha256[0]=sha("wrong");},"INVALID","instruction source hash mismatch");
await check("CORE wrong adaptive fifth",()=>fixture("CORE"),d=>{d.manifest.active_directors=d.manifest.active_directors.map(x=>x==="digital"?"behaviour":x);d.manifest.omitted_directors=ALL.filter(x=>!d.manifest.active_directors.includes(x));},"INVALID","analysis-mode Director set mismatch");
await check("CORE missing mandatory Director",()=>fixture("CORE"),d=>{d.manifest.active_directors=d.manifest.active_directors.filter(x=>x!=="equity");d.manifest.omitted_directors=ALL.filter(x=>!d.manifest.active_directors.includes(x));},"INVALID","analysis-mode Director set mismatch");
await check("FULL missing Director",()=>fixture("FULL"),d=>{d.manifest.active_directors=d.manifest.active_directors.filter(x=>x!=="innovation");d.manifest.omitted_directors=["innovation"];},"INVALID","analysis-mode Director set mismatch");
await check("CHAIR_SPECIFIED mismatch",()=>{const d=fixture("CORE");d.manifest.analysis_mode="CHAIR_SPECIFIED";d.manifest.chair_selected_directors=["digital"];d.manifest.active_directors=["systems","safety"];d.manifest.omitted_directors=ALL.filter(x=>!d.manifest.active_directors.includes(x));return d;},()=>{},"INVALID","analysis-mode Director set mismatch");
{
  const d=fixture("CORE");
  const ledgerRecord={decision_id:"DR-TEST",value:"fixture"};
  d.manifest.final_ledger_sha256=sha(JSON.stringify(ledgerRecord));
  const out=await verifyGovernanceProvenance({manifest:d.manifest,stageRecords:d.records,expectedDeployment:"abc123",sourceLoader,ledgerDocument:{decisions:[ledgerRecord]}});
  assert.equal(out.ledger_verification.status,"VALID","ledger hash method");
  assert.equal(out.ledger_verification.method,"SHA-256 over UTF-8 bytes of JSON.stringify(decision_record)");
}
// --- G-01 / G-02 schema v2 regression tests ---
// Build a v2-schema stage (adds raw_output, raw_output_sha256, output_transform, output_capture_stage).
function stageV2(id,decision,{rawOutput=null,outputTransform=null,outputCaptureStage=null,status="success"}={}){
  const base=stage(id,decision);
  base.schema="phdss.governance-stage-provenance.v2";
  base.raw_output=rawOutput;
  base.raw_output_sha256=rawOutput==null?null:sha(rawOutput);
  base.output_transform=outputTransform;
  base.output_capture_stage=outputCaptureStage;
  base.status=status;
  return base;
}
function fixtureV2(mode="CORE"){
  const d=fixture(mode);
  const decision="Should a public service pilot an AI tool?";
  // Upgrade all synthesis stage records to v2 schema with canonical transforms.
  const synthTransforms={
    surface_map:{outputTransform:"stripCalibrationBleed_v1+authority_repair",outputCaptureStage:"post_authority_repair"},
    epistemic_audit:{outputTransform:"stripCalibrationBleed_v1+authority_repair+stripCalibrationBleed_v1",outputCaptureStage:"post_authority_repair+stripCalibrationBleed_v1"},
    cross_domain_tension_analysis:{outputTransform:"stripCalibrationBleed_v1+authority_repair",outputCaptureStage:"post_authority_repair"},
    reality_anchor:{outputTransform:"stripCalibrationBleed_v1+authority_repair",outputCaptureStage:"post_authority_repair"},
    adversarial_probe:{outputTransform:"stripCalibrationBleed_v1+authority_repair",outputCaptureStage:"post_authority_repair"},
    stress_test:{outputTransform:"stripCalibrationBleed_v1+authority_repair",outputCaptureStage:"post_authority_repair"},
    chair:{outputTransform:"stripCalibrationBleed_v1+authority_repair+authority_repair",outputCaptureStage:"post_authority_repair"},
    comparator:{outputTransform:"stripCalibrationBleed_v1+authority_repair",outputCaptureStage:"post_authority_repair"},
  };
  d.records=d.records.map(function(r){
    if(r.stage_id.startsWith("director:")){
      const v2r=Object.assign({},r,{schema:"phdss.governance-stage-provenance.v2",raw_output:"RAW "+r.stage_id,output_transform:"stripCalibrationBleed_v1+deduplicateSections+rescueDirectorSignal",output_capture_stage:"post_stripCalibrationBleed_v1+deduplicateSections+rescueDirectorSignal"});
      v2r.raw_output_sha256=sha(v2r.raw_output);
      return v2r;
    }
    const transforms=synthTransforms[r.stage_id];
    if(!transforms) return r;
    const v2r=Object.assign({},r,{schema:"phdss.governance-stage-provenance.v2",raw_output:"RAW "+r.stage_id,output_transform:transforms.outputTransform,output_capture_stage:transforms.outputCaptureStage});
    v2r.raw_output_sha256=sha(v2r.raw_output);
    return v2r;
  });
  return d;
}

await check("v2 schema valid CORE",()=>fixtureV2("CORE"),()=>{},"VALID","\"adaptive_fifth\":\"digital\"");
await check("v2 raw_output hash corruption",()=>fixtureV2("CORE"),d=>{const r=d.records.find(x=>x.stage_id==="surface_map");r.raw_output_sha256=sha("wrong");},"INVALID","raw_output hash mismatch");
await check("v2 missing output_transform",()=>fixtureV2("CORE"),d=>{const r=d.records.find(x=>x.stage_id==="surface_map");r.output_transform=null;},"INVALID","v2 stage missing output_transform");
await check("v2 missing output_capture_stage",()=>fixtureV2("CORE"),d=>{const r=d.records.find(x=>x.stage_id==="surface_map");r.output_capture_stage=null;},"INVALID","v2 stage missing output_capture_stage");
// Skipped stage with v2 schema should not require transform fields (null is correct).
await check("v2 skipped stage no transform required",()=>fixtureV2("CORE"),d=>{const r=d.records.find(x=>x.stage_id==="stress_test");r.status="skipped";r.error="stress trigger not met";r.output=null;r.output_sha256=null;r.raw_output=null;r.raw_output_sha256=null;r.output_transform=null;r.output_capture_stage=null;d.manifest.stages=d.records.map(r2=>({stage_id:r2.stage_id,status:r2.status,output_sha256:r2.output_sha256}));},"VALID","SKIPPED");
// Failed stage with v2 schema: null transform/raw fields acceptable on a non-mandatory stage failure.
await check("v2 failed non-mandatory stage null transform acceptable",()=>fixtureV2("CORE"),d=>{const r=d.records.find(x=>x.stage_id==="reality_anchor");r.status="failed";r.output=null;r.output_sha256=null;r.raw_output=null;r.raw_output_sha256=null;r.output_transform=null;r.output_capture_stage=null;r.error="synthetic failure";d.manifest.stages=d.records.map(r2=>({stage_id:r2.stage_id,status:r2.status,output_sha256:r2.output_sha256}));},"VALID","VALID");

console.log("Governance provenance v2 source/mode regressions passed.");
console.log("Governance provenance stage-schema v2 (G-01/G-02) regressions passed.");
