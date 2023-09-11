<script lang="ts">
  import { getCompleted } from '$lib/progress.js';
  import { page } from '$app/stores';
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
  import Social from './Social.svelte';

  export let data;

  let filter: string | undefined;

  $: advanced = data.lessons
    .filter(({ category }) => !filter || category === filter)
    .sort(
      (a, z) =>
        ['Easy', 'Medium', 'Hard'].indexOf(a.difficulty) -
        ['Easy', 'Medium', 'Hard'].indexOf(z.difficulty),
    )
    .sort((a, z) => (a.todo ? 1 : 0) - (z.todo ? 1 : 0));

  let done = 0;
  onMount(() => {
    const completed = getCompleted();
    done = data.lessons.filter(({ path }) => completed.has(path)).length;
    if ($page.url.hash === '#lessons') {
      const id = $page.url.hash.substring(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  });
</script>

<Header />

<main>
  <section>
    <h1>Welcome on board 👋</h1>
    <p>
      API Security Academy provides hands-on, interactive lessons that teach
      various vulnerabilities and best practices in GraphQL security. You can
      access its full learning potential directly in your browser.
    </p>
    <p>
      Each lesson is built around a WebContainer containing a live GraphQL
      application, so you'll not only understand <em>why</em> a vulnerability is
      risky, but also
      <em>how</em> to exploit it and, most importantly, <em>how</em> to fix it.
    </p>
    <article>
      <h3>
        The API Security Academy is entirely
        <a
          href="https://github.com/Escape-Technologies/graphql-security-academy"
        >
          free and open-source!
        </a>
      </h3>
      <p>
        You can support the project by leaving a star, reporting bugs or even
        creating new lessons. <strong>We welcome all contributions!</strong>
      </p>
      <Social />
    </article>
    <Newsletter />
    <h3>
      Feel free to jump in and start your first lesson. Happy learning! 🔒
    </h3>
  </section>

  <section>
    <h2 id="lessons">Lessons</h2>
    <div class="space" />
    <Progress {done} total={data.lessons.filter(({ todo }) => !todo).length} />
    <Filters bind:filter />
    <LessonList lessons={advanced} />
  </section>
</main>

<footer>
  <p>© {new Date().getFullYear()} — Escape</p>
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
  article {
    padding: 0.75rem 1rem;
    background-color: var(--bg-secondary);
    border-radius: 5px;
  }

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
