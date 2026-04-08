import path from 'node:path';
import { createMonorepoEslintConfig } from '../../eslint.config.base.js';

export default createMonorepoEslintConfig({
  repoRoot: path.resolve(import.meta.dirname, '../..'),
  workspaceRoot: import.meta.dirname,
  importProjects: ['tsconfig.json']
});
