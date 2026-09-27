import fs from "node:fs";
import crypto from "node:crypto";

const manifestPath=process.argv[2];
const stagesDir=process.argv[3];
const expectedDeployment=process.argv[4]||null;
const repoSlug=process.argv[5]||"kojiro5150/phdss-instructions";
if(!manifestPath||!stagesDir){console.error("Usage: node scripts/verify-governance-provenance-v2.mjs <manifest.json> <stages-dir> [expected-deployment-sha] [repo-slug]");process.exit(2);}

const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
const stageRecords=fs.readdirSync(stagesDir).filter(n=>n.endsWith(".json")).map(n=>JSON.parse(fs.readFileSync(stagesDir+"/"+n,"utf8")));
const ALL=["systems","economics","behaviour","policy","equity","lived","digital","ethics","sovereignty","safety","physics","measurement","innovation"];
const CORE_REQUIRED=["systems","safety","equity","lived"];
const CHAIR_REQUIRED=["systems","safety"];
const AI=["artificial intelligence","machine learning","clinical decision support","samd","software as a medical device","algorithmic","ai-powered","ai powered","ai platform","ai system","ai tool","ai solution","ai governance","ai procurement","ai clinical","deep learning","neural network","predictive model","decision support system","clinical ai"];
const DIGITAL=["ai","artificial intelligence","machine learning","algorithm","automation","automated","software","platform","app","technology","data","model","clinical decision support","analytics","electronic","online","virtual","robot","emr","integration","digital workflow","digital"];
const POLICY=["minister","ministerial","government","legislation","regulation","statutory","compliance","public accountability","parliament","parliamentary","mandated change","policy reform","governance obligation"];
const ECON=["budget","cost","savings","affordability","efficiency","return on investment","roi","value for money","funding","expenditure","allocation","business case","financial pressure","procurement","investment"];

const sha=v=>crypto.createHash("sha256").update(Buffer.from(String(v??""),"utf8")).digest("hex");
const sameSet=(a,b)=>a.length===b.length&&a.every(x=>b.includes(x));
function adaptive(text){const s=String(text||"").toLowerCase();if(AI.some(k=>s.includes(k)))return"digital";const d=DIGITAL.some(k=>s.includes(k));const e=ECON.some(k=>s.includes(k));if(d&&e)return"economics";if(d)return"digital";if(POLICY.some(k=>s.includes(k)))return"policy";if(e)return"economics";return"behaviour";}
function decisionText(){if(typeof manifest.decision_text==="string"&&manifest.decision_text.trim())return manifest.decision_text.trim();const r=stageRecords.find(x=>String(x.stage_id||"").startsWith("director:")&&typeof x.user_message==="string");const p="Decision under review: ";return r&&r.user_message.startsWith(p)?r.user_message.slice(p.length).trim():"";}
function expectedDirectors(){if(manifest.analysis_mode==="FULL")return ALL.slice();if(manifest.analysis_mode==="CORE"){const d=decisionText();if(!d)throw new Error("CORE mode requires decision text");return[...new Set(CORE_REQUIRED.concat([adaptive(d)]))];}if(manifest.analysis_mode==="CHAIR_SPECIFIED"){if(!Array.isArray(manifest.chair_selected_directors))throw new Error("CHAIR_SPECIFIED requires chair_selected_directors");return[...new Set(CHAIR_REQUIRED.concat(manifest.chair_selected_directors))];}throw new Error("unsupported analysis_mode "+String(manifest.analysis_mode));}
async function sourceHash(record,file){if(record.instruction_normalization_version!=="trim_v1")throw new Error("unsupported normalization");const url="https://raw.githubusercontent.com/"+repoSlug+"/"+record.instruction_commit+"/"+file;const res=await fetch(url);if(!res.ok)throw new Error("source unavailable");return sha((await res.text()).trim());}

const failures=[];const stages=[];const fail=m=>failures.push(m);
if(manifest.schema!=="phdss.governance-provenance.v1")fail("unsupported manifest schema");
if(manifest.run_type!=="GOVERNANCE")fail("manifest run_type must be GOVERNANCE");
if(expectedDeployment&&manifest.deployment_commit!==expectedDeployment)fail("deployment commit mismatch");
const by={};for(const r of stageRecords){if(by[r.stage_id]){fail("duplicate stage record: "+r.stage_id);continue;}by[r.stage_id]=r;}

