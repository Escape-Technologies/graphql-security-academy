<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Contexts } from './files.js';

  export let context: Contexts['file'];

  const dispatch = createEventDispatcher<{ dirty: boolean }>();
</script>

<textarea
  bind:value={context.contents}
  on:input={() => dispatch('dirty', true)}
/>

<style lang="scss">
  textarea {
    display: block;
    font-family: monospace;
    resize: none;
    width: 100%;
    height: 100%;
  }
</style>
