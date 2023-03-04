<script lang="ts">
  // This component is browser only thanks to `{#await}` in its parent
  import type { WebContainer } from '@webcontainer/api';
  import { onMount } from 'svelte';
  import type { Readme } from '$lessons';
  import Directory from './Directory.svelte';
  import type { PaneChild } from './files.js';
  import Pane from './Pane.svelte';
  import { ShellService } from './shell.js';

  export let container: WebContainer;
  export let readme: Readme;

  const shellService = new ShellService(container);

  let children: PaneChild[] = [
    {
      type: 'readme',
      name: 'README',
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
          'utf-8'
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
      await container.fs.writeFile(child.name, child.context.contents, 'utf-8');
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
    const name = path === '/README.svx' ? 'README' : path;

    const matching = children.find((child) => child.name === name);
    if (matching) {
      selected = matching;
      return;
    }

    const child =
      name === 'README'
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
              contents: await container.fs.readFile(path, 'utf-8'),
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

  const x = {
    type: 'terminal',
    name: 'Terminal',
    context: {
      command: 'ls',
      async attach(terminal) {
        await shellService.initTerminal(terminal);
      },
    },
  } satisfies PaneChild<'terminal'>;

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
      await saveAll();
    }
  }}
/>

<main>
  <div style:grid-area="directory" class="container">
    <Directory
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
    🦜
    <button on:click={save}>Save</button>
    <button on:click={saveAll}>Save All</button>
    <button on:click={openBrowser}>Open 🌐</button>
    <button on:click={openTerminal}>Open 🎹</button>
  </div>

  <div style:grid-area="terminal">
    <Pane children={[x]} selected={x} />
  </div>
</main>

<style lang="scss">
  main {
    height: 100vh;
    display: grid;
    grid-template-areas:
      'menu menu'
      'directory main'
      'directory terminal';
    grid-template-columns: 15em 1fr;
    grid-template-rows: auto 4fr 1fr;

    > * {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .container {
    border: 1px solid black;
    overflow: auto;
  }
</style>
