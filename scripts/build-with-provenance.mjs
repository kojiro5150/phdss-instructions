import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const SHA_PATTERN = /^[0-9a-f]{40}$/;

export function resolveBuildCommit(runGit = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim(), existingCommit = process.env.VITE_GIT_COMMIT) {
  const sha = runGit("rev-parse", "HEAD").trim();
  if (!SHA_PATTERN.test(sha)) throw new Error("Build provenance: git HEAD is not a full 40-character SHA");
  if (existingCommit && existingCommit !== sha) throw new Error("Build provenance: supplied VITE_GIT_COMMIT differs from checked-out HEAD");
  const dirty = runGit("status", "--porcelain").trim();
  if (dirty) throw new Error("Build provenance: working tree is not clean; commit changes before building a provenance-bearing release");
  return sha;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const sha = resolveBuildCommit();
    const vite = resolve("node_modules/vite/bin/vite.js");
    const result = spawnSync(process.execPath, [vite, "build", ...process.argv.slice(2)], {
      stdio: "inherit",
      env: { ...process.env, VITE_GIT_COMMIT: sha }
    });
    if (result.error) throw result.error;
    if (result.signal) throw new Error("Vite build terminated by signal " + result.signal);
    process.exit(result.status ?? 1);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
