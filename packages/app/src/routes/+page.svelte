<script lang="ts">
  import type { PageData } from './$types';
  import LessonList from './LessonList.svelte';

  export let data: PageData;

  $: introduction = data.lessons.filter(({ introduction }) => introduction);
  $: advanced = data.lessons.filter(({ introduction }) => !introduction);
</script>

<header class="page-header">
  <h1>🦜 learn.escape.tech</h1>
</header>

<main>
  <section>
    <header>
      <h2>Introduction</h2>
      <p>These lessons cover common security concerns with simple solutions.</p>
    </header>
    <LessonList lessons={introduction} />
  </section>

  <section>
    <header>
      <h2>Advanced topics</h2>
      <p>
        These lessons cover more specific security concerns, exploiting
        lesser-known GraphQL features and requiring careful considerations to be
        prevented.
      </p>
    </header>
    <div>Authorization DoS Configuration Injection</div>
    <LessonList lessons={advanced} />
  </section>
</main>

<footer>
  <p>
    <a href="https://github.com/Escape-Technologies/learn.escape.tech">
      View on GitHub
    </a>
  </p>
</footer>

<style lang="scss">
  main,
  footer {
    max-width: 50rem;
    padding-inline: 1rem;
    margin-inline: auto;
  }

  section {
    margin-block: 2rem;
  }

  section header {
    margin-block: 1rem;

    > * {
      margin-block: 0;
    }
  }

  .page-header {
    padding: 1rem;
    background: var(--main);
    box-shadow: 0 0 0.5rem var(--dark);

    h1 {
      max-width: 50rem;
      padding-inline: 1rem;
      margin: 0 auto;
    }
  }
</style>
