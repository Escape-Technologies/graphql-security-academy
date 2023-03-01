<script lang="ts">
  import Directory from '$lib/Directory.svelte';
  import type { WebContainer } from '@webcontainer/api';
  import stripAnsi from 'strip-ansi';

  export let container: WebContainer;

  let file: { path: string; content: string } | undefined;

  const save = (container: WebContainer) => async () => {
    if (!file) return;
    await container.fs.writeFile(file.path, file.content);
  };

  const preview = (iframe: HTMLIFrameElement, container: WebContainer) => {
    iframe.src =
      'data:text/html;base64,' +
      btoa('<p style="text-align: center"><em>Loading preview...</em></p>');

    container.on('server-ready', (port, url) => {
      iframe.src = `${url}/graphql`;
    });
  };

  const run = (textarea: HTMLTextAreaElement, container: WebContainer) => {
    const createLogStream = () =>
      new WritableStream({
        write(data) {
          textarea.value += stripAnsi(data);
          textarea.scrollTop = textarea.scrollHeight;
        },
      });

    // Run tasks in an unbound context
    (async () => {
      // Install dependencies
      const install = await container.spawn('npm', ['install']);
      install.output.pipeTo(createLogStream());
      if ((await install.exit) !== 0) return;

      // Start the dev server
      const run = await container.spawn('npm', ['run', 'start']);
      run.output.pipeTo(createLogStream());
    })();

    return {};
  };

  type File = { name: string; files?: File[] | undefined };

  const readDir = async (
    container: WebContainer,
    dir = '/'
  ): Promise<File[]> => {
    const entries = await container.fs.readdir(dir, { withFileTypes: true });
    const tree = await Promise.all(
      entries.map(async (entry) =>
        entry.isDirectory()
          ? {
              name: `${entry.name}/`,
              files: await readDir(container, `${dir}${entry.name}/`),
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

  let dirRefresh = 0;

  const openFile = async (path: string) => {
    console.log(path);
    file = { path, content: await container.fs.readFile(path, 'utf-8') };
  };
</script>

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
      {#await readDir(container, '/')}
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
  <button on:click={save(container)}>▶️</button>
  <iframe use:preview={container} title="Preview" />
  <textarea readonly use:run={container} style:grid-column="1 / 5" />
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
