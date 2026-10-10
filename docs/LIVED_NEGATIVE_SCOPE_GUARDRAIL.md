# Lived Experience negative-scope guardrail — warning-only v1

This is a small development safeguard for **known surface forms**, not the deferred V3 research-grade claim/warrant architecture.

- **Instructions:** V2 candidate Lived instructions remain unchanged. No change to any other Director instruction.
- **Behaviour:** Scan Lived Director text after generation; display an advisory amber review flag in the existing Director card. Preserve all original output and export bytes. No rewrite or enforced hold.
- **Scope:** Explicit temporal non-occurrence, consultation exclusion and non-incorporation constructions, including headings; limited consistency indicator when the Participation & Representation Status section itself expresses uncertainty.
- **Meaning:** A flag identifies wording associated with previous unsupported-absence errors. It **does not confirm** a Category B failure, determine actual participation, establish whether a source warrants the assertion, or adjudicate A–D.
- **No flags:** Means only that no *implemented pattern* matched. It does not mean PASS, verified or safe to rely upon.
- **Limits:** No demonstrated sensitivity to novel paraphrases, no prospective failure-rate bound, no comprehensive semantic or source verification. A limited parser can miss section boundaries, modality and contextual qualifications. False positives and false negatives are possible.
- **Tests:** Synthetic development fixtures plus post-hoc regression lines transcribed from frozen V2-01, V2-04 and V2-05. These added fixtures are development copies, **not** frozen source artefacts, full ten-output replay, or independent human gold labels. The first full historical replay of guardrail v1.0.0 returned zero flags for all ten V2 outputs, including the three provisional Category B failures; this repair targets the observed line-wide suppression misses. Re-run against SHA-verified frozen originals before claiming historical regression results.
- **Category boundaries:** Frozen A–D rubric is unchanged. The separate whole-pack endorsement widening example is an A-adjacent control, not a Category B detector success. V2-08 remains disputed.
- **Rollout:** Warning-only development PR. Review and approval required before merge or deployment.

Run `npm run verify:lived-negative-scope`, then `npm run validate`. Production builds require a clean, committed checkout with verified source provenance.

- **Suppression repair:** Restrict conditional/record-attribution suppression to the containing clause rather than the entire line. This is still a heuristic, not grammatical or source-warrant verification; an unqualified phrase in an uncertainty discussion may receive a review flag.
