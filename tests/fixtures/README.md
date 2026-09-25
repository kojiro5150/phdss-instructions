# PHDSS v2 Fixtures

This directory implements the fixture architecture defined in `docs/FIXTURE_SCHEMA.md`.

## Tracked fixture classes

### `public/`

Contains non-sensitive structural observations derived from reference PHDSS runs.

Public fixtures may record:

- mode and Director coverage;
- active/omitted Director identifiers;
- signal distribution;
- synthesis stages;
- semantic score/verdict classes;
- record section presence;
- export expectations;
- ledger field presence;
- abstract known-defect flags.

They must not contain Governance-in-Confidence prose, original decision text, organisational context, or copied source conditions.

### `synthetic/`

Contains invented text used to test semantic contracts, including the distinction between legitimate constraint reporting and prohibited adjudication. The Chair non-substitution fixture keeps epistemic promotion, tension resolution, and condition invention as separate diagnostic cases.

Synthetic examples must not copy or lightly paraphrase confidential source artefacts.

## Untracked fixture class

### `private/`

Reserved for local evidence manifests that map public fixture observations back to exact source artefacts and cryptographic hashes.

This directory is gitignored and must never be required by public CI.

## Governing contracts

- `docs/AUTHORITY_TAXONOMY.md`
- `docs/FIXTURE_SCHEMA.md`

A known defect in a reference run is evidence of the calibration history. It is not a parity requirement.
