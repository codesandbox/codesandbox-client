import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import Notice from './';

describe('<Notice /> rendering', () => {
  it('basic', () => {
    const wrapper = mountWithTheme(<Notice>You need to Login</Notice>);
    expect(wrapper).toMatchSnapshot();
  });
});
