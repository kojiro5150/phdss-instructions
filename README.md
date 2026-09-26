# PHDSS — Public Health Decision Stewardship System

PHDSS is designed to make the decision space larger and more legible before humans decide.

It is a structured AI reasoning system for complex institutional decisions. It does not make decisions. It produces a governance record: a structured, auditable account of what was analysed, what was challenged, what is uncertain, and what remains unresolved — so that the human governance body deciding can do so with the full landscape visible rather than a compressed summary.

## How it works

A decision question is submitted to a Board of specialist Directors. Each Director analyses the question from a distinct domain — Safety, Equity, Systems & Dynamics, Measurement, Ethics, Policy, Behaviour, Economics, Lived Experience, Digital, Sovereignty, Capacity, Innovation. Directors work independently and do not synthesise each other's outputs.

Their outputs pass through a synthesis pipeline:

```text
Decision question + evidence
  ↓
Specialist Directors (domain analysis)
  ↓
Surface Map → Epistemic Audit → Cross-Domain Tension Analysis
  ↓
Reality Anchor → Adversarial Probe → Stress Test
  ↓
Chair (deliberative interface — organises and exposes)
  ↓
Comparator (signal tally and monitoring triggers)
  ↓
Decision Ledger (structured governance record)
  ↓
Human governance body → Decision
```

The Chair is not a decision layer. It surfaces what the reasoning system produced, preserves material disagreement and uncertainty, and makes the record legible for human judgment. It does not resolve, rank, or recommend.

## Authority chain

```text
AI: enlarge + interrogate
Code: constrain + validate + preserve
Chair: organise + expose
Human: judge + decide
```

Institutional authority stays outside the system. PHDSS does not confer legitimacy or substitute for the governance body's decision.

## Analysis modes

| Mode | Directors | Use |
|---|---:|---|
| CORE | 5 (adaptive) | Time- or cost-constrained; targeted analysis |
| FULL | 13 | Complete multi-domain coverage |
| CHAIR SPECIFIED | Custom | Defined selection for a known decision type |

CORE invokes fewer Directors than FULL and therefore reduces Director-stage model/API spend. Exact total cost depends on synthesis, compression, retries, and enabled features. Partial coverage is labelled explicitly; it does not appear equivalent to FULL.

## Getting started

### Prerequisites

- Node.js 20+
- An Anthropic API key with sufficient credits for your intended mode

### Install

```bash
git clone https://github.com/kojiro5150/phdss-instructions.git
cd phdss-instructions
npm install
```

### Validate

```bash
npm run validate
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:5173`. Enter your Anthropic API key at the unlock gate before running a session.

### Deploy

```bash
npm run build
# deploy dist/ to your hosting provider
```

## Key documents

| Document | Purpose |
|---|---|
| `docs/NORTH_STAR.md` | Constitutional invariants and authority model |
| `docs/ORIENTATION_CONTRACT.md` | Normative source for all orientation UI copy |
| `docs/DECISION_LEDGER_SCHEMA.md` | Ledger schema and field definitions |
| `docs/GOVERNANCE_COMPRESSION_BOUNDARY.md` | What compression may and may not do |
| `docs/V2_RECOVERY_MAP.md` | Architecture repair history and rationale |

`docs/ORIENTATION_CONTRACT.md` is the normative source of truth for all PHDSS orientation and explanatory UI copy. JSX and other presentation surfaces implement this contract and must not redefine it independently.

## Calibration

The constitutional calibration run `DR-20260926-204324-a2e644` is preserved at `tests/fixtures/calibration/`. It shows the architecture expanding the decision space, preserving human adjudication, detecting provenance corruption, failing visibly, and recovering within its own boundaries.

To replay a single stage against the frozen fixture:

```bash
ANTHROPIC_API_KEY='...' npm run replay:stage -- \
  --fixture tests/fixtures/calibration/DR-20260926-204324-a2e644 \
  --from comparator \
  --execute
```

## Governance Engineering

PHDSS is an instance of Governance Engineering — the systematic design of institutional reasoning architecture. The underlying theory is documented in the Behavioural Orchestration Architecture (BOA) and Governance Engineering working papers on SSRN.

The core claim: a governance system whose failures are legible is categorically different from one whose failures are invisible.
