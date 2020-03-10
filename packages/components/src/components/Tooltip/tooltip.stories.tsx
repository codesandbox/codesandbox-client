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

export const IconButtonHasTooltip = () => (
  <Stack justify="center">
    <IconButton name="check" label="Mark as resolved" />
  </Stack>
);
