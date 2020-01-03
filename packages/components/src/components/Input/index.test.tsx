import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import Input from '.';

describe('<Input /> rendering', () => {
  it('basic', () => {
    const wrapper = mountWithTheme(<Input value="I am a fancy input" />);
    expect(wrapper).toMatchSnapshot();
  });
  it('error', () => {
    const wrapper = mountWithTheme(<Input value="I am a fancy input" error />);
    expect(wrapper).toMatchSnapshot();
  });
  it('placeholder', () => {
    const wrapper = mountWithTheme(<Input placeholder="Hello" />);
    expect(wrapper).toMatchSnapshot();
  });
});
