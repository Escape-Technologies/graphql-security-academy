import type { WebContainer, WebContainerProcess } from '@webcontainer/api';
import { readable, type Readable } from 'svelte/store';
import type { Terminal } from 'xterm';

export type Shell = Readable<WebContainerProcess>;

export const spawnShell = async (
  container: WebContainer,
  terminal: Terminal
): Promise<Shell> => {
  let shell = await container.spawn('jsh', {
    terminal: { cols: terminal.cols, rows: terminal.rows },
  });

  return readable(shell, (set) => {
    let run = true;
    set(shell);

    // Start the shell in an unbound async context
    (async () => {
      while (run) {
        await shell.exit;
        terminal.clear();
        // Restart a new shell if the previous one exited
        shell = await container.spawn('jsh', {
          terminal: { cols: terminal.cols, rows: terminal.rows },
        });
        set(shell);
      }
    })();

    return () => {
      run = false;
      shell.kill();
    };
  });
};
