import eslintPluginSvelte from 'eslint-plugin-svelte'
import eslintConfigPrettier from 'eslint-config-prettier'
import svelteParser from 'svelte-eslint-parser'
import tsEslint from 'typescript-eslint'
import globals from 'globals'

export default tsEslint.config(
	...eslintPluginSvelte.configs['flat/recommended'],
	eslintConfigPrettier,
	...eslintPluginSvelte.configs['flat/prettier'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: { ...globals.node, ...globals.browser },
			parser: svelteParser,
			parserOptions: {
				parser: tsEslint.parser,
				extraFileExtensions: ['.svelte'],
			},
		},
	},
	{
		ignores: [
			'**/.svelte-kit',
			'**/.vercel',
			'**/.yarn',
			'**/build',
			'**/node_modules',
			'**/package',
		],
	}
)
