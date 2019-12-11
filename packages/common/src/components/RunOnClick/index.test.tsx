import 'jest-styled-components';
import React from 'react';
import { noop } from '../../test/mocks';
import mountWithTheme from '../../test/themeMount';
import RunOnClick from '.';

describe('<RunOnClick /> rendering', () => {
  it('basic', () => {
    const wrapper = mountWithTheme(<RunOnClick onClick={noop} />);
    expect(wrapper).toMatchSnapshot();
  });
});
