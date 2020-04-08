import { Stack } from '@codesandbox/components';
import React, { FunctionComponent } from 'react';

import { Config } from './Config';
import { Delete } from './Delete';
import { Privacy } from './Privacy';
import { Summary } from './Summary';

export const ProjectInfo: FunctionComponent = () => (
  <Stack css={{ height: '100%' }} direction="vertical" justify="space-between">
    <div>
      <Summary />

      <Privacy />

      <Config />
    </div>

    <Delete />
  </Stack>
);
