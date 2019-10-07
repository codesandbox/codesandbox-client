import applicationTheme from '@codesandbox/common/lib/theme';
import codesandboxNu from '@codesandbox/common/lib/themes/codesandbox-nu.json';

const theme = {
  ...applicationTheme,
  ...codesandboxNu.colors,
  vscodeTheme: codesandboxNu,
};

export default theme;
