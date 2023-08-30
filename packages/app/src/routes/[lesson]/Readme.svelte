<script lang="ts">
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import '$assets/markdown-content.scss';
  import '$assets/prism.scss';
  import { getAuthorsDetails } from '$lessons';
  import {
    deleteCompleted,
    getCompleted,
    markCompleted,
  } from '$lib/progress.js';
  import party from 'party-js';
  import { onMount } from 'svelte';
  import type { PageData } from './$types.js';
  import Github from '~icons/simple-icons/github';

  $: ({ readme } = $page.data as PageData);

  let completed = false;
  onMount(() => {
    completed = getCompleted().has($page.params.lesson);
  });
</script>

<article class="markdown-content">
  <h1>{readme.metadata.title}</h1>

  <aside>
    <p>{readme.metadata.description}</p>
    {#if readme.metadata.authors?.length}
      <ul class="authors">
        <li>Lesson written by:</li>
        {#each getAuthorsDetails(readme.metadata.authors) as { name, github }}
          <li>
            <a href="https://github.com/{github}" target="_blank">
              <img src="{base}/github-image/{github}" alt="" />
              {name}
            </a>
          </li>
        {/each}
      </ul>
    {/if}
    <p>
      <a
        href="https://github.com/Escape-Technologies/graphql-security-academy/tree/main/packages/lessons/{$page
          .params.lesson}/"
      >
        <Github /> Improve this lesson on GitHub
      </a>
    </p>
  </aside>

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
  aside,
  footer {
    padding: 0 1rem;
    margin-block: 1rem;
    border: 0.125rem solid var(--dark);
    border-radius: 0.25rem;

    > * {
      margin-block: 1rem;
    }
  }

  a {
    color: inherit;
    text-decoration: inherit;
  }

  .authors {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
    padding: 0;
    list-style: none;

    li a {
      display: flex;
      gap: 0.25rem;
      align-items: center;

      img {
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
      }
    }
  }
</style>
