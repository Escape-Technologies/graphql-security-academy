import { nodeResolve } from '@rollup/plugin-node-resolve';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // plugin-node-resolve is required to bundle chalk,
  // see https://github.com/vitejs/vite/issues/7385
  plugins: [nodeResolve(), sveltekit()],
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});
