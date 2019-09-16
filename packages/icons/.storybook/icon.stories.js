import React from 'react';
import { basename } from 'path';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Icons', module);

const context = require.context('./', false, /.js$/);
const files = requireAll(context);

stories.add('Gallery', () => {
  return files.map(({ name, Component }) => {
    return (
      <Wrapper name={name}>
        <Component />
        <label>{name}</label>
      </Wrapper>
    );
  });
});

const Wrapper = styled.div`
  width: 32px;
  height: 32px;
  margin: 16px;
  display: inline-block;
  border: 2px solid transparent;
  > label {
    font-size: 14px;
  }
`;

/** require all icon files */
function requireAll(context) {
  return context
    .keys()
    .map(filepath => {
      return {
        name: basename(filepath).replace('.js', ''),
        Component: context(filepath).default,
      };
    })
    .filter(({ Component }) => Component);
}
