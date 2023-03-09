<script lang="ts" context="module">
  /** Currently dragged tab. */
  let dragged = writable<PaneChild | undefined>();
</script>

<script lang="ts">
  import { flip } from 'svelte/animate';
  import { writable } from 'svelte/store';
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

  /** Splitting overlay direction. */
  let overlayDirection: 'left' | 'right' | 'up' | 'down' | undefined;

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
    overlayDirection = 'up';
    if (Math.abs(x) > Math.abs(y))
      if (x > 0) overlayDirection = 'right';
      else overlayDirection = 'left';
    else if (y > 0) overlayDirection = 'down';
    this.dataset.split = overlayDirection;
  };

  type Split = { children: PaneChild[]; selected: PaneChild | undefined };
  let splitA: Split = { children: [], selected: undefined };
  let splitB: Split = { children: [], selected: undefined };
  let splitDirection: 'horizontal' | 'vertical' | undefined;
  const split = function (this: HTMLElement) {
    if (!overlayDirection || !$dragged) return;
    // Reset the ratio if the panels were collapsed and split again
    splitRatio = 0.5;
    if (overlayDirection === 'up') {
      splitDirection = 'vertical';
      splitA.children = [$dragged];
      splitA.selected = $dragged;
      splitB.children = children.filter((child) => child !== $dragged);
      splitB.selected = splitB.children[0];
    } else if (overlayDirection === 'down') {
      splitDirection = 'vertical';
      splitA.children = children.filter((child) => child !== $dragged);
      splitA.selected = splitA.children[0];
      splitB.children = [$dragged];
      splitB.selected = $dragged;
    } else if (overlayDirection === 'left') {
      splitDirection = 'horizontal';
      splitA.children = [$dragged];
      splitA.selected = $dragged;
      splitB.children = children.filter((child) => child !== $dragged);
      splitB.selected = splitB.children[0];
    } else if (overlayDirection === 'right') {
      splitDirection = 'horizontal';
      splitA.children = children.filter((child) => child !== $dragged);
      splitA.selected = splitA.children[0];
      splitB.children = [$dragged];
      splitB.selected = $dragged;
    }
    $dragged = undefined;
  };

  // Automatically close the split if one of the two panes is empty
  $: if (splitDirection !== undefined) {
    if (splitA.children.length === 0) {
      splitDirection = undefined;
      children = splitB.children;
      selected = splitB.selected;
    } else if (splitB.children.length === 0) {
      splitDirection = undefined;
      children = splitA.children;
      selected = splitA.selected;
    }
  }

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
  on:drop={() => {
    overlayDirection = undefined;
  }}
  on:mousemove={resize}
  on:mouseup={() => {
    resizing = false;
  }}
/>

{#if splitDirection === undefined}
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
          on:dragleave|preventDefault={() => {
            overlayDirection = undefined;
          }}
          on:drop|preventDefault={split}
        >
          <div data-split={overlayDirection} />
        </div>
      {/if}

      {#each [...childrenSet] as child (child)}
        <div class="contents" hidden={selected !== child}>
          <div class="contents-scroll">
            <svelte:component
              this={paneComponents[child.type]}
              bind:context={child.context}
              on:cmd
              on:dirty={() => {
                child.dirty = true;
              }}
            />
          </div>
        </div>
      {/each}

      <div class="contents" hidden={Boolean(selected)}>
        <span class="empty">📔</span>
      </div>
    </div>
  </div>
{:else}
  <div
    class="parent {splitDirection}"
    bind:this={parent}
    style:--split-a="{splitRatio}fr"
    style:--split-b="{1 - splitRatio}fr"
  >
    <svelte:self
      bind:children={splitA.children}
      bind:selected={splitA.selected}
    />
    <div
      class="divider"
      on:mousedown={() => {
        resizing = true;
      }}
    />
    <svelte:self
      bind:children={splitB.children}
      bind:selected={splitB.selected}
    />
  </div>
{/if}

<style lang="scss">
  .pane {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
    overflow: hidden;
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
    overflow: hidden;
  }

  .drag-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    overflow: hidden;

    > div {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-color: var(--hovered);
      opacity: 0;
      transition: transform 0.1s, opacity 0.1s;
      transition-delay: 0.1s, 0s;
    }

    [data-split] {
      opacity: 1;
      transition-delay: 0s, 0.1s;
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
    overflow: hidden;
    background: var(--focused);
  }

  .contents-scroll {
    height: 100%;
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
