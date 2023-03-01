<script lang="ts">
  // This component is browser only thanks to `{#await}` in its parent
  import Directory from './Directory.svelte';
  import type { WebContainer } from '@webcontainer/api';
  import { Terminal } from 'xterm';
  import { FitAddon } from 'xterm-addon-fit';
  import 'xterm/css/xterm.css';
  import { onMount } from 'svelte';
  import { spawnShell, type Shell } from './shell.js';
  import chalk from 'chalk';

  export let container: WebContainer;

  let file: { path: string; content: string } | undefined;
  let preview: HTMLIFrameElement;
  let terminalWrapper: HTMLElement;
  let shell: Shell;

  const terminal = new Terminal({ convertEol: true, rows: 10 });
  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);

  let dirRefresh = 0;

  onMount(() => {
    fitAddon.fit();
    terminal.open(terminalWrapper);

    return () => terminal.dispose();
  });

  onMount(async () => {
    shell = await spawnShell(container, terminal);

    shell.subscribe(($shell) => {
      terminal.write(
        chalk.bold.yellowBright(
          '# Welcome! Run `npm install` and `npm start` to get started.\n'
        )
      );
      $shell.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          },
        })
      );

      const input = $shell.input.getWriter();
      terminal.onData((data) => {
        input.write(data);
      });
    });
  });

  type File = { name: string; files?: File[] | undefined };

  const save = async () => {
    if (!file) return;
    await container.fs.writeFile(file.path, file.content);
  };

  const openFile = async (path: string) => {
    file = { path, content: await container.fs.readFile(path, 'utf-8') };
  };

  const readDir = async (dir = '/'): Promise<File[]> => {
    const entries = await container.fs.readdir(dir, { withFileTypes: true });
    const tree = await Promise.all(
      entries.map(async (entry) =>
        entry.isDirectory()
          ? {
              name: `${entry.name}/`,
              files: await readDir(`${dir}${entry.name}/`),
            }
          : { name: entry.name }
      )
    );
    return tree.sort((a, b) => {
      if (a.files && !b.files) return -1;
      if (!a.files && b.files) return 1;
      return a.name.localeCompare(b.name);
    });
  };
</script>

<svelte:window
  on:resize={() => {
    fitAddon.fit();
    $shell?.resize({
      cols: terminal.cols,
      rows: terminal.rows,
    });
  }}
/>

<main>
  <div style:width="30rem" class="container">
    <div>
      <button
        on:click={() => {
          dirRefresh++;
        }}
        style:width="100%"
      >
        🔃
      </button>
    </div>
    {#key dirRefresh}
      {#await readDir('/')}
        <div style:text-align="center">🔃 Refreshing 🔃</div>
      {:then files}
        <Directory
          name="/"
          expanded
          {files}
          on:click={({ detail: path }) => openFile(path)}
        />
      {/await}
    {/key}
  </div>
  {#if file}
    <textarea bind:value={file.content} />
  {:else}
    <div class="container">👈 Open a file first</div>
  {/if}
  <button on:click={save}>▶️</button>
  <iframe
    bind:this={preview}
    title="Preview"
    src={'data:text/html;base64,' +
      btoa('<p style="text-align: center"><em>Loading preview...</em></p>')}
  />
  <div bind:this={terminalWrapper} style:grid-column="1 / 5" />
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

  textarea {
    font-family: monospace;
    resize: none;
  }

  .container {
    border: 1px solid black;
    overflow: auto;
  }
</style>
