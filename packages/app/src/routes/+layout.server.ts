import type { LayoutServerLoad } from './$types';

export const load = (async ({ setHeaders }) => {
  setHeaders({
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
  });
}) satisfies LayoutServerLoad;