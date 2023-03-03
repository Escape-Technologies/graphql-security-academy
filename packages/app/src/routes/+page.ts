import { lessons } from '$lessons';
import type { PageLoad } from './$types';

export const load = (() => ({
  lessons: Promise.all(
    [...lessons].map(async ([path, load]) => {
      const { metadata } = await load();
      return { path, ...metadata };
    })
  ),
})) satisfies PageLoad;
