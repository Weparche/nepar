import { useCallback, useEffect, useRef, useState } from "react";
import { shuffleOptions } from "../data/njamkoLevels.js";
import {
  markUserInteraction,
  playAnimalSound,
  playCorrectSound,
  playWrongSound,
  stopAnimalSound,
} from "../sounds.js";

const CORRECT_ANIMATION_MS = 1200;
const WRONG_RESET_MS = 800;
const SOUND_AUTOPLAY_DELAY_MS = 300;

export function useGameEngine({ rounds, levelId, soundEnabled, onComplete }) {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [soundAutoplayReady, setSoundAutoplayReady] = useState(false);

  const animationTimerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const round = rounds[currentRoundIndex] ?? null;
  const isSoundRound = round?.mode === "sound";

  useEffect(() => {
    return () => {
      clearTimeout(animationTimerRef.current);
      stopAnimalSound();
    };
  }, []);

  const resetLevel = useCallback(() => {
    clearTimeout(animationTimerRef.current);
    stopAnimalSound();
    setCurrentRoundIndex(0);
    setSelectedAnswer(null);
    setStars(0);
    setFeedback(null);
    setShowStars(false);
    setIsAnimating(false);
    setSoundAutoplayReady(false);
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
    stopAnimalSound();
    setShuffledOptions(shuffleOptions(round.options));
    setSoundAutoplayReady(false);
  }, [currentRoundIndex, round]);

  useEffect(() => {
    if (!isSoundRound || !soundEnabled || !round) return undefined;

    const timer = setTimeout(() => {
      markUserInteraction();
      playAnimalSound(round.soundText, round.soundSrc);
      setSoundAutoplayReady(true);
    }, SOUND_AUTOPLAY_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [currentRoundIndex, isSoundRound, levelId, round, soundEnabled]);

  const resetRoundFeedback = useCallback(() => {
    setSelectedAnswer(null);
    setFeedback(null);
    setShowStars(false);
    setIsAnimating(false);
    setSoundAutoplayReady(false);
  }, []);

  const handlePlaySound = useCallback(() => {
    if (!round || round.mode !== "sound") return;
    markUserInteraction();
    if (soundEnabled) {
      playAnimalSound(round.soundText, round.soundSrc);
    }
  }, [round, soundEnabled]);

  const handleSelectAnswer = useCallback(
    (answerName) => {
      if (isAnimating || !round) return;

      markUserInteraction();
      setSelectedAnswer(answerName);

      const isCorrect = answerName === round.correctAnswer;

      if (isCorrect) {
        setIsAnimating(true);
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
        setSelectedAnswer(null);
        setFeedback(null);
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
    soundAutoplayReady,
    handleSelectAnswer,
    handlePlaySound,
    resetLevel,
  };
}
