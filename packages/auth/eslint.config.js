import path from 'node:path';
import { createMonorepoEslintConfig } from '../../eslint.config.base.js';
import svelteConfig from './svelte.config.js';

export default createMonorepoEslintConfig({
	repoRoot: path.resolve(import.meta.dirname, '../..'),
	workspaceRoot: import.meta.dirname,
	svelteConfig,
	importProjects: ['tsconfig.json']
});
