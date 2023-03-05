/**
 * Patches the build output to add security headers.
 *
 * @module
 */

import { readFile, writeFile } from 'node:fs/promises';

const file = '.vercel/output/config.json';
const config = await readFile(file, 'utf8').then(JSON.parse);

for (const route of config.routes) {
  if (route.src === '/_app/immutable/.+') {
    route.headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
    route.headers['Cross-Origin-Opener-Policy'] = 'same-origin';
    route.headers['X-Content-Type-Options'] = 'nosniff';
  }
}

await writeFile(file, JSON.stringify(config, null, 2));
