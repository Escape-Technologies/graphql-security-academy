<script lang="ts">
  import type {
    create_ssr_component,
    SvelteComponentTyped,
  } from 'svelte/internal';
  import { createEventDispatcher } from 'svelte';

  export type Mdsvex = {
    metadata: {
      title: string;
      description?: string;
      date?: string;
      snippet?: { code: string; lang: string };
    };
    default: ReturnType<typeof create_ssr_component> &
      (new (...args: unknown[]) => SvelteComponentTyped);
  };

  const lessons = new Map(
    Object.entries(import.meta.glob<Mdsvex>('../lessons/*.svx')).map(
      ([path, load]) => [
        path.replace(/^\.\.\/lessons\//, '').replace(/\.svx$/, ''),
        load,
      ]
    )
  );

  const pr = Promise.all(
    [...lessons.entries()].map(async ([path, load]) =>
      load().then(({ metadata }) => ({ path, ...metadata }))
    )
  );

  let lesson: string | undefined;

  /** Used for typing purposes only. */
  createEventDispatcher<{ cmd: string }>();
</script>

<article>
  <h2>Lessons</h2>

  {#await pr then lessons}
    <!-- {@debug lessons} -->
    {#each lessons as { path, title }}
      <button on:click={() => (lesson = path)}>
        {title}
      </button>
    {/each}
  {/await}

  {#if lesson}
    {#await lessons.get(lesson)() then { default: component }}
      <svelte:component this={component} on:cmd />
    {/await}
  {/if}
</article>
