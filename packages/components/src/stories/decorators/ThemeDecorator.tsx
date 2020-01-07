import React from 'react';
import dot from 'dot-object';
import { ThemeProvider } from 'styled-components';

import deepmerge from 'deepmerge';
import designLanguage from '@codesandbox/common/lib/design-language';

// black is the default, it would be helpful to use storybook-addon-themes
// to test our components across multiple themes
import vsCodeTheme from '@codesandbox/common/lib/themes/codesandbox-black';

// convert vscode colors to dot notation so that we can use them in tokens
const vsCodeColors = dot.object({ ...vsCodeTheme.colors });

// merge the design language and vscode theme
const theme = deepmerge(designLanguage, { colors: vsCodeColors });

export const ThemeDecorator = (fn: () => JSX.Element) => (
  <ThemeProvider theme={theme}>{fn()}</ThemeProvider>
);
