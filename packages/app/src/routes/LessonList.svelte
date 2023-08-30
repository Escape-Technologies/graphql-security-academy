<script lang="ts">
  import { base } from '$app/paths';
  import { getAuthorsDetails, type Lesson } from '$lessons';
  import { categoryMap } from '$lib/categories.js';
  import { getCompleted } from '$lib/progress.js';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import RiCheckLine from '~icons/ri/check-line';
  import PlayFill from '~icons/ri/play-line';

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
            <PlayFill /> Start
          </div>
        {/if}
      </div>
      <h3>
        <span class="category">
          {category}
        </span>&nbsp;
        <div>
          {#if todo}
            <span class="title">{title}</span>
          {:else}
            <a class="title" href={path}>{title}</a>
          {/if}
        </div>
      </h3>
      <div class="description">
        <p>{description}</p>
        {#if owasp || todo}
          <!-- Placeholder to double the gap -->
          <div />
          <div class="tags">
            {#if owasp}
              <div class="badge">
                <div class="label">OWASP</div>
                <div class="value">{owasp}</div>
              </div>
            {/if}
            <span
              class="difficulty {difficulty === 'Easy'
                ? 'easy'
                : difficulty === 'Medium'
                ? 'medium'
                : 'hard'}"
            >
              {difficulty === 'Easy'
                ? 'Easy'
                : difficulty === 'Medium'
                ? 'Medium'
                : 'Hard'}
            </span>
            {#if authors?.length}
              <div class="authors">
                <span class="label">
                  Author {#if authors.length > 1}s{/if}:
                </span>
                <ul>
                  {#each getAuthorsDetails(authors) as { name, github }}
                    <li>
                      <img src="{base}/github-image/{github}" alt="" />
                      {name}
                    </li>
                  {/each}
                </ul>
              </div>
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
      row-gap: 0.5rem;
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
    border-radius: 0.75rem;
  }

  .badge {
    display: flex;
    align-items: stretch;
    font-size: 0.8em;
    background-color: #f2f2f4;
    border: 1px solid #f2f2f4;
    border-radius: 5px;
  }

  .badge .label {
    padding: 0.25rem 0.5rem;
    overflow: hidden;
    font-weight: 600;
  }

  .badge .value {
    padding: 0.25rem 0.5rem;
    background-color: white;
    border-radius: 0 5px 5px 0;
  }

  .difficulty {
    padding: 0.25rem 0.5rem;
    font-size: 0.8em;
    font-weight: 600;
    text-transform: uppercase;
    border-radius: 5px;
  }

  .difficulty.easy {
    background-color: #a7daff;
  }

  .difficulty.medium {
    background-color: #ffedb3;
  }

  .difficulty.hard {
    background-color: #fdccc1;
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
      color: var(--text);
      background: linear-gradient(
        90deg,
        #17e2bd 0%,
        #38c8fb 48.09%,
        #918aff 100%
      );
      border-radius: 99px; // Round ends
    }

    .coming-soon {
      padding: 0.25em 0.75em 0.25em 0.5em;
      font-size: 0.8em; /* new property, adjust as needed */
      color: #838383;
      background: #f2f2f2;
      border-radius: 99px; // Round ends
    }

    .stamp {
      color: var(--text);
      background: var(--accent);
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
    font-size: 0.55em;
    color: var(--secondary-accent);
    text-transform: uppercase;
  }

  .title {
    font-size: 1em;
    font-weight: 600;
    color: #313048;
  }

  .authors {
    display: flex;
    align-items: center;

    ul {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5em;
      padding: 0;
      padding: 0.25rem 0.5rem;
      margin: 0;
      list-style: none;
    }

    .label {
      padding: 0.25rem 0.25rem 0.25rem 0;
      font-size: 1em;
    }

    li {
      display: flex;
      gap: 0.25rem;
      align-items: center;
      padding: 0.25rem 0.5rem;
      background-color: #f2f2f4;
      border-radius: 5px;

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
    align-items: center;
    font-size: 0.8em;
  }

  .todo {
    color: #666;
    pointer-events: none;
    background: #f8f8f8;
    opacity: 0.9;
  }
</style>
