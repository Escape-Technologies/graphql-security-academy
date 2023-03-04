<script lang="ts">
  import * as monaco from 'monaco-editor';
  import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
  import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
  import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
  import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
  import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
  import { createEventDispatcher } from 'svelte';
  import type { Contexts } from './files.js';

  self.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === 'json') {
        return new jsonWorker();
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker();
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker();
      }
      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker();
      }
      return new editorWorker();
    },
  };

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
