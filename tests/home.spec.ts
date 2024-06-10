import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
	await page.goto('/')

	await expect(page).toHaveTitle(/Blog/)
})

test('aboout link', async ({ page }) => {
	await page.goto('/')

	await page.getByRole('link', { name: 'About' }).first().click()

	await expect(page).toHaveURL(/about/)
})
