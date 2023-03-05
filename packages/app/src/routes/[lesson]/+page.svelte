<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types.js';

  export let data: PageData;

  const createContainer = async () => {
    onMount(() => async () => {
      // Clear the container on unmount
      await container?.fs.rm('.', { recursive: true, force: true });
    });

    const container = await window.webcontainer;
    await container.fs.mkdir('.', { recursive: true });
    await container.mount(data.files.default);
    return container;
  };
</script>

{#await Promise.all([import('$lib/editor/Editor.svelte'), createContainer()])}
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
