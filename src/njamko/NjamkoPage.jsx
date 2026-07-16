import { useCallback, useEffect, useRef, useState } from "react";
import { usePageMeta } from "../usePageMeta.js";
import { assetPath } from "./assetPath.js";
import { BACKGROUND_IMAGES, MUSIC } from "./assets.js";
import {
  CAMPAIGN_TOTAL_STEPS,
  campaignSteps,
  clampCampaignStepIndex,
} from "./campaign.js";
import CampaignFinaleScreen from "./CampaignFinaleScreen.jsx";
import CampaignMapScreen from "./CampaignMapScreen.jsx";
import CountingGameScreen from "./CountingGameScreen.jsx";
import { getLevel, getLevelKey, getMode, NJAMKO_MODES_LIST } from "./data/njamkoLevels.js";
import { useCountingGame } from "./engine/useCountingGame.js";
import { useGameEngine } from "./engine/useGameEngine.js";
import FinishScreen from "./FinishScreen.jsx";
import GameScreen from "./GameScreen.jsx";
import LevelSelect from "./LevelSelect.jsx";
import LoopVideoCard from "./LoopVideoCard";
import ModeSelect from "./ModeSelect.jsx";
import NjamkoPlusScreen from "./NjamkoPlusScreen.jsx";
import ParentalGate from "./ParentalGate.jsx";
import {
  isPlusUnlocked,
  canPlayLevel,
  getCampaignCompletedStep,
  resetCampaignProgress,
  setCampaignCompletedStep,
} from "./njamkoStorage.js";
import {
  markUserInteraction,
  setBackgroundMusicEnabled,
  startBackgroundMusic,
  stopBackgroundMusic,
} from "./sounds.js";
import "./njamko.css";

const EMPTY_ROUNDS = [];

function getInitialScreen() {
  return "modeSelect";
}

