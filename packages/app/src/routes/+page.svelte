<script lang="ts">
  import { onMount } from 'svelte';
  import SimpleIconsGithub from '~icons/simple-icons/github';
  import SimpleIconsLinkedin from '~icons/simple-icons/linkedin';
  import SimpleIconsTwitter from '~icons/simple-icons/twitter';
  import Logo from '../assets/logo.svg?url';
  import Filters from './Filters.svelte';
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

  let ghost: HTMLElement;
  let mounted = false;
  onMount(() => {
    const { width } = ghost.getBoundingClientRect();
    ghost.parentElement?.style.setProperty('--ghost-width', `${width}px`);
    mounted = true;
  });
</script>

<header class="page-header">
  <h1 class:mounted>
    <img src={Logo} alt="" />
    <span>
      <a class="ghost" bind:this={ghost} href="https://escape.tech">
        escape.tech/
      </a>learn
    </span>
  </h1>
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
    <a href="https://github.com/Escape-Technologies/learn.escape.tech">
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

  .page-header {
    padding: 1rem;
    background: var(--main);
    box-shadow: 0 0 0.5rem var(--dark);
  }

  h1 {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    max-width: 50rem;
    padding-inline: 1rem;
    margin: 0 auto;
  }

  h1.mounted {
    > span {
      transition: transform 0.1s ease-out;
      transform: translateX(calc(-1 * var(--ghost-width)));
    }

    &:hover > span {
      transform: translateX(0);
    }
  }

  .ghost {
    position: absolute;
    display: inline-block;
    color: inherit;
    text-decoration: inherit;
    opacity: 0;
    transition: opacity 0.1s ease-out;

    h1:hover & {
      opacity: 1;
    }

    h1.mounted & {
      position: static;
    }
  }

  .icons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
</style>
