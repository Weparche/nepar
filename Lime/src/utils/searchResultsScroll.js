/** Offset ispod sticky headera (4.25rem) */
export const SEARCH_HEADER_OFFSET = 88

export function getResultsHeadingTop() {
  const heading = document.getElementById('search-results-heading')
  if (!heading) return 0
  return Math.max(0, heading.getBoundingClientRect().top + window.scrollY - SEARCH_HEADER_OFFSET)
}

export function getMaxScrollY() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
}

export function getScrollTargetAfterFilter({
  scrollY,
  headingTop,
  maxScroll,
  threshold = 32,
}) {
  const target = Math.min(Math.max(0, headingTop), Math.max(0, maxScroll))
  if (scrollY > target + threshold) return target
  return scrollY
}

/**
 * Prije promjene kategorije (dok je lista još visoka) — bez bljeska footera.
 */
export function scrollToResultsHeadingBeforeFilter() {
  const target = getScrollTargetAfterFilter({
    scrollY: window.scrollY,
    headingTop: getResultsHeadingTop(),
    maxScroll: getMaxScrollY(),
  })
  if (window.scrollY !== target) {
    window.scrollTo({ top: target, left: 0, behavior: 'instant' })
  }
}

/**
 * Nakon navigacije: samo korigiraj scroll ispod kraja dokumenta.
 */
export function getScrollClampAfterFilter({ scrollY, headingTop, maxScroll }) {
  const safeMax = Math.max(0, maxScroll)
  if (scrollY <= safeMax + 1) return scrollY
  return Math.min(Math.max(0, headingTop), safeMax)
}
