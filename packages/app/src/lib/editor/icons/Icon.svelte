<script lang="ts">
  import type { Contexts } from '../panes/index.js';
  import FileIcon from './FileIcon.svelte';
  import Browser from '~icons/ri/earth-fill';
  import Readme from '~icons/ri/book-open-fill';
  import Terminal from '~icons/ri/terminal-box-fill';

  export let type: keyof Contexts;
  export let name: string;
</script>

{#if type === 'file'}
  <FileIcon {name} />
{:else if type === 'browser'}
  <Browser />
{:else if type === 'markdown'}
  <Readme />
{:else if type === 'terminal'}
  <Terminal />
{/if}
