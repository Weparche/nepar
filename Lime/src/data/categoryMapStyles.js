/** SVG pathovi i boje markera po kategoriji (Leaflet divIcon) */
export const CATEGORY_MAP_STYLES = {
  frizeri: {
    label: 'Frizer',
    pinColor: '#78716c',
    iconColor: '#ffffff',
    paths: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l2 12M10 6l-2 12M14 4l4 16M18 4l-4 16"/>',
  },
  barberi: {
    label: 'Barber',
    pinColor: '#475569',
    iconColor: '#ffffff',
    paths: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M6 8v8a2 2 0 002 2h8a2 2 0 002-2V8M9 4v4m6-4v4"/>',
  },
  nokti: {
    label: 'Nokti',
    pinColor: '#db2777',
    iconColor: '#ffffff',
    paths: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14s1.5 2 4 2 4-2 4-2V6a4 4 0 00-8 0v8z"/>',
  },
  kozmetika: {
    label: 'Kozmetika',
    pinColor: '#d97706',
    iconColor: '#ffffff',
    paths: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1"/>',
  },
  obrve: {
    label: 'Obrve',
    pinColor: '#7c3aed',
    iconColor: '#ffffff',
    paths: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10c2-2 4-3 8-3s6 1 8 3"/><circle cx="12" cy="12" r="2" stroke-width="2"/>',
  },
  masaza: {
    label: 'Masaža',
    pinColor: '#0d9488',
    iconColor: '#ffffff',
    paths: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12c0-4 3-7 7-7s7 3 7 7-3 7-7 7H5z"/>',
  },
  wellness: {
    label: 'Wellness',
    pinColor: '#0891b2',
    iconColor: '#ffffff',
    paths: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4c-4 4-6 8-6 12a6 6 0 1012 0c0-4-2-8-6-12z"/>',
  },
  depilacija: {
    label: 'Depilacija',
    pinColor: '#65a30d',
    iconColor: '#ffffff',
    paths: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6v12M16 6v12M12 4v16"/>',
  },
  makeup: {
    label: 'Make-up',
    pinColor: '#c026d3',
    iconColor: '#ffffff',
    paths: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18l3-10 3 4 3-4 3 10"/>',
  },
  fizioterapija: {
    label: 'Fizio',
    pinColor: '#2563eb',
    iconColor: '#ffffff',
    paths: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 14l4-8 4 4 4-6 4 10"/>',
  },
  estetski: {
    label: 'Estetika',
    pinColor: '#b45309',
    iconColor: '#ffffff',
    paths: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v3m0 12v3M3 12h3m12 0h3"/>',
  },
  solariji: {
    label: 'Solarij',
    pinColor: '#ea580c',
    iconColor: '#ffffff',
    paths: '<circle cx="12" cy="12" r="4" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41"/>',
  },
  tetoviranje: {
    label: 'Tattoo',
    pinColor: '#3f3f46',
    iconColor: '#ffffff',
    paths: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4l-1 16M8 8h8M7 12h10"/>',
  },
  piercing: {
    label: 'Piercing',
    pinColor: '#6366f1',
    iconColor: '#ffffff',
    paths: '<circle cx="12" cy="12" r="3" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M12 2v4M12 18v4"/>',
  },
  'pet-grooming': {
    label: 'Pet',
    pinColor: '#ca8a04',
    iconColor: '#ffffff',
    paths: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10a2 2 0 104 0 2 2 0 00-4 0zM6 16a1.5 1.5 0 103 0M15 16a1.5 1.5 0 103 0M12 14v4"/>',
  },
}

export function getCategoryMapStyle(categorySlug) {
  return CATEGORY_MAP_STYLES[categorySlug] || CATEGORY_MAP_STYLES.wellness
}