export default function NjamkoPage() {
  usePageMeta({
    title: "Njamko | Igraj, uči i otkrivaj životinje",
    description:
      "Jednostavna dječja edukativna mini-platforma za djecu 3+. Igraj igre sa životinjama, zvukovima, domovima, bebama i brojanjem.",
    path: "/njamko",
  });

  const [screen, setScreen] = useState(getInitialScreen);
  const [activeModeId, setActiveModeId] = useState(null);
  const [activeLevelId, setActiveLevelId] = useState(null);
  const [playSession, setPlaySession] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [finishStars, setFinishStars] = useState(0);
  const [finishTotal, setFinishTotal] = useState(0);
  const [plusUnlocked, setPlusUnlocked] = useState(() => isPlusUnlocked());
  const [isCampaignActive, setIsCampaignActive] = useState(false);
  const [campaignStepIndex, setCampaignStepIndex] = useState(0);
  const [campaignMapCompletedStepIndex, setCampaignMapCompletedStepIndex] = useState(-1);
  const [pendingCampaignStepIndex, setPendingCampaignStepIndex] = useState(null);
  const screenRef = useRef(screen);
  const innerAppHistoryPushedRef = useRef(false);

  const activeLevel =
    activeModeId && activeLevelId
      ? getLevel(activeModeId, activeLevelId)
      : null;
  const activeCampaignStep = campaignSteps[campaignStepIndex] ?? campaignSteps[0];
  const handleLevelComplete = useCallback(
    (stars) => {
      if (isCampaignActive) {
        setCampaignCompletedStep(campaignStepIndex);
        setFinishStars(stars);
        setFinishTotal(activeLevel?.rounds.length ?? 0);
        setCampaignMapCompletedStepIndex(campaignStepIndex);
        setScreen("campaignMap");
        return;
      }

      setFinishStars(stars);
      setFinishTotal(activeLevel?.rounds.length ?? 0);
      setScreen("finish");
    },
    [activeLevel, campaignStepIndex, isCampaignActive],
  );

  const levelSessionKey =
    activeModeId && activeLevelId
      ? `${getLevelKey(activeModeId, activeLevelId)}-${playSession}`
      : null;
  const isCountingMode = activeModeId === "counting";

  const engine = useGameEngine({
    rounds: isCountingMode ? EMPTY_ROUNDS : activeLevel?.rounds ?? EMPTY_ROUNDS,
    levelId: levelSessionKey,
    soundEnabled,
    onComplete: handleLevelComplete,
  });
  const countingEngine = useCountingGame({
    rounds: isCountingMode
      ? activeLevel?.tasks ?? activeLevel?.rounds ?? EMPTY_ROUNDS
      : EMPTY_ROUNDS,
    levelId: levelSessionKey,
    soundEnabled,
    onComplete: handleLevelComplete,
  });

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap";
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("igra") !== "1") return;

    markUserInteraction();
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  useEffect(() => {
    if (window.history.state?.njamkoApp) return;
    window.history.replaceState(
      {
        ...(window.history.state ?? {}),
        njamkoApp: true,
        njamkoScreen: "modeSelect",
      },
      "",
      window.location.pathname,
    );
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (screenRef.current === "modeSelect") return;

      markUserInteraction();
      innerAppHistoryPushedRef.current = false;
      setIsCampaignActive(false);
      setPendingCampaignStepIndex(null);
      setActiveModeId(null);
      setActiveLevelId(null);
      setScreen("modeSelect");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (screen === "modeSelect") {
      innerAppHistoryPushedRef.current = false;
      if (window.history.state?.njamkoInnerApp) {
        window.history.replaceState(
          {
            njamkoApp: true,
            njamkoScreen: "modeSelect",
          },
          "",
          window.location.pathname,
        );
      }
      return;
    }

    if (innerAppHistoryPushedRef.current || window.history.state?.njamkoInnerApp) {
      return;
    }

    window.history.pushState(
      {
        njamkoApp: true,
        njamkoInnerApp: true,
        njamkoScreen: screen,
      },
      "",
      window.location.pathname,
    );
    innerAppHistoryPushedRef.current = true;
  }, [screen]);

  const activeBackgroundMusic =
    screen === "campaignMap"
      ? MUSIC.campaignMap
      : activeModeId
        ? MUSIC[activeModeId]
        : null;
  const backgroundMusicActive =
    Boolean(activeBackgroundMusic) &&
    (screen === "campaignMap" || screen === "playing" || screen === "finish");

  useEffect(() => {
    if (!backgroundMusicActive) {
      stopBackgroundMusic();
      return undefined;
    }

    startBackgroundMusic(activeBackgroundMusic);
    return () => {
      stopBackgroundMusic();
    };
  }, [activeBackgroundMusic, backgroundMusicActive]);

  useEffect(() => {
    setBackgroundMusicEnabled(soundEnabled);
  }, [soundEnabled]);

  const handleBackToHome = useCallback(() => {
    markUserInteraction();
    window.location.href = "/";
  }, []);

  const handleSelectMode = useCallback((modeId) => {
    markUserInteraction();
    setActiveModeId(modeId);
    setScreen("levelSelect");
  }, []);

  const startLevel = useCallback((modeId, levelId) => {
    markUserInteraction();
    setIsCampaignActive(false);
    setPendingCampaignStepIndex(null);
    setActiveModeId(modeId);
    setActiveLevelId(levelId);
    setPlaySession((value) => value + 1);
    setScreen("playing");
  }, []);

  const startCampaignStep = useCallback((stepIndex) => {
    markUserInteraction();
    const nextStepIndex = clampCampaignStepIndex(stepIndex);
    const step = campaignSteps[nextStepIndex];
    const level = getLevel(step.modeId, step.levelId);
    if (!level) return;

    setIsCampaignActive(true);
    setCampaignStepIndex(nextStepIndex);
    setActiveModeId(step.modeId);
    setActiveLevelId(step.levelId);

    if (!canPlayLevel(level)) {
      setPendingCampaignStepIndex(nextStepIndex);
      setScreen("parentalGate");
      return;
    }

    setPendingCampaignStepIndex(null);
    setPlaySession((value) => value + 1);
    setScreen("playing");
  }, []);

  const handleStartCampaign = useCallback(() => {
    markUserInteraction();
    const completedStep = getCampaignCompletedStep();
    if (completedStep >= CAMPAIGN_TOTAL_STEPS - 1) {
      setIsCampaignActive(true);
      setCampaignStepIndex(CAMPAIGN_TOTAL_STEPS - 1);
      setCampaignMapCompletedStepIndex(CAMPAIGN_TOTAL_STEPS - 1);
      setPendingCampaignStepIndex(null);
      setActiveModeId(null);
      setActiveLevelId(null);
      setScreen("campaignFinale");
      return;
    }

    setIsCampaignActive(true);
    setCampaignMapCompletedStepIndex(completedStep);
    setCampaignStepIndex(Math.max(0, completedStep));
    setPendingCampaignStepIndex(null);
    setActiveModeId(null);
    setActiveLevelId(null);
    setScreen("campaignMap");
  }, []);

  const handleSelectLevel = useCallback(
    (levelId, playable) => {
      markUserInteraction();
      setIsCampaignActive(false);
      setPendingCampaignStepIndex(null);
      if (playable) {
        startLevel(activeModeId, levelId);
        return;
      }

      setScreen("parentalGate");
    },
    [activeModeId, startLevel],
  );

  const handleLearnMore = useCallback(() => {
    markUserInteraction();
    setScreen("parentalGate");
  }, []);

  const handleParentalSuccess = useCallback(() => {
    markUserInteraction();
    setScreen("plus");
  }, []);

  const handlePlusUnlocked = useCallback(() => {
    setPlusUnlocked(true);
    if (pendingCampaignStepIndex !== null) {
      startCampaignStep(pendingCampaignStepIndex);
      return;
    }

    setScreen("levelSelect");
  }, [pendingCampaignStepIndex, startCampaignStep]);

  const handleBackToModeSelect = useCallback(() => {
    markUserInteraction();
    setIsCampaignActive(false);
    setPendingCampaignStepIndex(null);
    setActiveModeId(null);
    setScreen("modeSelect");
  }, []);

  const handleBackToLevelSelect = useCallback(() => {
    markUserInteraction();
    if (isCampaignActive) {
      setPendingCampaignStepIndex(null);
      if (getCampaignCompletedStep() >= 0) {
        setScreen("campaignMap");
        return;
      }

      setIsCampaignActive(false);
      setActiveModeId(null);
      setActiveLevelId(null);
      setScreen("modeSelect");
      return;
    }

    setScreen("levelSelect");
  }, [isCampaignActive]);

  const handleGameBack = useCallback(() => {
    markUserInteraction();
    if (isCampaignActive) {
      if (getCampaignCompletedStep() >= 0) {
        setScreen("campaignMap");
        return;
      }

      setIsCampaignActive(false);
      setPendingCampaignStepIndex(null);
      setActiveModeId(null);
      setActiveLevelId(null);
      setScreen("modeSelect");
      return;
    }

    setScreen("levelSelect");
  }, [isCampaignActive]);

  const handleReplay = useCallback(() => {
    markUserInteraction();
    setPlaySession((value) => value + 1);
    setScreen("playing");
  }, []);

  const handleChooseLevel = useCallback(() => {
    markUserInteraction();
    setScreen("levelSelect");
  }, []);

  const handleChooseMode = useCallback(() => {
    markUserInteraction();
    setIsCampaignActive(false);
    setPendingCampaignStepIndex(null);
    setActiveLevelId(null);
    setScreen("modeSelect");
  }, []);

  const handleCampaignContinue = useCallback(() => {
    markUserInteraction();
    if (campaignStepIndex >= CAMPAIGN_TOTAL_STEPS - 1) {
      setScreen("campaignFinale");
      return;
    }

    startCampaignStep(campaignStepIndex + 1);
  }, [campaignStepIndex, startCampaignStep]);

  const handleCampaignReset = useCallback(() => {
    markUserInteraction();
    resetCampaignProgress();
    setIsCampaignActive(true);
    setCampaignStepIndex(0);
    setCampaignMapCompletedStepIndex(-1);
    setPendingCampaignStepIndex(null);
    setActiveModeId(null);
    setActiveLevelId(null);
    setScreen("campaignMap");
  }, []);

  const handleCampaignFinish = useCallback(() => {
    markUserInteraction();
    setScreen("campaignFinale");
  }, []);

  const handleCampaignChooseMode = useCallback(() => {
    markUserInteraction();
    setIsCampaignActive(false);
    setPendingCampaignStepIndex(null);
    setActiveModeId(null);
    setActiveLevelId(null);
    setScreen("modeSelect");
  }, []);

  const handleCampaignPlayAgain = useCallback(() => {
    resetCampaignProgress();
    startCampaignStep(0);
  }, [startCampaignStep]);

  const handleNextLevel = useCallback(() => {
    markUserInteraction();
    if (activeModeId !== "food" || !activeLevelId || activeLevelId >= 5) return;

    const nextLevelId = activeLevelId + 1;
    const nextLevel = getLevel(activeModeId, nextLevelId);
    if (!nextLevel) return;

    if (canPlayLevel(nextLevel)) {
      startLevel(activeModeId, nextLevelId);
      return;
    }

    setActiveLevelId(nextLevelId);
    setScreen("parentalGate");
  }, [activeModeId, activeLevelId, startLevel]);

  const handleNextGame = useCallback(() => {
    markUserInteraction();
    const currentIndex = NJAMKO_MODES_LIST.findIndex((mode) => mode.id === activeModeId);
    const nextMode = NJAMKO_MODES_LIST[currentIndex + 1] ?? NJAMKO_MODES_LIST[0];
    setActiveModeId(nextMode.id);
    setActiveLevelId(null);
    setScreen("levelSelect");
  }, [activeModeId]);

  const handleToggleSound = useCallback(() => {
    markUserInteraction();
    setSoundEnabled((value) => !value);
  }, []);

  const sceneClass =
    screen === "finish" || screen === "campaignMap" || screen === "campaignFinale"
      ? "njamko--finish"
      : "njamko--playing";

  const activeRoundForBackground = isCountingMode ? countingEngine.task : engine.round;
  const mobileRoundBackgroundImage =
    screen === "playing" && activeRoundForBackground?.mobileBackgroundImage
      ? assetPath(activeRoundForBackground.mobileBackgroundImage)
      : null;
  const hasMobileLoopVideoCard =
    screen === "playing" && activeRoundForBackground?.mobileLoopVideoCard;

  const premiumGameClass = screen === "playing" ? " njamko--premium-game" : "";
  const campaignScreenClass =
    screen === "campaignMap" || screen === "campaignFinale" ? " njamko--campaign-screen" : "";
  const mobileRoundBgClass = mobileRoundBackgroundImage ? " njamko--mobile-round-bg" : "";
  const mobileRoundBgStaticClass =
    mobileRoundBackgroundImage && activeRoundForBackground?.mode === "sound"
      ? " njamko--mobile-round-bg-static"
      : "";
  const mobileLoopVideoClass = hasMobileLoopVideoCard ? " njamko--mobile-loop-video-bg" : "";

  const bgImage =
    screen === "finish"
      ? BACKGROUND_IMAGES.finish
      : BACKGROUND_IMAGES.game;

  return (
    <div
      className={`njamko njamko-app-shell ${sceneClass}${premiumGameClass}${campaignScreenClass}${mobileRoundBgClass}${mobileRoundBgStaticClass}${mobileLoopVideoClass}`}
      data-testid="njamko-page"
      style={{
        "--nj-bg-image": bgImage ? `url(${bgImage})` : "none",
        "--nj-mobile-round-bg-image": mobileRoundBackgroundImage
          ? `url(${mobileRoundBackgroundImage})`
          : "none",
      }}
    >
      <div className="njamko__bg" aria-hidden="true">
        <span className="njamko__cloud njamko__cloud--1">☁️</span>
        <span className="njamko__cloud njamko__cloud--2">☁️</span>
        <span className="njamko__sun">🌤️</span>
        <span className="njamko__tree njamko__tree--left">🌳</span>
        <span className="njamko__tree njamko__tree--right">🌲</span>
        <span className="njamko__fence" />
        <span className="njamko__hill njamko__hill--back" />
        <span className="njamko__hill njamko__hill--front" />
      </div>

      {hasMobileLoopVideoCard && (
        <LoopVideoCard
          className="nj-loop-video-card--background"
          posterSrc="/assets/backgrounds/food-rabbit-mobile.webp"
          videoSrc="/assets/backgrounds/njamko-rabbit-loop.webm"
          alt="Zeko na livadi"
          isActive={screen === "playing"}
        />
      )}

      <div className="njamko__container">
        {screen === "modeSelect" && (
          <ModeSelect
            onSelectMode={handleSelectMode}
            onStartCampaign={handleStartCampaign}
            onBack={handleBackToHome}
          />
        )}

        {screen === "levelSelect" && activeModeId && (
          <LevelSelect
            modeId={activeModeId}
            plusUnlocked={plusUnlocked}
            onSelectLevel={handleSelectLevel}
            onLearnMore={handleLearnMore}
            onBack={handleBackToModeSelect}
          />
        )}

        {screen === "parentalGate" && (
          <ParentalGate
            onSuccess={handleParentalSuccess}
            onBack={handleBackToLevelSelect}
          />
        )}

        {screen === "plus" && (
          <NjamkoPlusScreen
            onUnlocked={handlePlusUnlocked}
            onBack={handleBackToLevelSelect}
          />
        )}

        {screen === "playing" && activeLevel && activeModeId && isCountingMode && countingEngine.task && (
          <CountingGameScreen
            modeTitle={getMode(activeModeId)?.title ?? ""}
            levelTitle={activeLevel.title}
            level={activeLevel}
            task={countingEngine.task}
            taskNumber={countingEngine.currentTaskIndex + 1}
            totalTasks={(activeLevel.tasks ?? activeLevel.rounds).length}
            expectedNumber={countingEngine.expectedNumber}
            selectedNumbers={countingEngine.selectedNumbers}
            collectedItemIds={countingEngine.collectedItemIds}
            collectedCount={countingEngine.collectedCount}
            pathNumbers={countingEngine.pathNumbers}
            wrongItemId={countingEngine.wrongItemId}
            isTaskComplete={countingEngine.isTaskComplete}
            isSandboxActive={countingEngine.isSandboxActive}
            sandboxTouches={countingEngine.sandboxTouches}
            feedbackMessage={countingEngine.feedbackMessage}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onFindNumberTap={countingEngine.handleFindNumberTap}
            onCollectItem={countingEngine.handleCollectItem}
            onPathNumber={countingEngine.handlePathNumber}
            onChoiceNumber={countingEngine.handleChoiceNumber}
            onSandboxTap={countingEngine.handleSandboxTap}
            onFinishSandbox={countingEngine.finishSandbox}
            onBack={handleGameBack}
          />
        )}

        {screen === "playing" && activeLevel && activeModeId && !isCountingMode && engine.round && (
          <GameScreen
            modeTitle={getMode(activeModeId)?.title ?? ""}
            levelTitle={activeLevel.title}
            round={engine.round}
            roundKey={engine.currentRoundIndex}
            shuffledOptions={engine.shuffledOptions}
            roundNumber={engine.currentRoundIndex + 1}
            totalRounds={activeLevel.rounds.length}
            feedback={engine.feedback}
            selectedAnswer={engine.selectedAnswer}
            showStars={engine.showStars}
            isAnimating={engine.isAnimating}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onSelectAnswer={engine.handleSelectAnswer}
            onPlaySound={engine.handlePlaySound}
            onBack={handleGameBack}
          />
        )}

        {screen === "campaignMap" && activeCampaignStep && (
          <CampaignMapScreen
            completedStepIndex={campaignMapCompletedStepIndex}
            onLaunchStep={startCampaignStep}
            onFinishCampaign={handleCampaignFinish}
            onResetCampaign={handleCampaignReset}
            onChooseMode={handleCampaignChooseMode}
          />
        )}

        {screen === "campaignFinale" && (
          <CampaignFinaleScreen
            onPlayAgain={handleCampaignPlayAgain}
            onChooseMode={handleCampaignChooseMode}
          />
        )}

        {screen === "finish" && (
          <FinishScreen
            stars={finishStars}
            totalRounds={finishTotal}
            modeId={activeModeId}
            levelId={activeLevelId}
            onReplay={handleReplay}
            onNextLevel={handleNextLevel}
            onNextGame={handleNextGame}
            onChooseLevel={handleChooseLevel}
            onChooseMode={handleChooseMode}
          />
        )}
      </div>
    </div>
  );
}
