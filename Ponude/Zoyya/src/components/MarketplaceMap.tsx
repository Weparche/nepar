import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { getCategoryIcon } from '../data/categories'
import type { Salon } from '../types'

interface MarketplaceMapProps {
  salons: Salon[]
  onSalonClick: (salon: Salon) => void
  height?: string
  showSearchArea?: boolean
  showListButton?: boolean
  onShowList?: () => void
}

const ZAGREB_CENTER: [number, number] = [45.815, 15.982]

export default function MarketplaceMap({
  salons,
  onSalonClick,
  height = '380px',
  showSearchArea = true,
  showListButton = false,
  onShowList,
}: MarketplaceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current, {
      center: ZAGREB_CENTER,
      zoom: 13,
      zoomControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    mapInstance.current = map

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapInstance.current
    if (!map) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    salons.forEach((salon) => {
      const Icon = getCategoryIcon(salon.category)
      const iconHtml = renderToStaticMarkup(
        <div className="zoyya-marker-inner">
          <div className="zoyya-marker-pin">
            <Icon size={16} strokeWidth={2.5} />
          </div>
          <span className="zoyya-marker-rating">{salon.rating}</span>
        </div>,
      )

      const icon = L.divIcon({
        html: iconHtml,
        className: 'zoyya-marker',
        iconSize: [40, 50],
        iconAnchor: [20, 45],
      })

      const marker = L.marker([salon.lat, salon.lng], { icon })
        .addTo(map)
        .on('click', () => onSalonClick(salon))

      markersRef.current.push(marker)
    })

    if (salons.length > 0) {
      const bounds = L.latLngBounds(salons.map((s) => [s.lat, s.lng] as [number, number]))
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
    }
  }, [salons, onSalonClick])

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm"
      data-testid="marketplace-map"
      style={{ height }}
    >
      <div ref={mapRef} className="h-full w-full" />

      {showSearchArea && (
        <button
          type="button"
          className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-zoyya-700 shadow-lg transition hover:bg-zoyya-50"
        >
          Pretraži ovo područje
        </button>
      )}

      {showListButton && (
        <button
          type="button"
          onClick={onShowList}
          className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-zoyya-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-zoyya-700"
        >
          Prikaži listu
        </button>
      )}
    </div>
  )
}

export function MiniMap({ salon }: { salon: Salon }) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const map = L.map(mapRef.current, {
      center: [salon.lat, salon.lng],
      zoom: 15,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

    L.circleMarker([salon.lat, salon.lng], {
      radius: 8,
      fillColor: '#7c3aed',
      color: '#fff',
      weight: 2,
      fillOpacity: 1,
    }).addTo(map)

    return () => {
      map.remove()
    }
  }, [salon])

  return <div ref={mapRef} className="h-32 w-full rounded-xl" />
}
