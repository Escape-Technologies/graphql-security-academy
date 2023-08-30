<script lang="ts">
  import { categories } from '$lib/categories.js';
  import RiCloseLine from '~icons/ri/close-line';

  export let filter: string | undefined;
</script>

<div>
  Categories:
  {#each categories as { label, color, bg }}
    <label class:active={label === filter} style:color style:--bg={bg}>
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
    padding: 0 0.125em;
    font-family: 'Titillium Web', sans-serif;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    background: var(--main);
    border-radius: 0.25em;
    transition: background 0.1s ease-out;

    &.active,
    &:focus-within {
      background: var(--bg);
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
