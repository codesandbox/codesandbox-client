import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import ProgressButton from './';

describe('<ProgressButton /> rendering', () => {
  it('basic', () => {
    const wrapper = mountWithTheme(<ProgressButton>Click Me</ProgressButton>);
    expect(wrapper).toMatchSnapshot();
  });
  it('disabled', () => {
    const wrapper = mountWithTheme(
      <ProgressButton disabled>Click Me</ProgressButton>
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('loading', () => {
    const wrapper = mountWithTheme(
      <ProgressButton loading>Click Me</ProgressButton>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
