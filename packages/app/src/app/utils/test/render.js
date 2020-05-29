import 'jest-styled-components';

import theme from '@codesandbox/common/es/theme';
import React from 'react';
import renderer from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';

export default Component => {
  const tree = renderer
    .create(<ThemeProvider theme={theme}>{Component}</ThemeProvider>)
    .toJSON();
  expect(tree).toMatchSnapshot();
};
