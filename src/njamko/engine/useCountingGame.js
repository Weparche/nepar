import { useCallback, useEffect, useRef, useState } from "react";
import { markUserInteraction, playCorrectSound } from "../sounds.js";

const TASK_COMPLETE_MS = 900;
const WRONG_RESET_MS = 700;
const SANDBOX_COMPLETE_MS = 12000;

const COLLECT_TASK_TYPES = new Set(["collect-count", "collect-quantity", "decorate-result"]);
const PATH_TASK_TYPES = new Set(["number-path", "place-on-path", "complete-path", "build-order"]);
const CHOICE_TASK_TYPES = new Set(["count-visible", "missing-number"]);

export function useCountingGame({ rounds, levelId, soundEnabled, onComplete }) {
  const tasks = rounds;
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [expectedNumber, setExpectedNumber] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [collectedItemIds, setCollectedItemIds] = useState([]);
  const [collectedCount, setCollectedCount] = useState(0);
  const [pathNumbers, setPathNumbers] = useState([]);
  const [wrongItemId, setWrongItemId] = useState(null);
  const [isTaskComplete, setIsTaskComplete] = useState(false);
  const [isSandboxActive, setIsSandboxActive] = useState(false);
  const [sandboxTouches, setSandboxTouches] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [stars, setStars] = useState(0);

  const timerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const task = tasks[currentTaskIndex] ?? null;

  const resetTaskState = useCallback((nextTask) => {
    clearTimeout(timerRef.current);
    setExpectedNumber(nextTask?.sequence?.[0] ?? nextTask?.targetNumber ?? nextTask?.answer ?? null);
    setSelectedNumbers([]);
    setCollectedItemIds([]);
    setCollectedCount(0);
    setPathNumbers([]);
    setWrongItemId(null);
    setIsTaskComplete(false);
    setIsSandboxActive(false);
    setSandboxTouches(0);
    setFeedbackMessage("");
  }, []);

  useEffect(() => {
    setCurrentTaskIndex(0);
    setStars(0);
    resetTaskState(tasks[0]);
  }, [levelId, resetTaskState, tasks]);

  useEffect(() => {
    resetTaskState(task);
  }, [currentTaskIndex, resetTaskState, task]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const finishSandbox = useCallback(() => {
    clearTimeout(timerRef.current);
    setIsSandboxActive(false);
    onCompleteRef.current(tasks.length);
  }, [tasks.length]);

  const finishTask = useCallback(
    (message) => {
      setIsTaskComplete(true);
      setFeedbackMessage(message);
      if (soundEnabled) playCorrectSound();

      timerRef.current = setTimeout(() => {
        const nextTaskIndex = currentTaskIndex + 1;
        if (nextTaskIndex >= tasks.length) {
          setStars(tasks.length);
          setIsSandboxActive(true);
          timerRef.current = setTimeout(finishSandbox, task?.sandboxDurationMs ?? SANDBOX_COMPLETE_MS);
          return;
        }
        setStars((value) => value + 1);
        setCurrentTaskIndex(nextTaskIndex);
      }, TASK_COMPLETE_MS);
    },
    [currentTaskIndex, finishSandbox, soundEnabled, task?.sandboxDurationMs, tasks.length],
  );

  const handleFindNumberTap = useCallback(
    (item) => {
      if (!task || task.type !== "find-number" || isTaskComplete || isSandboxActive) return;
      if (selectedNumbers.includes(item.number)) return;

      markUserInteraction();
      clearTimeout(timerRef.current);

      if (item.number !== expectedNumber) {
        setWrongItemId(item.id);
        setFeedbackMessage(`Probaj pronaći broj ${expectedNumber}`);
        timerRef.current = setTimeout(() => setWrongItemId(null), WRONG_RESET_MS);
        return;
      }

      const nextSelectedNumbers = [...selectedNumbers, item.number];
      const nextExpectedNumber = task.sequence[nextSelectedNumbers.length] ?? null;
      setSelectedNumbers(nextSelectedNumbers);
      setCollectedItemIds((ids) => [...ids, item.id]);
      setExpectedNumber(nextExpectedNumber);
      setWrongItemId(null);
      setFeedbackMessage("");
      if (soundEnabled) playCorrectSound();

      if (nextSelectedNumbers.length >= task.sequence.length) {
        finishTask("Super! Sve si pronašao/la redom.");
      }
    },
    [expectedNumber, finishTask, isSandboxActive, isTaskComplete, selectedNumbers, soundEnabled, task],
  );

  const handleCollectItem = useCallback(
    (itemId) => {
      if (!task || !COLLECT_TASK_TYPES.has(task.type) || isTaskComplete || isSandboxActive) return;
      if (collectedItemIds.includes(itemId) || collectedCount >= task.targetNumber) return;

      markUserInteraction();
      const nextCount = collectedCount + 1;
      setCollectedItemIds((ids) => [...ids, itemId]);
      setCollectedCount(nextCount);
      setFeedbackMessage("");
      if (soundEnabled) playCorrectSound();

      if (nextCount >= task.targetNumber) {
        const doneMessage =
          task.type === "decorate-result"
            ? "Kula je gotova!"
            : `Bravo! To je ${task.targetNumber} ${task.itemName}.`;
        finishTask(doneMessage);
      }
    },
    [collectedCount, collectedItemIds, finishTask, isSandboxActive, isTaskComplete, soundEnabled, task],
  );

  const handlePathNumber = useCallback(
    (number) => {
      if (!task || !PATH_TASK_TYPES.has(task.type) || isTaskComplete || isSandboxActive) return;
      if (pathNumbers.includes(number)) return;

      markUserInteraction();
      clearTimeout(timerRef.current);
      const expectedPathNumber = task.sequence[pathNumbers.length];
      if (number !== expectedPathNumber) {
        setWrongItemId(`path-${number}`);
        setFeedbackMessage(`Još tražimo broj ${expectedPathNumber}.`);
        timerRef.current = setTimeout(() => setWrongItemId(null), WRONG_RESET_MS);
        return;
      }

      const nextPathNumbers = [...pathNumbers, number];
      setPathNumbers(nextPathNumbers);
      setFeedbackMessage("");
      if (soundEnabled) playCorrectSound();

      if (nextPathNumbers.length >= task.sequence.length) {
        finishTask(task.type === "complete-path" ? "Staza svijetli redom!" : "Sve si složio/la redom!");
      }
    },
    [finishTask, isSandboxActive, isTaskComplete, pathNumbers, soundEnabled, task],
  );

  const handleChoiceNumber = useCallback(
    (number) => {
      if (!task || !CHOICE_TASK_TYPES.has(task.type) || isTaskComplete || isSandboxActive) return;

      markUserInteraction();
      clearTimeout(timerRef.current);
      const correctNumber = task.answer ?? task.visibleCount;
      if (number !== correctNumber) {
        setWrongItemId(`choice-${number}`);
        setFeedbackMessage(`Još tražimo broj ${correctNumber}.`);
        timerRef.current = setTimeout(() => setWrongItemId(null), WRONG_RESET_MS);
        return;
      }

      setSelectedNumbers([number]);
      setWrongItemId(null);
      setFeedbackMessage("");
      finishTask(task.type === "count-visible" ? `To su ${correctNumber} ${task.itemName}.` : "Tako je!");
    },
    [finishTask, isSandboxActive, isTaskComplete, task],
  );

  const handleSandboxTap = useCallback(() => {
    if (!isSandboxActive) return;
    markUserInteraction();
    setSandboxTouches((value) => value + 1);
    setFeedbackMessage("");
    if (soundEnabled) playCorrectSound();
  }, [isSandboxActive, soundEnabled]);

  return {
    task,
    currentTaskIndex,
    expectedNumber,
    selectedNumbers,
    collectedItemIds,
    collectedCount,
    pathNumbers,
    wrongItemId,
    isTaskComplete,
    isSandboxActive,
    sandboxTouches,
    feedbackMessage,
    stars,
    handleFindNumberTap,
    handleCollectItem,
    handlePathNumber,
    handleChoiceNumber,
    handleSandboxTap,
    finishSandbox,
  };
}
