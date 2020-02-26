import React, { ComponentType, FunctionComponent } from 'react';

import { Stack, Text } from '../..';

const formatNumber = (count: number): string | number => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }

  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }

  return count;
};

type Props = {
  count: number;
  Icon: ComponentType;
};
export const Stat: FunctionComponent<Props> = ({ count, Icon }) => (
  <Stack gap={1} align="center">
    <Text variant="muted" style={{ display: 'flex', alignItems: 'center' }}>
      <Icon />
    </Text>

    <Text variant="muted">{formatNumber(count)}</Text>
  </Stack>
);
