import React from 'react';
import { IconButton } from '.';
import { Stack } from '../..';

export default {
  title: 'components/IconButton',
  component: IconButton,
};

export const Basic = () => (
  <Stack justify="center">
    <IconButton label="Filter elements" name="filter" />
  </Stack>
);

export const Disabled = () => (
  <IconButton label="Filter elements disabled" disabled name="filter" />
);
