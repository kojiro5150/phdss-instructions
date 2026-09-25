export const DIRECTORS = [
  { id:"systems",        label:"Systems & Dynamics",                 icon:"*", color:"#06B6D4", desc:"Complex system behaviour, feedback loops, unintended consequences" },
  { id:"economics",      label:"Health Economics",                   icon:"$", color:"#FFB347", desc:"Cost-effectiveness, resource allocation, economic equity, incentive alignment" },
  { id:"behaviour",      label:"Behaviour & Implementation",         icon:"@", color:"#FF6B9D", desc:"Adoption engineering, behavioural failure modes, implementation realism, COM-B diagnosis" },
  { id:"policy",         label:"Policy & Power",                     icon:"#", color:"#A78BFA", desc:"Political feasibility, stakeholder power, regulatory landscape, coalition dynamics" },
  { id:"equity",         label:"Equity & Human Rights",              icon:"=", color:"#34D399", desc:"Global health equity, human rights and dignity - rights-based governance" },
  { id:"lived",          label:"Lived Experience",                   icon:"o", color:"#F87171", desc:"Lived and living expertise, community legitimacy, trust and agency" },
  { id:"digital",        label:"Digital & AI Governance",            icon:"~", color:"#60A5FA", desc:"AI safety, data governance, SaMD classification, algorithmic bias" },
  { id:"ethics",         label:"Ethics & Influence Risk",            icon:"^", color:"#FBBF24", desc:"Ethical influence, integrity, manipulation risk, foreign interference" },
  { id:"sovereignty",    label:"Sovereignty & Containment",          icon:"+", color:"#F472B6", desc:"Decision integrity, affective containment, reflective capacity" },
  { id:"safety",         label:"Safety, Quality & Harm",             icon:"!", color:"#EF4444", desc:"Clinical safety, harm pathways, regulatory obligations, quality systems" },
  { id:"physics",        label:"Capacity & Constraints",             icon:"%", color:"#A3E635", desc:"Physics-based constraints, entropy, scaling limits, finite capacity" },
  { id:"measurement",    label:"Measurement & Evidence Integrity",   icon:"&", color:"#C084FC", desc:"Theory of change, evaluation design, indicator governance, Goodhart risks" },
  { id:"innovation",     label:"Innovation & Improvement",           icon:"/", color:"#22D3EE", desc:"Improvement pathways, learning architecture, responsible experimentation" },
];

export const SYNTHESIS_ROLES = [
  { id:"surfacemap",  label:"Decision Surface Map",          icon:"⊕", color:"#0891B2" },
  { id:"epistemic",   label:"Epistemic Confidence Audit",    icon:"E", color:"#DC2626" },
  { id:"meta",        label:"Cross-Domain Tension Analysis", icon:"M", color:"#A78BFA" },
  { id:"reality",     label:"Reality Anchor",                icon:"A", color:"#0369A1" },
  { id:"probe",       label:"Adversarial Bias Probe",        icon:"P", color:"#7C3AED" },
  { id:"stress",      label:"Decision Stress Test",          icon:"S", color:"#F87171" },
  { id:"chair",       label:"Decision Brief",                icon:"C", color:"#0369A1" },
  { id:"comparator",  label:"Governance Comparator",         icon:"G", color:"#64748B" },
];

export const ALL_ROLES = DIRECTORS.concat(SYNTHESIS_ROLES);

export const STAGE_META = [
  {id:"directors",  short:"Directors"},
  {id:"surfacemap", short:"Surface Map"},
  {id:"epistemic",  short:"Epistemic"},
  {id:"meta",       short:"META"},
  {id:"reality",    short:"Reality"},
  {id:"probe",      short:"Probe"},
  {id:"stress",     short:"Stress"},
  {id:"chair",      short:"Chair"},
];

export const SUGGESTED_PUSHBACKS = [
  "Which unresolved tension is most decision-consequential, and why?",
  "What evidence would materially change the decision space?",
  "If we phased the rollout over 3 years, which risks reduce and which remain?",
  "The Equity Director said HALT but Economics said PROCEED — help me understand the tension without resolving it for me.",
  "Which assumptions are doing the most work in the current analysis?",
  "Who bears the most risk under each available pathway, and what safeguards are non-negotiable?",
];
