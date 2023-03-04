<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<main>
  <h1>🦜 learn.escape.tech</h1>

  <p>Choose a lesson:</p>

  <ul>
    {#each data.lessons as { path, title }}
      <li><a href={path}>{title}</a></li>
    {/each}
  </ul>

  <p>
    <a href="https://github.com/Escape-Technologies/learn.escape.tech">
      View on GitHub
    </a>
  </p>
</main>

<style lang="scss">
  main {
    margin-inline: auto;
    padding-inline: 1rem;
    max-width: 50rem;
  }
</style>
