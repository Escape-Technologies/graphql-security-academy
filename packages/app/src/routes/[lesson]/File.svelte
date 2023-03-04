<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Contexts } from './files.js';
  import * as monaco from 'monaco-editor';

  export let context: Contexts['file'];

  const supportedLanguages = new Map([
    ['env', 'ini'],
    ['js', 'javascript'],
    ['json', 'json'],
    ['sql', 'sql'],
    ['toml', 'ini'],
  ]);
  let language = supportedLanguages.get(context.extension);

  const dispatch = createEventDispatcher<{ dirty: boolean }>();

  const editor = (node: HTMLElement) => {
    const editor = monaco.editor.create(node, {
      value: context.contents,
      language,
      minimap: { enabled: false },
    });

    editor.onDidChangeModelContent(() => {
      dispatch('dirty', true);
      context.contents = editor.getValue();
    });

    return {
      destroy() {
        editor.dispose();
      },
    };
  };
</script>

{#if language}
  <div use:editor />
{:else}
  <div>
    Unknown extension <strong>{context.extension}</strong>
    <button
      on:click={() => {
        language = 'text';
      }}>Open anyway</button
    >
  </div>
{/if}

<style lang="scss">
  div {
    width: 100%;
    height: 100%;
  }
</style>
