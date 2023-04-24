<script lang="ts">
  import type { Readme } from '$lessons';
  import { slide } from 'svelte/transition';

  export let lessons: Array<{ path: string } & Readme['metadata']>;
</script>

<div class="list">
  {#each lessons as { path, title, description, category, points, owasp } (path)}
    <article transition:slide|local={{ duration: 200 }}>
      <div class="icon">⚡</div>
      <div class="points">{points}<br />points</div>
      <div class="description">
        <h3><a href={path}>{title}</a></h3>
        <p>{description}</p>
      </div>
      <div class="tags">
        <span class="tag">{category}</span>
        {#if owasp}
          <span class="tag">OWASP <span>{owasp}</span></span>
        {/if}
      </div>
    </article>
  {/each}
</div>

<style lang="scss">
  @use 'sass:math';

  article {
    position: relative;
    display: grid;
    grid-template:
      'icon description points'
      'icon description points'
      'tags tags points'
      / auto 1fr auto;
    gap: 0.75rem;
    padding: 1rem;
    margin-top: -0.125rem;
    background-color: var(--main);
    border: 0.125rem solid var(--dark);
    transition: all 0.1s ease-out;

    &:hover {
      z-index: 1;
      border-radius: 0.25rem;
      box-shadow: 0 0 1rem var(--dark);
      transform: scale(#{math.div(51, 50)});
    }
  }

  h3 a {
    color: inherit;
    text-decoration: inherit;

    &::before {
      position: absolute;
      inset: 0;
      z-index: 1;
      content: '';
    }
  }

  .list {
    padding-top: 0.125rem;
    margin-block: 1rem;

    article:first-of-type {
      border-top-left-radius: 0.25rem;
      border-top-right-radius: 0.25rem;
    }

    article:last-of-type {
      border-bottom-right-radius: 0.25rem;
      border-bottom-left-radius: 0.25rem;
    }
  }

  .icon {
    display: flex;
    grid-area: icon;
    align-items: center;
    align-self: start;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    font-size: 2rem;
    background: linear-gradient(108deg, rgb(173 255 173), rgb(195 249 249));
    border-radius: 0.25rem;
  }

  .points {
    grid-area: points;
    align-self: center;
    text-align: center;

    &::first-line {
      font-size: 2em;
      font-weight: bold;
      line-height: 1;
    }
  }

  .description {
    display: flex;
    flex-direction: column;
    grid-area: description;
    gap: 0.25rem;
    line-height: 1.25;

    h3 {
      line-height: 1;
    }

    > * {
      margin: 0;
    }
  }

  .tags {
    display: flex;
    grid-area: tags;
    gap: 0.75em;
  }

  .tag {
    display: flex;
    gap: 0.25em;
    align-items: center;
    padding: 0 0.125em;
    background: var(--dark);
    border-radius: 0.25em;

    > span {
      display: inline-block;
      padding: 0 0.25em;
      line-height: 1.25;
      background: var(--main);
      border-block: 0.125em solid var(--dark);
      border-radius: 0 0.25em 0.25em 0;
    }
  }
</style>
