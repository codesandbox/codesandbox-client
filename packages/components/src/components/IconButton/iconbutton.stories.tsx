import React from 'react';
import { IconButton } from '.';
import { Stack } from '../..';

export default {
  title: 'components/IconButton',
  component: IconButton,
};

export const Basic = () => (
  <Stack justify="center">
    <IconButton title="Filter elements" name="filter" />
  </Stack>
);

export const Disabled = () => (
  <IconButton title="Filter elements disabled" disabled name="filter" />
);

export const Sizes = () => (
  <Stack justify="center">
    <IconButton size={8} title="Filter elements" name="filter" />
    <IconButton size={12} title="Filter elements" name="filter" />
    <IconButton size={16} title="Filter elements" name="filter" />
  </Stack>
);
