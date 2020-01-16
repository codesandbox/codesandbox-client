import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import { HeartIcon, ViewIcon, ForkIcon } from './icons';

export const Stats = ({ sandbox }) => (
  <Stack gap={4} style={{ padding: '0 8px' }}>
    <Stack gap={1} align="center">
      <HeartIcon />
      <Text variant="muted">{sandbox.likeCount}</Text>
    </Stack>
    <Stack gap={1} align="center">
      <ViewIcon />
      <Text variant="muted">{sandbox.viewCount}</Text>
    </Stack>
    <Stack gap={1} align="center">
      <ForkIcon />
      <Text variant="muted">{sandbox.forkCount}</Text>
    </Stack>
  </Stack>
);
