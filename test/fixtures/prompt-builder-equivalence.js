// Prompt-builder regression fingerprints. Most values preserve the extraction baseline; intentional contract changes update only the affected prompt fingerprints.
// The test recomputes these over the extracted module using the same representative inputs.
// FNV-1a + byte length is used as a compact exact-output regression fingerprint.

export const promptBuilderExpected = Object.freeze([
  {label:"buildEmbeddedDocs",length:246,fnv1a:"44ae9df3"},
  {label:"buildSessionEvidence",length:221,fnv1a:"51cd5a5f"},
  {label:"buildWebNoteTrusted",length:376,fnv1a:"fd22f00e"},
  {label:"buildWebNotePublic",length:177,fnv1a:"afcf6f68"},
  {label:"ctxBlocks",length:165,fnv1a:"af25eb46"},
  {label:"buildCoveragePreambleCore",length:916,fnv1a:"c79e4f25"},
  {label:"outputCalibrationCore",length:1041,fnv1a:"542c0d7f"},
  {label:"directorSystemInstruction",length:2751,fnv1a:"b72819f6"},
  {label:"metaSystem",length:1770,fnv1a:"15532a2e"},
  {label:"surfaceMapperSystem",length:1355,fnv1a:"cefb0559"},
  {label:"realityAnchorSystem",length:930,fnv1a:"d7e11894"},
  {label:"stressSystem",length:1772,fnv1a:"9eb92bc3"},
  {label:"chairSystemPartial",length:2383,fnv1a:"c51e7a18"},
  {label:"chairDialogueSystem",length:910,fnv1a:"1ff31a73"},
  {label:"epistemicAuditorSystem",length:926,fnv1a:"1fd7951c"},
  {label:"adversarialProbeSystem",length:969,fnv1a:"8ee64cd4"},
  {label:"directorBriefSystem",length:1509,fnv1a:"5d5ba77f"},
  {label:"lensComparatorSystem",length:1862,fnv1a:"10a8f305"},
  {label:"comparatorJsonSystem",length:2452,fnv1a:"e7f00f51"},
]);

export const promptBuilderFixture = Object.freeze({
  entries:[
    {label:"Ref One",content:"Alpha evidence."},
    {label:"",content:"Beta evidence."},
  ],
  session:[
    {label:"Session One",content:"Gamma evidence.",type:"paste"},
  ],
  ctx:{
    decisionSignal:"Synthetic signal",
    orgContext:"Synthetic context",
    constraints:["Constraint A"],
    evidenceLinks:["https://example.test/evidence"],
  },
  instructionValues:{
    systems:"SYSTEMS BASE",
    meta:"META BASE",
    surfacemap:"SURFACE BASE",
    reality:"REALITY BASE",
    stress:"STRESS BASE",
    chair:"CHAIR BASE",
    epistemic:"EPI BASE",
    probe:"PROBE BASE",
    comparator:"COMPARATOR BASE",
  },
  activeIds:["systems","equity","lived","digital","safety"],
});
