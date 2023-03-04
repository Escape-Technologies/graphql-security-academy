import type {
  create_ssr_component,
  SvelteComponentTyped,
} from 'svelte/internal';

export type Readme = {
  metadata: {
    title: string;
  };
  default: ReturnType<typeof create_ssr_component> &
    (new (...args: unknown[]) => SvelteComponentTyped);
};

export const lessons = new Map(
  Object.entries(import.meta.glob<Readme>('./*/README.svx')).map(
    ([path, load]) => [path.slice('./'.length, -'/README.svx'.length), load]
  )
);
