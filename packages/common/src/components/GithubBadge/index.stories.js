import React from 'react';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import GithubBadge from './index.tsx';

storiesOf('GithubBadge', module).add('Default', () => (
  <GithubBadge
    username={text('username', 'CompuIves')}
    repo={text('repo', 'codesandbox-client')}
    branch={text('branch', 'storybook')}
  />
));
