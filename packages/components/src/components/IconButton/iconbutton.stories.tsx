import React from 'react';
import { IconButton } from '.';

export default {
  title: 'components/IconButton',
  component: IconButton,
};

export const Basic = () => <IconButton name="filter" />;

export const Disabled = () => <IconButton disabled name="filter" />;
