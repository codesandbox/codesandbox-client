import React, { FunctionComponent } from 'react';
import { Text } from '@codesandbox/components';

import { VSCodePlaceholder } from './VSCodePlaceholder';

export const KeyMapping: FunctionComponent = () => (
  <>
    <Text block marginBottom={6} size={4} weight="bold">
      Key Bindings
    </Text>

    <VSCodePlaceholder />
  </>
);
