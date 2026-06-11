import { useState } from "react";
import { assetPath } from "./assetPath.js";

export default function AssetImage({ src, alt, emoji, className = "" }) {
  const resolvedSrc = src ? assetPath(src) : src;
  const [useEmoji, setUseEmoji] = useState(!resolvedSrc);
  const [loaded, setLoaded] = useState(false);

  if (useEmoji || !resolvedSrc) {
    return (
      <span className={`nj-asset-emoji ${className}`.trim()} aria-hidden={alt === ""}>
        {emoji}
      </span>
    );
  }

  return (
    <span className={`nj-asset-wrap ${className}`.trim()}>
      {!loaded && (
        <span className="nj-asset-emoji nj-asset-wrap__fallback" aria-hidden={alt === ""}>
          {emoji}
        </span>
      )}
      <img
        src={resolvedSrc}
        alt={alt}
        className="nj-asset-img"
        onLoad={(event) => {
          if (event.currentTarget.naturalWidth === 0) {
            setUseEmoji(true);
            return;
          }
          setLoaded(true);
        }}
        onError={() => setUseEmoji(true)}
        draggable={false}
        decoding="async"
        hidden={!loaded}
      />
    </span>
  );
}
