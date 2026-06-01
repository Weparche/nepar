import { useCallback, useEffect, useRef, useState } from "react";
import { usePageMeta } from "../usePageMeta.js";
import { BACKGROUND_IMAGES } from "./assets.js";
import FinishScreen from "./FinishScreen.jsx";
import GameScreen from "./GameScreen.jsx";
import StartScreen from "./StartScreen.jsx";
import { ROUNDS, shuffleOptions } from "./rounds.js";
import {
  markUserInteraction,
  playCorrectSound,
  playWrongSound,
} from "./sounds.js";
import "./njamko.css";

const CORRECT_ANIMATION_MS = 1200;
const WRONG_RESET_MS = 800;

export default function NjamkoPage() {
  usePageMeta({
    title: "Njamko | Nahrani životinju",
    description:
      "Jednostavna edukativna igra za djecu 3+. Odaberi pravu hranu za gladnu životinju.",
    path: "/njamko",
  });

  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selectedFoodName, setSelectedFoodName] = useState(null);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [foodOptions, setFoodOptions] = useState([]);

  const animationTimerRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(animationTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!gameStarted || gameFinished) return;
    const round = ROUNDS[currentRoundIndex];
    if (!round) return;
    setFoodOptions(shuffleOptions(round.options));
  }, [currentRoundIndex, gameStarted, gameFinished]);

  const resetRoundFeedback = useCallback(() => {
    setSelectedFoodName(null);
    setFeedback(null);
    setShowStars(false);
    setIsAnimating(false);
  }, []);

  const startGame = useCallback(() => {
    markUserInteraction();
    clearTimeout(animationTimerRef.current);
    setGameStarted(true);
    setGameFinished(false);
    setCurrentRoundIndex(0);
    setSelectedFoodName(null);
    setStars(0);
    setFeedback(null);
    setShowStars(false);
    setIsAnimating(false);
    setFoodOptions(shuffleOptions(ROUNDS[0].options));
  }, []);

  const replayGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleToggleSound = useCallback(() => {
    markUserInteraction();
    setSoundEnabled((value) => !value);
  }, []);

  const handleSelectFood = useCallback(
    (foodName) => {
      if (isAnimating) return;

      markUserInteraction();
      setSelectedFoodName(foodName);
      setIsAnimating(true);

      const round = ROUNDS[currentRoundIndex];
      const isCorrect = foodName === round.correctFood;

      if (isCorrect) {
        setFeedback("correct");
        setShowStars(true);
        setStars((value) => value + 1);

        if (soundEnabled) playCorrectSound();

        animationTimerRef.current = setTimeout(() => {
          const nextIndex = currentRoundIndex + 1;
          if (nextIndex >= ROUNDS.length) {
            setGameFinished(true);
            setGameStarted(false);
          } else {
            setCurrentRoundIndex(nextIndex);
          }
          resetRoundFeedback();
        }, CORRECT_ANIMATION_MS);
        return;
      }

      setFeedback("wrong");

      if (soundEnabled) playWrongSound();

      animationTimerRef.current = setTimeout(() => {
        resetRoundFeedback();
      }, WRONG_RESET_MS);
    },
    [currentRoundIndex, isAnimating, resetRoundFeedback, soundEnabled],
  );

  const round = ROUNDS[currentRoundIndex];
  const sceneClass = gameFinished
    ? "njamko--finish"
    : gameStarted
      ? "njamko--playing"
      : "njamko--start";

  const bgImage = gameFinished
    ? BACKGROUND_IMAGES.finish
    : gameStarted
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
        {!gameStarted && !gameFinished && <StartScreen onStart={startGame} />}

        {gameStarted && !gameFinished && round && (
          <GameScreen
            round={round}
            roundKey={currentRoundIndex}
            foodOptions={foodOptions}
            roundNumber={currentRoundIndex + 1}
            totalRounds={ROUNDS.length}
            stars={stars}
            feedback={feedback}
            selectedFoodName={selectedFoodName}
            showStars={showStars}
            isAnimating={isAnimating}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onSelectFood={handleSelectFood}
          />
        )}

        {gameFinished && (
          <FinishScreen stars={stars} onReplay={replayGame} />
        )}
      </div>
    </div>
  );
}
