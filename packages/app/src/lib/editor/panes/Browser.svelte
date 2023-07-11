<script lang="ts">
  import type { Contexts } from './index.js';

  export let context: Contexts['browser'];
  let value = context.url;
</script>

<div>
  <form
    on:submit|preventDefault={() => {
      context.url = value;
    }}
  >
    <input type="text" bind:value />
    <button type="submit">Go</button>
  </form>
  <iframe title="Preview" src={context.url} />
</div>

<style lang="scss">
  div {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
  }

  form {
    display: grid;
    grid-template-columns: 1fr auto;
  }

  iframe {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
