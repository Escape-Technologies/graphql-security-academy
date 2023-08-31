<script lang="ts">
  import { tweened } from 'svelte/motion';
  import cup from '$assets/cup.svg?url';

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
    <div class="cup" class:complete={done >= total}>
      <img src={cup} alt="Cup" />
    </div>
  </div>
</div>

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

  .cup {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75em;
    overflow: hidden;
    background: var(--bg-secondary);
    border-radius: 100%;

    img {
      width: 1.5em;
      height: 1.5em;
    }
  }
</style>
