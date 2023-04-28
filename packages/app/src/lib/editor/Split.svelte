<script context="module" lang="ts">
  import type { PaneChild } from './files.js';

  export type SplitContext = {
    children: PaneChild[];
    selected: PaneChild | undefined;
  };
</script>

<script lang="ts">
  import Pane from './Pane.svelte';

  export let splitDirection: 'horizontal' | 'vertical';
  export let splitA: SplitContext;
  export let splitB: SplitContext;
  export let activeOnMount: 'A' | 'B';

  let splitRatio = 0.5;
  let resizing = false;
  let parent: HTMLElement;
  const resize = (event: MouseEvent) => {
    if (!resizing) return;
    const rect = parent.getBoundingClientRect();
    if (splitDirection === 'horizontal') {
      const dx = event.x - rect.x;
      splitRatio = dx / rect.width;
    } else if (splitDirection === 'vertical') {
      const dy = event.y - rect.y;
      splitRatio = dy / rect.height;
    }

    // Prevent the panels from being too small
    splitRatio = Math.max(0.1, Math.min(0.9, splitRatio));
  };
</script>

<svelte:window
  on:mousemove={resize}
  on:mouseup={() => {
    resizing = false;
  }}
/>

<div
  class="parent {splitDirection}"
  bind:this={parent}
  style:--split-a="{splitRatio}fr"
  style:--split-b="{1 - splitRatio}fr"
>
  <Pane
    bind:children={splitA.children}
    bind:selected={splitA.selected}
    activeOnMount={activeOnMount === 'A'}
  />
  <div
    class="divider"
    on:mousedown={() => {
      resizing = true;
    }}
  />
  <Pane
    bind:children={splitB.children}
    bind:selected={splitB.selected}
    activeOnMount={activeOnMount === 'B'}
  />
</div>

<style lang="scss">
  .parent {
    display: grid;
    height: 100%;
    overflow: hidden;

    &.horizontal {
      grid-template-columns: var(--split-a) 1px var(--split-b);
    }

    &.vertical {
      grid-template-rows: var(--split-a) 1px var(--split-b);
    }
  }

  .divider {
    position: relative;
    z-index: 1;

    .vertical > & {
      cursor: row-resize;
    }

    .horizontal > & {
      cursor: col-resize;
    }

    &::before {
      position: absolute;
      inset: -2px;
      content: '';
      transition: background-color 0.1s;
    }

    &:hover::before {
      background-color: var(--hovered);
    }
  }
</style>
