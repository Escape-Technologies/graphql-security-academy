<script lang="ts">
  import { tweened } from 'svelte/motion';
  import cup from '$assets/cup.svg?url';
  import Linkedin from '~icons/simple-icons/linkedin';

  export let done: number;
  export let total: number;

  const progress = tweened(0);
  $: $progress = done;
</script>

<div class="wrapper">
  <span><span>{Math.ceil($progress)}</span>/{total}</span>
  <div class="rate">
    <div class="progress">
      <div style="width: {100 - ($progress / total) * 100}%" />
    </div>
    <div class="round cup" class:complete={done >= total}>
      <img src={cup} alt="Cup" />
    </div>
  </div>
</div>

{#if done >= total}
  <section id="test">
    <article>
      <div class="badge" class:complete={done >= total}>
        <img
          src="/certification_badge.png"
          alt="GraphQL Security Certification"
        />
      </div>
      <div>
        <h3>Congratulations! You have done all lessons</h3>
        <p>
          You can post your certification of completion on your LinkedIn
          profile.
        </p>
        <div class="button-container">
          <button
            on:click={() => {
              window.open(
                'https://www.linkedin.com/sharing/share-offsite/?url=https://escape.tech/academy/',
                '',
                '_blank, width=500, height=500, resizable=yes, scrollbars=yes',
              );
            }}
            class="linkedin"
          >
            <Linkedin aria-label="Share on LinkedIn" />
            Share on Linkedin
          </button>
        </div>
      </div>
    </article>
  </section>
{/if}

<style lang="scss">
  .wrapper {
    display: flex;
    flex-direction: column;
  }

  .rate {
    display: flex;
    flex: 1;
    gap: 1em;
    align-items: center;
  }

  .wrapper > span {
    margin-bottom: -10px;

    span {
      font-size: 1.2em;
      font-weight: 800;
    }
  }

  .progress {
    display: flex;
    flex: 1;
    justify-content: end;
    height: 1em;
    overflow: hidden;
    background-image: linear-gradient(
      70deg,
      hsl(169deg 82% 49%) 0%,
      hsl(182deg 100% 44%) 29%,
      hsl(192deg 100% 50%) 43%,
      hsl(197deg 100% 50%) 57%,
      hsl(202deg 100% 50%) 71%,
      hsl(243deg 100% 76%) 100%
    );
    border-radius: 0.25rem;

    > div {
      height: 100%;
      background: var(--bg-secondary);
    }
  }

  .round {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3em;
    height: 3em;
    padding: 0.75em;
    overflow: hidden;
    border-radius: 100%;
  }

  .cup {
    background: var(--bg-secondary);

    &.complete {
      background: var(--accent);
    }

    img {
      width: 1.5em;
      height: 1.5em;
    }
  }

  .badge {
    img {
      width: 9em;
      height: auto;
    }
  }

  article {
    display: flex;
    gap: 1em;
    padding: 0.75rem 1rem;
    margin: 1rem 0;
    background-color: var(--bg-secondary);
    border-radius: 5px;

    > div:last-child {
      flex: 1;
    }

    .button-container {
      display: flex;
      justify-content: flex-end;
    }

    .linkedin {
      gap: 0.5em;
      padding: 0.5em;
      font-size: 0.9em;
      color: white;
      text-decoration: none;
      background: #0073b1;
      border-color: #0073b1;
      border-radius: 0.25em;
      transition: box-shadow 0.1s ease-out;
    }
  }
</style>
