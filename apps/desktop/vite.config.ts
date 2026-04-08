import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { defineConfig, defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: defineConfig({
      plugins: [
        tailwindcss(),
        sveltekit(),
        viteStaticCopy({
          // don't point to static directory, point to finished build directory (static -> / after build)
          targets: [{ src: '../../packages/ui/static/fonts/*', dest: 'fonts' }]
        })
      ],
      server: {
        fs: {
          allow: ['../../']
        }
      }
    }),
    plugins: [svelteTesting()],
    test: {
      name: 'client',
      environment: 'jsdom',
      clearMocks: true,
      include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
      exclude: ['src/lib/server/**'],
      setupFiles: ['./vitest-setup-client.ts']
    }
  },
  {
    extends: defineConfig({
      plugins: [
        tailwindcss(),
        sveltekit(),
        viteStaticCopy({
          // don't point to static directory, point to finished build directory (static -> / after build)
          targets: [{ src: '../../packages/ui/static/fonts/*', dest: 'fonts' }]
        })
      ],
      server: {
        fs: {
          allow: ['../../']
        }
      }
    }),
    test: {
      name: 'server',
      environment: 'node',
      include: ['src/**/*.{test,spec}.{js,ts}'],
      exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
    }
  }
]);

