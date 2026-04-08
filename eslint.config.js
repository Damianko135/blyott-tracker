import path from 'node:path';
import { createMonorepoEslintConfig } from './eslint.config.base.js';

export default createMonorepoEslintConfig({
  repoRoot: import.meta.dirname,
  workspaceRoot: import.meta.dirname,
  gitignorePath: path.resolve(import.meta.dirname, '.gitignore')
});
