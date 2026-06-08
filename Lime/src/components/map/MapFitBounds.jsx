import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

export function MapFitBounds({ salons, citySlug, onBaselineZoom }) {
  const map = useMap()
  const fittedCity = useRef(null)

  useEffect(() => {
    const points = salons.filter((s) => s.lat != null && s.lng != null)
    const reportBaseline = () => {
      onBaselineZoom?.(map.getZoom())
    }

    if (points.length === 0) {
      reportBaseline()
      return
    }

    const shouldFit = fittedCity.current !== citySlug
    fittedCity.current = citySlug

    if (!shouldFit) {
      reportBaseline()
      return
    }

    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 15, { animate: true })
      map.once('moveend', reportBaseline)
      return () => map.off('moveend', reportBaseline)
    }

    const bounds = L.latLngBounds(points.map((s) => [s.lat, s.lng]))
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14, animate: true })
    map.once('moveend', reportBaseline)
    return () => map.off('moveend', reportBaseline)
  }, [map, salons, citySlug, onBaselineZoom])

  return null
}
