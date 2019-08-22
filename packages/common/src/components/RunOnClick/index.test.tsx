import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import RunOnClick from './';

describe('<RunOnClick /> rendering', () => {
  it('basic', () => {
    const wrapper = mountWithTheme(<RunOnClick onClick={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
