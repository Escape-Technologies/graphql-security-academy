<script lang="ts">
  import { paneComponents, type PaneChild } from './files.js';

  export let children: PaneChild[];
  export let selected: PaneChild | undefined = undefined;

  // Tell svelte that updates to `selected` also affect `children`
  $: children = (selected, children);

  const close = (child: PaneChild) => {
    if (child.dirty && !confirm('Close without saving?')) return;
    const index = children.indexOf(child);
    children = [...children.slice(0, index), ...children.slice(index + 1)];
    // Opens the next tab if the current one is closed
    if (selected === child)
      selected = children[Math.min(index, children.length - 1)];
  };
</script>

<div class="pane">
  <div class="tabs">
    {#each children as child (child)}
      <span class="tab" class:selected={selected === child}>
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

  {#each children as child (child)}
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
    <span class="icon">📔</span>
  </div>
</div>

<style lang="scss">
  .pane {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
  }

  .tabs {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid black;
    background-color: #eee;
  }

  .tab {
    display: flex;
    border: 1px solid black;
    border-bottom: none;
    margin-right: -1px;
    background: #eee;
    padding-top: 3px;
    min-width: 10em;

    &.selected {
      background: #fff;
      padding-top: 0;
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

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10em;
    height: 100%;
    opacity: 0.1;
    user-select: none;
  }
</style>
