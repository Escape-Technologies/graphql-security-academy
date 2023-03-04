import type { SvelteComponent } from 'svelte';
import type { Terminal } from 'xterm';
import Browser from './Browser.svelte';
import File from './File.svelte';
import Readme from './Readme.svelte';
import Xterm from './Xterm.svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SvelteConstructor = new (args: any) => SvelteComponent;

export type Contexts = {
  readme: { contents: SvelteConstructor };
  file: { contents: string; path: string; extension: string };
  browser: { url: string };
  terminal: {
    command?: string;
    attach(terminal: Terminal): unknown;
  };
};

export const paneComponents: Record<keyof Contexts, SvelteConstructor> = {
  readme: Readme,
  file: File,
  browser: Browser,
  terminal: Xterm,
};

export type PaneChild<T extends keyof Contexts = keyof Contexts> = {
  type: T;
  name: string;
  dirty?: boolean;
  context: Contexts[T];
};
