<script lang="ts" context="module">
  export type PaneChild = {
    name: string;
    component: any; // Typing svelte component constructors is hard
    props?: object;
  };
</script>

<script lang="ts">
  export let children: PaneChild[];
  export let selected: PaneChild | undefined;
</script>

<div class="pane">
  <div>
    {#each children as child}
      <button
        on:click={() => {
          selected = child;
        }}
      >
        {child.name}
      </button>
      <button
        on:click={() => {
          children = children.filter((c) => c !== child);
          if (selected === child) selected = undefined;
        }}>x</button
      >
    {/each}
  </div>

  {#if selected === undefined}
    👆 Pick something
  {:else}
    <svelte:component this={selected.component} {...selected.props} />
  {/if}
</div>

<style lang="scss">
  .pane {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
  }
</style>
