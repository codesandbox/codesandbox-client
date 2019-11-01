import dot from 'dot-object';
import applicationTheme from '@codesandbox/common/lib/theme';
import codesandboxBlack from '@codesandbox/common/lib/themes/codesandbox-black.json';
import tokens from './tokens';

// merge vscode colors into tokens
Object.assign(tokens.colors, dot.object({ ...codesandboxBlack.colors }));

const theme = {
  // hope to remove this bit
  ...applicationTheme,
  // used for parts imported from outside embed
  ...codesandboxBlack.colors,
  // used for syntax highlighting
  vscodeTheme: codesandboxBlack,
  // used for embed styles
  ...tokens,
};

export default theme;
