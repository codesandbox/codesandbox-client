import React from 'react';

import { Tooltip } from '.';
import { Stack, IconButton } from '../..';

export default {
  title: 'components/Tooltip',
  component: Tooltip,
};

export const Simple = () => (
  <Stack justify="center">
    <Tooltip label="Mark as resolved">
      <span>hover over me</span>
    </Tooltip>
  </Stack>
);

export const Long = () => (
  <Stack justify="center">
    <Tooltip label="Mark as resolved because now it's job is done">
      <span>hover over me</span>
    </Tooltip>
  </Stack>
);

export const Edges = () => (
  <Stack justify="space-between">
    <Tooltip label="Mark as resolved">
      <span>hover</span>
    </Tooltip>
    <Tooltip label="Mark as resolved">
      <span>hover</span>
    </Tooltip>
  </Stack>
);

export const IconButtonHasTooltip = () => (
  <IconButton name="check" label="Mark as resolved" />
);
