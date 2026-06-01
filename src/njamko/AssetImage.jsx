import { useState } from "react";

export default function AssetImage({ src, alt, emoji, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <span className={`nj-asset-emoji ${className}`.trim()} aria-hidden={alt === ""}>
        {emoji}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`nj-asset-img ${className}`.trim()}
      onError={() => setFailed(true)}
      draggable={false}
    />
  );
}
