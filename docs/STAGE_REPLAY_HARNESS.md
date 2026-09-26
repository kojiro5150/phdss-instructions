# Stage Replay Harness

The replay harness re-enters the governance pipeline from a named downstream stage using frozen upstream artefacts. Its first purpose is to retest Chair and Comparator contracts without regenerating the 13 stochastic Director analyses and earlier synthesis stages.

## Safety and cost discipline

Replay is a dry run by default. **No Anthropic API call is made unless `--execute` is supplied.**

Dry-run:

```bash
npm run replay:stage -- \
  --fixture tests/fixtures/calibration/DR-20260926-204324-a2e644 \
  --from comparator
```

Execute Comparator only:

```bash
ANTHROPIC_API_KEY='...' npm run replay:stage -- \
  --fixture tests/fixtures/calibration/DR-20260926-204324-a2e644 \
  --from comparator \
  --execute
```

Execute Chair, then Comparator:

```bash
ANTHROPIC_API_KEY='...' npm run replay:stage -- \
  --fixture tests/fixtures/calibration/DR-20260926-204324-a2e644 \
  --from chair \
  --execute
```

Do not commit API keys. Shell history and local environment handling remain the operator's responsibility.

## Replay semantics

- `--from comparator` freezes all upstream outputs including the Chair and executes Comparator only.
- `--from chair` freezes Director, Surface, META, Reality, Probe and Stress outputs, executes Chair, then executes Comparator with the newly generated Chair output.
- `--instruction-pin <sha>` may be supplied as an assertion; it must equal the repository's current `INSTRUCTION_COMMIT`.
- The source fixture instruction pin is historical provenance. It may differ from the current replay pin after later instruction repairs.

The harness uses the same Chair and Comparator prompt builders, authority enforcement, Chair repair, Comparator schema validation and signal counts as the production recovery pipeline. It intentionally does not regenerate upstream stages.

## Output

Execution writes to `.replay/<decision-id>/<stage>-<timestamp>/` by default:

- `replay-manifest.json`
- `authority-repair-events.json`
- `chair.md` when Chair is replayed
- `comparator.raw.txt` and `comparator.json` when Comparator succeeds

The `.replay/` directory is ignored by Git.

Transport, billing, authority and schema failures remain explicit in the replay manifest and produce a non-zero exit status.

## Current scope

Supported entry stages are deliberately narrow: `chair` and `comparator`. Extending replay farther upstream should be a separate architectural change with explicit dependency contracts rather than a generic "start anywhere" switch.
