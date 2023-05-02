<script lang="ts">
  import { getCompleted } from '$lib/progress.js';
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import Logo from '../assets/logo.svg?url';
  import type { PageData } from './$types.js';

  export let lessons: PageData['lessons'];

  let ghost: HTMLElement;
  let mounted = false;
  onMount(() => {
    const { width } = ghost.getBoundingClientRect();
    ghost.parentElement?.style.setProperty('--ghost-width', `${width}px`);
    mounted = true;
  });

  const points = tweened(0, { duration: 500 });
  onMount(() => {
    const completed = getCompleted();
    $points = lessons.reduce(
      (points, lesson) =>
        completed.has(lesson.path) ? points + lesson.points : points,
      0
    );
  });
</script>

<div class="page-header">
  <header>
    <h1 class:mounted>
      <img src={Logo} alt="" />
      <span>
        <a class="ghost" bind:this={ghost} href="https://escape.tech">
          escape.tech/
        </a>learn
        <span class="beta">Beta</span>
      </span>
    </h1>
    <div class="points"><strong>{Math.ceil($points)}</strong> points</div>
  </header>
</div>

<style lang="scss">
  header {
    display: flex;
    justify-content: space-between;
    max-width: 50rem;
    padding-inline: 1rem;
    margin: 0 auto;
  }

  h1 {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin: 0;
  }

  /* stylelint-disable-next-line media-feature-range-notation */
  @media (min-width: 30rem) {
    h1.mounted > span {
      transition: transform 0.1s ease-out;
      transform: translateX(calc(-1 * var(--ghost-width)));
    }

    .page-header:hover h1.mounted {
      .ghost {
        opacity: 1;
      }

      > span {
        transform: translateX(0);
      }
    }
  }

  .ghost {
    position: absolute;
    display: none;
    color: inherit;
    text-decoration: inherit;
    opacity: 0;
    transition: opacity 0.1s ease-out;

    h1.mounted & {
      position: static;
    }

    /* stylelint-disable-next-line media-feature-range-notation */
    @media (min-width: 30rem) {
      display: inline-block;
    }
  }

  .page-header {
    padding: 1rem;
    background: var(--main);
    box-shadow: 0 0 0.5rem var(--dark);
  }

  .points strong {
    font-size: 2em;
  }

  .beta {
    padding: 0 0.25em;
    font-family: 'Open Sans', sans-serif;
    font-size: 0.5em;
    font-weight: bold;
    color: #fff;
    vertical-align: middle;
    background: #07c9ac;
    border-radius: 0.25em;
  }
</style>
