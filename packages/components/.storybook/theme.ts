import dot from 'dot-object';
import deepmerge from 'deepmerge';
import designLanguage from '@codesandbox/common/lib/design-language';
import polyfillTheme from '../src/utils/polyfill-theme';

// black is the default, it would be helpful to use storybook-addon-themes
// to test our components across multiple themes
import vsCodeTheme from '@codesandbox/common/lib/themes/codesandbox-black';

// convert vscode colors to dot notation so that we can use them in tokens
const vsCodeColors = dot.object({ ...vsCodeTheme.colors });

// Our interface does not map 1-1 with vscode.
// To add styles that remain themeable, we add
// some polyfills to the theme tokens.
const polyfilledVSCodeColors = polyfillTheme(vsCodeColors);

// merge the design language and vscode theme
const theme = deepmerge(designLanguage, { colors: polyfilledVSCodeColors });

export default theme;
