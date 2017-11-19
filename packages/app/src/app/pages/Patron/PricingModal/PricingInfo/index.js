import React from 'react';
import styled, { css } from 'styled-components';

import Feature from './Feature';

import Title from '../Title';

const Container = styled.div`
  padding: 1rem 0;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
`;

const CenteredHeader = styled.th`
  font-size: 1.25rem;
  font-weight: 400;
  text-align: center;
  padding: 1rem 0;

  ${props => props.supporter && css`background-color: rgba(0, 0, 0, 0.3);`};
`;

export default () => (
  <Container>
    <Title>Lifted Limits</Title>
    <table style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th />
          <CenteredHeader>Free</CenteredHeader>
          <CenteredHeader supporter>Patron</CenteredHeader>
        </tr>
      </thead>
      <tbody>
        <Feature feature="Private Sandboxes" free="No" supporter="Yes" />
        <Feature feature="Sandbox Limit" free="50" supporter="Unlimited" />
        <Feature feature="Dependency Limit" free="20" supporter="40" />
        <Feature
          disabled
          feature="Static File Hosting"
          free="10Mb"
          supporter="1Gb"
        />
      </tbody>
    </table>
  </Container>
);
