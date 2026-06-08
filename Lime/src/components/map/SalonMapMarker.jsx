import L from 'leaflet'
import { getCategoryMapStyle } from '../../data/categoryMapStyles'

function getPinStyles(categorySlug, active) {
  const cat = getCategoryMapStyle(categorySlug)
  return {
    cat,
    pinBg: active ? '#3d8d5e' : cat.pinColor,
    pinBorder: active ? '#2d7a4e' : cat.pinColor,
    shadow: active
      ? '0 6px 18px rgba(61,141,94,0.4)'
      : '0 3px 12px rgba(15,23,42,0.18)',
  }
}

function pinHtml(categorySlug, { active = false } = {}) {
  const { cat, pinBg, pinBorder } = getPinStyles(categorySlug, active)
  return `
    <div class="salon-map-marker__pin">
      <div
        class="salon-map-marker__pin-head"
        style="background:${pinBg};border:2.5px solid ${pinBorder};"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" aria-hidden="true">
          ${cat.paths}
        </svg>
      </div>
      <div class="salon-map-marker__pin-tail" style="background:${pinBg};"></div>
    </div>
  `
}

/** Pin s ikonom kategorije — bez ocjene (širi zoom) */
export function createCategoryPinIcon(categorySlug, { active = false } = {}) {
  const { shadow } = getPinStyles(categorySlug, active)
  return L.divIcon({
    className: 'salon-map-marker salon-map-marker--pin-only',
    html: `<div class="salon-map-marker__stack" style="filter:drop-shadow(${shadow})">${pinHtml(categorySlug, { active })}</div>`,
    iconSize: [44, 36],
    iconAnchor: [22, 36],
    popupAnchor: [0, -38],
  })
}

/** Pin + ocjena ispod (uža zoom) */
export function createCategoryRatingIcon(rating, categorySlug, { active = false } = {}) {
  const { shadow } = getPinStyles(categorySlug, active)
  const scoreBg = active ? '#3d8d5e' : '#4fa872'
  const scoreBorder = active ? '#2d7a4e' : '#3d9a64'
  return L.divIcon({
    className: 'salon-map-marker',
    html: `
      <div class="salon-map-marker__stack" style="filter:drop-shadow(${shadow})">
        ${pinHtml(categorySlug, { active })}
        <div
          class="salon-map-marker__score"
          style="background:${scoreBg};color:#ffffff;border:2px solid ${scoreBorder};${active ? 'transform:scale(1.05);' : ''}"
        >
          ${rating.toFixed(1)}
        </div>
      </div>
    `,
    iconSize: [44, 54],
    iconAnchor: [22, 36],
    popupAnchor: [0, -40],
  })
}

/** @deprecated use createCategoryRatingIcon */
export function createRatingIcon(rating, options) {
  return createCategoryRatingIcon(rating, 'wellness', options)
}
