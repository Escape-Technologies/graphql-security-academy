<script lang="ts">
  // This component is browser only thanks to `{#await}` in its parent
  import type { WebContainer } from '@webcontainer/api';
  import chalk from 'chalk';
  import { onMount } from 'svelte';
  import type { Terminal } from 'xterm';
  import Directory from './Directory.svelte';
  import Lesson from './Lesson.svelte';
  import { spawnShell, type Shell } from './shell.js';
  import Xterm from './Xterm.svelte';

  export let container: WebContainer;

  let file: { path: string; content: string } | undefined;
  let terminal: Terminal;
  let shell: Shell;

  $: input = $shell?.input.getWriter();

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

      terminal.onData((data) => {
        input.write(data);
      });
    });
  });

  const save = async () => {
    if (!file) return;
    await container.fs.writeFile(file.path, file.content);
  };

  const openFile = async (path: string) => {
    file = { path, content: await container.fs.readFile(path, 'utf-8') };
  };

  const preview = (frame: HTMLIFrameElement) => {
    container.on('server-ready', (port, url) => {
      frame.src = `${url}/graphql`;
    });
  };

  const runCmd = async (cmd: string) => {
    input.write(`${cmd}\n`);
  };
</script>

<svelte:window
  on:resize={() => {
    $shell.resize({ cols: terminal.cols, rows: terminal.rows });
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
  <div class="container" style="display:grid;grid-template-rows:1fr 1fr">
    <Lesson on:cmd={({ detail: cmd }) => runCmd(cmd)} />
    {#if file}
      <textarea bind:value={file.content} />
    {:else}
      <div class="container">👈 Open a file first</div>
    {/if}
  </div>
  <button on:click={save}>▶️</button>
  <iframe
    use:preview
    title="Preview"
    src={'data:text/html;base64,' +
      btoa('<p style="text-align: center"><em>Loading preview...</em></p>')}
  />
  <div style:grid-column="1 / 5"><Xterm bind:terminal /></div>
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
