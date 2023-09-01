import { lessons } from '$lessons';

export const trailingSlash = 'always';

export const load = () => ({
  lessons: Promise.all(
    [...lessons].map(async ([path, load]) => {
      const { metadata } = await load();
      return { path, ...metadata };
    }),
  ),
  title: 'GraphQL Security Academy – Master API vulnerabilities',
  description:
    'The GraphQL Security Academy is a set of free and interactive online modules that will teach you how to secure your GraphQL applications.',
});
