<script lang="ts">
  import type { ComponentType } from 'svelte';

  export let context: {
    contents: ComponentType;
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
