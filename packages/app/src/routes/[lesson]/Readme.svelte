<script lang="ts">
  import type { PageData } from './$types.js';

  export let context: PageData['readme'];
</script>

<svelte:component this={context.default} />
