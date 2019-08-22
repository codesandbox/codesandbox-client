import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import AutosizeTextArea from './';

let wrapper;

beforeEach(() => {
  wrapper = mountWithTheme(<AutosizeTextArea />);
});

describe('<AutosizeTextArea /> rendering', () => {
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
