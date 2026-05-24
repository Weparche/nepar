import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export const PILOT_TOTAL = 10;
export const PILOT_TARGET = 6;
const START = 1;
const INTERVAL_MS = 500;

export function usePilotFillCount(active = true) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(reduceMotion ? PILOT_TARGET : START);

  useEffect(() => {
    if (!active) return;

    if (reduceMotion) {
      setCount(PILOT_TARGET);
      return;
    }

    setCount(START);
    let current = START;
    const id = setInterval(() => {
      current += 1;
      if (current >= PILOT_TARGET) {
        setCount(PILOT_TARGET);
        clearInterval(id);
      } else {
        setCount(current);
      }
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, [active, reduceMotion]);

  return count;
}
