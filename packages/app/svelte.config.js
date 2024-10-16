import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import rehypeExternalLinks from 'rehype-external-links';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.md', '.svelte'],
  preprocess: [
    mdsvex({
      extension: '.md',
      // @ts-expect-error The types are broken
      rehypePlugins: [[rehypeExternalLinks, { target: '_blank' }]],
    }),
    vitePreprocess(),
  ],

  kit: {
    adapter: adapter(),
    alias: {
      $assets: './src/assets',
      $lessons: './src/lessons',
    },
    paths: {
      base: '/academy',
    },
  },
};

export default config;
