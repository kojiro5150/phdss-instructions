export const ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
export const SYNTHESIS_MODEL = "claude-sonnet-4-6";
export const API_TEST_MODEL = "claude-haiku-4-5-20251001";

function runtimeFetch(fetchImpl) {
  if (fetchImpl) return fetchImpl;
  if (typeof globalThis !== "undefined" && typeof globalThis.fetch === "function") {
    return globalThis.fetch.bind(globalThis);
  }
  throw new Error("fetch is unavailable");
}

function runtimeSleep(sleepImpl) {
  return sleepImpl || function(ms) {
    return new Promise(function(resolve){ setTimeout(resolve, ms); });
  };
}

export function installApiKeyInterceptor(apiKey, windowObj) {
  var target = windowObj || (typeof window !== "undefined" ? window : null);
  if (!target || typeof target.fetch !== "function") throw new Error("window.fetch is unavailable");
  if (target.__phdssApiKeyInterceptorInstalled) return;
  const _originalFetch = target.fetch.bind(target);
  target.fetch = async function(url, options = {}) {
    if (typeof url === "string" && url.startsWith("https://api.anthropic.com/")) {
      const headers = Object.assign({}, options.headers || {}, {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      });
      return _originalFetch(url, Object.assign({}, options, { headers }));
    }
    return _originalFetch(url, options);
  };
  target.__phdssApiKeyInterceptorInstalled = true;
}

export async function apiCall(systemPrompt, userMessage, useWebSearch, fetchImpl) {
  var body = { model:SYNTHESIS_MODEL, max_tokens:16000, temperature:0.8, system:systemPrompt, messages:[{role:"user", content:userMessage}] };
  if (useWebSearch) body.tools = [{type:"web_search_20250305", name:"web_search"}];
  var response = await runtimeFetch(fetchImpl)(ANTHROPIC_MESSAGES_URL, {
    method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)
  });
  var data = await response.json();
  if (data.error) throw new Error(data.error.message||JSON.stringify(data.error));
  if (!data.content) throw new Error("No content. Keys: "+Object.keys(data).join(","));
  return { text: data.content.map(function(b){return b.text||"";}).join("\n").trim(), stopReason: data.stop_reason||"end_turn" };
}

export async function callClaude_synthesis(systemPrompt, userMessage, autoContinue, useWebSearch, runtime) {
  runtime = runtime || {};
  var fetchImpl = runtime.fetchImpl;
  var sleep = runtimeSleep(runtime.sleepImpl);
  var lastError;
  for (var attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      var delay = attempt === 1 ? 3000 : 8000;
      await sleep(delay);
    }
    try {
      var result = await apiCall(systemPrompt, userMessage, !!useWebSearch, fetchImpl);
      var passCount = 0;
      while (result.stopReason==="max_tokens" && autoContinue && passCount < 2) {
        passCount++;
        var contBody = {
          model:SYNTHESIS_MODEL, max_tokens:16000, temperature:0.8,
          system: systemPrompt,
          messages: [
            {role:"user",      content: userMessage},
            {role:"assistant", content: result.text},
            {role:"user",      content: "Continue your analysis from exactly where you stopped. Do not restate or summarise what you have already written — continue the document directly."}
          ]
        };
        if (useWebSearch) contBody.tools = [{type:"web_search_20250305", name:"web_search"}];
        var contResponse = await runtimeFetch(fetchImpl)(ANTHROPIC_MESSAGES_URL, {
          method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(contBody)
        });
        var contRaw = await contResponse.text();
        if (!contRaw||!contRaw.trim().startsWith("{")) throw new Error("Continuation non-JSON: "+contRaw.substring(0,200));
        var contData = JSON.parse(contRaw);
        if (contData.error) throw new Error(contData.error.message||JSON.stringify(contData.error));
        var contText = (contData.content||[]).map(function(b){return b.text||"";}).join("\n").trim();
        result = { text: result.text+"\n"+contText, stopReason: contData.stop_reason||"end_turn" };
      }
      if (result.stopReason==="max_tokens") return result.text+"\n\n⚠ PARTIAL - token limit reached after "+passCount+" continuation pass"+(passCount===1?"":"es")+".";
      return result.text;
    } catch(e) {
      lastError = e;
      var msg = (e&&e.message)||"";
      if (msg.indexOf("invalid_api_key")!==-1 || msg.indexOf("400")!==-1) throw e;
    }
  }
  throw lastError;
}

export async function callClaudeChat(systemPrompt, messages, fetchImpl) {
  var body = {model:SYNTHESIS_MODEL, max_tokens:2000, temperature:0.8, system:systemPrompt, messages:messages};
  var response = await runtimeFetch(fetchImpl)(ANTHROPIC_MESSAGES_URL, {
    method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)
  });
  var rawText = await response.text();
  if (!rawText||!rawText.trim().startsWith("{")) throw new Error("Non-JSON (HTTP "+response.status+"): "+rawText.substring(0,200));
  var data = JSON.parse(rawText);
  if (data.error) throw new Error(data.error.message||JSON.stringify(data.error));
  if (!data.content) throw new Error("No content in response");
  return data.content.map(function(b){return b.text||"";}).join("\n").trim();
}
