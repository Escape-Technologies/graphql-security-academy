<script lang="ts">
  // This component is browser only thanks to `{#await}` in its parent
  import { beforeNavigate } from '$app/navigation';
  import type { Readme } from '$lessons';
  import type { WebContainer } from '@webcontainer/api';
  import { onMount } from 'svelte';
  import Editor from './Explorer.svelte';
  import type { PaneChild } from './files.js';
  import Pane from './Pane.svelte';
  import { ShellService } from './shell.js';

  export let container: WebContainer;
  export let readme: Readme;

  const shellService = new ShellService(container);

  let children: PaneChild[] = [
    {
      type: 'readme',
      name: 'README.md',
      context: { contents: readme.default },
    },
  ];
  let selected = children[0];
  let saving = false;

  onMount(() =>
    container.on('server-ready', (port, url) => {
      const child = {
        name: 'Preview',
        type: 'browser',
        context: { url },
      } satisfies PaneChild<'browser'>;
      children = [...children, child];
      selected = child;
    })
  );

  // Show a confirmation dialog before leaving the page
  beforeNavigate((navigation) => {
    if (children.every(({ type }) => type === 'readme')) return;
    if (navigation.willUnload || !confirm('Are you sure you want to leave?'))
      navigation.cancel();
  });

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

  const openBrowser = async () => {
    const child = {
      name: 'Browser',
      type: 'browser',
      context: { url: '/hello-world' },
    } satisfies PaneChild<'browser'>;
    children = [...children, child];
    selected = child;
  };

  const openFile = async (path: string) => {
    const name = path.slice(1);

    const matching = children.find((child) => child.name === name);
    if (matching) {
      selected = matching;
      return;
    }

    const child =
      name === 'README.md'
        ? ({
            type: 'readme',
            name,
            context: {
              contents: readme.default,
            },
          } satisfies PaneChild<'readme'>)
        : ({
            type: 'file',
            name,
            context: {
              contents: await container.fs.readFile(path, 'utf8'),
              path,
              extension: path.split('.').pop() ?? '',
            },
          } satisfies PaneChild<'file'>);
    children = [...children, child];
    selected = child;
  };

  const runCommand = (cmd: string) => {
    console.log(`${cmd}\r\n`);
  };

  const openTerminal = () => {
    const child = {
      type: 'terminal',
      name: 'Terminal',
      context: {
        async attach(terminal) {
          await shellService.initTerminal(terminal);
        },
      },
    } satisfies PaneChild<'terminal'>;
    children = [...children, child];
    selected = child;
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
  <div class="directory container">
    <Editor
      name="/"
      path=""
      {container}
      on:click={({ detail: path }) => openFile(path)}
    />
  </div>
  <div class="container" style:grid-area="main">
    <Pane
      bind:children
      bind:selected
      on:cmd={({ detail: cmd }) => runCommand(cmd)}
    />
  </div>
  <div style:grid-area="menu" style:display="flex">
    <a href="/" style:text-decoration="none">🦜</a>
    <button on:click={save}>Save</button>
    <button on:click={saveAll}>Save All</button>
    <button on:click={openBrowser}>Open 🌐</button>
    <button on:click={openTerminal}>Open 🎹</button>
  </div>
</main>

<style lang="scss">
  main {
    display: grid;
    grid-template:
      'menu menu' auto
      'directory main' 1fr / 15em 1fr;
    height: 100vh;

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
</style>
