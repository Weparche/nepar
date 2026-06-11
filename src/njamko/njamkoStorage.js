const PLUS_KEY = "njamkoPlusUnlocked";
const CAMPAIGN_COMPLETED_STEP_KEY = "njamkoCampaignCompletedStep";
const MIN_CAMPAIGN_STEP = -1;
const MAX_CAMPAIGN_STEP = 19;

export function isPlusUnlocked() {
  try {
    return localStorage.getItem(PLUS_KEY) === "true";
  } catch {
    return false;
  }
}

export function unlockPlus() {
  try {
    localStorage.setItem(PLUS_KEY, "true");
  } catch {
    /* ignore */
  }
}

export function resetPlusForTesting() {
  try {
    localStorage.removeItem(PLUS_KEY);
  } catch {
    /* ignore */
  }
}

function clampCompletedStep(stepIndex) {
  const numericStep = Number(stepIndex);
  if (!Number.isFinite(numericStep)) return MIN_CAMPAIGN_STEP;
  return Math.max(MIN_CAMPAIGN_STEP, Math.min(MAX_CAMPAIGN_STEP, Math.trunc(numericStep)));
}

export function getCampaignCompletedStep() {
  try {
    const storedStep = localStorage.getItem(CAMPAIGN_COMPLETED_STEP_KEY);
    if (storedStep === null) return MIN_CAMPAIGN_STEP;
    return clampCompletedStep(storedStep);
  } catch {
    return MIN_CAMPAIGN_STEP;
  }
}

export function setCampaignCompletedStep(stepIndex) {
  try {
    const currentStep = getCampaignCompletedStep();
    const nextStep = Math.max(currentStep, clampCompletedStep(stepIndex));
    localStorage.setItem(CAMPAIGN_COMPLETED_STEP_KEY, String(nextStep));
  } catch {
    /* ignore */
  }
}

export function resetCampaignProgress() {
  try {
    localStorage.removeItem(CAMPAIGN_COMPLETED_STEP_KEY);
  } catch {
    /* ignore */
  }
}

export function canPlayLevel(level) {
  if (level.isFree) return true;
  return isPlusUnlocked();
}

export function getLevelStatus(level) {
  if (level.isFree) return "free";
  if (isPlusUnlocked()) return "unlocked";
  return "locked";
}
