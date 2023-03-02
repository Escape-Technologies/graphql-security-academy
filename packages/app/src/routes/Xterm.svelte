<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { Terminal } from 'xterm';
  import { FitAddon } from 'xterm-addon-fit';
  import 'xterm/css/xterm.css';

  let terminal: Terminal;
  let fitAddon: FitAddon;
  let wrapper: HTMLElement;

  const dispatch = createEventDispatcher<{ ready: Terminal }>();

  onMount(() => {
    terminal = new Terminal({
      convertEol: true,
      rows: 10,
      fontFamily: 'Consolas, Monaco, "Ubuntu Mono", monospace',
    });
    fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    fitAddon.fit();
    terminal.open(wrapper);

    dispatch('ready', terminal);

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
