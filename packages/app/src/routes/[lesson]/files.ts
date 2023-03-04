import type { SvelteComponent } from 'svelte';
import Browser from './Browser.svelte';
import File from './File.svelte';
import Readme from './Readme.svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SvelteConstructor = new (args: any) => SvelteComponent;

export type Contexts = {
  readme: { contents: SvelteConstructor };
  file: { contents: string; path: string; extension: string };
  browser: { url: string };
};

export const paneComponents: Record<keyof Contexts, SvelteConstructor> = {
  readme: Readme,
  file: File,
  browser: Browser,
};

export type PaneChild<T extends keyof Contexts = keyof Contexts> = {
  type: T;
  name: string;
  dirty?: boolean;
  context: Contexts[T];
};
