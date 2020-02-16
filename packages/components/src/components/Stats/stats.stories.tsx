import React from 'react';
import { Stats } from '.';

export default {
  title: 'components/Stats',
  component: Stats,
};

// replace the text inside with Text variants when available
export const Basic = () => (
  <Stats
    sandbox={{
      likeCount: 12,
      viewCount: 12,
      forkCount: 12,
    }}
  />
);

export const BigNumber = () => (
  <Stats
    sandbox={{
      likeCount: 712683,
      viewCount: 12,
      forkCount: 12,
    }}
  />
);
