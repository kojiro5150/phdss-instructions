# PHDSS v2 — Runtime Orchestration Boundary

Status: modularisation contract  
Scope: orchestration PR 1

## Purpose

This slice separates external runtime I/O from the React monolith without changing governance behavior.

Two modules are extracted:

- `src/runtime/instruction-loader.js` — immutable instruction pin, instruction manifest, jsDelivr fetch, aggregate loading/progress.
- `src/runtime/anthropic-client.js` — Anthropic request construction, retry/backoff, continuation passes, chat calls, and API-key fetch interception.

## Boundary

This PR moves side-effectful runtime I/O. It does **not** move:

- Director compression/extraction orchestration;
- synthesis authority enforcement;
- synthesis brief storage;
- ledger assembly;
- `parseDashboard`;
- Google Doc loading;
- React state or refs.

The application continues to call the same runtime function names and argument shapes. Optional injected `fetch` and sleep implementations exist only to make the boundary deterministic under test; normal browser calls use the current `globalThis.fetch` at invocation time.

## Compatibility invariants

The following are fixed by regression tests:

- instruction commit remains `56ad2305ca62ed7409c3e89723f9bd1ca914d935`;
- all 21 instruction files remain in the manifest;
- instruction text is trimmed and failed fetches return `null`;
- aggregate instruction loading reports progress and separates loaded/failed entries;
- synthesis model remains `claude-sonnet-4-6`;
- request token limits, temperature, web-search tool declaration, and message structure remain unchanged;
- synthesis retries remain three total attempts with 3s then 8s backoff;
- automatic continuation remains capped at two passes;
- definitive API-key / 400-style errors do not retry;
- the API-key interceptor remains one-shot and Anthropic-domain scoped.

## Next slice

Compression/extraction orchestration is deliberately deferred to the next orchestration PR so API transport and governance-record derivation are not moved in the same diff.
