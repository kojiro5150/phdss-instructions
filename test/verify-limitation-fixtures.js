import assert from "node:assert/strict";
import fs from "node:fs";

import { dominantSignalFromCounts, tallyDirectorSignals } from "../src/signal-tally.js";
import { assessAuthorityBoundary } from "../src/authority-contract.js";
import { shouldRunStressTest } from "../src/pipeline.js";

// Characterisation of known limitations L-18 to L-21 at the pre-evaluation
// baseline. Assertions record OBSERVED defect behaviour, not desired behaviour.
// A failure here means behaviour changed: update the matching entry in
// docs/LIMITATIONS_REGISTER.md and this fixture in the same change.

const fixture=JSON.parse(fs.readFileSync(new URL("../tests/fixtures/synthetic/limitations-l18-l21.json",import.meta.url),"utf8"));
const failures=[];

function signalOutput(signal){
  return "**Recommendation Signal**: "+signal+" — synthetic rationale.";
}

for(const c of fixture.cases){
  try {
    if(c.kind==="dominant_from_counts"){
      assert.equal(dominantSignalFromCounts(c.input.proceed,c.input.caution,c.input.halt),c.observed);
    } else if(c.kind==="authority_assessment"){
      assert.equal(assessAuthorityBoundary(c.layer,c.input).violates,c.observed_violates);
    } else if(c.kind==="stress_from_epistemic"){
      const r=shouldRunStressTest("CORE","neutral",[],"",c.input,"BOARD REASONING SOUND","ready");
      assert.equal(r.run,c.observed_run);
      assert.equal(r.reason,c.observed_reason);
    } else if(c.kind==="stress_vs_tally"){
      assert.equal(tallyDirectorSignals([{output:c.input}]).halt,c.observed_tally_halt);
      assert.equal(shouldRunStressTest("CORE","neutral",[{output:c.input}],"","","","").reason,c.observed_stress_reason);
    } else if(c.kind==="tally"){
      assert.equal(tallyDirectorSignals(c.input_signals.map(function(s){return {output:signalOutput(s)};})).dominant,c.observed_dominant);
    } else {
      throw new Error("unknown fixture kind "+c.kind);
    }
  } catch(error){
    failures.push(c.id+" ("+c.limitation+"): "+error.message);
  }
}

if(failures.length){
  failures.forEach(function(f){console.error("FAIL "+f);});
  console.error("Observed behaviour changed. Update the register entry and this fixture together.");
  process.exit(1);
}
console.log("Limitation characterisation L-18 to L-21 ("+fixture.cases.length+" cases): PASS");
