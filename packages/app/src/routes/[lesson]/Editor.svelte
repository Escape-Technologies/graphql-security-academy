<script lang="ts">
  // This component is browser only thanks to `{#await}` in its parent
  import { chalk } from '$lib/chalk.js';
  import type { WebContainer } from '@webcontainer/api';
  import type { Terminal } from 'xterm';
  import type { PageData } from './$types.js';
  import Directory from './Directory.svelte';
  import File from './File.svelte';
  import type { PaneChild } from './files.js';
  import Pane from './Pane.svelte';
  import { spawnShell, type Shell } from './shell.js';
  import Xterm from './Xterm.svelte';

  export let container: WebContainer;
  export let readme: PageData['readme'];

  let activeTerminal: Terminal;
  let shell: Shell;

  let children: PaneChild[] = [
    { type: 'readme', name: 'README', component: readme.default },
  ];
  let selected = children[0];
  let saving = false;

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
      for (const child of children) {
        if (child.type !== 'file') continue;
        await container.fs.writeFile(child.name, child.props.contents, 'utf-8');
        child.props.dirty = false;
      }
      children = [...children];
    } finally {
      saving = false;
    }
  };

  const openFile = async (path: string) => {
    const name = path === '/README.svx' ? 'README' : path;

    const matching = children.find((child) => child.name === name);
    if (matching) {
      selected = matching;
      return;
    }

    const child: PaneChild =
      name === 'README'
        ? { type: 'readme', name, component: readme.default }
        : {
            type: 'file',
            name,
            component: File,
            props: {
              contents: await container.fs.readFile(path, 'utf-8'),
              dirty: false,
            },
          };
    children = [...children, child];
    selected = child;
  };

  const runCommand = async (cmd: string) => {
    await input.write(`${cmd}\r\n`);
  };

  const preview = (frame: HTMLIFrameElement) => {
    container.on('server-ready', (port, url) => {
      frame.src = `${url}/graphql`;
    });
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
  <div style:width="30rem" class="container">
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
  <button on:click={save}>Save & run {saving ? '🔃' : '💾'}</button>
  <iframe
    use:preview
    title="Preview"
    src={'data:text/html;base64,' +
      btoa('<p style="text-align: center"><em>Loading preview...</em></p>')}
  />
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
    grid-template-columns: auto 1fr auto 1fr;
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
