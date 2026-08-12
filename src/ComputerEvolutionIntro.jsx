import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export const EVOLUTION_INTRO_SESSION_KEY = "nepar:evolution-intro-seen";

const SCENE_TRANSITION_MS = 1350;
const SECOND_TO_THIRD_TRANSITION_MS = 1150;
const FINAL_LOOP_START = 18;
const FINAL_LOOP_END = 20;

export const evolutionScenes = [
  { time: 0.2, copy: "Računalo je počelo kao alat na jednom stolu." },
  { time: 3.8, copy: "Grafička sučelja približila su tehnologiju svima." },
  { time: 8.3, copy: "Internet je povezao cijeli svijet." },
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
  const [activeScene, setActiveScene] = useState(0);
  const videoRef = useRef(null);
  const panelRefs = useRef([]);
  const sentinelRef = useRef(null);
  const sceneObserverRef = useRef(null);
  const sentinelObserverRef = useRef(null);
  const animationFrameRef = useRef(null);
  const activeSceneRef = useRef(0);
  const previousSceneRef = useRef(0);
  const wheelGestureRef = useRef(false);
  const wheelGestureTimerRef = useRef(null);
  const pendingTargetRef = useRef(0);
  const pendingDurationRef = useRef(SCENE_TRANSITION_MS);
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
    videoRef.current?.pause();
    onComplete(reason);
  }, [cancelTween, onComplete]);

  const tweenTo = useCallback((targetTime, transitionDuration = SCENE_TRANSITION_MS) => {
    pendingTargetRef.current = targetTime;
    pendingDurationRef.current = transitionDuration;
    cancelTween();

    const video = videoRef.current;
    if (!video || video.readyState < 1) return;

    video.pause();
    const startTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;
    const distance = targetTime - startTime;
    if (Math.abs(distance) < 0.02) {
      video.currentTime = targetTime;
      return;
    }

    const startedAt = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - startedAt) / transitionDuration);
      video.currentTime = startTime + distance * sceneEase(progress);

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      video.currentTime = targetTime;
      animationFrameRef.current = null;

      if (
        targetTime === evolutionScenes.at(-1).time
        && activeSceneRef.current === evolutionScenes.length - 1
      ) {
        video.play().catch(() => {
          // The stable brand frame remains visible if playback is unavailable.
        });
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(step);
  }, [cancelTween]);

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
    const endWheelGesture = () => {
      wheelGestureRef.current = false;
      wheelGestureTimerRef.current = null;
    };

    const onWheel = (event) => {
      if (completedRef.current || Math.abs(event.deltaY) < 2) return;
      event.preventDefault();

      if (wheelGestureRef.current) return;
      wheelGestureRef.current = true;
      wheelGestureTimerRef.current = window.setTimeout(
        endWheelGesture,
        SCENE_TRANSITION_MS + 120,
      );

      const direction = event.deltaY > 0 ? 1 : -1;
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
      setActiveScene(next);

      const targetPanel = panelRefs.current[next];
      if (targetPanel) {
        const targetTop = targetPanel.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: targetTop, left: 0, behavior: "auto" });
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      if (wheelGestureTimerRef.current !== null) {
        window.clearTimeout(wheelGestureTimerRef.current);
      }
    };
  }, [completeIntro]);

  useEffect(() => {
    const panels = panelRefs.current.filter(Boolean);
    if (!panels.length) return undefined;

    const chooseActivePanel = () => {
      const viewportHeight = window.innerHeight;
      const candidates = panels.flatMap((panel) => {
        const rect = panel.getBoundingClientRect();
        const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
        if (!visibleHeight) return [];

        return [{
          index: Number(panel.dataset.sceneIndex),
          ratio: visibleHeight / rect.height,
          centerDistance: Math.abs(rect.top + rect.height / 2 - viewportHeight / 2),
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
      chooseActivePanel();
    }, { threshold: observerThresholds });

    panels.forEach((panel) => observer.observe(panel));
    sceneObserverRef.current = observer;

    return () => {
      observer.disconnect();
      if (sceneObserverRef.current === observer) sceneObserverRef.current = null;
    };
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) completeIntro("sentinel");
    });

    observer.observe(sentinel);
    sentinelObserverRef.current = observer;

    return () => {
      observer.disconnect();
      if (sentinelObserverRef.current === observer) sentinelObserverRef.current = null;
    };
  }, [completeIntro]);

  useEffect(() => () => cancelTween(), [cancelTween]);

  const onLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    tweenTo(pendingTargetRef.current, pendingDurationRef.current);
  };

  const isFinalScene = activeScene === evolutionScenes.length - 1;

  const keepFinalSceneLooping = () => {
    const video = videoRef.current;
    if (!video || !isFinalScene || video.currentTime < FINAL_LOOP_END) return;
    video.currentTime = FINAL_LOOP_START;
    video.play().catch(() => {
      // The stable brand frame remains visible if playback is unavailable.
    });
  };

  return (
    <section
      className={`evolution-intro${isFinalScene ? " evolution-intro--final" : ""}`}
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
            <video
              ref={videoRef}
              className="evolution-intro__video"
              src="/nepar-animacija.mp4"
              muted
              playsInline
              preload="auto"
              tabIndex={-1}
              data-testid="evolution-video"
              onLoadedMetadata={onLoadedMetadata}
              onTimeUpdate={keepFinalSceneLooping}
              onError={() => completeIntro("error")}
              onEnded={keepFinalSceneLooping}
            />
          </motion.div>
        </div>

        <div className="evolution-intro__veil" aria-hidden="true" />

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
          <div className="evolution-intro__progress-wrap">
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
          </div>

          <button
            type="button"
            className="evolution-intro__skip"
            aria-label="Preskoči uvod i idi na web"
            onClick={() => completeIntro("skip")}
          >
            Idi na web
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
