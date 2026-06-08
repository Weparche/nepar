import { useLayoutEffect, useRef } from 'react'
import {
  getMaxScrollY,
  getResultsHeadingTop,
  getScrollClampAfterFilter,
} from '../utils/searchResultsScroll'

/**
 * Nakon promjene rute: samo spriječi scroll ispod footera (bez skoka gore/dolje).
 * Glavni scroll na naslov radi scrollToResultsHeadingBeforeFilter() na klik kategorije.
 */
export function useSearchResultsScroll({ city, category, query }) {
  const skip = useRef(true)
  const prev = useRef({ city, category, query })

  useLayoutEffect(() => {
    const changed =
      prev.current.city !== city ||
      prev.current.category !== category ||
      prev.current.query !== query

    prev.current = { city, category, query }

    if (!changed || skip.current) {
      skip.current = false
      return
    }

    const targetY = getScrollClampAfterFilter({
      scrollY: window.scrollY,
      headingTop: getResultsHeadingTop(),
      maxScroll: getMaxScrollY(),
    })

    if (window.scrollY !== targetY) {
      window.scrollTo({ top: targetY, left: 0, behavior: 'instant' })
    }
  }, [city, category, query])
}
