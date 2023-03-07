import { nodeResolve } from '@rollup/plugin-node-resolve';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import icons from 'unplugin-icons/vite';

export default defineConfig({
  plugins: [
    icons({ compiler: 'svelte', defaultClass: 'icon', scale: 1.5 }),
    // plugin-node-resolve is required to bundle chalk,
    // see https://github.com/vitejs/vite/issues/7385
    nodeResolve(),
    sveltekit(),
  ],
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});
