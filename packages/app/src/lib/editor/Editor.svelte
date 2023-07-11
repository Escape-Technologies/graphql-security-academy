<script lang="ts">
  // This component is browser only thanks to `{#await}` in its parent
  import { base } from '$app/paths';
  import type { WebContainer } from '@webcontainer/api';
  import { onMount, type ComponentType } from 'svelte';
  import Editor from './Explorer.svelte';
  import Pane, { open } from './Pane.svelte';
  import type { PaneChild } from './panes/index.js';
  import { ShellService } from './shell.js';

  export let container: WebContainer;
  export let Readme: ComponentType;
  export let dirty = false;

  $: dirty = children.some(({ type }) => type !== 'markdown');

  const shellService = new ShellService(container);

  let children: PaneChild[] = [
    {
      type: 'markdown',
      name: 'README.md',
      context: { contents: Readme },
    },
  ];
  let selected = children[0];
  let saving = false;

  onMount(() =>
    container.on('server-ready', (port, url) => {
      $open({
        name: 'Preview',
        type: 'browser',
        context: { url },
      } satisfies PaneChild<'browser'>);
    })
  );

  const saveAll = async () => {
    if (saving) return;
    saving = true;
    try {
      for (const child of children.filter(
        (child): child is PaneChild<'file'> => child.type === 'file'
      )) {
        await container.fs.writeFile(
          child.name,
          child.context.contents,
          'utf8'
        );
        child.dirty = false;
      }
      children = [...children];
    } finally {
      saving = false;
    }
  };

  const save = async () => {
    if (saving) return;
    saving = true;
    try {
      if (selected.type !== 'file') return;
      const child = selected as PaneChild<'file'>;
      await container.fs.writeFile(child.name, child.context.contents, 'utf8');
      selected.dirty = false;
    } finally {
      saving = false;
    }
  };

  const openBrowser = () => {
    $open({
      name: 'Browser',
      type: 'browser',
      context: { url: `${base}/hello-world` },
    } satisfies PaneChild<'browser'>);
  };

  const openFile = async (path: string) => {
    const name = path.slice(1);

    const matching = children.find((child) => child.name === name);
    if (matching) {
      selected = matching;
      return;
    }

    $open(
      name === 'README.md'
        ? ({
            type: 'markdown',
            name,
            context: {
              contents: Readme,
            },
          } satisfies PaneChild<'markdown'>)
        : ({
            type: 'file',
            name,
            context: {
              contents: await container.fs.readFile(path, 'utf8'),
              path,
              extension: path.split('.').pop() ?? '',
            },
          } satisfies PaneChild<'file'>)
    );
  };

  const openTerminal = () => {
    $open({
      type: 'terminal',
      name: 'Terminal',
      context: {
        async attach(terminal) {
          await shellService.initTerminal(terminal);
        },
      },
    } satisfies PaneChild<'terminal'>);
  };
</script>

<svelte:window
  on:keydown={async (event) => {
    if (event.key === 's' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      await save();
    }
  }}
/>

<main>
  <div class="menu">
    <a href="{base}/" style:text-decoration="none">🦜</a>
    <button on:click={save}>Save</button>
    <button on:click={saveAll}>Save All</button>
    <button on:click={openBrowser}>New browser</button>
    <button on:click={openTerminal}>New terminal</button>
  </div>
  <div class="directory container">
    <Editor
      name="/"
      path=""
      {container}
      on:click={({ detail: path }) => openFile(path)}
    />
  </div>
  <div class="container" style:grid-area="main">
    <Pane bind:children bind:selected activeOnMount />
  </div>
</main>

<style lang="scss">
  main {
    display: grid;
    grid-template:
      'menu menu' auto
      'directory main' 1fr / 15em 1fr;
    height: 100vh;
    overflow: hidden;
    user-select: none;

    > * {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .directory {
    grid-area: directory;
  }

  .container {
    overflow: hidden;
    border: 1px solid black;
  }

  .menu {
    display: flex;
    grid-area: menu;
    gap: 0.25em;
    padding: 0.25em;

    button {
      padding: 0.25em 0.5em;
    }

    a {
      padding: 0.25em;
    }

    button,
    a {
      font-family: inherit;
      color: inherit;
      background: none;
      border: none;
      border-radius: 0.25em;
      transition: background 0.2s ease-in-out;

      &:hover,
      &:focus {
        background: var(--hovered);
      }
    }
  }
</style>
