import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import SandboxCard, { Props } from './';
import * as fixtures from './fixtures';

const createSandboxStory = ({
  sandbox = fixtures.sandbox(),
  selectSandbox = () => {},
  small,
  noHeight,
  defaultHeight,
  noMargin,
}: Partial<Props>) => () => (
  <SandboxCard
    sandbox={sandbox}
    selectSandbox={selectSandbox}
    small={small}
    noHeight={noHeight}
    defaultHeight={defaultHeight}
    noMargin={noMargin}
  />
);

describe('<SandboxCard /> rendering', () => {
  it('basic', () => {
    const wrapper = mountWithTheme(createSandboxStory({}));
    expect(wrapper).toMatchSnapshot();
  });
});
