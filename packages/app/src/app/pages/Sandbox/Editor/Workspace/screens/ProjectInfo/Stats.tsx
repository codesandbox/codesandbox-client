import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import { HeartIcon, ViewIcon, ForkIcon } from './icons';

export const formatNumber = (count: number): string =>
  count >= 1000 ? `${(count / 1000).toFixed(1)}k` : `${count}`;

export const Stats = ({ sandbox }) => (
  <Stack gap={4} style={{ padding: '0 8px' }}>
    <Stack gap={1} align="center">
      <HeartIcon />
      <Text variant="muted">{formatNumber(sandbox.likeCount)}</Text>
    </Stack>
    <Stack gap={1} align="center">
      <ViewIcon />
      <Text variant="muted">{formatNumber(sandbox.viewCount)}</Text>
    </Stack>
    <Stack gap={1} align="center">
      <ForkIcon />
      <Text variant="muted">{formatNumber(sandbox.forkCount)}</Text>
    </Stack>
  </Stack>
);
