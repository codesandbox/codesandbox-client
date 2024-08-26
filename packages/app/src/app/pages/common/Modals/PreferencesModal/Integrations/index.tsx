import { Text } from '@codesandbox/components';
import React, { FunctionComponent } from 'react';

import { GitHubPermissions } from './GitHubPermissions';
import { Container } from './elements';

export const Integrations: FunctionComponent = () => (
  <div>
    <Text block marginBottom={6} size={4} weight="regular">
      Integrations
    </Text>

    <Container>
      <GitHubPermissions />
    </Container>
  </div>
);
