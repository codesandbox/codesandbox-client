import React from 'react';
import css from '@styled-system/css';

import { Column, Grid, SkeletonText, Stack } from '@codesandbox/components';
import { ViewMode } from '../../types';

const SolidCardSkeleton: React.FC = () => (
  <Stack
    direction="vertical"
    gap={4}
    css={css({
      width: '100%',
      height: '100%',
      border: '1px solid',
      borderColor: 'grays.600',
      borderRadius: '4px',
      overflow: 'hidden',
    })}
  >
    <SkeletonText css={{ width: '100%', height: '100%' }} />
  </Stack>
);

const SolidListItemSkeleton: React.FC = () => (
  <Stack>
    <Grid css={{ width: 'calc(100% - 26px - 8px)' }}>
      <Column
        span={[12, 5, 5]}
        css={{
          display: 'block',
          overflow: 'hidden',
          paddingBottom: 4,
          paddingTop: 4,
        }}
      >
        <Stack gap={4} align="center" marginLeft={2}>
          <SkeletonText
            css={css({
              width: '16px',
            })}
          />
          <SkeletonText />
        </Stack>
      </Column>
      <Column span={[0, 4, 4]} as={Stack} align="center">
        <SkeletonText />
      </Column>
    </Grid>
  </Stack>
);

export const SolidSkeleton: React.FC<{ viewMode: ViewMode }> = ({
  viewMode,
}) => {
  return {
    list: <SolidListItemSkeleton />,
    grid: <SolidCardSkeleton />,
  }[viewMode];
};
