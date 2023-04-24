<script lang="ts">
  import { categories } from '$lib/categories.js';
  import RiCloseLine from '~icons/ri/close-line';

  export let filter: string | undefined;
</script>

<div>
  Categories:
  {#each categories as { label, color }}
    <label class:active={label === filter} style:--color={color}>
      <input type="radio" bind:group={filter} value={label} />
      {label}
    </label>
  {/each}
  {#if filter}
    <button
      on:click={() => {
        filter = undefined;
      }}
    >
      <RiCloseLine aria-label="Clear filters" />
    </button>
  {/if}
</div>

<style lang="scss">
  div {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: baseline;
  }

  label {
    position: relative;
    gap: 0.25em;
    padding: 0 0.125em;
    background: var(--main);
    border: 0.125em solid var(--color);
    border-radius: 0.25em;
    outline: 0 solid var(--color);
    transition: outline 0.1s ease-out;

    &.active {
      background: var(--color);
    }

    &:focus-within {
      outline-width: 0.125em;
    }
  }

  input {
    position: absolute;
    opacity: 0;
  }

  button {
    all: unset;
    outline: revert;
  }
</style>
