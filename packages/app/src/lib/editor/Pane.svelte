<script lang="ts">
  import { flip } from 'svelte/animate';
  import { paneComponents, type PaneChild } from './files.js';

  export let children: PaneChild[];
  export let selected: PaneChild | undefined = undefined;

  /** Currently dragged tab. */
  let dragged: PaneChild | undefined = undefined;

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
  const drag = function (this: HTMLElement, event: DragEvent) {
    if (!dragged) return;
    /** Horizontal coordinate relative to the tabs container. */
    const x = event.pageX - this.offsetLeft;
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
    if (placeAfterIndex === undefined) reordered.push(dragged);
    for (const [i, child] of children.entries()) {
      // Skip the dragged tab
      if (child !== dragged) reordered.push(child);
      // Insert the dragged tab after the insertion point
      if (i === placeAfterIndex) reordered.push(dragged);
    }
    // Only update `children` if the order has changed to avoid visual glitches
    if (reordered.some((child, i) => child !== children[i]))
      children = reordered;
  };
</script>

<div class="pane">
  <div
    class="tabs"
    on:dragenter|preventDefault
    on:dragover|preventDefault={drag}
  >
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
          dragged = child;
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
          {child.name}{#if child.dirty}*{/if}
        </button>
        <button class="close" title="close" on:click={() => close(child)}>
          ×
        </button>
      </span>
    {/each}
  </div>

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

<style lang="scss">
  .pane {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
  }

  .tabs {
    // Makes event coordinates relative to this element
    position: relative;
    display: flex;
    flex-wrap: wrap;
    background-color: #eee;
    border-bottom: 1px solid black;
  }

  .tab {
    display: flex;
    min-width: 10em;
    padding-top: 3px;
    margin-right: -1px;
    background: #eee;
    border: 1px solid black;
    border-bottom: none;

    &.selected {
      z-index: 1;
      padding-top: 0;
      background: #fff;
      border-top: 4px solid lime;
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
      background: #ccc;
    }
  }

  .contents {
    overflow: auto;
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
