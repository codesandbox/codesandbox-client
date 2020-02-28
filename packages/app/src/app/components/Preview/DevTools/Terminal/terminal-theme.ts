import { ITheme } from 'xterm';
import dot from 'dot-object';

export type VSTheme = {
  background2: () => void;
  vscodeTheme: {
    colors: {
      'terminal.ansiBlack': string;
      'terminal.ansiBlue': string;
      'terminal.ansiBrightBlack': string;
      'terminal.ansiBrightBlue': string;
      'terminal.ansiBrightCyan': string;
      'terminal.ansiBrightGreen': string;
      'terminal.ansiBrightMagenta': string;
      'terminal.ansiBrightRed': string;
      'terminal.ansiBrightWhite': string;
      'terminal.ansiBrightYellow': string;
      'terminal.ansiCyan': string;
      'terminal.ansiGreen': string;
      'terminal.ansiMagenta': string;
      'terminal.ansiRed': string;
      'terminal.ansiWhite': string;
      'terminal.ansiYellow': string;
      'panel.background': string;
      'panel.foreground': string;
      'terminal.foreground': string;
      'terminal.selectionBackground': string;
    };
  };
};

export default function getTerminalTheme(theme: VSTheme): ITheme {
  return {
    background:
      theme.vscodeTheme.colors['terminal.background'] || theme.background2(),
    black: theme.vscodeTheme.colors['terminal.ansiBlack'],
    blue: theme.vscodeTheme.colors['terminal.ansiBlue'],
    brightBlack: theme.vscodeTheme.colors['terminal.ansiBrightBlack'],
    brightBlue: theme.vscodeTheme.colors['terminal.ansiBrightBlue'],
    brightCyan: theme.vscodeTheme.colors['terminal.ansiBrightCyan'],
    brightGreen: theme.vscodeTheme.colors['terminal.ansiBrightGreen'],
    brightMagenta: theme.vscodeTheme.colors['terminal.ansiBrightMagenta'],
    brightRed: theme.vscodeTheme.colors['terminal.ansiBrightRed'],
    brightWhite: theme.vscodeTheme.colors['terminal.ansiBrightWhite'],
    brightYellow: theme.vscodeTheme.colors['terminal.ansiBrightYellow'],
    cyan: theme.vscodeTheme.colors['terminal.ansiCyan'],
    foreground:
      theme.vscodeTheme.colors['terminal.foreground'] ||
      theme.vscodeTheme.colors['panel.foreground'],
    green: theme.vscodeTheme.colors['terminal.ansiGreen'],
    magenta: theme.vscodeTheme.colors['terminal.ansiMagenta'],
    red: theme.vscodeTheme.colors['terminal.ansiRed'],
    white: theme.vscodeTheme.colors['terminal.ansiWhite'],
    yellow: theme.vscodeTheme.colors['terminal.ansiYellow'],
    selection: theme.vscodeTheme.colors['terminal.selectionBackground'],
    cursor: theme.vscodeTheme.colors['terminalCursor.foreground'],
    cursorAccent: theme.vscodeTheme.colors['terminalCursor.background'],
  };
}

export const flattenTerminalTheme = theme => ({
  ...theme,
  vscodeTheme: {
    ...theme.vscodeTheme,
    colors: dot.dot(theme.vscodeTheme.colors),
  },
});
