import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import ts from 'typescript-eslint';

const defaultSvelteFiles = ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'];
const svelteKitCoreModules = [
	'$app/environment',
	'$app/paths',
	'$app/server',
	'$app/state',
	'$env/dynamic/private',
	'$env/dynamic/public',
	'$env/static/private',
	'$env/static/public',
	'$lib'
];

function stripFunctions(value) {
	if (Array.isArray(value)) {
		return value.map(stripFunctions);
	}

	if (!value || typeof value !== 'object') {
		return value;
	}

	return Object.fromEntries(
		Object.entries(value)
			.filter(([, entry]) => typeof entry !== 'function')
			.map(([key, entry]) => [key, stripFunctions(entry)])
	);
}

export function createMonorepoEslintConfig({
	repoRoot = import.meta.dirname,
	workspaceRoot = repoRoot,
	gitignorePath = path.resolve(repoRoot, '.gitignore'),
	svelteConfig,
	svelteFiles = defaultSvelteFiles,
	importProjects = [],
	additionalConfigs = [],
	additionalRules = {},
	additionalSettings = {}
} = {}) {
	const resolvedImportProjects = importProjects.map((project) =>
		path.isAbsolute(project) ? project : path.resolve(workspaceRoot, project)
	);

	const config = [
		includeIgnoreFile(gitignorePath),
		js.configs.recommended,
		...ts.configs.recommended,
		importPlugin.flatConfigs.recommended,
		...(svelteConfig ? [svelte.configs.recommended, svelte.configs.prettier] : []),
		prettier,
		{
			languageOptions: {
				globals: { ...globals.browser, ...globals.node }
			},
			settings: {
				'import/core-modules': svelteKitCoreModules,
				...(resolvedImportProjects.length
					? {
						'import/resolver': {
							typescript: {
								project: resolvedImportProjects
							}
						}
					}
					: {}),
				...additionalSettings
			},
			rules: {
				'no-undef': 'off',
				...additionalRules
			}
		},
		{
			files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
			rules: {
				'import/no-unresolved': 'error'
			}
		},
		...(svelteConfig
			? [
				{
					files: svelteFiles,
					languageOptions: {
						parserOptions: {
							tsconfigRootDir: workspaceRoot,
							projectService: true,
							extraFileExtensions: ['.svelte'],
							parser: ts.parser,
							svelteConfig: stripFunctions(svelteConfig)
						}
					},
					rules: {
						'import/no-unresolved': 'off'
					}
				}
			]
			: []),
		...additionalConfigs
	];

	return defineConfig(...config);
}