import { useEffect, useRef, useState } from "react";

type LoopVideoCardProps = {
  posterSrc?: string;
  videoSrc?: string;
  alt?: string;
  isActive?: boolean;
  className?: string;
};

const DEFAULT_POSTER_SRC = "/assets/backgrounds/food-rabbit-mobile.webp";
const DEFAULT_VIDEO_SRC = "/assets/backgrounds/njamko-rabbit-loop.webm";
const DEFAULT_ALT = "Zeko na livadi";

function getPrefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function LoopVideoCard({
  posterSrc = DEFAULT_POSTER_SRC,
  videoSrc = DEFAULT_VIDEO_SRC,
  alt = DEFAULT_ALT,
  isActive = true,
  className = "",
}: LoopVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    getPrefersReducedMotion,
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    setIsReady(false);
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isActive || prefersReducedMotion || !isReady) {
      video.pause();
      return;
    }

    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        video.pause();
      });
    }
  }, [isActive, isReady, prefersReducedMotion]);

  const handleVideoReady = () => {
    setIsReady(true);
  };

  const classes = [
    "nj-loop-video-card",
    isReady && !prefersReducedMotion ? "nj-loop-video-card--ready" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} data-testid="loop-video-card">
      <img
        src={posterSrc}
        alt={alt}
        className="nj-loop-video-card__poster"
        draggable={false}
      />

      {!prefersReducedMotion && (
        <video
          ref={videoRef}
          className="nj-loop-video-card__video"
          src={videoSrc}
          poster={posterSrc}
          autoPlay={isActive}
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onLoadedData={handleVideoReady}
          onCanPlay={handleVideoReady}
        />
      )}
    </div>
  );
}
