import type { SvelteComponent } from 'svelte';

type Type =
  | { type: 'readme' }
  | {
      type: 'file';
      props: { contents: string };
    };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SvelteConstructor = new (args: any) => SvelteComponent;

export type PaneChild = {
  name: string;
  component: SvelteConstructor;
  props?: { dirty?: boolean };
} & Type;
