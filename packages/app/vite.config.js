import { nodeResolve } from '@rollup/plugin-node-resolve';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [nodeResolve(), sveltekit()],
});
