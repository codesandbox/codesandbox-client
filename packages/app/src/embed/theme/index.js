import applicationTheme from '@codesandbox/common/lib/theme';
import codesandboxBlack from '@codesandbox/common/lib/themes/codesandbox-nu.json';
import tokens from './tokens';

const theme = {
  ...applicationTheme,
  ...tokens,
  vscodeTheme: codesandboxBlack,
};

export default theme;
