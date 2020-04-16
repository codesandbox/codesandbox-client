import React, { FunctionComponent } from 'react';
import { Text } from '@codesandbox/components';

import { VSCodePlaceholder } from '../VSCodePlaceholder';

export const KeyMapping: FunctionComponent = () => (
  <>
    <Text size={4} marginBottom={6} block variant="muted" weight="bold">
      Key Bindings
    </Text>
    <VSCodePlaceholder />
  </>
);
