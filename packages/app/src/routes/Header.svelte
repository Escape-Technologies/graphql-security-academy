<script lang="ts">
  import { getCompleted } from '$lib/progress.js';
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import logo from '$assets/logo.svg?url';
  import type { PageData } from './$types.js';

  export let lessons: PageData['lessons'];

  const points = tweened(0, { duration: 500 });
  onMount(() => {
    const completed = getCompleted();
    $points = lessons.reduce(
      (points, lesson) => (completed.has(lesson.path) ? points + 1 : points),
      0
    );
  });
</script>

<div class="page-header">
  <header>
    <img src={logo} alt="" />
    <h1>Escape Academy</h1>
    <span class="beta">Beta</span>
    <div style="flex: 1" />
    <div class="points">
      <strong>{Math.ceil($points)}</strong>/{lessons.length}
    </div>
  </header>
</div>

<style lang="scss">
  header {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    max-width: 50rem;
    padding-inline: 1rem;
    margin: 0 auto;

    > * {
      text-align: center;
    }
  }

  h1 {
    margin: 0;
  }

  .page-header {
    padding: 1rem;
    background: var(--main);
    box-shadow: 0 0 0.5rem var(--dark);
  }

  .beta {
    padding: 0 0.25em;
    font-family: 'Open Sans', sans-serif;
    font-size: 0.8em;
    font-weight: bold;
    color: #fff;
    vertical-align: middle;
    background: #07c9ac;
    border-radius: 0.25em;
  }

  .points {
    text-align: center;

    strong {
      font-size: 2em;
    }
  }
</style>
