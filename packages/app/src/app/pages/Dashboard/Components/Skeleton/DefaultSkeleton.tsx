import React from 'react';
import css from '@styled-system/css';

import { SkeletonText, Stack } from '@codesandbox/components';
import { ViewMode } from '../../types';

const DefaultSkeletonCard = () => (
  <Stack
    direction="vertical"
    gap={4}
    css={css({
      width: '100%',
      height: 240,
      border: '1px solid',
      borderColor: 'grays.600',
      borderRadius: 'medium',
      overflow: 'hidden',
    })}
  >
    <SkeletonText css={{ width: '100%', height: 120, borderRadius: 0 }} />
    <Stack direction="vertical" gap={2} marginX={4}>
      <SkeletonText css={{ width: 120 }} />
      <SkeletonText css={{ width: 180 }} />
    </Stack>
  </Stack>
);

const DefaultSkeletonListItem = () => (
  <Stack
    paddingX={2}
    align="center"
    justify="space-between"
    css={css({
      height: 64,
      paddingX: 2,
      borderBottom: '1px solid',
      borderBottomColor: 'grays.600',
    })}
  >
    <Stack align="center" gap={4}>
      <SkeletonText css={{ height: 32, width: 32 }} />
      <SkeletonText css={{ width: 120 }} />
    </Stack>
    <SkeletonText css={{ width: 120 }} />
    <SkeletonText css={{ width: 120 }} />
  </Stack>
);

export const DefaultSkeleton: React.FC<{ viewMode: ViewMode }> = ({
  viewMode,
}) => {
  return {
    list: <DefaultSkeletonListItem />,
    grid: <DefaultSkeletonCard />,
  }[viewMode];
};
