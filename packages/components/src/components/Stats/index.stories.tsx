import React from 'react';
import { storiesOf } from '@storybook/react';
import { number } from '@storybook/addon-knobs';
import StatsComponent from '.';

const defaults = () => ({
  viewCount: number('viewCount', 1223),
  likeCount: number('likeCount', 1223),
  forkCount: number('forkCount', 122123123),
});

storiesOf('components/Stats', module)
  .add('Stats', () => <StatsComponent {...defaults()} />)
  .add('Stats with text', () => <StatsComponent {...defaults()} text />)
  .add('Vertical Stats', () => <StatsComponent {...defaults()} vertical />)
  .add('Vertical Stats with text', () => (
    <StatsComponent {...defaults()} vertical text />
  ));
