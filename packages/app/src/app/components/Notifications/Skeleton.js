import React from 'react';
import css from '@styled-system/css';
import { ListItem, Stack } from '@codesandbox/components';
import { SkeletonTextBlock } from 'app/components/Skeleton/elements';

const NotificationSkeleton = () => (
  <ListItem
    justify="space-between"
    align="center"
    css={css({ paddingLeft: 3, minHeight: 7 })}
    marginY={3}
  >
    <Stack gap={4} align="center" css={css({ color: 'sideBar.border' })}>
      <SkeletonTextBlock css={css({ width: 32, height: 32 })} />
      <SkeletonTextBlock css={{ width: 240 }} />
    </Stack>
  </ListItem>
);

export const Skeleton = () => (
  <>
    <NotificationSkeleton />
    <NotificationSkeleton />
    <NotificationSkeleton />
    <NotificationSkeleton />
    <NotificationSkeleton />
    <NotificationSkeleton />
  </>
);
