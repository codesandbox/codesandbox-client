import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import React, { FunctionComponent } from 'react';

import { ErrorTitle } from './elements';

export const LoadingSandbox: FunctionComponent = () => (
  <Centered horizontal vertical>
    <Margin top={4}>
      <ErrorTitle>Loading showcased sandbox...</ErrorTitle>
    </Margin>
  </Centered>
);
