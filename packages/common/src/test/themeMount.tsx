import React, { ReactElement } from 'react';
import { mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import theme from '../theme';

const mountWithTheme = (tree: ReactElement) => {
  const WrappingThemeProvider: React.FunctionComponent<{
    children: React.ReactChild;
  }> = props => <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;

  return mount(tree, { wrappingComponent: WrappingThemeProvider });
};

export default mountWithTheme;
