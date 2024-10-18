<script lang="ts">
  import { FitAddon } from '@xterm/addon-fit';
  import { Terminal } from '@xterm/xterm';
  import '@xterm/xterm/css/xterm.css';
  import { createEventDispatcher, onMount } from 'svelte';
  import type { Contexts } from './index.js';

  export let context: Contexts['terminal'];

  let terminal: Terminal;
  let fitAddon: FitAddon;
  let wrapper: HTMLElement;

  const dispatch = createEventDispatcher<{ ready: Terminal }>();

  onMount(() => {
    terminal = new Terminal({
      convertEol: true,
      fontFamily: 'Consolas, Monaco, "Ubuntu Mono", monospace',
    });
    fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    // Open the terminal in the wrapper and fit it to the wrapper
    terminal.open(wrapper);
    fitAddon.fit();

    dispatch('ready', terminal);
    context.attach(terminal);

    return () => {
      fitAddon.dispose();
      terminal.dispose();
    };
  });
</script>

<svelte:window
  on:resize={() => {
    fitAddon.fit();
  }}
/>

<div bind:this={wrapper} />

<style lang="scss">
  div {
    height: 100%;
    background: #000;
  }
</style>
