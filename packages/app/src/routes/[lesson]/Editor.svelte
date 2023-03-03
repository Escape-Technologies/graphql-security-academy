<script lang="ts">
  // This component is browser only thanks to `{#await}` in its parent
  import { chalk } from '$lib/chalk.js';
  import type { WebContainer } from '@webcontainer/api';
  import { onMount } from 'svelte';
  import type { Terminal } from 'xterm';
  import type { PageData } from './$types.js';
  import Directory from './Directory.svelte';
  import type { PaneChild } from './files.js';
  import Pane from './Pane.svelte';
  import { spawnShell, type Shell } from './shell.js';
  import Xterm from './Xterm.svelte';

  export let container: WebContainer;
  export let readme: PageData['readme'];

  let activeTerminal: Terminal;
  let shell: Shell;

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

  $: input = $shell?.input.getWriter();

  const onTerminalReady = async (terminal: Terminal) => {
    activeTerminal = terminal;
    shell = await spawnShell(container, terminal);

    terminal.onData((data) => {
      input.write(data);
    });

    shell.subscribe(($shell) => {
      terminal.write(
        `# Welcome! Run ${chalk.yellowBright(
          'npm install'
        )} and ${chalk.yellowBright('npm start')} to get started.\n`
      );
      $shell.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          },
        })
      );
    });
  };

  const save = async () => {
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

  const openBrowser = async () => {
    const child = {
      name: 'Browser',
      type: 'browser',
      context: { url: '/hello-world' },
    } satisfies PaneChild;
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
            },
          } satisfies PaneChild<'file'>);
    children = [...children, child];
    selected = child;
  };

  const runCommand = async (cmd: string) => {
    await input.write(`${cmd}\r\n`);
  };
</script>

<svelte:window
  on:resize={() => {
    $shell.resize({ cols: activeTerminal.cols, rows: activeTerminal.rows });
  }}
  on:keydown={async (event) => {
    if (event.key === 's' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      await save();
    }
  }}
/>

<main>
  <div style:width="15em" class="container">
    <Directory
      name="/"
      path=""
      {container}
      on:click={({ detail: path }) => openFile(path)}
    />
  </div>
  <div class="container">
    <Pane
      bind:children
      bind:selected
      on:cmd={({ detail: cmd }) => runCommand(cmd)}
    />
  </div>
  <div style:display="flex" style:flex-direction="column">
    <button on:click={save}>Save {saving ? '🔃' : '💾'}</button>
    <button on:click={openBrowser}>Open 🌐</button>
  </div>

  <div style:grid-column="1 / 5">
    <Xterm
      on:ready={({ detail: terminal }) => {
        onTerminalReady(terminal);
      }}
    />
  </div>
</main>

<style lang="scss">
  main {
    height: 100vh;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: 4fr 1fr;

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
