import { lessons } from '$lessons';

export const trailingSlash = 'always';

export const load = () => ({
  lessons: Promise.all(
    [...lessons].map(async ([path, load]) => {
      const { metadata } = await load();
      return { path, ...metadata };
    }),
  ),
  title: 'API Security Academy – Master GraphQL API vulnerabilities',
  description:
    'The API Security Academy is a set of free and interactive online modules that will teach you how to secure your GraphQL applications.',
});
