import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { createCategoryRatingIcon } from './SalonMapMarker'
import 'leaflet/dist/leaflet.css'

export function SalonLocationMap({ salon, className = '' }) {
  if (salon.lat == null || salon.lng == null) {
    return (
      <div className={`flex items-center justify-center bg-surface-muted text-sm text-ink-muted ${className}`}>
        Lokacija nije dostupna.
      </div>
    )
  }

  return (
    <MapContainer
      center={[salon.lat, salon.lng]}
      zoom={16}
      className={`salons-leaflet-map z-0 ${className}`}
      scrollWheelZoom={false}
      aria-label={`Karta lokacije salona ${salon.name}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[salon.lat, salon.lng]}
        icon={createCategoryRatingIcon(salon.rating, salon.categorySlug, { active: true })}
      >
        <Popup>
          <strong>{salon.name}</strong>
          <br />
          <span className="text-sm">{salon.address}</span>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
