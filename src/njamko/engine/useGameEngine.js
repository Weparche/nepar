import { useCallback, useEffect, useRef, useState } from "react";
import { shuffleOptions } from "../data/njamkoLevels.js";
import {
  markUserInteraction,
  playAnimalSound,
  playCorrectSound,
  playWrongSound,
} from "../sounds.js";

const CORRECT_ANIMATION_MS = 1200;
const WRONG_RESET_MS = 800;

export function useGameEngine({ rounds, levelId, soundEnabled, onComplete }) {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [soundRevealed, setSoundRevealed] = useState(false);

  const animationTimerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const round = rounds[currentRoundIndex] ?? null;

  useEffect(() => {
    return () => {
      clearTimeout(animationTimerRef.current);
    };
  }, []);

  const resetLevel = useCallback(() => {
    clearTimeout(animationTimerRef.current);
    setCurrentRoundIndex(0);
    setSelectedAnswer(null);
    setStars(0);
    setFeedback(null);
    setShowStars(false);
    setIsAnimating(false);
    setSoundRevealed(false);
    if (rounds[0]) {
      setShuffledOptions(shuffleOptions(rounds[0].options));
    } else {
      setShuffledOptions([]);
    }
  }, [rounds]);

  useEffect(() => {
    if (!levelId) return;
    resetLevel();
  }, [levelId, resetLevel]);

  useEffect(() => {
    if (!round) return;
    setShuffledOptions(shuffleOptions(round.options));
    setSoundRevealed(false);
  }, [currentRoundIndex, round]);

  const resetRoundFeedback = useCallback(() => {
    setSelectedAnswer(null);
    setFeedback(null);
    setShowStars(false);
    setIsAnimating(false);
    setSoundRevealed(false);
  }, []);

  const handlePlaySound = useCallback(() => {
    if (!round || round.mode !== "sound") return;
    markUserInteraction();
    setSoundRevealed(true);
    if (soundEnabled) {
      playAnimalSound(round.soundText);
    }
  }, [round, soundEnabled]);

  const handleSelectAnswer = useCallback(
    (answerName) => {
      if (isAnimating || !round) return;

      markUserInteraction();
      setSelectedAnswer(answerName);
      setIsAnimating(true);

      const isCorrect = answerName === round.correctAnswer;

      if (isCorrect) {
        setFeedback("correct");
        setShowStars(true);

        if (soundEnabled) playCorrectSound();

        setStars((prevStars) => {
          const nextStars = prevStars + 1;

          animationTimerRef.current = setTimeout(() => {
            const nextIndex = currentRoundIndex + 1;
            if (nextIndex >= rounds.length) {
              onCompleteRef.current(nextStars);
            } else {
              setCurrentRoundIndex(nextIndex);
            }
            resetRoundFeedback();
          }, CORRECT_ANIMATION_MS);

          return nextStars;
        });
        return;
      }

      setFeedback("wrong");

      if (soundEnabled) playWrongSound();

      animationTimerRef.current = setTimeout(() => {
        resetRoundFeedback();
      }, WRONG_RESET_MS);
    },
    [
      currentRoundIndex,
      isAnimating,
      resetRoundFeedback,
      round,
      rounds.length,
      soundEnabled,
    ],
  );

  return {
    round,
    currentRoundIndex,
    shuffledOptions,
    stars,
    feedback,
    selectedAnswer,
    isAnimating,
    showStars,
    soundRevealed,
    handleSelectAnswer,
    handlePlaySound,
    resetLevel,
  };
}
