import { Terminal } from 'xterm';

export type TerminalWithFit = Terminal & {
  fit(): void;
};

export type ShellT = {
  id: string;
  title: string;
  script: string | undefined;
  ended: boolean;
};
