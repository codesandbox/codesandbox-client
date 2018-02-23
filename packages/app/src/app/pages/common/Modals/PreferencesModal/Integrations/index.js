import React from 'react';

import ZeitIntegration from 'app/pages/common/ZeitIntegration';
import GitHubIntegration from 'app/pages/common/GithubIntegration';

import { Container } from './elements';
import { Title } from '../elements';

function Integrations() {
  return (
    <div>
      <Title>Integrations</Title>

      <Container>
        <ZeitIntegration />
        <GitHubIntegration />
      </Container>
    </div>
  );
}

export default Integrations;
