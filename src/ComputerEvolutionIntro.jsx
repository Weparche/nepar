import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const SCENE_TRANSITION_MS = 1350;
const SECOND_TO_THIRD_TRANSITION_MS = 1150;
const FINAL_LOOP_START = 18.8;
const FRAME_RATE = 6;
const FRAME_COUNT = 120;

const frameIndexForTime = (time) => Math.max(
  0,
  Math.min(FRAME_COUNT - 1, Math.round(time * FRAME_RATE)),
);
const frameSource = (index) => (
  `/evolution-frames/evolution-frame-${String(index + 1).padStart(3, "0")}.webp`
);

export const evolutionScenes = [
  { time: 0.2, copy: "Računalo je počelo kao alat na jednom stolu." },
  { time: 3.8, copy: "Grafička sučelja približila su tehnologiju svima." },
  { time: 8.1, copy: "Internet je povezao cijeli svijet." },
  { time: 10.3, copy: "Cloud je rad preselio na svaki uređaj." },
  { time: 13, copy: "Digitalni alati postali su radno okruženje." },
  { time: 16, copy: "AI danas razumije, automatizira i stvara." },
  { time: FINAL_LOOP_START, copy: null },
];

const observerThresholds = Array.from({ length: 21 }, (_, index) => index / 20);
const sceneEase = (value) => (
  value < 0.5
    ? 4 * value * value * value
    : 1 - ((-2 * value + 2) ** 3) / 2
);

/**
 * @param {{ onComplete: (reason: "skip" | "sentinel" | "error" | "ended") => void }} props
 */
