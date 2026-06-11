import AssetImage from "./AssetImage.jsx";

export default function SafeImage({ src, alt, fallbackEmoji, className = "" }) {
  return (
    <AssetImage src={src} alt={alt} emoji={fallbackEmoji} className={className} />
  );
}
