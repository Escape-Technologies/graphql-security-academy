<script lang="ts">
  import type { Readme } from '$lessons';

  export let lessons: Array<{ path: string } & Readme['metadata']>;
</script>

<div class="list">
  {#each lessons as { path, title, description, category, points, owasp } (path)}
    <article>
      <div class="icon">⚡</div>
      <div class="points">{points}<br />points</div>
      <h3><a href={path}>{title}</a></h3>
      <p>{description}</p>
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
  article {
    position: relative;
    display: grid;
    grid-template:
      'icon title points'
      'icon description points'
      'icon tags points'
      / auto 1fr auto;
    row-gap: 0.25rem;
    column-gap: 1rem;
    padding: 1rem;
    margin-top: -0.125rem;
    border: 0.125rem solid var(--dark);

    > * {
      margin: 0;
    }

    h3 {
      line-height: 1;
    }
  }

  h3 a {
    color: inherit;
    text-decoration: inherit;

    &::before {
      position: absolute;
      inset: 0;
      content: '';
    }
  }

  .list {
    padding-top: 0.125rem;

    article:first-of-type {
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }

    article:last-of-type {
      border-bottom-right-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
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
      line-height: 1;
    }
  }

  .tags {
    display: flex;
    gap: 0.5em;
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
