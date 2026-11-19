import { browser } from '$app/environment';

export const prerender = true;
export const trailingSlash = 'never';

export const load = async () => {
  if (browser) await import('./boot.js');
};
