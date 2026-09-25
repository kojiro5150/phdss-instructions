import assert from "node:assert/strict";
import fs from "node:fs";

import {
  INSTRUCTION_COMMIT,
  GITHUB_BASE,
  INSTRUCTION_FILES,
  fetchInstructionFile,
  loadAllInstructions,
} from "../src/runtime/instruction-loader.js";
import {
  ANTHROPIC_MESSAGES_URL,
  SYNTHESIS_MODEL,
  installApiKeyInterceptor,
  apiCall,
  callClaude_synthesis,
  callClaudeChat,
} from "../src/runtime/anthropic-client.js";

const failures=[];
async function check(label,fn){
  try { await fn(); }
  catch(error){ failures.push(label+": "+error.message); }
}

await check("instruction pin and manifest",async function(){
  assert.equal(INSTRUCTION_COMMIT,"56ad2305ca62ed7409c3e89723f9bd1ca914d935");
  assert.equal(GITHUB_BASE,"https://cdn.jsdelivr.net/gh/kojiro5150/phdss-instructions@56ad2305ca62ed7409c3e89723f9bd1ca914d935/");
  assert.equal(Object.keys(INSTRUCTION_FILES).length,21);
  assert.equal(INSTRUCTION_FILES.systems,"systems.md");
  assert.equal(INSTRUCTION_FILES.chair,"chair.md");
  assert.equal(INSTRUCTION_FILES.comparator,"comparator.md");
});

await check("instruction fetch trims successful content",async function(){
  const calls=[];
  const fetchImpl=async function(url){
    calls.push(url);
    return {ok:true,text:async function(){return "  instruction text  ";}};
  };
  const result=await fetchInstructionFile("systems",fetchImpl);
  assert.equal(result,"instruction text");
  assert.deepStrictEqual(calls,[GITHUB_BASE+"systems.md"]);
});

await check("instruction fetch fails closed",async function(){
  assert.equal(await fetchInstructionFile("systems",async function(){return {ok:false,text:async function(){return "ignored";}};}),null);
  assert.equal(await fetchInstructionFile("systems",async function(){throw new Error("network");}),null);
});

await check("all instructions report loaded and failed",async function(){
  const progress=[];
  const failedKey="probe";
  const fetchImpl=async function(url){
    const fail=url.endsWith(INSTRUCTION_FILES[failedKey]);
    return {ok:!fail,text:async function(){return fail?"":"  "+url.split("/").pop()+" body  ";}};
  };
  const result=await loadAllInstructions(function(done,total){progress.push([done,total]);},fetchImpl);
  assert.deepStrictEqual(result.failed,[failedKey]);
  assert.equal(Object.keys(result.loaded).length,20);
  assert.equal(result.loaded.systems,"systems.md body");
  assert.equal(progress.length,21);
  assert.equal(progress.at(-1)[0],21);
  assert.equal(progress.at(-1)[1],21);
});

await check("apiCall preserves request contract",async function(){
  const calls=[];
  const fetchImpl=async function(url,options){
    calls.push({url,options,body:JSON.parse(options.body)});
    return {json:async function(){return {content:[{text:" first "},{text:"second"}],stop_reason:"end_turn"};}};
  };
  const result=await apiCall("SYS","USER",true,fetchImpl);
  assert.deepStrictEqual(result,{text:"first \nsecond",stopReason:"end_turn"});
  assert.equal(calls.length,1);
  assert.equal(calls[0].url,ANTHROPIC_MESSAGES_URL);
  assert.deepStrictEqual(calls[0].body,{
    model:SYNTHESIS_MODEL,
    max_tokens:16000,
    temperature:0.8,
    system:"SYS",
    messages:[{role:"user",content:"USER"}],
    tools:[{type:"web_search_20250305",name:"web_search"}],
  });
});

await check("synthesis continuation preserves transcript",async function(){
  const bodies=[];
  let call=0;
  const fetchImpl=async function(url,options){
    bodies.push(JSON.parse(options.body));
    call++;
    if(call===1){
      return {json:async function(){return {content:[{text:"first"}],stop_reason:"max_tokens"};}};
    }
    return {
      text:async function(){return JSON.stringify({content:[{text:"second"}],stop_reason:"end_turn"});}
    };
  };
  const out=await callClaude_synthesis("SYS","USER",true,false,{fetchImpl,sleepImpl:async function(){}});
  assert.equal(out,"first\nsecond");
  assert.equal(bodies.length,2);
  assert.deepStrictEqual(bodies[1].messages,[
    {role:"user",content:"USER"},
    {role:"assistant",content:"first"},
    {role:"user",content:"Continue your analysis from exactly where you stopped. Do not restate or summarise what you have already written — continue the document directly."},
  ]);
});

