import React from 'react';
import { storiesOf } from '@storybook/react';
import GithubBadge from './';

const stories = storiesOf('components/GithubBadge', module);

stories
  .add('Master', () => (
    <GithubBadge
      username={'CompuIves'}
      repo={'codesandbox-client'}
      branch={'master'}
    />
  ))
  .add('Other Branch', () => (
    <GithubBadge
      username={'CompuIves'}
      repo={'codesandbox-client'}
      branch={'storybook'}
    />
  ));
