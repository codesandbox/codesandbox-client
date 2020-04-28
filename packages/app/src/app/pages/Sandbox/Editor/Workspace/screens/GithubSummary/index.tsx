import { Stack } from '@codesandbox/components';
import React from 'react';

import { Explorer } from '../Explorer';

export const GithubSummary = () => (
  <Stack direction="vertical" justify="space-between" css={{ height: '100%' }}>
    <p>Hello there!</p>
    <Explorer readonly />
  </Stack>
);
