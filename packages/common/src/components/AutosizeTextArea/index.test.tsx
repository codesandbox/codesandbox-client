import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import AutosizeTextArea from './';

describe('<AutosizeTextArea /> rendering', () => {
  it('renders correctly', () => {
    expect(mountWithTheme(<AutosizeTextArea />)).toMatchSnapshot();
  });
});
