<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { PageData } from './$types.js';

  export let data: PageData;

  const createContainer = async () => {
    const container = await window.webcontainer;
    onDestroy(async () => {
      // Clear the container on unmount
      await container.fs.rm('.', { recursive: true, force: true });
    });

    await container.fs.mkdir('.', { recursive: true });
    await container.mount(data.files.default);
    return container;
  };
</script>

<svelte:head>
  <title>{data.readme.metadata.title}</title>
</svelte:head>

{#await Promise.all([import('./Editor.svelte'), createContainer()])}
  <div class="loading">
    <h1>Loading...</h1>
  </div>
{:then [editor, container]}
  <svelte:component this={editor.default} {container} readme={data.readme} />
{:catch error}
  <pre>{error}</pre>
{/await}

<style lang="scss">
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
</style>
