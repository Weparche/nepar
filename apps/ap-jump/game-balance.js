// Keep Dino-style progression, but make the early and mid game fairer.
difficultyTier = function () {
  if (score >= 1050) return 5;
  if (score >= 760) return 4;
  if (score >= 500) return 3;
  if (score >= 280) return 2;
  if (score >= 110) return 1;
  return 0;
};

targetSpeed = function () {
  const tierBoost = difficultyTier() * 22;
  return Math.min(970, BASE_SPEED + score * .82 + tierBoost);
};

spawnWindow = function () {
  const tier = difficultyTier();
  const min = Math.max(.62, 1.16 - tier * .07 - (speed - BASE_SPEED) / 3400);
  const jitter = Math.max(.26, .62 - tier * .045);
  return min + Math.random() * jitter;
};

spawnObstaclePattern = function () {
  const tier = difficultyTier();
  const first = randomObstacle(tier);
  pushObstacle(first, W + 32);

  const comboChance =
    tier >= 5 ? .20 :
    tier >= 4 ? .14 :
    tier >= 3 ? .08 :
    tier >= 2 ? .03 : 0;

  if (Math.random() < comboChance) {
    const secondPool = eligibleObstacles(Math.max(0, tier - 1))
      .filter(item => item.kind !== 'skip' && item.h <= 60);
    const second = secondPool[Math.floor(Math.random() * secondPool.length)];
    const comboGap = clamp(205 + Math.random() * 75, 195, 280);
    pushObstacle(second, W + 32 + first.w + comboGap);
  }

  nextSpawn = spawnWindow();
};
