import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CAMPAIGN_LEVEL_ONE_START_POSITION,
  CAMPAIGN_MODE_ORDER,
  CAMPAIGN_TOTAL_STEPS,
  campaignSteps,
  getCampaignCarPosition,
  getCampaignStop,
  getCampaignStopsForLevel,
} from "./campaign.js";

const CAR_ANIMATION_SECONDS = 3;

const LEVEL_ONE_DRIVE_PATHS = {
  0: [
    CAMPAIGN_LEVEL_ONE_START_POSITION,
    { left: "18%", top: "89%" },
    { left: "23%", top: "90%" },
    { left: "28%", top: "90%" },
    { left: "33%", top: "90%" },
    { left: "38%", top: "89.5%" },
    { left: "43%", top: "89%" },
    { left: "47%", top: "88.4%" },
    { left: "49.5%", top: "87.7%" },
    { left: "51%", top: "87%" },
  ],
  1: [
    { left: "51%", top: "87%" },
    { left: "50%", top: "82%" },
    { left: "48%", top: "77%" },
    { left: "45%", top: "72%" },
    { left: "42%", top: "68%" },
    { left: "39%", top: "64%" },
    { left: "36%", top: "61%" },
    { left: "33.5%", top: "58.5%" },
    { left: "31.5%", top: "56.5%" },
    { left: "30%", top: "55%" },
  ],
  2: [
    { left: "30%", top: "55%" },
    { left: "34%", top: "53%" },
    { left: "38%", top: "50.5%" },
    { left: "43%", top: "48%" },
    { left: "48%", top: "46%" },
    { left: "53%", top: "44%" },
    { left: "58%", top: "41.8%" },
    { left: "62%", top: "39.8%" },
    { left: "65.5%", top: "37.8%" },
    { left: "68%", top: "36%" },
  ],
  3: [
    { left: "68%", top: "36%" },
    { left: "65%", top: "34.2%" },
    { left: "61.5%", top: "32.2%" },
    { left: "57.5%", top: "30.2%" },
    { left: "53.5%", top: "28.1%" },
    { left: "49.5%", top: "25.8%" },
    { left: "45.5%", top: "23.5%" },
    { left: "41.8%", top: "21.5%" },
    { left: "38.7%", top: "20%" },
    { left: "36%", top: "19%" },
  ],
};

const LEVEL_ONE_DRIVE_ROTATIONS = {
  0: [-4, -2, 0, 1, 1, 0, -1, -2, -4, -6],
  1: [-8, -12, -16, -20, -24, -24, -20, -17, -14, -12],
  2: [10, 12, 14, 15, 13, 10, 8, 6, 5, 4],
  3: [-10, -12, -14, -15, -16, -17, -18, -17, -15, -12],
};

function positionToPoint(position, stageSize) {
  const left = Number.parseFloat(position.left) / 100;
  const top = Number.parseFloat(position.top) / 100;
  return {
    x: stageSize.width * left,
    y: stageSize.height * top,
  };
}

function getCampaignLevelForStep(stepIndex) {
  return Math.floor(stepIndex / CAMPAIGN_MODE_ORDER.length) + 1;
}

function getCampaignModeIndex(stepIndex) {
  return ((stepIndex % CAMPAIGN_MODE_ORDER.length) + CAMPAIGN_MODE_ORDER.length) % CAMPAIGN_MODE_ORDER.length;
}

function getCurrentMapPosition(completedStepIndex, activeStepIndex) {
  if (completedStepIndex < 0) return CAMPAIGN_LEVEL_ONE_START_POSITION;

  const completedLevel = getCampaignLevelForStep(completedStepIndex);
  const activeLevel = getCampaignLevelForStep(activeStepIndex);
  if (completedLevel !== activeLevel) return CAMPAIGN_LEVEL_ONE_START_POSITION;

  return getCampaignStop(completedStepIndex)?.position ?? CAMPAIGN_LEVEL_ONE_START_POSITION;
}

function getDrivePathPoints(targetStepIndex, startPosition, targetPosition, stageSize) {
  const path = LEVEL_ONE_DRIVE_PATHS[getCampaignModeIndex(targetStepIndex)] ?? [
    startPosition,
    targetPosition,
  ];
  const normalizedPath = [
    startPosition,
    ...path.slice(1, -1),
    targetPosition,
  ];
  return normalizedPath.map((position) => positionToPoint(position, stageSize));
}

function getDriveRotations(targetStepIndex, pointCount) {
  const rotations = LEVEL_ONE_DRIVE_ROTATIONS[getCampaignModeIndex(targetStepIndex)] ?? [0, 0];
  if (rotations.length === pointCount) return rotations;
  return Array.from({ length: pointCount }, (_, index) => rotations[index] ?? rotations.at(-1) ?? 0);
}

