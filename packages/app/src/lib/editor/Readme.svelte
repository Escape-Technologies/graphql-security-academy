<script lang="ts">
  import type { SvelteConstructor } from './files.js';

  export let context: {
    contents: SvelteConstructor;
  };
</script>

<div>
  <svelte:component this={context.contents} />
</div>

<style lang="scss">
  div {
    height: 100%;
    overflow: auto;
    cursor: auto;
    user-select: text;
  }
</style>
