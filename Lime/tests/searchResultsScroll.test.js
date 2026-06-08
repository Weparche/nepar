import { describe, expect, it } from 'vitest'
import {
  getScrollClampAfterFilter,
  getScrollTargetAfterFilter,
} from '../src/utils/searchResultsScroll.js'

/** Riley: skrol na "Sve" → odaberi kategoriju → bez footera */
describe('searchResultsScroll', () => {
  describe('scrollToResultsHeadingBeforeFilter (prije navigacije)', () => {
    it('cilj je naslov rezultata, ne dno stranice', () => {
      const target = getScrollTargetAfterFilter({
        scrollY: 2800,
        headingTop: 420,
        maxScroll: 5200,
      })
      expect(target).toBe(420)
    })
  })

  describe('getScrollClampAfterFilter (nakon navigacije)', () => {
    it('ne pomiče scroll ako je unutar dokumenta', () => {
      expect(
        getScrollClampAfterFilter({
          scrollY: 120,
          headingTop: 420,
          maxScroll: 520,
        }),
      ).toBe(120)
    })

    it('spušta scroll samo kad je ispod kraja (footer flash)', () => {
      expect(
        getScrollClampAfterFilter({
          scrollY: 2800,
          headingTop: 420,
          maxScroll: 520,
        }),
      ).toBe(420)
    })

    it('koristi maxScroll kad je naslov ispod dostupnog skrola', () => {
      expect(
        getScrollClampAfterFilter({
          scrollY: 900,
          headingTop: 800,
          maxScroll: 500,
        }),
      ).toBe(500)
    })
  })
})
