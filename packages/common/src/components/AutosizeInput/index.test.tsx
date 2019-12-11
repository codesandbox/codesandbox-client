import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import AutosizeInput from '.';

describe('<AutosizeInput /> rendering', () => {
  it('renders correctly', () => {
    expect(mountWithTheme(<AutosizeInput />)).toMatchSnapshot();
  });
});
