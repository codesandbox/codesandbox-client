import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import Navigation from './';

describe('<Navigation /> rendering', () => {
  it('basic', () => {
    const wrapper = mountWithTheme(<Navigation />);
    expect(wrapper).toMatchSnapshot();
  });
});
