import React from 'react';
import { Badge } from '.';
import { Stack } from '../Stack';

export default {
  title: 'components/Badge',
  component: Badge,
};

export const Examples = () => (
  <Stack align="flex-start" gap={2} direction="vertical">
    <Badge>Neutral</Badge>
    <Badge color="accent">Accent</Badge>
    <Badge icon="bell">With icon</Badge>
    <Badge icon="bell" color="accent">
      Accent with icon
    </Badge>
  </Stack>
);
