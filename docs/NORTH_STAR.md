# PHDSS North Star

## The canonical sentence

PHDSS is designed to make the decision space larger and more legible before humans decide — surfacing assumptions, tensions, missing evidence, affected perspectives, operational constraints and plausible alternatives that may otherwise remain hidden.

Everything in the architecture — every Director, every synthesis layer, every schema constraint, every authority boundary — should be judged against this sentence. If a design choice contracts the decision space, manufactures certainty, or relocates institutional authority into the system, it violates the North Star.

## Three constitutional invariants

These govern all architecture and implementation decisions. They are not guidelines; they are constraints.

**1. Decision-space expansion**  
Later layers must not prematurely collapse alternatives, uncertainty, tensions, or affected perspectives. A synthesis layer that resolves a tension the Directors identified as unresolved is making the decision space smaller, not larger.

**2. Non-substitution**  
AI may improve human judgment but must not silently substitute its own judgment for the authorised human one. The system may surface, frame, preserve, and expose. It may not select, resolve, foreclose, or rank.

**3. Epistemic provenance**  
Synthesis may organise evidence but cannot strengthen its evidentiary status through repetition, convergence, or compression. If something is unverified, it remains unverified. Director convergence is not corroboration. Compression is not confirmation.

## The authority chain

```text
AI: enlarge + interrogate
  ↓
Code: constrain + validate + preserve
  ↓
Chair: organise + expose
  ↓
Human: judge + decide
```

The Chair is a deliberative interface, not a judgment layer. Removing the Chair output must not alter any substantive finding, signal, evidentiary state, condition, or disposition produced upstream — only its legibility.

Analytical authority terminates at the act of adjudication.

## The self-demonstration principle

PHDSS found a contradiction in its own architecture: the Chair instruction asked a stochastic model to form a higher-order judgment, while the authority boundary correctly rejected that act. The response was not to weaken the detector, but to change the architecture and add a falsifiable invariant. This is the calibration cycle Governance Engineering is designed to support.

The system is expected to identify and correct its own structural contradictions. That capacity is itself a governance property.

## Vocabulary

Legacy terms from earlier BOA and PHDSS documentation — "recommendation," "determination," "Chair Recommendation" — described a governance position within the reasoning record. They did not confer institutional decision authority. They are retired in v2 where they can be confused with human decision authority. This is a vocabulary correction, not a change to the underlying architecture, which was already human-authority preserving.

## What this is not

PHDSS does not make decisions. It does not confer institutional legitimacy. It does not replace legal, clinical, or regulatory advice. The Decision Ledger is a structured governance record, not an authorisation to act.
