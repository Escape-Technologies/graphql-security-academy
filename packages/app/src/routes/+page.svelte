<script lang="ts">
  import SimpleIconsGithub from '~icons/simple-icons/github';
  import SimpleIconsLinkedin from '~icons/simple-icons/linkedin';
  import SimpleIconsTwitter from '~icons/simple-icons/twitter';
  import Filters from './Filters.svelte';
  import Header from './Header.svelte';
  import LessonList from './LessonList.svelte';

  export let data;

  let filter: string | undefined;

  $: introduction = data.lessons
    .filter(({ introduction }) => introduction)
    .sort((a, z) => a.owasp?.localeCompare(z.owasp ?? '') ?? 1);
  $: advanced = data.lessons.filter(
    ({ introduction, category }) =>
      !introduction && (!filter || category === filter)
  );
</script>

<Header lessons={data.lessons} />

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
    <Filters bind:filter />
    <LessonList lessons={advanced} />
  </section>
</main>

<footer>
  <p>© {new Date().getFullYear()} — Escape Technologies</p>
  <p class="icons">
    <a href="https://twitter.com/escapetechHQ">
      <SimpleIconsTwitter aria-label="Open on Twitter" />
    </a>
    <a href="https://www.linkedin.com/company/escapetech/">
      <SimpleIconsLinkedin aria-label="Open on LinkedIn" />
    </a>
    <a href="https://github.com/Escape-Technologies/learn">
      <SimpleIconsGithub aria-label="Open on GitHub" />
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

  footer {
    text-align: center;

    a {
      color: inherit;

      &:hover {
        color: var(--accent);
      }
    }
  }

  .icons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
</style>
