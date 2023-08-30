<script lang="ts">
  import { getCompleted } from '$lib/progress.js';
  import { onMount } from 'svelte';
  import Discord from '~icons/simple-icons/discord';
  import Github from '~icons/simple-icons/github';
  import Linkedin from '~icons/simple-icons/linkedin';
  import Twitter from '~icons/simple-icons/twitter';
  import Filters from './Filters.svelte';
  import Header from './Header.svelte';
  import LessonList from './LessonList.svelte';
  import Newsletter from './Newsletter.svelte';
  import Progress from './Progress.svelte';

  export let data;

  let filter: string | undefined;

  $: advanced = data.lessons
    .filter(({ category }) => !filter || category === filter)
    .sort((a, z) => (a.todo ? 1 : 0) - (z.todo ? 1 : 0))
    .sort(
      (a, z) =>
        ['easy', 'medium', 'hard'].indexOf(a.difficulty) -
        ['easy', 'medium', 'hard'].indexOf(z.difficulty)
    );

  let done = 0;
  onMount(() => {
    const completed = getCompleted();
    done = data.lessons.filter(({ path }) => completed.has(path)).length;
  });
</script>

<Header />

<main>
  <section>
    <h1>Welcome on Board 👋</h1>
    <p>
      The GraphQL Security Academy offers hands-on lessons that walk you through
      various vulnerabilities and security best practices specific to GraphQL
      directly in your browser.
    </p>
    <p>
      Each lesson is built around a WebContainer containing a live GraphQL
      application, so you'll not only understand <em>why</em> a vulnerability is
      risky, but also
      <em>how</em> to exploit it and, most importantly, <em>how</em> to fix it.
    </p>
    <p>
      The Academy is entirely
      <a href="https://github.com/Escape-Technologies/graphql-security-academy">
        free and open-source!
      </a>
      You can support the project by leaving a star, reporting bugs or even creating
      new lessons. <strong>We welcome all contributions!</strong>
    </p>
    <p>
      <button>
        <Github /> Star on GitHub {#await data.github.stars then stars}
          ({stars})
        {/await}
      </button>
      <button>
        <Discord /> Join Escape Community
      </button>
    </p>
    <p>Feel free to jump in and start your first lesson. Happy Learning! 🔒</p>
    <Newsletter />
  </section>

  <section>
    <h2>Lessons</h2>
    <Progress {done} total={data.lessons.length} />
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
    <a href="https://github.com/Escape-Technologies/graphql-security-academy">
      <Github aria-label="Open on GitHub" />
    </a>
    <a href="https://discord.escape.tech">
      <Discord aria-label="Open on Discord" />
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
