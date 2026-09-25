# PHDSS v2.0 — Local Run

The v2.0 branch is intentionally local-first while recovery and modularisation continue. The live `gh-pages` deployment remains the behavioural reference and is not modified by this branch.

## Start locally

```bash
git switch v2.0
git pull
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

## Validate before a test run

```bash
npm run validate
npm run build
```

Both commands are also enforced by the GitHub Actions recovery gate on `v2.0`.

## Current recovery contract

- Instruction commit: `56ad2305ca62ed7409c3e89723f9bd1ca914d935`
- Runtime contract: `2.0-recovery`
- Ledger schema: `3.0.0-alpha.1`
- Human decision authority remains outside PHDSS.
- Chair output is a **Decision Brief** with **Decision Brief Status**.
- Director and synthesis Governance Records are dynamically derived from the same technical analyses.
- Static scenario-specific Governance Records are prohibited by CI.
- Exact instruction/runtime provenance is recorded in the Decision Ledger.

## Local parity test

Use a synthetic CORE scenario equivalent in structure to the 25 September 2026 baseline. Compare architecture and contracts, not natural-language wording.

Minimum PASS:

1. CORE resolves the expected Director set.
2. Technical and Governance views both render.
3. Every completed Director receives a source-derived Governance Record.
4. Chair emits Decision Brief Status and no preferred course of action.
5. Stress gating remains deterministic.
6. Dashboard reports Director Signal Distribution.
7. Ledger stores exact instruction commit and runtime contract.
8. No retired static Governance Record content appears.
