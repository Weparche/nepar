import { useCallback, useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { MapFitBounds } from './MapFitBounds'
import { MapInvalidateSize } from './MapInvalidateSize'
import { MapSalonMarkers } from './MapSalonMarkers'
import { getCityCenter } from '../../data/salonCoordinates'
import 'leaflet/dist/leaflet.css'

export function SalonsMap({
  salons,
  citySlug = 'zagreb',
  selectedSlug = null,
  onMarkerClick,
  className = '',
  resizeTrigger = 0,
}) {
  const mappable = useMemo(
    () => salons.filter((s) => s.lat != null && s.lng != null),
    [salons],
  )

  const center = getCityCenter(citySlug)
  const [baselineZoom, setBaselineZoom] = useState(null)
  const handleBaselineZoom = useCallback((z) => setBaselineZoom(z), [])

  if (mappable.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-surface-muted text-sm text-ink-muted ${className}`}>
        Nema lokacija za prikaz na karti.
      </div>
    )
  }

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={center.zoom}
      className={`salons-leaflet-map z-0 ${className}`}
      scrollWheelZoom
      aria-label="Karta salona"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapInvalidateSize trigger={resizeTrigger} />
      <MapFitBounds salons={mappable} citySlug={citySlug} onBaselineZoom={handleBaselineZoom} />
      <MapSalonMarkers
        salons={mappable}
        selectedSlug={selectedSlug}
        onMarkerClick={onMarkerClick}
        baselineZoom={baselineZoom}
      />
    </MapContainer>
  )
}
