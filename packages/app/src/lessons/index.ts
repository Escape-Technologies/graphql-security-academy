import type { SvelteComponent } from 'svelte';

export type Readme = {
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
  default: new (...args: unknown[]) => SvelteComponent;
};

export const lessons = new Map(
  Object.entries(import.meta.glob<Readme>('./*/README.md')).map(
    ([path, load]) => [path.slice('./'.length, -'/README.md'.length), load]
  )
);
