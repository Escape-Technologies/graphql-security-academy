import type { ComponentType } from 'svelte';

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
    points: number;
    owasp?: string;
    introduction?: boolean;
    todo?: boolean;
  };
  default: ComponentType;
}

export const lessons = new Map(
  Object.entries(import.meta.glob<Lesson>('./*/README.md')).map(
    ([path, load]) => [path.slice('./'.length, -'/README.md'.length), load]
  )
);
