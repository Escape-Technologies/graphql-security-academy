<script lang="ts">
  import CloseLine from '~icons/ri/close-line';
  import Bars from '~icons/ri/menu-fill';
  export let open = true;
</script>

<button type="button" title="Toggle menu" on:click>
  {#if open}
    <Bars />
  {:else}
    <CloseLine />
  {/if}
</button>

<style lang="scss">
  button {
    all: unset;
    display: flex;
    align-items: baseline;
    justify-content: center;
    padding: 0.25em;
    font-size: 1.5em;
    color: var(--text);
    cursor: pointer;
    border-radius: 0.5em;

    // color: white;

    &:hover,
    &:focus {
      // color: var(--link-burger-hover);
      color: var(--accent);

      // background: var(--hovered);
      outline: 0;
      box-shadow: 0 0 0 0.1em var(--accent) inset;
    }
  }
</style>
