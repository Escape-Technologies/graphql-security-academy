import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { readFileSync } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import rehypeExternalLinks from 'rehype-external-links';

const inventory = JSON.parse(
  readFileSync(new URL('./routes-inventory.json', import.meta.url), 'utf8'),
);
const staticAdapter = adapter();

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
    adapter: {
      ...staticAdapter,
      async adapt(builder) {
        const lessons = (await readdir('../lessons', { withFileTypes: true }))
          .filter((entry) => entry.isDirectory())
          .map((entry) => `/academy/${entry.name}`);
        const expected = [
          '/academy',
          '/academy/hello-world',
          ...lessons,
        ].sort();
        if (
          JSON.stringify([...inventory].sort()) !== JSON.stringify(expected)
        ) {
          throw new Error('routes-inventory.json does not match lesson routes');
        }
        await staticAdapter.adapt(builder);
        for (const route of inventory) {
          const relative = route.slice('/academy'.length).replace(/^\//, '');
          const file = join(
            'build',
            relative ? `${relative}.html` : 'index.html',
          );
          if (!(await stat(file).catch(() => null))?.isFile()) {
            throw new Error(`Missing prerendered route ${route}: ${file}`);
          }
        }
      },
    },
    alias: {
      $assets: './src/assets',
      $lessons: './src/lessons',
    },
    paths: {
      base: '/academy',
      relative: false,
    },
  },
};

export default config;
