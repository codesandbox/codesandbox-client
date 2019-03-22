import React from 'react';
import { number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import Stats from './index.tsx';

storiesOf('Stats', module)
  .add('Default', () => (
    <Stats
      viewCount={number('viewCount', 123)}
      likeCount={number('likeCount', 123)}
      forkCount={number('forkCount', 123)}
    />
  ))
  .add('Verical', () => (
    <Stats
      vertical
      viewCount={number('viewCount', 123)}
      likeCount={number('likeCount', 123)}
      forkCount={number('forkCount', 123)}
    />
  ));
