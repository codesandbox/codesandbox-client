import dot from 'dot-object';
import applicationTheme from '@codesandbox/common/lib/theme';
import codesandboxBlack from '@codesandbox/common/lib/themes/codesandbox-black';
import codesandboxLight from '@codesandbox/common/lib/themes/codesandbox-light.json';
import tokens from './tokens';

export function getTheme(variant) {
  const embedTheme = variant === 'light' ? codesandboxLight : codesandboxBlack;

  // merge vscode colors into tokens
  Object.assign(tokens.colors, dot.object({ ...embedTheme.colors }));

  return {
    // hope to remove this bit
    ...applicationTheme,
    // used for parts imported from outside embed
    ...embedTheme.colors,
    // used for syntax highlighting
    vscodeTheme: embedTheme,
    // used for embed styles
    ...tokens,
    // used by multiple components in common
    light: variant === 'light',
  };
}
