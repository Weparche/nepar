import { useState } from 'react'

const STYLES = {
  'Frizerski saloni': { gradient: 'from-stone-200 via-stone-100 to-lime-50', accent: 'bg-stone-400/20' },
  Barberi: { gradient: 'from-slate-300 via-slate-200 to-slate-100', accent: 'bg-slate-500/15' },
  Nokti: { gradient: 'from-rose-100 via-pink-50 to-white', accent: 'bg-rose-300/25' },
  'Kozmetički saloni': { gradient: 'from-amber-50 via-orange-50/80 to-white', accent: 'bg-amber-200/30' },
  'Obrve i trepavice': { gradient: 'from-violet-100 via-purple-50 to-white', accent: 'bg-violet-200/25' },
  Masaže: { gradient: 'from-teal-100 via-emerald-50 to-lime-50', accent: 'bg-teal-300/20' },
  'Wellness i spa': { gradient: 'from-cyan-100 via-sky-50 to-lime-50', accent: 'bg-cyan-200/25' },
  'Make-up': { gradient: 'from-fuchsia-100 via-rose-50 to-white', accent: 'bg-fuchsia-200/20' },
  Depilacija: { gradient: 'from-lime-100 via-lime-50 to-white', accent: 'bg-lime-300/25' },
  Fizioterapija: { gradient: 'from-blue-100 via-slate-50 to-white', accent: 'bg-blue-200/20' },
  'Estetski tretmani': { gradient: 'from-amber-100 via-stone-50 to-white', accent: 'bg-amber-200/20' },
  Solariji: { gradient: 'from-orange-100 via-yellow-50 to-white', accent: 'bg-orange-200/25' },
  Tetoviranje: { gradient: 'from-zinc-300 via-zinc-200 to-zinc-100', accent: 'bg-zinc-500/15' },
  Piercing: { gradient: 'from-slate-200 via-zinc-100 to-white', accent: 'bg-slate-400/20' },
  'Pet grooming': { gradient: 'from-amber-100 via-lime-50 to-emerald-50', accent: 'bg-amber-300/20' },
}

const DEFAULT = STYLES['Frizerski saloni']

export function SalonCover({
  category,
  name,
  imageUrl,
  imageFallbackSlug,
  aspect = '4/3',
  className = '',
}) {
  const style = STYLES[category] || DEFAULT
  const initial = name?.charAt(0)?.toUpperCase() || 'L'
  const aspectStyle = aspect === 'auto' ? undefined : { aspectRatio: aspect }
  const [imgFailed, setImgFailed] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [fallbackSrc, setFallbackSrc] = useState(null)
  const src = fallbackSrc || imageUrl
  const showImage = src && !imgFailed

  function handleImgError() {
    if (!fallbackSrc && imageFallbackSlug) {
      setFallbackSrc(`https://picsum.photos/seed/${imageFallbackSlug}/800/600`)
      setImgLoaded(false)
      return
    }
    setImgFailed(true)
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${style.gradient} ${className}`}
      style={aspectStyle}
      role="img"
      aria-label={`Fotografija salona ${name}`}
    >
      {showImage && (
        <>
          {!imgLoaded && (
            <div className="absolute inset-0 bg-slate-100 animate-pulse motion-reduce:animate-none" aria-hidden />
          )}
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImgLoaded(true)}
            onError={handleImgError}
          />
        </>
      )}
      {!showImage && (
        <>
          <div
            className={`absolute inset-0 salon-cover-pattern opacity-60 ${style.accent}`}
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            }}
          />
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/95 bg-black/25 backdrop-blur-sm px-2 py-1 rounded-md">
          {category.split(' ')[0]}
        </span>
        <span className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur text-lime-700 font-bold text-sm flex items-center justify-center shadow-sm">
          {initial}
        </span>
      </div>
    </div>
  )
}