for(const ref of(manifest.stages||[])){const r=by[ref.stage_id];if(!r){stages.push({stage_id:ref.stage_id,stage_provenance_status:"INVALID",reason:"missing record"});fail("manifest references missing stage record: "+ref.stage_id);continue;}let reason=null;if(r.schema!=="phdss.governance-stage-provenance.v1")reason="unsupported stage schema";else if(r.decision_id!==manifest.decision_id)reason="decision_id mismatch";else if(r.deployment_commit!==manifest.deployment_commit)reason="deployment commit mismatch";else if(r.instruction_commit!==manifest.instruction_commit)reason="instruction commit mismatch";else if(r.instruction_normalization_version!==manifest.instruction_normalization_version)reason="instruction normalization mismatch";
if(!reason&&r.status==="skipped"){if(!r.error||!String(r.error).trim())reason="skipped stage missing reason";if(reason){stages.push({stage_id:r.stage_id,stage_provenance_status:"INVALID",reason});fail("stage "+r.stage_id+" invalid: "+reason);}else stages.push({stage_id:r.stage_id,stage_provenance_status:"SKIPPED",reason:String(r.error)});continue;}
if(!reason&&r.system_prompt_sha256!==sha(r.system_prompt))reason="system prompt hash mismatch";if(!reason&&r.user_message_sha256!==sha(r.user_message))reason="user message hash mismatch";if(!reason&&r.output_sha256!==(r.output==null?null:sha(r.output)))reason="output hash mismatch";if(!reason&&ref.output_sha256!==(r.output_sha256||null))reason="manifest output hash mismatch";if(!reason&&ref.status!==r.status)reason="manifest stage status mismatch";if(!reason&&r.stage_id==="chair"&&!r.authority_repair)reason="Chair authority repair metadata missing";if(!reason&&(!Array.isArray(r.instruction_files)||!Array.isArray(r.instruction_runtime_sha256)||r.instruction_files.length===0||r.instruction_files.length!==r.instruction_runtime_sha256.length))reason="instruction provenance incomplete";
if(!reason){for(let i=0;i<r.instruction_files.length;i++){try{if(await sourceHash(r,r.instruction_files[i])!==r.instruction_runtime_sha256[i]){reason="instruction source hash mismatch for "+r.instruction_files[i];break;}}catch(e){reason="instruction source unavailable at declared commit for "+r.instruction_files[i];break;}}}
if(reason){stages.push({stage_id:r.stage_id,stage_provenance_status:"INVALID",reason});fail("stage "+r.stage_id+" invalid: "+reason);}else stages.push({stage_id:r.stage_id,stage_provenance_status:"VALID",reason:r.status==="failed"?"execution failed but provenance is valid":"hashes, source identity and metadata valid"});}

for(const id of Object.keys(by))if(!(manifest.stages||[]).some(r=>r.stage_id===id))fail("unreferenced stage record: "+id);
try{const exp=expectedDirectors();const act=(manifest.active_directors||[]).slice();const expOmit=ALL.filter(id=>!exp.includes(id));const actOmit=(manifest.omitted_directors||[]).slice();if(!sameSet(act,exp))fail("analysis-mode Director set mismatch: expected ["+exp.join(", ")+"] got ["+act.join(", ")+"]");if(!sameSet(actOmit,expOmit))fail("analysis-mode omitted Director set mismatch");}catch(e){fail("analysis-mode consistency could not be verified: "+e.message);}
for(const id of(manifest.active_directors||[])){const sid="director:"+id;if(!by[sid])fail("active Director missing provenance record: "+id);else if(by[sid].status==="skipped")fail("active Director incorrectly skipped: "+id);}
for(const id of(manifest.omitted_directors||[])){const sid="director:"+id;if(by[sid]&&by[sid].status!=="skipped")fail("omitted Director was invoked: "+id);}
for(const sid of["surface_map","epistemic_audit","cross_domain_tension_analysis","adversarial_probe","chair"]){if(!by[sid])fail("mandatory stage missing: "+sid);else if(by[sid].status==="skipped")fail("mandatory stage incorrectly skipped: "+sid);}
for(const sid of["reality_anchor","stress_test","comparator"])if(!by[sid])fail("conditional/degradable stage missing explicit record: "+sid);
const status=failures.length?"INVALID":"VALID";console.log(JSON.stringify({schema:"phdss.governance-provenance-verification.v2",decision_id:manifest.decision_id,run_provenance_status:status,stages,failures},null,2));if(failures.length)process.exit(1);
