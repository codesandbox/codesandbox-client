import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import CustomTemplate from '.';
import { sandbox } from '../SandboxCard/fixtures';

const template = (props = null) => ({
  id: '2321',
  color: '#fff',
  sandbox: sandbox(props),
});

describe('<ContributorsBadge /> rendering', () => {
  it('Default', () =>
    expect(
      mountWithTheme(<CustomTemplate template={template()} />)
    ).toMatchSnapshot());
  it('No Title', () =>
    expect(
      mountWithTheme(<CustomTemplate template={template({ title: null })} />)
    ).toMatchSnapshot());
  it('No Description', () =>
    expect(
      mountWithTheme(
        <CustomTemplate template={template({ description: null })} />
      )
    ).toMatchSnapshot());
  it('No Tags', () =>
    expect(
      mountWithTheme(<CustomTemplate template={template({ tags: [] })} />)
    ).toMatchSnapshot());
});
