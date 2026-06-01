import { useCallback, useEffect, useRef, useState } from "react";
import { usePageMeta } from "../usePageMeta.js";
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

const ROUND_ADVANCE_MS = 1200;

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
  const [selectedFood, setSelectedFood] = useState(null);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animalBounce, setAnimalBounce] = useState(false);
  const [shakeFood, setShakeFood] = useState(null);
  const [locked, setLocked] = useState(false);
  const [foodOptions, setFoodOptions] = useState([]);

  const advanceTimerRef = useRef(null);
  const shakeTimerRef = useRef(null);
  const bounceTimerRef = useRef(null);

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
      clearTimeout(advanceTimerRef.current);
      clearTimeout(shakeTimerRef.current);
      clearTimeout(bounceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!gameStarted || gameFinished) return;
    const round = ROUNDS[currentRoundIndex];
    if (!round) return;
    setFoodOptions(shuffleOptions(round.options));
  }, [currentRoundIndex, gameStarted, gameFinished]);

  const startGame = useCallback(() => {
    markUserInteraction();
    setGameStarted(true);
    setGameFinished(false);
    setCurrentRoundIndex(0);
    setSelectedFood(null);
    setStars(0);
    setFeedback(null);
    setAnimalBounce(false);
    setShakeFood(null);
    setLocked(false);
    setFoodOptions(shuffleOptions(ROUNDS[0].options));
  }, []);

  const replayGame = useCallback(() => {
    markUserInteraction();
    setGameStarted(true);
    setGameFinished(false);
    setCurrentRoundIndex(0);
    setSelectedFood(null);
    setStars(0);
    setFeedback(null);
    setAnimalBounce(false);
    setShakeFood(null);
    setLocked(false);
    setFoodOptions(shuffleOptions(ROUNDS[0].options));
  }, []);

  const handleToggleSound = useCallback(() => {
    markUserInteraction();
    setSoundEnabled((value) => !value);
  }, []);

  const handleSelectFood = useCallback(
    (foodName) => {
      if (locked) return;

      markUserInteraction();
      setSelectedFood(foodName);

      const round = ROUNDS[currentRoundIndex];
      const isCorrect = foodName === round.correctFood;

      if (isCorrect) {
        setFeedback("correct");
        setStars((value) => value + 1);
        setAnimalBounce(true);
        setShakeFood(null);
        setLocked(true);

        if (soundEnabled) playCorrectSound();

        bounceTimerRef.current = setTimeout(() => {
          setAnimalBounce(false);
        }, 600);

        advanceTimerRef.current = setTimeout(() => {
          const nextIndex = currentRoundIndex + 1;
          if (nextIndex >= ROUNDS.length) {
            setGameFinished(true);
            setGameStarted(false);
          } else {
            setCurrentRoundIndex(nextIndex);
          }
          setSelectedFood(null);
          setFeedback(null);
          setLocked(false);
        }, ROUND_ADVANCE_MS);
        return;
      }

      setFeedback("wrong");
      setShakeFood(foodName);

      if (soundEnabled) playWrongSound();

      shakeTimerRef.current = setTimeout(() => {
        setShakeFood(null);
      }, 500);
    },
    [currentRoundIndex, locked, soundEnabled],
  );

  const round = ROUNDS[currentRoundIndex];
  const sceneClass = gameFinished
    ? "njamko--finish"
    : gameStarted
      ? "njamko--playing"
      : "njamko--start";

  return (
    <div
      className={`njamko ${sceneClass}`}
      data-testid="njamko-page"
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
            foodOptions={foodOptions}
            roundNumber={currentRoundIndex + 1}
            totalRounds={ROUNDS.length}
            stars={stars}
            feedback={feedback}
            animalBounce={animalBounce}
            shakeFood={shakeFood}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onSelectFood={handleSelectFood}
            locked={locked}
          />
        )}

        {gameFinished && (
          <FinishScreen stars={stars} onReplay={replayGame} />
        )}
      </div>
    </div>
  );
}
