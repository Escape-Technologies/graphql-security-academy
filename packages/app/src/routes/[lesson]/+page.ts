import { lessons } from '$lessons';
import { error } from '@sveltejs/kit';
import type { FileSystemTree } from '@webcontainer/api';

export const load = async ({ params }) => {
  const load = lessons.get(params.lesson);
  if (!load) throw error(404, `Lesson ${params.lesson} found`);
  // https://github.com/sveltejs/kit/issues/9296
  const files = import(`../../lessons/${params.lesson}/files.json`) as Promise<{
    default: FileSystemTree;
  }>;
  const readme = await load();
  return {
    readme,
    files,
    title: readme.metadata.title,
    description: readme.metadata.description,
  };
};
