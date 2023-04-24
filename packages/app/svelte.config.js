import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.md', '.svelte'],
  preprocess: [mdsvex({ extension: '.md' }), vitePreprocess()],

  kit: {
    adapter: adapter(),
    alias: {
      $assets: './src/assets',
      $lessons: './src/lessons',
    },
  },
};

export default config;
