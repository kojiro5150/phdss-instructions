# Gate A — Clean-Clone Build Evidence Record

**Date:** 2026-10-20
**Verified commit:** `25948b8821bc50cc9738db1c87ae781895cde4c2` (PR #85, branch `assurance/gate-a-reproducibility-20261020`)
**Classification:** AI-assisted verification — Protocol Authority review pending; independent human verification pending
**Classification amended:** 2026-10-20. Original classification "Reviewer-executed, artefact-backed verification" replaced to state completed actions only. Execution details, timestamps, hashes and logs are unchanged; no new verification run.
**Gate A:** OPEN

## Evidentiary status

This record preserves the commands, exit codes, timestamps, hashes and full logs of a clean-clone build verification. The run was executed by an AI system. Review by a second AI system is not independent assurance. Preserving the logs improves auditability. It does **not** make the run independently witnessed, does **not** constitute transfer-candidate acceptance, and does **not** freeze a candidate. The commit that adds this record is a review reference only.

Source commit identity is not deployment identity. This record establishes what builds from source at `25948b8`. It does not establish what is running on any deployment, which instruction set a live session loads, or which model configuration a live session uses.

## Environment

| Item | Value |
|---|---|
| OS | Linux 6.18.44-fc-v139 x86_64 (cloud sandbox) |
| Node | v22.22.0 |
| npm | 10.9.4 |
| git | 2.43.0 |
| Executed by | Claude (AI reviewer), on behalf of the Protocol Authority |
| Start / end (UTC) | 2026-10-20T11:06:48Z / 2026-10-20T11:06:56Z |

## Procedure and results

Fresh clone, checkout of the exact SHA, then:

| Step | Command | Exit | Working tree after |
|---|---|---|---|
| Before | `git status --porcelain` | n/a | clean |
| Install | `npm ci --no-audit --no-fund` | 0 | clean |
| Validate | `npm run validate` | 0 | n/a (36 suites report pass) |
| Build | `npm run build` (`scripts/build-with-provenance.mjs`) | 0 | clean |

## Hashes and build provenance

| Artefact | SHA-256 |
|---|---|
| `package-lock.json` | `0d905a67662da0a207a58f70c73fc2560b27bc0e3b9f26a5b7dea7a0b77b0fac` |
| `dist/index.html` | `f10cb08fd8442da8032ac8edbc8e50182dc33cd64f35e17acbfbc802a2cc5799` |
| `dist/assets/index-Bukdyuok.js` | `8ceb416f87e82f2317a8e19e2e310c4a3518891abca1ed01c64b91092d521e6f` |

**Build provenance identifier:** the build script refuses a dirty tree, resolves `git rev-parse HEAD`, and injects it as `VITE_GIT_COMMIT`. The full SHA `25948b8821bc50cc9738db1c87ae781895cde4c2` appears in the built bundle.

**Observation:** an earlier untimestamped clean-clone run at the same commit in the same session produced a bundle with the same content-hashed filename (`index-Bukdyuok.js`). This suggests, but does not prove, a byte-stable build in this environment. Cross-environment reproducibility is untested.

## Full logs

In `tests/evidence/gate-a/2026-10-20-clean-clone-25948b8/`:

- `environment.log`: environment, HEAD, tree status at each stage, lockfile hash, timestamps
- `npm-ci.log`, `npm-validate.log`, `npm-build.log`: full command output with start and end timestamps and exit codes
- `dist-sha256.txt`: SHA-256 of every file in `dist/`

## What this closes and what it does not

- **Closes on this branch:** the untracked-lockfile defect. A fresh clone now reaches a provenance-bearing build with no manual step.
- **Does not address:** live Governance capture and export, UI disclosure, analytical reproducibility (L-15), deployment identity, or independent operator execution (L-12).
