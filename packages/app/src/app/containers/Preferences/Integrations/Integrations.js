import React from 'react';
import styled from 'styled-components';

import ZeitIntegration from 'app/containers/integrations/Zeit';
import GitHubIntegration from 'app/containers/integrations/GitHub';

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
  <Container>
    <ZeitIntegration />
    <GitHubIntegration />
  </Container>
);
