import { useCallback, useEffect, useState } from "react";
import { usePageMeta } from "../usePageMeta.js";
import { BACKGROUND_IMAGES } from "./assets.js";
import { getLevelById } from "./data/njamkoLevels.js";
import { useGameEngine } from "./engine/useGameEngine.js";
import FinishScreen from "./FinishScreen.jsx";
import GameScreen from "./GameScreen.jsx";
import LevelSelect from "./LevelSelect.jsx";
import StartScreen from "./StartScreen.jsx";
import { markUserInteraction } from "./sounds.js";
import "./njamko.css";

export default function NjamkoPage() {
  usePageMeta({
    title: "Njamko | Igraj, uči i otkrivaj životinje",
    description:
      "Jednostavna dječja edukativna mini-platforma za djecu 3+. Nahrani životinju, pronađi dom, pogodi zvuk i spoji mamu s bebom.",
    path: "/njamko",
  });

  const [screen, setScreen] = useState("start");
  const [activeLevelId, setActiveLevelId] = useState(null);
  const [playSession, setPlaySession] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [finishStars, setFinishStars] = useState(0);
  const [finishTotal, setFinishTotal] = useState(0);

  const activeLevel = activeLevelId ? getLevelById(activeLevelId) : null;

  const handleLevelComplete = useCallback((stars) => {
    const level = getLevelById(activeLevelId);
    setFinishStars(stars);
    setFinishTotal(level?.rounds.length ?? 0);
    setScreen("finish");
  }, [activeLevelId]);

  const engine = useGameEngine({
    rounds: activeLevel?.rounds ?? [],
    levelId: activeLevelId ? `${activeLevelId}-${playSession}` : null,
    soundEnabled,
    onComplete: handleLevelComplete,
  });

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  const goToLevelSelect = useCallback(() => {
    markUserInteraction();
    setScreen("levelSelect");
  }, []);

  const handleStart = useCallback(() => {
    markUserInteraction();
    setScreen("levelSelect");
  }, []);

  const handleSelectLevel = useCallback((levelId) => {
    markUserInteraction();
    setActiveLevelId(levelId);
    setPlaySession((value) => value + 1);
    setScreen("playing");
  }, []);

  const handleBack = useCallback(() => {
    markUserInteraction();
    setScreen("levelSelect");
  }, []);

  const handleReplay = useCallback(() => {
    markUserInteraction();
    setPlaySession((value) => value + 1);
    setScreen("playing");
  }, []);

  const handleChooseLevel = useCallback(() => {
    markUserInteraction();
    setScreen("levelSelect");
  }, []);

  const handleToggleSound = useCallback(() => {
    markUserInteraction();
    setSoundEnabled((value) => !value);
  }, []);

  const sceneClass =
    screen === "finish"
      ? "njamko--finish"
      : screen === "playing" || screen === "levelSelect"
        ? "njamko--playing"
        : "njamko--start";

  const bgImage =
    screen === "finish"
      ? BACKGROUND_IMAGES.finish
      : screen === "playing" || screen === "levelSelect"
        ? BACKGROUND_IMAGES.game
        : BACKGROUND_IMAGES.start;

  return (
    <div
      className={`njamko ${sceneClass}`}
      data-testid="njamko-page"
      style={{ "--nj-bg-image": `url(${bgImage})` }}
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

      <div className="njamko__container">
        {screen === "start" && <StartScreen onStart={handleStart} />}

        {screen === "levelSelect" && (
          <LevelSelect onSelectLevel={handleSelectLevel} />
        )}

        {screen === "playing" && activeLevel && engine.round && (
          <GameScreen
            levelTitle={activeLevel.title}
            round={engine.round}
            roundKey={engine.currentRoundIndex}
            shuffledOptions={engine.shuffledOptions}
            roundNumber={engine.currentRoundIndex + 1}
            totalRounds={activeLevel.rounds.length}
            stars={engine.stars}
            feedback={engine.feedback}
            selectedAnswer={engine.selectedAnswer}
            showStars={engine.showStars}
            isAnimating={engine.isAnimating}
            soundRevealed={engine.soundRevealed}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onSelectAnswer={engine.handleSelectAnswer}
            onPlaySound={engine.handlePlaySound}
            onBack={handleBack}
          />
        )}

        {screen === "finish" && (
          <FinishScreen
            stars={finishStars}
            totalRounds={finishTotal}
            onReplay={handleReplay}
            onChooseLevel={handleChooseLevel}
          />
        )}
      </div>
    </div>
  );
}