export default function CampaignMapScreen({
  completedStepIndex,
  onLaunchStep,
  onFinishCampaign,
  onResetCampaign,
  onChooseMode,
}) {
  const stageRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [selectedStop, setSelectedStop] = useState(null);
  const [carPosition, setCarPosition] = useState(() =>
    completedStepIndex < CAMPAIGN_TOTAL_STEPS - 1
      ? getCurrentMapPosition(completedStepIndex, completedStepIndex + 1)
      : getCampaignCarPosition(completedStepIndex),
  );
  const [carPoint, setCarPoint] = useState({ x: 0, y: 0, rotate: 0 });
  const [isLaunching, setIsLaunching] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const activeStepIndex = completedStepIndex + 1;
  const isCampaignComplete = completedStepIndex >= CAMPAIGN_TOTAL_STEPS - 1;
  const activeCampaignLevel = getCampaignLevelForStep(
    Math.min(activeStepIndex, CAMPAIGN_TOTAL_STEPS - 1),
  );
  const campaignStops = useMemo(
    () => getCampaignStopsForLevel(activeCampaignLevel),
    [activeCampaignLevel],
  );
  const displayStepIndex = Math.max(0, Math.min(completedStepIndex, CAMPAIGN_TOTAL_STEPS - 1));
  const displayStep = campaignSteps[displayStepIndex] ?? campaignSteps[0];

  const currentPoint = useMemo(
    () => positionToPoint(carPosition, stageSize),
    [carPosition, stageSize],
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const updateStageSize = () => {
      const rect = stage.getBoundingClientRect();
      setStageSize({ width: rect.width, height: rect.height });
    };

    updateStageSize();
    const observer = new ResizeObserver(updateStageSize);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nextPosition =
      completedStepIndex < CAMPAIGN_TOTAL_STEPS - 1
        ? getCurrentMapPosition(completedStepIndex, completedStepIndex + 1)
        : getCampaignCarPosition(completedStepIndex);
    setCarPosition(nextPosition);
    setSelectedStop(null);
    setShowResetConfirm(false);
  }, [completedStepIndex]);

  useEffect(() => {
    if (isLaunching || stageSize.width === 0 || stageSize.height === 0) return;
    setCarPoint({ ...currentPoint, rotate: 0 });
  }, [currentPoint, isLaunching, stageSize]);

  const handleStopClick = (stop) => {
    if (isLaunching || stop.stepIndex !== activeStepIndex) return;
    setShowResetConfirm(false);
    setSelectedStop(stop);
  };

  const requestReset = () => {
    setSelectedStop(null);
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setShowResetConfirm(false);
    onResetCampaign();
  };

  const launchStep = async (targetStepIndex) => {
    const targetStop = getCampaignStop(targetStepIndex);
    if (!targetStop || isLaunching) return;

    setIsLaunching(true);
    setSelectedStop(null);
    const targetPoint = positionToPoint(targetStop.position, stageSize);

    if (!prefersReducedMotion && stageSize.width > 0 && stageSize.height > 0) {
      const drivePath = getDrivePathPoints(
        targetStepIndex,
        carPosition,
        targetStop.position,
        stageSize,
      );
      setCarPoint({
        x: drivePath.map((point) => point.x),
        y: drivePath.map((point) => point.y),
        rotate: getDriveRotations(targetStepIndex, drivePath.length),
      });
      await new Promise((resolve) => {
        window.setTimeout(resolve, CAR_ANIMATION_SECONDS * 1000);
      });
    } else {
      setCarPoint({ ...targetPoint, rotate: 0 });
    }

    setCarPosition(targetStop.position);
    setIsLaunching(false);
    onLaunchStep(targetStepIndex);
  };

  return (
    <section
      className={`nj-campaign-map ${
        isCampaignComplete
          ? "nj-campaign-map--complete"
          : `nj-campaign-map--level-${activeCampaignLevel}`
      }`}
      data-testid="campaign-map-screen"
    >
      <header className="nj-campaign-map__header">
        <p className="nj-campaign-map__eyebrow">
          {isCampaignComplete
            ? "Kampanja završena"
            : `Razina ${activeCampaignLevel} kampanje`}
        </p>
        <h1 className="nj-campaign-map__title">
          {isCampaignComplete ? "Bravo, sve si obišao!" : "Odaberi stajalište"}
        </h1>
        <p className="nj-campaign-map__subtitle">
          {isCampaignComplete
            ? `Etapa ${displayStep.stepNumber}/${displayStep.totalSteps}`
            : `Prati Njamka kroz četiri igre razine ${activeCampaignLevel}.`}
        </p>
      </header>

      <div ref={stageRef} className="nj-campaign-map__stage" aria-label="Karta Njamko kampanje">
        {!isCampaignComplete && (
          <div className="nj-campaign-stops" aria-label={`Stajališta razine ${activeCampaignLevel}`}>
            {campaignStops.map((stop) => {
              const isCompleted = stop.stepIndex <= completedStepIndex;
              const isActive = stop.stepIndex === activeStepIndex;
              const isFuture = stop.stepIndex > activeStepIndex;
              return (
                <button
                  key={stop.stepIndex}
                  type="button"
                  data-testid={stop.testId}
                  className={[
                    "nj-campaign-stop",
                    isCompleted ? "nj-campaign-stop--completed" : "",
                    isActive ? "nj-campaign-stop--active" : "",
                    isFuture ? "nj-campaign-stop--future" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{
                    "--nj-stop-left": stop.position.left,
                    "--nj-stop-top": stop.position.top,
                  }}
                  aria-label={stop.label}
                  disabled={!isActive || isLaunching}
                  onClick={() => handleStopClick(stop)}
                >
                  <span className="nj-campaign-stop__beacon" aria-hidden="true" />
                  <span className="nj-campaign-stop__label">{stop.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <motion.div
          className={`nj-campaign-car${isLaunching ? " nj-campaign-car--driving" : ""}`}
          data-testid="campaign-car"
          animate={{ x: carPoint.x, y: carPoint.y, rotate: carPoint.rotate }}
          initial={false}
          transition={{
            duration: isLaunching && !prefersReducedMotion ? CAR_ANIMATION_SECONDS : 0,
            ease: [0.16, 1, 0.3, 1],
          }}
          aria-hidden="true"
        >
          <span className="nj-campaign-car__shell">
            <span className="nj-campaign-car__body">
              <img className="nj-campaign-car__mascot" src="/njamko.png" alt="" />
              <span className="nj-campaign-car__wheel nj-campaign-car__wheel--left" />
              <span className="nj-campaign-car__wheel nj-campaign-car__wheel--right" />
            </span>
          </span>
        </motion.div>

        <AnimatePresence>
          {selectedStop && (
            <motion.div
              className="nj-campaign-popup"
              data-testid="campaign-game-popup"
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="nj-campaign-popup__eyebrow">Novo stajalište</p>
              <h2 className="nj-campaign-popup__title">{selectedStop.label}</h2>
              <p className="nj-campaign-popup__text">Razina {selectedStop.levelId}</p>
              <button
                type="button"
                data-testid="campaign-launch-step-button"
                className="nj-btn nj-btn--primary nj-campaign-popup__button"
                disabled={isLaunching}
                onClick={() => launchStep(selectedStop.stepIndex)}
              >
                Kreni
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showResetConfirm && (
            <motion.div
              className="nj-campaign-popup nj-campaign-popup--confirm"
              data-testid="campaign-reset-confirm"
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="nj-campaign-popup__eyebrow">Reset kampanje</p>
              <h2 className="nj-campaign-popup__title">Jesi siguran?</h2>
              <p className="nj-campaign-popup__text">Sav napredak kampanje kreće ispočetka.</p>
              <div className="nj-campaign-popup__confirm-actions">
                <button
                  type="button"
                  data-testid="campaign-reset-confirm-button"
                  className="nj-btn nj-btn--primary nj-campaign-popup__button"
                  onClick={confirmReset}
                >
                  Da, resetiraj
                </button>
                <button
                  type="button"
                  data-testid="campaign-reset-cancel-button"
                  className="nj-btn nj-btn--secondary nj-campaign-popup__button"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Odustani
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="nj-campaign-map__actions">
        {isCampaignComplete ? (
          <button
            type="button"
            data-testid="campaign-continue-button"
            className="nj-btn nj-btn--primary nj-campaign-map__continue"
            onClick={onFinishCampaign}
          >
            Završi kampanju
          </button>
        ) : null}

        <div className="nj-campaign-map__secondary-actions">
          {completedStepIndex >= 0 ? (
            <button
              type="button"
              data-testid="campaign-replay-step-button"
              className="nj-btn nj-btn--secondary nj-campaign-map__small-action"
              onClick={requestReset}
            >
              Resetiraj kampanju
            </button>
          ) : (
            <button
              type="button"
              data-testid="campaign-replay-step-button"
              className="nj-btn nj-btn--secondary nj-campaign-map__small-action"
              disabled
            >
              Resetiraj kampanju
            </button>
          )}
          <button
            type="button"
            data-testid="campaign-choose-mode-button"
            className="nj-btn nj-btn--secondary nj-campaign-map__small-action"
            onClick={onChooseMode}
          >
            Odaberi igru
          </button>
        </div>
      </div>
    </section>
  );
}
