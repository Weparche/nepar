export const CAMPAIGN_MODE_ORDER = ["food", "home", "sound", "baby"];

export const CAMPAIGN_TOTAL_STEPS = 20;

export const CAMPAIGN_LEVEL_ONE_START_POSITION = {
  left: "14%",
  top: "88%",
};

export const campaignSteps = Array.from({ length: 5 }, (_, levelIndex) =>
  CAMPAIGN_MODE_ORDER.map((modeId, modeIndex) => {
    const stepIndex = levelIndex * CAMPAIGN_MODE_ORDER.length + modeIndex;
    return {
      modeId,
      levelId: levelIndex + 1,
      stepNumber: stepIndex + 1,
      totalSteps: CAMPAIGN_TOTAL_STEPS,
    };
  }),
).flat();

const CAMPAIGN_STOP_TEMPLATES = [
  {
    modeId: "food",
    label: "Nahrani životinju",
    testId: "campaign-stop-food",
    position: { left: "51%", top: "87%" },
  },
  {
    modeId: "home",
    label: "Pronađi dom",
    testId: "campaign-stop-home",
    position: { left: "30%", top: "55%" },
  },
  {
    modeId: "sound",
    label: "Pogodi zvuk",
    testId: "campaign-stop-sound",
    position: { left: "68%", top: "36%" },
  },
  {
    modeId: "baby",
    label: "Mama i beba",
    testId: "campaign-stop-baby",
    position: { left: "36%", top: "19%" },
  },
];

export function getCampaignStopsForLevel(levelId) {
  const numericLevel = Number(levelId);
  if (!Number.isFinite(numericLevel)) return [];

  return CAMPAIGN_STOP_TEMPLATES.map((stop, modeIndex) => ({
    ...stop,
    stepIndex: (numericLevel - 1) * CAMPAIGN_MODE_ORDER.length + modeIndex,
    levelId: numericLevel,
  }));
}

export const campaignLevelOneStops = getCampaignStopsForLevel(1);

const CAMPAIGN_CAR_POSITIONS = [
  { left: "51%", top: "94%" },
  { left: "46%", top: "88%" },
  { left: "53%", top: "82%" },
  { left: "48%", top: "76%" },
  { left: "44%", top: "70%" },
  { left: "50%", top: "64%" },
  { left: "56%", top: "58%" },
  { left: "51%", top: "52%" },
  { left: "45%", top: "47%" },
  { left: "49%", top: "41%" },
  { left: "55%", top: "36%" },
  { left: "50%", top: "31%" },
  { left: "45%", top: "27%" },
  { left: "50%", top: "22%" },
  { left: "55%", top: "18%" },
  { left: "50%", top: "14%" },
  { left: "44%", top: "12%" },
  { left: "49%", top: "10%" },
  { left: "56%", top: "9%" },
  { left: "62%", top: "8%" },
];

export function clampCampaignStepIndex(stepIndex) {
  const numericStep = Number(stepIndex);
  if (!Number.isFinite(numericStep)) return 0;
  return Math.max(0, Math.min(CAMPAIGN_TOTAL_STEPS - 1, Math.trunc(numericStep)));
}

export function getCampaignCarPosition(stepIndex) {
  return CAMPAIGN_CAR_POSITIONS[clampCampaignStepIndex(stepIndex)];
}

export function getCampaignStop(stepIndex) {
  const numericStep = Number(stepIndex);
  if (!Number.isFinite(numericStep) || numericStep < 0 || numericStep >= CAMPAIGN_TOTAL_STEPS) {
    return null;
  }

  const levelId = Math.floor(numericStep / CAMPAIGN_MODE_ORDER.length) + 1;
  return getCampaignStopsForLevel(levelId).find((stop) => stop.stepIndex === numericStep) ?? null;
}

export function getCampaignLevelOneStop(stepIndex) {
  return getCampaignStop(stepIndex);
}

export function isCampaignLevelOneStep(stepIndex) {
  const numericStep = Number(stepIndex);
  return Number.isFinite(numericStep) && numericStep >= 0 && numericStep <= 3;
}
