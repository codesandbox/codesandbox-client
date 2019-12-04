import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import GithubBadge from '.';

describe('<GithubBadge /> rendering', () => {
  it('master', () => {
    const wrapper = mountWithTheme(
      <GithubBadge
        username="CompuIves"
        repo="codesandbox-client"
        branch="master"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('other branch', () => {
    const wrapper = mountWithTheme(
      <GithubBadge
        username="CompuIves"
        repo="codesandbox-client"
        branch="storybook"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
