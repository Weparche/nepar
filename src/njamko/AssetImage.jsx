import { useState } from "react";

export default function AssetImage({ src, alt, emoji, className = "" }) {
  const [useEmoji, setUseEmoji] = useState(!src);
  const [loaded, setLoaded] = useState(false);

  if (useEmoji || !src) {
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
        src={src}
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
