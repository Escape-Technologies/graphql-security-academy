import type {
  create_ssr_component,
  SvelteComponentTyped,
} from 'svelte/internal';

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
  };
  default: ReturnType<typeof create_ssr_component> &
    (new (...args: unknown[]) => SvelteComponentTyped);
};

export const lessons = new Map(
  Object.entries(import.meta.glob<Readme>('./*/README.md')).map(
    ([path, load]) => [path.slice('./'.length, -'/README.md'.length), load]
  )
);
