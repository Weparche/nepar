import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

/** Leaflet treba invalidateSize nakon što kontejner postane vidljiv (npr. mobilni overlay). */
export function MapInvalidateSize({ trigger = 0 }) {
  const map = useMap()

  useEffect(() => {
    const t = setTimeout(() => {
      map.invalidateSize({ animate: false })
    }, 150)
    return () => clearTimeout(t)
  }, [map, trigger])

  return null
}
