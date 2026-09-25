import assert from "node:assert/strict";
import fs from "node:fs";

const fixture=JSON.parse(
  fs.readFileSync("tests/fixtures/synthetic/chair-non-substitution.json","utf8")
);

function sameJson(a,b){
  return JSON.stringify(a)===JSON.stringify(b);
}

function assessNonSubstitution(upstream,projection){
  if(!sameJson(projection.director_signals,upstream.director_signals)){
    return {permitted:false,reason:"DIRECTOR_SIGNAL_MUTATION"};
  }
  if(projection.probe_verdict!==upstream.probe_verdict){
    return {permitted:false,reason:"PROBE_VERDICT_MUTATION"};
  }
  if(projection.fragility_score!==upstream.fragility_score){
    return {permitted:false,reason:"FRAGILITY_SCORE_MUTATION"};
  }

  for(const [key,value] of Object.entries(projection.epistemic_states||{})){
    if(Object.prototype.hasOwnProperty.call(upstream.epistemic_states||{},key)
      && value!==upstream.epistemic_states[key]){
      return {permitted:false,reason:"EPISTEMIC_STATE_PROMOTION"};
    }
  }

  const upstreamConditions=new Set(upstream.conditions||[]);
  for(const condition of projection.conditions||[]){
    if(!upstreamConditions.has(condition)){
      return {permitted:false,reason:"CONDITION_INVENTION"};
    }
  }

  const upstreamTensions=new Set(upstream.unresolved_tensions||[]);
  for(const tension of projection.resolved_tensions||[]){
    if(upstreamTensions.has(tension)){
      return {permitted:false,reason:"TENSION_RESOLUTION"};
    }
  }

  for(const tension of projection.unresolved_tensions||[]){
    if(!upstreamTensions.has(tension)){
      return {permitted:false,reason:"TENSION_INVENTION"};
    }
  }

  return {permitted:true,reason:null};
}

assert.equal(
  fixture.fixture_class,
  "synthetic_chair_non_substitution",
  "unexpected fixture class"
);
assert.ok(Array.isArray(fixture.cases)&&fixture.cases.length>=4,"fixture cases missing");

for(const testCase of fixture.cases){
  const result=assessNonSubstitution(fixture.upstream,testCase.chair_projection);
  assert.equal(
    result.permitted,
    testCase.expected_permitted,
    testCase.id+": permitted mismatch"
  );
  assert.equal(
    result.reason,
    testCase.expected_reason,
    testCase.id+": diagnostic mismatch"
  );
}

const ids=new Set(fixture.cases.map(x=>x.id));
assert.ok(ids.has("invalid-epistemic-promotion"));
assert.ok(ids.has("invalid-tension-resolution"));
assert.ok(ids.has("invalid-condition-invention"));

console.log("PHDSS Chair non-substitution verification passed.");
console.log("Synthetic Chair cases: "+fixture.cases.length+" PASS");
console.log("Distinct diagnostics: epistemic promotion / tension resolution / condition invention PASS");
