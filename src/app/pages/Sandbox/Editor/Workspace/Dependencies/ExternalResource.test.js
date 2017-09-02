import React from 'react';
import renderer from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';

import ExternalResource from './ExternalResource';
import theme from '../../../../../../common/theme';

describe('ExternalResource', () => {
  it('renders file if there is an extension', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={theme}>
          <ExternalResource resource="https://ivesvh.com/ives.js" />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders url if there is no extension', () => {
    const tree1 = renderer
      .create(
        <ThemeProvider theme={theme}>
          <ExternalResource resource="https://ivesvh.com/" theme={theme} />
        </ThemeProvider>
      )
      .toJSON();

    const tree2 = renderer
      .create(
        <ThemeProvider theme={theme}>
          <ExternalResource resource="https://ivesvh.com" theme={theme} />
        </ThemeProvider>
      )
      .toJSON();

    expect(tree1).toMatchSnapshot();
    expect(tree2).toMatchSnapshot();
  });
});
