<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let cmd: string;

  const dispatch = createEventDispatcher<{ cmd: string }>();
</script>

<button on:click={() => dispatch('cmd', cmd)}>
  <slot />
</button>
