import type { ComponentType } from 'svelte';
import authorMap from './authors.json';

export interface Lesson {
  /**
   * Readmes frontmatter.
   *
   * @see https://mdsvex.pngwn.io/docs#frontmatter-1
   */
  metadata: {
    title: string;
    description: string;
    category: 'Authorization' | 'DoS' | 'Configuration' | 'Injection';
    difficulty: 'easy' | 'medium' | 'hard';
    owasp?: string;
    introduction?: boolean;
    todo?: boolean;
    authors?: string[];
  };
  default: ComponentType;
}

export const lessons = new Map(
  Object.entries(import.meta.glob<Lesson>('./*/README.md')).map(
    ([path, load]) => [path.slice('./'.length, -'/README.md'.length), load]
  )
);

const map = new Map(Object.entries(authorMap));
export const getAuthorsDetails = (authors: string[] = []) =>
  authors
    .map((author) => map.get(author))
    .filter((author): author is { name: string; github: string } => {
      if (author) return true;
      console.warn(`Author ${author} not found`);
      return false;
    })
    .slice(0, 3);
