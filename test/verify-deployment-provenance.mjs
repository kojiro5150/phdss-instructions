import assert from "node:assert/strict";
import { resolveBuildCommit } from "../scripts/build-with-provenance.mjs";

const A = "a".repeat(40);
const B = "b".repeat(40);
const git = (sha, status = "") => (command, argument) => {
  if (command === "rev-parse" && argument === "HEAD") return sha;
  if (command === "status" && argument === "--porcelain") return status;
  throw new Error("Unexpected git command");
};

assert.equal(resolveBuildCommit(git(A), undefined), A);
assert.equal(resolveBuildCommit(git(A), A), A);
assert.throws(() => resolveBuildCommit(git(A), B), /differs from checked-out HEAD/);
assert.throws(() => resolveBuildCommit(git("short"), undefined), /full 40-character SHA/);
assert.throws(() => resolveBuildCommit(git(A, " M App_FINAL.jsx"), undefined), /not clean/);
assert.throws(() => resolveBuildCommit(() => { throw new Error("git unavailable"); }, undefined), /git unavailable/);
console.log("Deployment provenance build checks passed.");
