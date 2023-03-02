<script lang="ts">
  import { onMount } from 'svelte';
  import { Terminal } from 'xterm';
  import { FitAddon } from 'xterm-addon-fit';
  import 'xterm/css/xterm.css';

  export let terminal: Terminal;
  let fitAddon: FitAddon;
  let wrapper: HTMLElement;

  onMount(() => {
    terminal = new Terminal({ convertEol: true, rows: 10 });
    fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    fitAddon.fit();
    terminal.open(wrapper);

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
