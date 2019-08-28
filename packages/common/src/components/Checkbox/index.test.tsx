import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import { Checkbox } from '.';

describe('<Checkbox /> rendering', () => {
  it('no props', () => {
    const wrapper = mountWithTheme(<Checkbox />);
    expect(wrapper).toMatchSnapshot();
  });
  it('checkbox checked', () => {
    const wrapper = mountWithTheme(<Checkbox checked />);
    expect(wrapper).toMatchSnapshot();
  });
});
