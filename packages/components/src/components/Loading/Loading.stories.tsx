import React from 'react';
import { Loading } from './Loading';
import { Stack } from '../Stack';

export default {
  title: 'components/Loading',
  component: Loading,
};

export const Default = () => (
  <Stack direction="vertical" gap={2}>
    <Loading size={4} />
    <Loading size={8} />
    <Loading size={16} />
    <Loading size={24} />
  </Stack>
);
