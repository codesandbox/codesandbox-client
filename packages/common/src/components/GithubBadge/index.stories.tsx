import * as React from 'react';
import { storiesOf } from '@storybook/react';
import GithubBadge from './';
import { ThemeDecorator } from '../../stories/decorators';

const stories = storiesOf('components/GithubBadge', module).addDecorator(
  ThemeDecorator
);

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
