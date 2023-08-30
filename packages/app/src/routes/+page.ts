import { lessons } from '$lessons';

export const trailingSlash = 'always';

export const load = ({ fetch }) => ({
  lessons: Promise.all(
    [...lessons].map(async ([path, load]) => {
      const { metadata } = await load();
      return { path, ...metadata };
    })
  ),
  github: {
    stars: fetch('https://api.github.com/repos/Escape-Technologies/academy')
      .then((response) => response.json())
      .then((data) => data.stargazers_count),
  },
});
