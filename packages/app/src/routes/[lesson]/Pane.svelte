<script lang="ts">
  import type { PaneChild } from './files.js';

  export let children: PaneChild[];
  export let selected: PaneChild | undefined = undefined;

  // Tell svelte that updates to `selected` also affect `children`
  $: children = (selected, children);
</script>

<div class="pane">
  <div class="tabs">
    {#each children as child}
      <span class="tab" class:selected={selected === child}>
        <button
          class="name"
          on:click={() => {
            selected = child;
          }}
        >
          {child.name}{#if child.context?.dirty}*{/if}
        </button>
        <button
          class="close"
          title="close"
          on:click={() => {
            if (child.context?.dirty && !confirm('Close without saving?'))
              return;
            children = children.filter((c) => c !== child);
            if (selected === child) selected = undefined;
          }}
        >
          ×
        </button>
      </span>
    {/each}
  </div>

  <div class="contents">
    {#if selected === undefined}
      👈 Pick something
    {:else}
      <svelte:component
        this={selected.component}
        bind:context={selected.context}
        on:cmd
      />
    {/if}
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
</style>
