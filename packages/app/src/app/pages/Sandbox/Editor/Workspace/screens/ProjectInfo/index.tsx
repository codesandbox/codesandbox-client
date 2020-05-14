import React from 'react';
import { Stack } from '@codesandbox/components';
import { Summary } from './Summary';
import { Privacy } from './Privacy';
import { Config } from './Config';
import { Delete } from './Delete';

export const ProjectInfo = () => (
  <Stack direction="vertical" justify="space-between" css={{ height: '100%' }}>
    <div>
      <Summary />
      <Privacy />
      <Config />
    </div>
    <Delete />
  </Stack>
);
