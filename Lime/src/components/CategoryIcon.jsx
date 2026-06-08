const icons = {
  frizeri: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6l2 12M10 6l-2 12M14 4l4 16M18 4l-4 16" />
  ),
  barberi: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M6 8v8a2 2 0 002 2h8a2 2 0 002-2V8M9 4v4m6-4v4" />
  ),
  nokti: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14s1.5 2 4 2 4-2 4-2V6a4 4 0 00-8 0v8z" />
  ),
  kozmetika: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" />
  ),
  obrve: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 10c2-2 4-3 8-3s6 1 8 3" />
      <circle cx="12" cy="12" r="2" strokeWidth={1.5} />
    </>
  ),
  masaza: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12c0-4 3-7 7-7s7 3 7 7-3 7-7 7H5z" />
  ),
  wellness: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4c-4 4-6 8-6 12a6 6 0 1012 0c0-4-2-8-6-12z" />
  ),
  depilacija: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 6v12M16 6v12M12 4v16" />
  ),
  makeup: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18l3-10 3 4 3-4 3 10" />
  ),
  fizioterapija: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 14l4-8 4 4 4-6 4 10" />
  ),
  'pet-grooming': (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10a2 2 0 104 0 2 2 0 00-4 0zM6 16a1.5 1.5 0 103 0M15 16a1.5 1.5 0 103 0M12 14v4" />
  ),
  tetoviranje: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4l-1 16M8 8h8M7 12h10" />
  ),
  estetski: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v3m0 12v3M3 12h3m12 0h3" />
  ),
  solariji: (
    <>
      <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeWidth={1.5} d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41" />
    </>
  ),
  piercing: (
    <>
      <circle cx="12" cy="12" r="3" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeWidth={1.5} d="M12 2v4M12 18v4" />
    </>
  ),
}

export function CategoryIcon({ slug, className = 'w-6 h-6' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      {icons[slug] || icons.wellness}
    </svg>
  )
}
