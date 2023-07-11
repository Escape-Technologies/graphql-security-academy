<script lang="ts">
  import { browser } from '$app/environment';
  import { beforeNavigate } from '$app/navigation';
  import { onMount } from 'svelte';
  import Readme from './Readme.svelte';

  export let data;

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

  const load = async () =>
    browser
      ? Promise.all([
          import('$lib/editor/Editor.svelte').then((module) => module.default),
          createContainer(),
        ])
      : (null as never);

  // Show a confirmation dialog before leaving the page
  let dirty = false;
  beforeNavigate((navigation) => {
    if (!dirty) return;
    if (navigation.willUnload || !confirm('Are you sure you want to leave?'))
      navigation.cancel();
  });
</script>

{#await load()}
  <main>
    <div
      class="loading"
      style="grid-area: menu; padding-block: 1em"
      aria-hidden="true"
    >
      Loading...
    </div>
    <div class="loading" style="grid-area: directory" aria-hidden="true" />
    <div class="container">
      <Readme />
    </div>
  </main>
{:then [Editor, container]}
  <svelte:component this={Editor} {Readme} {container} bind:dirty />
{:catch error}
  <pre>{error}</pre>
{/await}

<style lang="scss">
  main {
    display: grid;
    grid-template:
      'menu menu' auto
      'directory main' 1fr / 15em 1fr;
    height: 100vh;
    overflow: hidden;

    > * {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .container {
    overflow: auto;
    border: 1px solid black;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--dark);
  }
</style>
