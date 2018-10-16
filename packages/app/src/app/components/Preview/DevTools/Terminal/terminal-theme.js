// @flow

type VSTheme = {
  background2: () => void,
  vscodeTheme: {
    colors: {
      'terminal.ansiBlack': string,
      'terminal.ansiBlue': string,
      'terminal.ansiBrightBlack': string,
      'terminal.ansiBrightBlue': string,
      'terminal.ansiBrightCyan': string,
      'terminal.ansiBrightGreen': string,
      'terminal.ansiBrightMagenta': string,
      'terminal.ansiBrightRed': string,
      'terminal.ansiBrightWhite': string,
      'terminal.ansiBrightYellow': string,
      'terminal.ansiCyan': string,
      'terminal.ansiGreen': string,
      'terminal.ansiMagenta': string,
      'terminal.ansiRed': string,
      'terminal.ansiWhite': string,
      'terminal.ansiYellow': string,
      'panel.background': string,
      'panel.foreground': string,
      'terminal.foreground': string,
      'terminal.selectionBackground': string,
    },
  },
};

type XTermTheme = {
  background: string,
  black: string,
  blue: string,
  brightBlack: string,
  brightBlue: string,
  brightCyan: string,
  brightGreen: string,
  brightMagenta: string,
  brightRed: string,
  brightWhite: string,
  brightYellow: string,
  cyan: string,
  foreground: string,
  green: string,
  magenta: string,
  red: string,
  selection: string,
  white: string,
  yellow: string,
};

export default function getTerminalTheme(theme: VSTheme): XTermTheme {
  return {
    background:
      theme.vscodeTheme.colors['panel.background'] || theme.background2(),
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
  };
}
