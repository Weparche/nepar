import { useCallback, useEffect, useState } from 'react'
import { Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import { createCategoryPinIcon, createCategoryRatingIcon } from './SalonMapMarker'
import { MapSalonPopupContent } from './MapPanel'
import { getCategoryMapStyle } from '../../data/categoryMapStyles'

export function MapSalonMarkers({ salons, selectedSlug, onMarkerClick, baselineZoom }) {
  const map = useMap()
  const [zoom, setZoom] = useState(() => map.getZoom())

  const syncZoom = useCallback(() => {
    setZoom(map.getZoom())
  }, [map])

  useMapEvents({
    zoomend: syncZoom,
    moveend: syncZoom,
  })

  useEffect(() => {
    syncZoom()
  }, [syncZoom, baselineZoom])

  const showRatings = baselineZoom != null && zoom >= baselineZoom + 1

  return (
    <>
      {salons.map((salon) => {
        const style = getCategoryMapStyle(salon.categorySlug)
        const active = selectedSlug === salon.slug
        const icon = showRatings
          ? createCategoryRatingIcon(salon.rating, salon.categorySlug, { active })
          : createCategoryPinIcon(salon.categorySlug, { active })
        const tooltipOffset = showRatings ? [0, -40] : [0, -38]

        return (
          <Marker
            key={salon.id}
            position={[salon.lat, salon.lng]}
            icon={icon}
            eventHandlers={{
              click: () => onMarkerClick?.(salon),
            }}
          >
            <Tooltip
              direction="top"
              offset={tooltipOffset}
              opacity={0.95}
              className="salon-map-tooltip"
            >
              <span className="font-semibold text-xs">{salon.name}</span>
              <span className="text-[10px] opacity-90"> · {style.label}</span>
            </Tooltip>
            <Popup closeButton className="salon-leaflet-popup" maxWidth={280}>
              <MapSalonPopupContent salon={salon} />
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}
