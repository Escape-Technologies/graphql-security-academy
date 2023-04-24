/**
 * This module builds lessons into the app.
 *
 * @module
 */

import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  writeFile,
} from 'node:fs/promises';
import type { FileSystemTree } from '@webcontainer/api';

/** Computes a path relative to this file. */
const relative = (path: string) => new URL(path, import.meta.url);
const dest = '../app/src/lessons/';

/** Main build function, builds all directories in `lessons`. */
const build = async () => {
  const entries = await readdir(relative('.'), { withFileTypes: true });
  const dirs = entries.filter((entry) => entry.isDirectory());
  return Promise.all(
    dirs.map((dir) => buildLesson(dir.name, relative(`${dir.name}/`)))
  );
};

/** Build a single lesson. */
const buildLesson = async (name: string, dir: URL) => {
  console.log(`Building lesson ${name}...`);
  try {
    const files = await buildLessonFiles(dir);
    await mkdir(relative(`${dest}${name}`), { recursive: true });
    await copyFile(new URL('README.md', dir), `${dest}${name}/README.md`);
    await writeFile(`${dest}${name}/files.json`, JSON.stringify(files));
  } catch (error) {
    console.error(`Error building lesson ${name}: ${error}`);
  }
};

/**
 * Serialize all files in a format compatible with
 * [WebContainers](https://webcontainers.io).
 */
const buildLessonFiles = async (dir: URL): Promise<FileSystemTree> => {
  const entries = await readdir(dir, { withFileTypes: true });

  return Object.fromEntries(
    await Promise.all(
      entries.map(async (entry) => {
        if (entry.isDirectory()) {
          return [
            entry.name,
            {
              directory: await buildLessonFiles(new URL(`${entry.name}/`, dir)),
            },
          ];
        }

        return [
          entry.name,
          {
            file: {
              contents: await readFile(new URL(entry.name, dir), 'utf8'),
            },
          },
        ];
      })
    )
  );
};

console.time('Built lessons in');
await build();
console.timeEnd('Built lessons in');
