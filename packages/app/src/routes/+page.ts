import { lessons } from '$lessons';

export const load = () => ({
  lessons: Promise.all(
    [...lessons].map(async ([path, load]) => {
      const { metadata } = await load();
      return { path, ...metadata };
    })
  ),
});
