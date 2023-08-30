<script lang="ts">
  import { base } from '$app/paths';
  import { getAuthorsDetails, type Lesson } from '$lessons';
  import { categoryMap } from '$lib/categories.js';
  import { getCompleted } from '$lib/progress.js';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import RiCheckLine from '~icons/ri/check-line';
  import RiCheckboxBlankCircleLine from '~icons/ri/checkbox-blank-circle-line';

  let completed = new Map<string, Date>();

  onMount(() => {
    completed = getCompleted();
  });

  export let lessons: Array<{ path: string } & Lesson['metadata']>;
</script>

<div class="list">
  {#each lessons as { path, title, description, category, difficulty, owasp, todo, authors } (path)}
    <article transition:slide={{ duration: 200 }} class:todo>
      <div
        class="icon"
        style:--from={categoryMap.get(category)?.bg}
        style:--to={categoryMap.get(category)?.color}
      >
        {categoryMap.get(category)?.icon}
      </div>
      <div class="points">
        {#if todo}
          <span class="coming-soon">Coming soon</span>
        {:else if completed.has(path)}
          <div class="stamp" transition:slide><RiCheckLine /> Done</div>
        {:else}
          <div class="stamp-todo" transition:slide>
            <RiCheckboxBlankCircleLine /> Start
          </div>
        {/if}
      </div>
      <h3>
        <span class="category" style:color={categoryMap.get(category)?.color}>
          {category}
        </span>&nbsp;
        {#if todo}
          <span>{title}</span>
        {:else}
          <a href={path}>{title}</a>
        {/if}
      </h3>
      <div class="description">
        <p>{description}</p>
        {#if owasp || todo}
          <!-- Placeholder to double the gap -->
          <div />
          <div class="tags">
            {#if owasp}
              <span class="tag">OWASP <span>{owasp}</span></span>
            {/if}
            <span>
              {difficulty === 'Easy'
                ? '🟢 Easy'
                : difficulty === 'Medium'
                ? '🟡 Medium'
                : '🔴 Hard'}
            </span>
            {#if authors?.length}
              <ul class="authors">
                <li>Author:</li>
                {#each getAuthorsDetails(authors) as { name, github }}
                  <li>
                    <img src="{base}/github-image/{github}" alt="" />
                    {name}
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
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
      'icon title title'
      'description description points'
      / auto 1fr auto;
    gap: 0.75rem;
    align-items: center;
    padding: 1rem;
    margin-top: -0.125rem;
    background-color: var(--main);
    border: 0.125rem solid var(--dark);
    transition: all 0.1s ease-out;

    /* stylelint-disable-next-line media-feature-range-notation */
    @media (min-width: 30rem) {
      grid-template:
        'icon title points' auto
        'icon description points' 1fr
        / auto 1fr auto;
      row-gap: 0;
    }

    &:not(.todo):hover,
    &:not(.todo):focus-within {
      z-index: 1;
      border-radius: 0.25rem;
      box-shadow: 0 0 1rem var(--dark);
      transform: scale(#{math.div(51rem, 50rem)});
    }

    h3 {
      grid-area: title;
      margin: 0;
      line-height: 1.25;

      > * {
        vertical-align: baseline;
      }
    }
  }

  h3 a {
    color: inherit;
    text-decoration: inherit;
    outline: 0;

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
    background: linear-gradient(165deg, var(--from), var(--to));
    border-radius: 0.25rem;
  }

  .points {
    position: relative;
    display: flex;
    flex-direction: column;
    grid-area: points;
    gap: 0.25rem;
    align-items: center;
    min-width: 6em;
    text-align: center;

    .stamp,
    .stamp-todo {
      padding: 0.25em 0.75em 0.25em 0.5em;
      font-size: 0.8em;
      color: #838383;
      background: #f2f2f2;
      border-radius: 99px; // Round ends
    }

    .stamp {
      color: #5b9b78;
      background: #cff2cf;
    }
  }

  article:hover .stamp,
  article:focus-within .stamp {
    animation: wiggle 0.5s ease-in-out;
  }

  @keyframes wiggle {
    0% {
      transform: rotate(0deg) scale(1);
    }

    10% {
      transform: rotate(5deg) scale(1.1);
    }

    20% {
      transform: rotate(-5deg) scale(1.1);
    }

    50% {
      transform: rotate(5deg) scale(1.1);
    }

    70% {
      transform: rotate(-5deg) scale(1.1);
    }

    100% {
      transform: rotate(0deg) scale(1);
    }
  }

  .description {
    display: flex;
    flex-direction: column;
    grid-area: description;
    gap: 0.25rem;
    line-height: 1.25;

    p {
      text-align: justify;
    }

    > * {
      margin: 0;
    }
  }

  .category {
    grid-area: category;
    font-size: 0.8em;
    text-transform: uppercase;
  }

  .authors {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      display: flex;
      gap: 0.25rem;
      align-items: center;

      img {
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
      }
    }
  }

  .tags {
    display: flex;
    gap: 0.5rem;
    font-size: 0.8em;
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

  .todo {
    color: #666;
    pointer-events: none;
    background: #f8f8f8;
    opacity: 0.9;
  }

  .coming-soon {
    padding: 0.12em 0.3em;
    font-size: 0.8em; /* new property, adjust as needed */
    font-weight: bold;
    color: #fff;
    background: linear-gradient(165deg, #727486, #5b5669);
    border-radius: 0.25em;
  }
</style>
