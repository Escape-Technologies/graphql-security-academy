import { chalk } from '$lib/chalk.js';
import type { WebContainer } from '@webcontainer/api';
import type { Terminal } from 'xterm';

export class ShellService {
  readonly tasks: Array<Promise<void>> = [];

  constructor(readonly container: WebContainer) {}

  async spawn(terminal: Terminal) {
    return this.container.spawn('jsh', {
      terminal: { cols: terminal.cols, rows: terminal.rows },
    });
  }

  async initTerminal(terminal: Terminal) {
    const shell = await this.spawn(terminal);
    const input = shell.input.getWriter();

    // $shell.resize({ cols: activeTerminal.cols, rows: activeTerminal.rows });

    terminal.onData((data) => {
      input.write(data);
    });
    terminal.write(
      `# Welcome! Run ${chalk.yellowBright(
        'npm install'
      )} and ${chalk.yellowBright('npm start')} to get started.\n`
    );
    shell.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal.write(data);
        },
      })
    );

    return shell;
  }
}
