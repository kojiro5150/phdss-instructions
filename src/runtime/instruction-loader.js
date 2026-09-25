export const INSTRUCTION_COMMIT = "b6792cb5e69b4dbe3c5db438063ef4255b76d56e";
export const GITHUB_BASE = "https://cdn.jsdelivr.net/gh/kojiro5150/phdss-instructions@"+INSTRUCTION_COMMIT+"/";

export const INSTRUCTION_FILES = Object.freeze({
  systems:        "systems.md",
  economics:      "economics.md",
  behaviour:      "behaviour.md",
  policy:         "policy.md",
  equity:         "equity.md",
  lived:          "lived.md",
  digital:        "digital.md",
  ethics:         "ethics.md",
  sovereignty:    "sovereignty.md",
  safety:         "safety.md",
  physics:        "physics.md",
  measurement:    "measurement.md",
  innovation:     "innovation.md",
  surfacemap:     "surfacemap.md",
  epistemic:      "epistemic.md",
  meta:           "meta.md",
  reality:        "reality.md",
  probe:          "probe.md",
  stress:         "stress.md",
  chair:          "chair.md",
  comparator:     "comparator.md",
});

function runtimeFetch(fetchImpl) {
  if (fetchImpl) return fetchImpl;
  if (typeof globalThis !== "undefined" && typeof globalThis.fetch === "function") {
    return globalThis.fetch.bind(globalThis);
  }
  throw new Error("fetch is unavailable");
}

export async function fetchInstructionFile(key, fetchImpl) {
  var url = GITHUB_BASE + INSTRUCTION_FILES[key];
  try {
    var res = await runtimeFetch(fetchImpl)(url);
    if (!res.ok) return null;
    var text = await res.text();
    return text && text.trim() ? text.trim() : null;
  } catch(e) { return null; }
}

export async function loadAllInstructions(onProgress, fetchImpl) {
  var keys = Object.keys(INSTRUCTION_FILES);
  var loaded = {};
  var failed = [];
  await Promise.all(keys.map(async function(key) {
    var content = await fetchInstructionFile(key, fetchImpl);
    if (content) { loaded[key] = content; }
    else { failed.push(key); }
    if (onProgress) onProgress(Object.keys(loaded).length + failed.length, keys.length);
  }));
  return { loaded, failed };
}
