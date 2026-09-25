# PR-1 equivalence fixtures

These fixtures were captured before pure-function extraction on the `v2-modularisation` branch.

- `equivalence.js` is executable by `test/verify.js` after extraction and enforces the PR-1 invariant: **same inputs -> byte/structure-equivalent outputs**.
- `dashboard-states.js` preserves four synthetic reference states for the later `parseDashboard` split: complete, partial, HALT distribution, and META under-extraction diagnostic.

`parseDashboard` is deliberately not extracted in PR 1 because it is not pure: it stamps the current time and emits diagnostic warnings. The META under-extraction warning is treated as a governance-relevant diagnostic and must move to the future orchestration/runtime wrapper rather than disappear.