await check("synthesis retry keeps 3s first backoff",async function(){
  const sleeps=[];
  let call=0;
  const fetchImpl=async function(){
    call++;
    if(call===1) throw new Error("network unavailable");
    return {json:async function(){return {content:[{text:"recovered"}],stop_reason:"end_turn"};}};
  };
  const out=await callClaude_synthesis("SYS","USER",false,false,{
    fetchImpl,
    sleepImpl:async function(ms){sleeps.push(ms);},
  });
  assert.equal(out,"recovered");
  assert.deepStrictEqual(sleeps,[3000]);
  assert.equal(call,2);
});

await check("synthesis does not retry definitive API-key error",async function(){
  let call=0;
  const fetchImpl=async function(){
    call++;
    return {json:async function(){return {error:{message:"invalid_api_key"}};}};
  };
  await assert.rejects(
    callClaude_synthesis("SYS","USER",false,false,{fetchImpl,sleepImpl:async function(){}}),
    /invalid_api_key/
  );
  assert.equal(call,1);
});

await check("chat preserves non-JSON failure behavior",async function(){
  const fetchImpl=async function(){
    return {status:502,text:async function(){return "<html>bad gateway</html>";}};
  };
  await assert.rejects(callClaudeChat("SYS",[{role:"user",content:"hi"}],fetchImpl),/Non-JSON \(HTTP 502\)/);
});

await check("API key interceptor is one-shot and scoped",async function(){
  const calls=[];
  const fakeWindow={
    fetch:async function(url,options){calls.push({url,options:options||{}});return {ok:true};}
  };
  installApiKeyInterceptor("secret-1",fakeWindow);
  installApiKeyInterceptor("secret-2",fakeWindow);
  await fakeWindow.fetch("https://api.anthropic.com/v1/messages",{headers:{"Content-Type":"application/json"}});
  await fakeWindow.fetch("https://example.com/test",{headers:{A:"B"}});
  assert.equal(fakeWindow.__phdssApiKeyInterceptorInstalled,true);
  assert.equal(calls[0].options.headers["x-api-key"],"secret-1");
  assert.equal(calls[0].options.headers["anthropic-version"],"2023-06-01");
  assert.equal(calls[0].options.headers["anthropic-dangerous-direct-browser-access"],"true");
  assert.equal(calls[1].options.headers.A,"B");
  assert.equal(calls[1].options.headers["x-api-key"],undefined);
});

const app=fs.readFileSync("App_FINAL.jsx","utf8");
if(/function\s+installApiKeyInterceptor\s*\(/.test(app)) failures.push("installApiKeyInterceptor remains locally defined");
if(/async function\s+apiCall\s*\(/.test(app)) failures.push("apiCall remains locally defined");
if(/async function\s+callClaude_synthesis\s*\(/.test(app)) failures.push("callClaude_synthesis remains locally defined");
if(/async function\s+callClaudeChat\s*\(/.test(app)) failures.push("callClaudeChat remains locally defined");
if(/async function\s+fetchInstructionFile\s*\(/.test(app)) failures.push("fetchInstructionFile remains locally defined");
if(/async function\s+loadAllInstructions\s*\(/.test(app)) failures.push("loadAllInstructions remains locally defined");
if(!/function\s+parseDashboard\s*\(/.test(app)) failures.push("parseDashboard moved during orchestration PR 1");
if(!/async function\s+compressDirectorOutput\s*\(/.test(app)) failures.push("compression orchestration moved too early");
if(!/async function\s+callGovernedSynthesis\s*\(/.test(app)) failures.push("synthesis authority orchestration moved too early");
if(!/function\s+commitToLedger\s*\(/.test(app)) failures.push("ledger assembly moved too early");

if(failures.length){
  console.error("PHDSS runtime orchestration boundary verification failed:");
  failures.forEach(function(failure){console.error("- "+failure);});
  process.exit(1);
}

console.log("PHDSS runtime orchestration boundary verification passed.");
console.log("Instruction manifest/pin: PASS");
console.log("Instruction loading behavior: PASS");
console.log("Anthropic request/retry/continuation behavior: PASS");
console.log("API key interceptor behavior: PASS");
console.log("Orchestration scope guards: PASS");
