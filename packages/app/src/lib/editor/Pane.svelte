<script lang="ts" context="module">
  /** Currently dragged tab. */
  let dragged = writable<PaneChild | undefined>();
</script>

<script lang="ts">
  import { flip } from 'svelte/animate';
  import { writable } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import { paneComponents, type PaneChild } from './files.js';
  import Icon from './icons/Icon.svelte';

  export let children: PaneChild[];
  export let selected: PaneChild | undefined = undefined;

  /** Maps elements of `children` to their matching tab element. */
  let tabsMap = new Map<PaneChild, HTMLElement>();

  /**
   * Contains the same elements as `children` but does not change order when
   * `children` does. This allows keeping HTML elements while iterating over
   * them:
   *
   * - `{#each children as child}` moves nodes, provoking refreshes
   * - `{#each [...childrenSet] as child}` keeps the elements in their order, even
   *   when `children` is reordered
   */
  let childrenSet = new Set(children);

  /** Splitting direction */
  let split: 'left' | 'right' | 'up' | 'down' | undefined;

  // Tell svelte that updates to `selected` also affect `children`
  $: children = (selected, children);

  // Keep `childrenSet` in sync with `children`
  $: {
    for (const child of children) childrenSet.add(child);
    for (const child of childrenSet)
      if (!children.includes(child)) childrenSet.delete(child);
  }

  /** Keeps `tabsMap` in sync with `children`. */
  const map = (node: HTMLElement, child: PaneChild) => {
    tabsMap.set(child, node);
    return {
      destroy() {
        tabsMap.delete(child);
      },
    };
  };

  /** Closes the tab given. */
  const close = (child: PaneChild) => {
    if (child.dirty && !confirm('Close without saving?')) return;
    const index = children.indexOf(child);
    children = [...children.slice(0, index), ...children.slice(index + 1)];
    // Opens the next tab if the current one is closed
    if (selected === child)
      selected = children[Math.min(index, children.length - 1)];
  };

  /** Updates the tab order in realtime. */
  const dragTab = function (this: HTMLElement, event: DragEvent) {
    if (!$dragged) return;
    /** Horizontal coordinate relative to the tabs container. */
    const rect = this.getBoundingClientRect();
    console.log(rect);
    const x = event.pageX - rect.left + this.scrollLeft;
    // const x = event.layer;
    /** Insert the dragged tab after this index. */
    let placeAfterIndex: number | undefined;
    for (const [i, child] of children.entries()) {
      const tab = tabsMap.get(child);
      if (!tab) continue;
      // Stop when the insertion have been found
      if (x < tab.offsetLeft + tab.offsetWidth / 2) break;
      // Keep the last index that is before the insertion point
      placeAfterIndex = i;
    }
    /** New `children` array. */
    const reordered = [];
    // If the insertion point has been found before the first tab,
    // `placeAfterIndex` is undefined and the dragged tab is inserted first
    if (placeAfterIndex === undefined) reordered.push($dragged);
    for (const [i, child] of children.entries()) {
      // Skip the dragged tab
      if (child !== $dragged) reordered.push(child);
      // Insert the dragged tab after the insertion point
      if (i === placeAfterIndex) reordered.push($dragged);
    }
    // Only update `children` if the order has changed to avoid visual glitches
    if (reordered.some((child, i) => child !== children[i]))
      children = reordered;
  };

  const dragSplit = function (this: HTMLElement, event: DragEvent) {
    if (!$dragged) return;
    const rect = this.getBoundingClientRect();
    const x = (event.pageX - rect.left + this.scrollLeft) / rect.width - 0.5;
    const y = (event.pageY - rect.top + this.scrollTop) / rect.height - 0.5;
    split = 'up';
    if (Math.abs(x) > Math.abs(y))
      if (x > 0) split = 'right';
      else split = 'left';
    else if (y > 0) split = 'down';
    this.dataset.split = split;
  };
</script>

<div class="pane">
  <div
    class="scroll"
    on:dragenter|preventDefault
    on:dragover|preventDefault={dragTab}
  >
    <div class="tabs">
      {#each children as child (child)}
        <span
          class="tab"
          class:selected={selected === child}
          draggable="true"
          on:dragstart={(event) => {
            if (!event.dataTransfer) return;
            event.dataTransfer.setData('text/plain', child.name);
            event.dataTransfer.effectAllowed = 'all';
            event.dataTransfer.dropEffect = 'move';
            selected = child;
            $dragged = child;
          }}
          on:dragend={() => {
            $dragged = undefined;
          }}
          use:map={child}
          animate:flip={{ duration: 200 }}
        >
          <button
            class="name"
            on:click={() => {
              selected = child;
            }}
          >
            <Icon {...child} />
            {child.name}{#if child.dirty}*{/if}
          </button>
          <button class="close" title="close" on:click={() => close(child)}>
            ×
          </button>
        </span>
      {/each}
    </div>
  </div>

  <div class="wrapper">
    {#if $dragged}
      <div
        class="drag-overlay"
        on:dragenter|preventDefault
        on:dragover|preventDefault={dragSplit}
        transition:fade={{ duration: 100 }}
      >
        <div data-split={split} />
      </div>
    {/if}

    {#each [...childrenSet] as child (child)}
      <div class="contents" hidden={selected !== child}>
        <svelte:component
          this={paneComponents[child.type]}
          bind:context={child.context}
          on:cmd
          on:dirty={() => {
            child.dirty = true;
          }}
        />
      </div>
    {/each}

    <div class="contents" hidden={Boolean(selected)}>
      <span class="empty">📔</span>
    </div>
  </div>
</div>

<style lang="scss">
  .pane {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
  }

  .scroll {
    position: relative;
    overflow-x: overlay;
    border-bottom: 1px solid var(--dark);
  }

  .tabs {
    display: flex;
  }

  .tab {
    display: flex;
    flex-shrink: 0;
    min-width: 10em;
    padding-block: 3px;
    margin-right: -1px;
    background: var(--main-4);
    border-bottom: none;

    &.selected {
      z-index: 1;
      padding-top: 0;
      background: var(--focused);
      border-top: 4px solid var(--accent);
    }
  }

  .name,
  .close {
    all: unset;
    outline: revert;
  }

  .name {
    flex: 1;
  }

  .close {
    padding: 0 0.5em;
    line-height: 1;

    &:hover {
      background: var(--hovered);
    }
  }

  .wrapper {
    position: relative;
    overflow-y: auto;
  }

  .drag-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    overflow: hidden;

    [data-split] {
      position: absolute;
      inset: 0;
      background-color: var(--hovered);
      transition: transform 0.1s;
    }

    [data-split='up'] {
      transform: scaleY(0.5) translateY(-50%);
    }

    [data-split='down'] {
      transform: scaleY(0.5) translateY(50%);
    }

    [data-split='left'] {
      transform: scaleX(0.5) translateX(-50%);
    }

    [data-split='right'] {
      transform: scaleX(0.5) translateX(50%);
    }
  }

  .contents {
    height: 100%;
    overflow: auto;
    background: var(--focused);
  }

  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 10em;
    user-select: none;
    opacity: 0.1;
  }
</style>
