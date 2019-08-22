import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import AutosizeInput from '.';

let wrapper;

beforeEach(() => {
  wrapper = mountWithTheme(<AutosizeInput />);
});

describe('<AutosizeInput /> rendering', () => {
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
