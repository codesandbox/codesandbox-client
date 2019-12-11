import React from 'react';

import { ZeitIntegration } from 'app/pages/common/ZeitIntegration';
import { GithubIntegration } from 'app/pages/common/GithubIntegration';

import { Container } from './elements';
import { Title } from '../elements';

export function Integrations() {
  return (
    <div>
      <Title>Integrations</Title>

      <Container>
        <ZeitIntegration />
        <GithubIntegration />
      </Container>
    </div>
  );
}
