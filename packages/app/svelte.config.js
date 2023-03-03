import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.svx'],
  preprocess: [vitePreprocess(), mdsvex()],

  kit: {
    adapter: adapter(),
    alias: {
      $assets: './src/assets',
      $lessons: './src/lessons',
    },
  },
};

export default config;
