<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  type File = { name: string; files?: File[] | undefined };

  export let name: string;
  export let files: File[];
  export let expanded = false;

  const dispatch = createEventDispatcher<{ click: string }>();
</script>

<button
  on:click={() => {
    expanded = !expanded;
  }}>{expanded ? '📂' : '📁'} {name}</button
>

{#if expanded}
  <ul>
    {#each files as file}
      {#if file.files}
        <li>
          <svelte:self
            {...file}
            on:click={({ detail: path }) => dispatch('click', `${name}${path}`)}
          />
        </li>
      {:else}
        <li>
          <button on:click={() => dispatch('click', `${name}/${file.name}`)}>
            📄 {file.name}
          </button>
        </li>
      {/if}
    {/each}
  </ul>
{/if}

<style lang="scss">
  button {
    appearance: none;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    // Compensate for the icon when text wraps
    padding-left: 3.5rem;
    text-indent: -3.5rem;
  }

  ul {
    margin: 0;
    list-style: none;
    padding-inline-start: 2rem;
  }
</style>
