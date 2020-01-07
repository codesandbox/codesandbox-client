import React from 'react';
import { ThemeProvider } from 'styled-components';

import deepmerge from 'deepmerge';
import designLanguage from '@codesandbox/common/lib/design-language';

// black is the default, it would be helpful to use storybook-addon-themes
// to test our components across multiple themes
import vsCodeTheme from '@codesandbox/common/lib/themes/codesandbox-black';

const theme = deepmerge(designLanguage, vsCodeTheme);

export const ThemeDecorator = (fn: () => JSX.Element) => (
  <ThemeProvider theme={theme}>{fn()}</ThemeProvider>
);
