<script lang="ts">
  import Github from '~icons/simple-icons/github';
  import Linkedin from '~icons/simple-icons/linkedin';
  import Twitter from '~icons/simple-icons/twitter';
  import Filters from './Filters.svelte';
  import Header from './Header.svelte';
  import LessonList from './LessonList.svelte';
  import SimpleIconsGithub from '~icons/simple-icons/github';

  export let data;

  let filter: string | undefined;

  $: advanced = data.lessons
    .filter(({ category }) => !filter || category === filter)
    .sort(
      (a, z) =>
        ['easy', 'medium', 'hard'].indexOf(a.difficulty) -
        ['easy', 'medium', 'hard'].indexOf(z.difficulty)
    );
</script>

<Header lessons={data.lessons} />

<main>
  <section>
    <h2>Welcome!</h2>
    <p>
      Escape Academy is a collection of interactive challenges that will teach
      you how to secure your GraphQL applications. All these lessons work
      entirely in your browser: no need to install anything, and once downloaded
      you can use them offline.
    </p>
    <p>
      The Academy is entirely
      <a href="https://github.com/Escape-Technologies/learn">
        free and open-source!
      </a>
      You can support the project by leaving a star on GitHub, reporting bugs or
      even creating new lessons. <strong>We welcome all contributions!</strong>
    </p>
    <p>
      <button>
        <SimpleIconsGithub /> Star on GitHub {#await data.github.stars then stars}
          ({stars})
        {/await}
      </button>
    </p>
  </section>

  <section>
    <Filters bind:filter />
    <LessonList lessons={advanced} />
  </section>
</main>

<footer>
  <p>© {new Date().getFullYear()} — Escape Technologies</p>
  <p class="icons">
    <a href="https://twitter.com/escapetechHQ">
      <Twitter aria-label="Open on Twitter" />
    </a>
    <a href="https://www.linkedin.com/company/escapetech/">
      <Linkedin aria-label="Open on LinkedIn" />
    </a>
    <a href="https://github.com/Escape-Technologies/learn">
      <Github aria-label="Open on GitHub" />
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
