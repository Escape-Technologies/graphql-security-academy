<script lang="ts">
  import { tweened } from 'svelte/motion';

  export let done: number;
  export let total: number;

  const progress = tweened(0);
  $: $progress = done;
</script>

<div class="wrapper">
  <span>{Math.ceil($progress)}/{total}</span>
  <div class="progress">
    <div style="width: {100 - ($progress / total) * 100}%" />
  </div>
  <span class="cup" class:complete={done >= total}> 🏆 </span>
</div>

<style lang="scss">
  .wrapper {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .progress {
    display: flex;
    flex: 1;
    justify-content: end;
    height: 1em;
    overflow: hidden;
    background: linear-gradient(to right, #5b9b78, #52cd89);
    border-radius: 0.25rem;

    > div {
      height: 100%;
      background: #f2f2f2;
    }
  }

  .cup {
    font-size: 3em;
    line-height: 1;
    color: #0004;
    text-shadow: #838383 0 0 0;
    opacity: 0.5;
    transition: 0.2s all ease-out;

    .wrapper:hover & {
      color: #0004;
      opacity: 1;
      transform: scale(1.1);
    }

    &.complete,
    .wrapper:hover &.complete {
      color: inherit;
      opacity: 1;
    }
  }
</style>
