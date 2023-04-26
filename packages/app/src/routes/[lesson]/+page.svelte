<script lang="ts">
  import { browser } from '$app/environment';
  import { beforeNavigate } from '$app/navigation';
  import { onMount } from 'svelte';

  export let data;

  const loadEditor = async () => {
    if (browser) return import('$lib/editor/Editor.svelte');
    // The editor cannot be loaded on the server
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.resolve() as any;
  };

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

  // Show a confirmation dialog before leaving the page
  let dirty = false;
  beforeNavigate((navigation) => {
    if (!dirty) return;
    if (navigation.willUnload || !confirm('Are you sure you want to leave?'))
      navigation.cancel();
  });
</script>

{#await Promise.all([loadEditor(), createContainer()])}
  <div class="loading">
    <h1>Loading...</h1>
  </div>
{:then [editor, container]}
  <svelte:component
    this={editor.default}
    {container}
    readme={data.readme}
    bind:dirty
  />
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
