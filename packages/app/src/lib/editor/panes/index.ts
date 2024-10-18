import type { Terminal } from '@xterm/xterm';
import type { ComponentType } from 'svelte';
import Browser from './Browser.svelte';
import File from './File.svelte';
import Markdown from './Markdown.svelte';
import Xterm from './Xterm.svelte';

export interface Contexts {
  markdown: { contents: ComponentType };
  file: { contents: string; path: string; extension: string };
  browser: { url: string };
  terminal: {
    command?: string;
    attach(terminal: Terminal): unknown;
  };
}
export interface PaneChild<T extends keyof Contexts = keyof Contexts> {
  type: T;
  name: string;
  dirty?: boolean;
  context: Contexts[T];
}

export const paneComponents: Record<keyof Contexts, ComponentType> = {
  markdown: Markdown,
  file: File,
  browser: Browser,
  terminal: Xterm,
};
