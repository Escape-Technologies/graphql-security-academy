<script lang="ts">
  import { page } from '$app/stores';
  import '$assets/markdown-content.scss';
  import '$assets/prism.scss';
  import type { Readme } from '$lessons';
  import {
    deleteCompleted,
    getCompleted,
    markCompleted,
  } from '$lib/progress.js';
  import party from 'party-js';
  import { onMount } from 'svelte';

  export let readme: Readme;

  let completed = false;
  onMount(() => {
    completed = getCompleted().has($page.params.lesson);
  });
</script>

<article class="markdown-content">
  <svelte:component this={readme.default} />

  <footer>
    <h2>Well done!</h2>

    <p>Track your progression and gain points!</p>

    <p>
      <button
        on:click={({ target }) => {
          if (completed) {
            deleteCompleted($page.params.lesson);
            completed = false;
          } else {
            // @ts-expect-error target is not properly typed
            party.confetti(target);
            markCompleted($page.params.lesson);
            completed = true;
          }
        }}
      >
        {#if completed}
          Mark lesson as ongoing
        {:else}
          Mark lesson as completed
        {/if}
      </button>
    </p>
  </footer>
</article>

<style lang="scss">
  footer {
    padding: 0 1rem;
    margin-block: 1rem;
    border: 0.125rem solid var(--dark);
    border-radius: 0.25rem;

    > * {
      margin-block: 1rem;
    }
  }
</style>
