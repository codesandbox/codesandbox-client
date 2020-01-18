import React from 'react';
import { Text } from '../Text';
import { Stack } from '../Stack';

export const HeartIcon = props => (
  <svg width={11} height={10} fill="none" viewBox="0 0 11 10" {...props}>
    <path
      fill="currentColor"
      d="M5.423 9.625c9.631-5.155 4.868-12.17 0-8.695-4.658-3.475-9.421 3.54 0 8.695z"
    />
  </svg>
);

export const ViewIcon = props => (
  <svg width={13} height={10} fill="none" viewBox="0 0 13 10" {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M13 4.55c0 1.3-3.987 4.55-6.5 4.55S0 5.525 0 4.55C0 3.25 3.987 0 6.5 0S13 3.25 13 4.55zm-3.9 0a2.6 2.6 0 11-5.2 0 2.6 2.6 0 015.2 0zM6.5 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
      clipRule="evenodd"
    />
  </svg>
);

export const ForkIcon = props => (
  <svg width={10} height={12} fill="none" viewBox="0 0 10 12" {...props}>
    <path
      fill="currentColor"
      d="M10 1.625C10 .715 9.267 0 8.333 0 7.4 0 6.667.715 6.667 1.625c0 .585.333 1.138.833 1.397v1.071a.75.75 0 01-.2.51L5.55 6.491a.75.75 0 01-1.1 0L2.7 4.603a.75.75 0 01-.2-.51v-1.07c.5-.26.833-.78.833-1.398C3.333.715 2.6 0 1.667 0 .733 0 0 .715 0 1.625c0 .585.333 1.138.833 1.397V4.71c0 .19.072.372.202.511l2.93 3.143a.75.75 0 01.202.511v.102c-.5.293-.834.813-.834 1.398C3.333 11.285 4.067 12 5 12s1.667-.715 1.667-1.625c0-.585-.334-1.105-.834-1.398v-.102a.75.75 0 01.202-.511l2.93-3.143a.75.75 0 00.202-.511V3.022c.5-.26.833-.78.833-1.397z"
    />
  </svg>
);

export const formatNumber = (count: number): string =>
  count >= 1000 ? `${(count / 1000).toFixed(1)}k` : `${count}`;

export const Stats = ({ sandbox }) => (
  <Stack gap={4} css={{ paddingX: 3 }}>
    <Stack gap={1} align="center">
      <Text variant="muted">
        <HeartIcon />
      </Text>
      <Text variant="muted">{formatNumber(sandbox.likeCount)}</Text>
    </Stack>
    <Stack gap={1} align="center">
      <Text variant="muted">
        <ViewIcon />
      </Text>
      <Text variant="muted">{formatNumber(sandbox.viewCount)}</Text>
    </Stack>
    <Stack gap={1} align="center">
      <Text variant="muted">
        {' '}
        <ForkIcon />
      </Text>
      <Text variant="muted">{formatNumber(sandbox.forkCount)}</Text>
    </Stack>
  </Stack>
);
