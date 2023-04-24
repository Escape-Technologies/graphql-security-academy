import { browser } from '$app/environment';

export const load = async () => {
  if (browser) await import('./boot.js');
};
