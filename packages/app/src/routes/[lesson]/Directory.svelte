<script lang="ts">
  import type { WebContainer } from '@webcontainer/api';
  import { createEventDispatcher, onMount } from 'svelte';

  type File = { name: string; directory: boolean };

  export let container: WebContainer;
  export let name: string;
  export let path: string;
  export let expanded = false;

  let files: File[] = [];

  const dispatch = createEventDispatcher<{ click: string }>();

  const readDir = async (path: string): Promise<File[]> => {
    const entries = await container.fs.readdir(path, { withFileTypes: true });
    return entries
      .map((entry) => ({ name: entry.name, directory: entry.isDirectory() }))
      .sort((a, b) => {
        if (a.directory && !b.directory) return -1;
        if (!a.directory && b.directory) return 1;
        return a.name.localeCompare(b.name);
      });
  };

  const toggle = async () => {
    if (expanded) {
      expanded = false;
      return;
    }
    files = await readDir(path);
    expanded = true;
  };

  onMount(async () => {
    // Open the root directory
    if (path === '') await toggle();
  });
</script>

<button on:click={toggle}>{expanded ? '📂' : '📁'} {name}</button>

{#if expanded}
  <ul>
    {#each files as file}
      {#if file.directory}
        <li>
          <svelte:self
            {container}
            name="{file.name}/"
            path={`${path}${file.name}/`}
            on:click={({ detail: path }) => dispatch('click', `${name}${path}`)}
          />
        </li>
      {:else}
        <li>
          <button on:click={() => dispatch('click', `${name}${file.name}`)}>
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
