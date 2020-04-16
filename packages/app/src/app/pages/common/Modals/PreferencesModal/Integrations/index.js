import React from 'react';

import { ZeitIntegration } from 'app/pages/common/ZeitIntegration';
import { GithubIntegration } from 'app/pages/common/GithubIntegration';
import { Text } from '@codesandbox/components';

import { Container } from './elements';

export function Integrations() {
  return (
    <div>
      <Text size={4} marginBottom={6} block variant="muted" weight="bold">
        Integrations
      </Text>

      <Container>
        <ZeitIntegration />
        <GithubIntegration />
      </Container>
    </div>
  );
}
