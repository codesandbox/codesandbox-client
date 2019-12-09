import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import { Button } from '.';

describe('<Button /> rendering', () => {
  it('no props', () => {
    expect(mountWithTheme(<Button>Le button</Button>)).toMatchSnapshot();
  });
  it('Danger Button', () => {
    expect(mountWithTheme(<Button danger>Le button</Button>)).toMatchSnapshot();
  });
  it('Secondary Button', () => {
    expect(
      mountWithTheme(<Button secondary>Le button</Button>)
    ).toMatchSnapshot();
  });
  it('Small Button', () => {
    expect(mountWithTheme(<Button small>Le button</Button>)).toMatchSnapshot();
  });
  it('block Button', () => {
    expect(mountWithTheme(<Button block>Le button</Button>)).toMatchSnapshot();
  });

  it('Href Button', () => {
    expect(
      mountWithTheme(<Button href="#">Le button</Button>)
    ).toMatchSnapshot();
  });
});
