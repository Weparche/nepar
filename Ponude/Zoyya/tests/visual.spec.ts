import { test, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const screenshotsDir = path.join(__dirname, '..', 'screenshots')

test.describe('Zoyya Marketplace Visual QA', () => {
  test('homepage sections and interactions', async ({ page }) => {
    test.setTimeout(60000)
    await page.goto('/')
    await page.waitForSelector('[data-testid="zoyya-app"]')

    // Main UI sections exist
    await expect(page.getByTestId('zoyya-app')).toBeVisible()

    // Desktop viewport
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.waitForTimeout(1500) // allow map tiles to load

    const desktop = page.getByTestId('desktop-layout')
    await expect(desktop.getByTestId('marketplace-map')).toBeVisible()
    await expect(desktop.getByTestId('recommended-salons')).toBeVisible()
    await expect(desktop.getByTestId('quick-filters')).toBeVisible()

    await page.screenshot({
      path: path.join(screenshotsDir, 'zoyya-desktop.png'),
      fullPage: true,
    })

    // Category filter
    await desktop.getByTestId('category-frizeri').click()
    await expect(desktop.getByTestId('salon-card-1')).toBeVisible()
    await expect(desktop.getByTestId('salon-card-11')).toBeVisible()

    // Favorite toggle
    await desktop.getByTestId('favorite-1').click()

    // Salon card opens detail
    await desktop.getByTestId('salon-card-1').locator('h3').click()
    await expect(page.getByTestId('salon-detail-modal')).toBeVisible()
    await page.getByLabel('Zatvori').click()

    // Booking flow
    await desktop.getByTestId('salon-card-1').getByRole('button', { name: 'Rezerviraj termin' }).click()
    await expect(page.getByTestId('booking-flow')).toBeVisible()
    await expect(page.getByTestId('booking-step-1')).toBeVisible()

    await page.getByTestId('booking-service-s1').click()
    await expect(page.getByTestId('booking-step-2')).toBeVisible()

    await page.getByTestId('slot-Danas-13:00').click()
    await expect(page.getByTestId('booking-step-3')).toBeVisible()

    await page.getByLabel('Ime i prezime').fill('Ana Horvat')
    await page.getByLabel('Mobitel').fill('+385 91 123 4567')
    await page.getByLabel('Email').fill('ana@example.com')
    await page.getByTestId('confirm-booking').click()

    await expect(page.getByTestId('booking-confirmed')).toBeVisible()
    await page.getByRole('button', { name: 'Zatvori' }).click()

    // Mobile viewport
    await page.setViewportSize({ width: 390, height: 844 })
    await page.waitForTimeout(1500)

    const mobile = page.getByTestId('mobile-layout')
    await expect(mobile.getByTestId('mobile-bottom-nav')).toBeVisible()
    await expect(mobile.getByTestId('mobile-salon-list')).toBeVisible()

    await page.screenshot({
      path: path.join(screenshotsDir, 'zoyya-mobile.png'),
      fullPage: true,
    })

    // Mobile category
    await mobile.getByTestId('mobile-category-nokti').click()
    await expect(mobile.getByTestId('salon-card-2')).toBeVisible()

    // Mobile favorite
    await mobile.getByTestId('favorite-2').click()
  })
})
