import { Text } from '@codesandbox/components';
import React, { FunctionComponent } from 'react';

import { GithubIntegration } from 'app/pages/common/GithubIntegration';
import { VercelIntegration } from 'app/pages/common/VercelIntegration';

import { Container } from './elements';

export const Integrations: FunctionComponent = () => (
  <div>
    <Text block marginBottom={6} size={4} weight="regular">
      Integrations
    </Text>

    <Container>
      <VercelIntegration />

      <GithubIntegration />
    </Container>
  </div>
);