export default function ComputerEvolutionIntro({ onComplete }) {
  const prefersReducedMotion = useReducedMotion();
  const initialScene = prefersReducedMotion ? evolutionScenes.length - 1 : 0;
  const initialTime = evolutionScenes[initialScene].time;
  const [activeScene, setActiveScene] = useState(initialScene);
  const [frameIndex, setFrameIndex] = useState(() => (
    frameIndexForTime(initialTime)
  ));
  const sectionRef = useRef(null);
  const panelRefs = useRef([]);
  const sentinelRef = useRef(null);
  const sceneObserverRef = useRef(null);
  const sentinelObserverRef = useRef(null);
  const animationFrameRef = useRef(null);
  const activeSceneRef = useRef(initialScene);
  const previousSceneRef = useRef(initialScene);
  const wheelGestureRef = useRef(false);
  const wheelGestureTimerRef = useRef(null);
  const sceneAlignmentRef = useRef(false);
  const timelineTimeRef = useRef(initialTime);
  const frameIndexRef = useRef(frameIndex);
  const completedRef = useRef(false);

  const cancelTween = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const completeIntro = useCallback((reason) => {
    if (completedRef.current) return;
    completedRef.current = true;
    cancelTween();
    sceneObserverRef.current?.disconnect();
    sentinelObserverRef.current?.disconnect();
    onComplete(reason);
  }, [cancelTween, onComplete]);

  const tweenTo = useCallback((targetTime, transitionDuration = SCENE_TRANSITION_MS) => {
    cancelTween();

    const startTime = timelineTimeRef.current;
    const distance = targetTime - startTime;

    const renderTime = (time) => {
      timelineTimeRef.current = time;
      const nextFrameIndex = frameIndexForTime(time);
      if (nextFrameIndex === frameIndexRef.current) return;
      frameIndexRef.current = nextFrameIndex;
      setFrameIndex(nextFrameIndex);
    };

    const startFinalLoop = () => {
      renderTime(FINAL_LOOP_START);
    };

    if (Math.abs(distance) < 0.02) {
      renderTime(targetTime);
      if (targetTime === evolutionScenes.at(-1).time) startFinalLoop();
      return;
    }

    const startedAt = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - startedAt) / transitionDuration);
      renderTime(startTime + distance * sceneEase(progress));

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      renderTime(targetTime);
      animationFrameRef.current = null;

      if (
        targetTime === evolutionScenes.at(-1).time
        && activeSceneRef.current === evolutionScenes.length - 1
      ) {
        startFinalLoop();
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(step);
  }, [cancelTween]);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    let cancelled = false;
    const sources = Array.from({ length: FRAME_COUNT }, (_, index) => frameSource(index));
    const loadSequence = async (offset) => {
      for (let index = offset; index < sources.length && !cancelled; index += 6) {
        await new Promise((resolve) => {
          const image = new Image();
          image.onload = resolve;
          image.onerror = resolve;
          image.src = sources[index];
        });
      }
    };

    Promise.all([0, 1, 2, 3, 4, 5].map(loadSequence));
    return () => { cancelled = true; };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const previousScene = previousSceneRef.current;
    const transitionDuration = (
      previousScene === 1 && activeScene === 2
        ? SECOND_TO_THIRD_TRANSITION_MS
        : SCENE_TRANSITION_MS
    );
    previousSceneRef.current = activeScene;
    activeSceneRef.current = activeScene;
    tweenTo(evolutionScenes[activeScene].time, transitionDuration);
  }, [activeScene, tweenTo]);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const TOUCH_STEP_PX = 24;
    const scrollHost = sectionRef.current;
    if (!scrollHost) return undefined;

    const endWheelGesture = () => {
      wheelGestureRef.current = false;
      wheelGestureTimerRef.current = null;
    };

    const jumpToScene = (direction) => {
      wheelGestureRef.current = true;
      wheelGestureTimerRef.current = window.setTimeout(
        endWheelGesture,
        SCENE_TRANSITION_MS + 120,
      );

      const current = activeSceneRef.current;

      if (direction > 0 && current === evolutionScenes.length - 1) {
        completeIntro("sentinel");
        return;
      }

      const next = Math.max(0, Math.min(evolutionScenes.length - 1, current + direction));
      if (next === current) return;

      const gestureLockDuration = (
        current === 1 && next === 2
          ? SECOND_TO_THIRD_TRANSITION_MS
          : SCENE_TRANSITION_MS
      );
      window.clearTimeout(wheelGestureTimerRef.current);
      wheelGestureTimerRef.current = window.setTimeout(
        endWheelGesture,
        gestureLockDuration + 120,
      );

      activeSceneRef.current = next;
      sceneAlignmentRef.current = true;
      setActiveScene(next);

      const targetPanel = panelRefs.current[next];
      if (targetPanel) {
        const hostRect = scrollHost.getBoundingClientRect();
        const targetTop = targetPanel.getBoundingClientRect().top - hostRect.top + scrollHost.scrollTop;
        const previousScrollBehavior = scrollHost.style.scrollBehavior;
        scrollHost.style.scrollBehavior = "auto";
        scrollHost.scrollTo({ top: targetTop, left: 0, behavior: "auto" });
        window.requestAnimationFrame(() => {
          sceneAlignmentRef.current = false;
          scrollHost.style.scrollBehavior = previousScrollBehavior;
        });
      } else {
        sceneAlignmentRef.current = false;
      }
    };

    const onWheel = (event) => {
      if (completedRef.current || Math.abs(event.deltaY) < 2) return;
      event.preventDefault();
      if (wheelGestureRef.current) return;
      jumpToScene(event.deltaY > 0 ? 1 : -1);
    };

    // Touch devices never fire "wheel" events, so without this a swipe only
    // moves the scene once native scrolling has dragged the panel stack
    // through roughly half of a full 100vh panel. Mirror the wheel gesture
    // instead: a short swipe past TOUCH_STEP_PX advances exactly one scene,
    // same as a single mouse-wheel tick.
    let touchStartY = null;

    const onTouchStart = (event) => {
      if (completedRef.current || event.touches.length !== 1) {
        touchStartY = null;
        return;
      }
      touchStartY = event.touches[0].clientY;
    };

    const onTouchMove = (event) => {
      if (completedRef.current || touchStartY === null || event.touches.length !== 1) return;
      event.preventDefault();

      const currentY = event.touches[0].clientY;
      const delta = touchStartY - currentY;

      if (wheelGestureRef.current) {
        touchStartY = currentY;
        return;
      }

      if (Math.abs(delta) < TOUCH_STEP_PX) return;
      touchStartY = currentY;
      jumpToScene(delta > 0 ? 1 : -1);
    };

    const onTouchEnd = () => {
      touchStartY = null;
    };

    scrollHost.addEventListener("wheel", onWheel, { passive: false, capture: true });
    scrollHost.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    scrollHost.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    scrollHost.addEventListener("touchend", onTouchEnd, { passive: true, capture: true });
    scrollHost.addEventListener("touchcancel", onTouchEnd, { passive: true, capture: true });
    return () => {
      scrollHost.removeEventListener("wheel", onWheel, { capture: true });
      scrollHost.removeEventListener("touchstart", onTouchStart, { capture: true });
      scrollHost.removeEventListener("touchmove", onTouchMove, { capture: true });
      scrollHost.removeEventListener("touchend", onTouchEnd, { capture: true });
      scrollHost.removeEventListener("touchcancel", onTouchEnd, { capture: true });
      if (wheelGestureTimerRef.current !== null) {
        window.clearTimeout(wheelGestureTimerRef.current);
      }
    };
  }, [completeIntro, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const scrollHost = sectionRef.current;
    const panels = panelRefs.current.filter(Boolean);
    if (!scrollHost || !panels.length) return undefined;

    const chooseActivePanel = () => {
      const hostRect = scrollHost.getBoundingClientRect();
      const viewportHeight = scrollHost.clientHeight;
      const candidates = panels.flatMap((panel) => {
        const rect = panel.getBoundingClientRect();
        const visibleHeight = Math.max(
          0,
          Math.min(rect.bottom, hostRect.bottom) - Math.max(rect.top, hostRect.top),
        );
        if (!visibleHeight) return [];

        return [{
          index: Number(panel.dataset.sceneIndex),
          ratio: visibleHeight / rect.height,
          centerDistance: Math.abs(rect.top + rect.height / 2 - (hostRect.top + viewportHeight / 2)),
        }];
      });
      if (!candidates.length) return;

      candidates.sort((first, second) => (
        second.ratio - first.ratio
        || first.centerDistance - second.centerDistance
        || first.index - second.index
      ));

      setActiveScene((current) => {
        if (current === candidates[0].index) return current;
        activeSceneRef.current = candidates[0].index;
        return candidates[0].index;
      });
    };

    const observer = new IntersectionObserver(() => {
      if (sceneAlignmentRef.current) return;
      chooseActivePanel();
    }, { root: scrollHost, threshold: observerThresholds });

    panels.forEach((panel) => observer.observe(panel));
    sceneObserverRef.current = observer;

    return () => {
      observer.disconnect();
      if (sceneObserverRef.current === observer) sceneObserverRef.current = null;
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const scrollHost = sectionRef.current;
    const sentinel = sentinelRef.current;
    if (!scrollHost || !sentinel) return undefined;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) completeIntro("sentinel");
    }, { root: scrollHost });

    observer.observe(sentinel);
    sentinelObserverRef.current = observer;

    return () => {
      observer.disconnect();
      if (sentinelObserverRef.current === observer) sentinelObserverRef.current = null;
    };
  }, [completeIntro, prefersReducedMotion]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") completeIntro("skip");
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [completeIntro]);

  useEffect(() => () => cancelTween(), [cancelTween]);

  const isFinalScene = activeScene === evolutionScenes.length - 1;
  const showFinalLoop = !prefersReducedMotion
    && isFinalScene
    && frameIndex >= frameIndexForTime(FINAL_LOOP_START);

  return (
    <section
      ref={sectionRef}
      className={`evolution-intro evolution-intro--modal${isFinalScene ? " evolution-intro--final" : ""}${prefersReducedMotion ? " evolution-intro--reduced" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Evolucija računala"
      data-active-scene={activeScene}
      data-testid="evolution-intro"
    >
      <div className="evolution-intro__viewport">
        <div className="evolution-intro__media-stage" aria-hidden="true">
          <motion.div
            layout
            layoutDependency={isFinalScene}
            className={`evolution-intro__media-frame${isFinalScene ? " is-contained" : ""}`}
            transition={{ layout: { duration: 0.82, ease: [0.16, 1, 0.3, 1] } }}
          >
            <img
              className="evolution-intro__sequence-frame evolution-intro__sequence-frame--backdrop"
              src={frameSource(showFinalLoop ? frameIndexForTime(FINAL_LOOP_START) : frameIndex)}
              alt=""
              aria-hidden="true"
            />
            <img
              className="evolution-intro__sequence-frame evolution-intro__sequence-frame--picture"
              src={showFinalLoop ? "/evolution-loop.webp" : frameSource(frameIndex)}
              alt=""
              data-frame-time={(showFinalLoop ? FINAL_LOOP_START : frameIndex / FRAME_RATE).toFixed(2)}
              data-testid="evolution-frame"
              onError={() => completeIntro("error")}
            />
          </motion.div>
        </div>

        <div className="evolution-intro__veil" aria-hidden="true" />

        {!isFinalScene && (
          <button
            type="button"
            className="evolution-intro__brand-title"
            aria-label="Nepar Solutions — zatvori animaciju"
            onClick={() => completeIntro("skip")}
          >
            Nepar Solutions
          </button>
        )}

        <div className="evolution-intro__story" aria-live="polite" aria-atomic="true">
          <AnimatePresence initial={false} mode="wait">
            {evolutionScenes[activeScene].copy && (
              <motion.p
                key={activeScene}
                className="evolution-intro__copy"
                data-testid="evolution-copy"
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              >
                {evolutionScenes[activeScene].copy}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="evolution-intro__controls">
          {!prefersReducedMotion && <div className="evolution-intro__progress-wrap">
            <span className="evolution-intro__scroll-cue">
              <ArrowDown aria-hidden="true" size={18} />
              Scrollaj za nastavak
            </span>
            <div
              className="evolution-intro__progress"
              role="progressbar"
              aria-label="Napredak kroz evoluciju računala"
              aria-valuemin={1}
              aria-valuemax={evolutionScenes.length}
              aria-valuenow={activeScene + 1}
            >
              {evolutionScenes.map((scene, index) => (
                <span key={scene.time} className={index <= activeScene ? "is-active" : ""} />
              ))}
            </div>
          </div>}

          <button
            type="button"
            autoFocus
            className="evolution-intro__skip"
            aria-label="Zatvori animaciju"
            onClick={() => completeIntro("skip")}
          >
            Zatvori
            <ArrowRight aria-hidden="true" size={19} />
          </button>
        </div>
      </div>

      <div className="evolution-intro__panels" aria-hidden="true">
        {evolutionScenes.map((scene, index) => (
          <div
            key={scene.time}
            ref={(element) => { panelRefs.current[index] = element; }}
            className="evolution-intro__panel"
            data-scene-index={index}
            data-testid={`evolution-panel-${index}`}
          />
        ))}
        <div className="evolution-intro__exit-space" />
        <div ref={sentinelRef} className="evolution-intro__sentinel" data-testid="evolution-sentinel" />
      </div>
    </section>
  );
}
