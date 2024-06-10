import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
	use: {
		baseURL: process.env.BASE_URL || 'http://localhost:4173',
	},
	testDir: 'tests',
}

export default config
