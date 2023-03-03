import type { SvelteComponent } from 'svelte';

type Type =
  | {
      type: 'readme';
      context: { contents: SvelteConstructor };
    }
  | {
      type: 'file';
      context: { contents: string };
    };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SvelteConstructor = new (args: any) => SvelteComponent;

export type PaneChild = {
  name: string;
  component: SvelteConstructor;
  context?: { dirty?: boolean };
} & Type;
