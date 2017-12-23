import React from 'react';
import styled from 'styled-components';

import ZeitIntegration from 'app/pages/common/ZeitIntegration';
import GitHubIntegration from 'app/pages/common/GithubIntegration';

import Title from '../MenuTitle';

const Container = styled.div`
  > div {
    margin: 0.5rem 0;
  }

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export default () => (
  <div>
    <Title>Integrations</Title>

    <Container>
      <ZeitIntegration />
      <GitHubIntegration />
    </Container>
  </div>
);
