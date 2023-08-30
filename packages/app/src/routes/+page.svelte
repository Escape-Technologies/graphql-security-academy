<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import Discord from '~icons/simple-icons/discord';
  import Github from '~icons/simple-icons/github';
  import Linkedin from '~icons/simple-icons/linkedin';
  import Twitter from '~icons/simple-icons/twitter';
  import Filters from './Filters.svelte';
  import Header from './Header.svelte';
  import LessonList from './LessonList.svelte';
  import { onMount } from 'svelte';
  import { getCompleted } from '$lib/progress.js';

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

  const count = tweened(0, { easing: cubicOut });
  onMount(() => {
    const completed = getCompleted();
    $count = data.lessons.filter(({ path }) => completed.has(path)).length;
  });
</script>

<Header />

<main>
  <section>
    <h1>Welcome to GraphQL Security Academy 👋</h1>
    <p>
      If you're a developer or a security engineer interested in fortifying
      GraphQL applications, you've come to the right place. Here, we offer
      hands-on lessons that walk you through various vulnerabilities and
      security best practices specific to GraphQL.
    </p>
    <p>
      Each lesson is built around a WebContainer containing a real-world GraphQL
      application, so you'll not only understand <em>why</em> a vulnerability is
      risky, but also
      <em>how</em> to exploit it and, most importantly, <em>how</em> to fix it.
    </p>
    <p>Feel free to jump in and start learning. Secure coding awaits!</p>
    <p>🔒 Happy Learning! 🔒</p>
    <p>
      The Academy is entirely
      <a href="https://github.com/Escape-Technologies/academy">
        free and open-source!
      </a>
      You can support the project by leaving a star on GitHub, reporting bugs or
      even creating new lessons. <strong>We welcome all contributions!</strong>
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
  </section>

  <section>
    <h2>Progress</h2>
    <div class="flex">
      <span>{Math.ceil($count)}/{data.lessons.length}</span>
      <meter value={$count} max={data.lessons.length} />
      <span style="font-size: 2em"> 🏆 </span>
    </div>
  </section>

  <section>
    <h2>Lessons</h2>
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
    <a href="https://github.com/Escape-Technologies/academy">
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

  meter {
    display: block;
    width: 100%;
    height: 1em;
    appearance: none;
    border: none;
    border-radius: 0.25rem;
  }

  .flex {
    display: flex;
    gap: 1rem;
    align-items: baseline;
  }

  .icons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
</style>
