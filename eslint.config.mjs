import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';

export default [
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', 'node_modules/']
	},
	...svelte.configs['flat/prettier'],
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelte.parsers['svelte-eslint-parser'],
			parserOptions: {
				parser: tseslint.parser,
				svelteFeatures: {
					experimentalGenerics: true,
					experimentalReactiveDependencyTracking: true
				}
			}
		},
		plugins: {
			svelte
		},
		rules: {
			...svelte.configs.recommended.rules
		}
	},
	{
		files: ['**/*.{js,ts,svelte}'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module'
		},
		extends: [prettier],
		rules: {
			'prettier/prettier': 'off'
		}
	}
];

