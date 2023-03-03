<script lang="ts">
  import { WebContainer } from '@webcontainer/api';
  import { onDestroy } from 'svelte';
  import type { PageData } from './$types.js';

  export let data: PageData;

  const createContainer = async () => {
    let container: WebContainer | undefined;
    onDestroy(() => {
      container?.teardown();
    });
    container = await WebContainer.boot();
    await container.mount(data.files);
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
