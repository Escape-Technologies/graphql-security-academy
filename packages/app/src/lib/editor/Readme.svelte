<script lang="ts">
  import '$assets/markdown-content.scss';
  import '$assets/prism.scss';
  import { createEventDispatcher } from 'svelte';
  import type { SvelteConstructor } from './files.js';

  export let context: {
    contents: SvelteConstructor;
  };

  createEventDispatcher<{ cmd: string }>();
</script>

<article class="markdown-content">
  <svelte:component this={context.contents} on:cmd />
</article>

<style lang="scss">
  article {
    cursor: auto;
    user-select: text;
  }
</style>
