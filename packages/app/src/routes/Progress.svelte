<script lang="ts">
  import { tweened } from 'svelte/motion';

  export let done: number;
  export let total: number;

  const progress = tweened(0);
  $: $progress = done;
</script>

<div>
  <span>{Math.ceil($progress)}/{total}</span>
  <meter value={$progress} max={total} />
  <span class="cup" class:complete={done >= total}> 🏆 </span>
</div>

<style lang="scss">
  div {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  meter {
    flex: 1;
    height: 1em;
    appearance: none;
    border: none;
    border-radius: 0.25rem;
  }

  .cup {
    font-size: 3em;
    line-height: 1;
    color: #0004;
    text-shadow: #838383 0 0 0;
    opacity: 0.5;
    transition: 0.2s all ease-out;

    div:hover & {
      color: #0004;
      opacity: 1;
      transform: scale(1.1);
    }

    &.complete {
      color: inherit;
      opacity: 1;
    }
  }
</style>
