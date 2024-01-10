import { Stack } from '@codesandbox/components';
import React, { FunctionComponent } from 'react';

import { Config } from './Config';
import { Delete } from './Delete';
import { Permissions } from './Permissions';
import { Summary } from './Summary';

export const ProjectInfo: FunctionComponent = () => (
  <Stack css={{ height: '100%' }} direction="vertical" justify="space-between">
    <div>
      <Summary />
      <Permissions />
      <Config />
    </div>

    <Delete />
  </Stack>
);
