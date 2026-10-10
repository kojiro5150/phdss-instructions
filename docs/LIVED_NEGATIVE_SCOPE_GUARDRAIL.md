# Lived Experience negative-scope guardrail — warning-only v1

This is a small development safeguard for **known surface forms**, not the deferred V3 research-grade claim/warrant architecture.

- **Instructions:** V2 candidate Lived instructions remain unchanged. No change to any other Director instruction.
- **Behaviour:** Scan Lived Director text after generation; display an advisory amber review flag in the existing Director card. Preserve all original output and export bytes. No rewrite or enforced hold.
- **Scope:** Explicit temporal non-occurrence, consultation exclusion and non-incorporation constructions, including headings; limited consistency indicator when the Participation & Representation Status section itself expresses uncertainty.
- **Meaning:** A flag identifies wording associated with previous unsupported-absence errors. It **does not confirm** a Category B failure, determine actual participation, establish whether a source warrants the assertion, or adjudicate A–D.
- **No flags:** Means only that no *implemented pattern* matched. It does not mean PASS, verified or safe to rely upon.
- **Limits:** No demonstrated sensitivity to novel paraphrases, no prospective failure-rate bound, no comprehensive semantic or source verification. A limited parser can miss section boundaries, modality and contextual qualifications. False positives and false negatives are possible.
- **Tests:** Synthetic development fixtures plus post-hoc regression lines transcribed from frozen V2-01, V2-04 and V2-05. These added fixtures are development copies, **not** frozen source artefacts, full ten-output replay, or independent human gold labels. The first full historical replay of guardrail v1.0.0 returned zero flags for all ten V2 outputs, including the three provisional Category B failures; this repair targets the observed line-wide suppression misses. The subsequent retrospective replay is documented below with explicit source and execution limitations.
- **Category boundaries:** Frozen A–D rubric is unchanged. The separate whole-pack endorsement widening example is an A-adjacent control, not a Category B detector success. V2-08 remains disputed.
- **Rollout:** Warning-only development PR. Review and approval required before merge or deployment.

Run `npm run verify:lived-negative-scope`, then `npm run validate`. Production builds require a clean, committed checkout with verified source provenance.

- **Suppression repair:** Restrict conditional/record-attribution suppression to the containing clause rather than the entire line. This is still a heuristic, not grammatical or source-warrant verification; an unqualified phrase in an uncertainty discussion may receive a review flag.


## Historical V2 replay record — 2026-10-10, PR #69

**Status:** retrospective, exploratory developer evidence; **not** independent human-gold evaluation or a prospective accuracy estimate. This section records the ten full Markdown outputs uploaded for replay, rather than modifying or reclassifying the frozen V2 tranche. The accompanying advisory-request JSON sidecars identified instruction commit `94c5851146d849957af9610935a85f674c6ab05d` and deployment commit `1ab38db9dbed19ed07ed978ba5eed91a487e0348`. The output SHA-256 values below identify the uploaded Markdown bytes (filenames had a local `(1)` suffix); this document does **not** assert independent identity verification against a separately held frozen manifest.

**Detector:** PR #69 head `98cb44b658ac6cf3f1d8033a340350aa8a61f67f`, merged into `experiment/ns-claim-scope-v2` by `66b4d8db2e50d26470cdf6ffc4b6ced413634ddd`. The replay used an independent local transcription of that detector's source, **not** an imported module executed from a checked-out commit. Scanner version string: `1.0.0` (unchanged by the repair). Reproducibility therefore requires checking transcription parity before interpreting the result as exact-code regression evidence.

| Case | Decision ID | Uploaded Markdown SHA-256 | Advisory warning matches |
|---|---|---|---|
| V2-01 | `DR-20261010-183322-39db5f` | `88b02482ba6efcbc745a47c24c01cc67878388536968136fa564e4e534ed773d` | NS_TEMPORAL_ABSENCE L68 |
| V2-02 | `DR-20261010-184143-b6d085` | `66154fcc793f76fd408cc18b20bbf1675f584b00153da5033b9cb4c94d690219` | None |
| V2-03 | `DR-20261010-184444-3bf609` | `01a3443308d0f464baebb551c06859e8f48a43193ebc6be57214240cf859a801` | None |
| V2-04 | `DR-20261010-184727-dbb135` | `7dd4967097bcda205114fb27292b1efae31f6ec717d34b5a8dbf150ff44c5982` | NS_EXCLUSION L19 |
| V2-05 | `DR-20261010-185035-3b3d8d` | `3b979dedafc32ffa26a60a112202eccbbd51ada35bf8c1957e9238bb0702fe78` | NS_UNINCORPORATED L37, L43 |
| V2-06 | `DR-20261010-185257-8191c0` | `26b5cb89caec55cdb477b40cfba0a51ce4f7f4037c9e89e99af65be331e50af2` | None |
| V2-07 | `DR-20261010-185437-7e4db3` | `75659c9aa88002c207980078143d85982acc130b2e2aa0c51efb1a31b27a6a5f` | None |
| V2-08 | `DR-20261010-185737-c18ba3` | `5bcb8c43f30f2acbc216d4e4d77cc293266596912ad188ad7a68e1e93f3dc9c0` | None |
| V2-09 | `DR-20261010-190219-185c15` | `1a1500837dfb15cdcdf16aebf3c7fd06840fa610cbe95fcb6686c057bd7817d3` | None |
| V2-10 | `DR-20261010-190346-4d166d` | `ca1fc6cecc2e5c0ed052e5a4fa8c36eb0f9c4a6ad48dadb4ec3cace41ec4dc24` | None |

**Observed pattern outcomes:** 3/3 previously *provisionally* identified Category B cases (V2-01, V2-04, V2-05) received review warnings; 0/7 other outputs received a warning. Four matched spans occurred across three outputs. These figures are **not** validated sensitivity, specificity, precision, false-positive rate, or proof that the other seven outputs are PASS. The seven include V2-08, whose earlier adjudication was disputed. No flags means only no implemented surface pattern matched. A flag does not establish unsupportedness; for example, V2-04 has a documented screen-reader access failure, while the scope of the model's subsequent exclusion claim requires separate review.

**Comparison:** the earlier v1.0.0 full-document historical replay produced 0/10 warnings, including 0/3 provisional B cases. PR #69 changed clause-local suppression and the treatment of `could not` (documented inability versus hypothetical modality); post-hoc transcribed regression fixtures and local developer validation/build passed. This is a repair demonstrated on known historical constructions, **not** a blind holdout or a validated generalisation result.

**Governance boundary and next validation:** no frozen source outputs, rubric, V2 instruction candidate, `main`, or production deployment are changed by this record. Human adjudication of each flagged span against the supplied evidence remains outstanding. For a stronger reproducibility claim, execute the exact merged module on verified source bytes, preserve a machine-readable per-span replay artefact outside the frozen tranche, and independently assess new unseen cases before proposing promotion. The detector remains warning-only, without rewriting, blocking, or conferring authority.
