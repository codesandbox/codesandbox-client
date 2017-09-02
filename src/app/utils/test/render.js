import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';

import { ThemeProvider } from 'styled-components';
import theme from 'common/theme';

export default Component => {
  const tree = renderer
    .create(<ThemeProvider theme={theme}>{Component}</ThemeProvider>)
    .toJSON();
  expect(tree).toMatchSnapshot();
};
