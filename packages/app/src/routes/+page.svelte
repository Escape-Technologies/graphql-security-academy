<script lang="ts">
  import type { PageData } from './$types';
  import LessonList from './LessonList.svelte';

  export let data: PageData;

  $: introduction = data.lessons.filter(({ introduction }) => introduction);
  $: advanced = data.lessons.filter(({ introduction }) => !introduction);
</script>

<main>
  <h1>🦜 learn.escape.tech</h1>

  <h2>Introduction</h2>
  <p>These lessons cover common security concerns with simple solutions.</p>
  <LessonList lessons={introduction} />

  <h2>Advanced topics</h2>
  <p>
    These lessons cover more specific security concerns, exploiting lesser-known
    GraphQL features and requiring careful considerations to be prevented.
  </p>
  <div>Authorization DoS Configuration Injection</div>
  <LessonList lessons={advanced} />

  <p>
    <a href="https://github.com/Escape-Technologies/learn.escape.tech">
      View on GitHub
    </a>
  </p>
</main>

<style lang="scss">
  main {
    max-width: 50rem;
    padding-inline: 1rem;
    margin-inline: auto;
  }
</style>
