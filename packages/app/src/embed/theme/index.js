import applicationTheme from '@codesandbox/common/lib/theme';
import codesandboxBlack from '@codesandbox/common/lib/themes/codesandbox-black.json';

const theme = {
  ...applicationTheme,
  ...codesandboxBlack.colors,
  vscodeTheme: codesandboxBlack,
};

export default theme;
