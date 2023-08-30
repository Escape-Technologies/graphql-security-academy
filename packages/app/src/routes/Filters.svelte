<script lang="ts">
  import { categories } from '$lib/categories.js';
  import RiCloseLine from '~icons/ri/close-line';

  export let filter: string | undefined;
</script>

<div>
  Categories:
  {#each categories as { label }}
    <label class:active={label === filter}>
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
    align-items: center;
    margin-block: 1rem;
  }

  label {
    position: relative;
    gap: 0.25em;
    padding: 0.325em 0.65em;
    font-size: 0.75em;
    font-weight: 500;
    color: var(--weak-color);
    text-transform: uppercase;
    cursor: pointer;
    background: var(--main);
    border: 1px solid var(--weak-color);
    border-radius: 0.5em;
    transition: background 0.1s ease-out;

    &.active,
    &:focus-within {
      font-weight: 600;
      color: var(--secondary-accent);
      background: var(--bg);
      border: 1px solid var(--secondary-accent);
    }
  }

  input {
    position: absolute;
    opacity: 0;
  }

  button {
    all: unset;
    cursor: pointer;
    outline: revert;
  }
</style>
