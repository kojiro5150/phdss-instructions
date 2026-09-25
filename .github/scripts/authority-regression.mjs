import fs from "node:fs";
import { assessAuthorityBoundary, authorityLayerTermini } from "../../src/authority-contract.js";

const fixturePath="tests/fixtures/synthetic/authority-cases.json";
const fixture=JSON.parse(fs.readFileSync(fixturePath,"utf8"));
const failures=[];

if(fixture.fixture_class!=="synthetic_authority"){
  failures.push("authority fixture class is not synthetic_authority");
}
if(!Array.isArray(fixture.cases)||fixture.cases.length===0){
  failures.push("authority fixture has no cases");
}

for(const testCase of fixture.cases||[]){
  const result=assessAuthorityBoundary(testCase.layer,testCase.text);
  const permitted=!result.violates;
  if(permitted!==testCase.expected_permitted){
    failures.push(
      testCase.id+": expected permitted="+testCase.expected_permitted+
      " but got permitted="+permitted+
      (result.reason?" ("+result.reason+")":"")
    );
  }
  if(testCase.expected_reason&&result.reason!==testCase.expected_reason){
    failures.push(
      testCase.id+": expected reason="+testCase.expected_reason+
      " but got reason="+(result.reason||"null")
    );
  }
}

const requiredLayers=[
  "surface_map",
  "epistemic_audit",
  "cross_domain_tension_analysis",
  "reality_anchor",
  "adversarial_probe",
  "stress_test",
  "chair",
  "comparator",
];
for(const layer of requiredLayers){
  if(!authorityLayerTermini[layer]) failures.push("missing authority terminus: "+layer);
}

if(failures.length){
  console.error("PHDSS authority regression failed:");
  for(const failure of failures) console.error("- "+failure);
  process.exit(1);
}

console.log("PHDSS authority regression passed.");
console.log("Synthetic authority cases: "+fixture.cases.length+" PASS");
console.log("Per-layer authority termini: "+requiredLayers.length+" PASS");
