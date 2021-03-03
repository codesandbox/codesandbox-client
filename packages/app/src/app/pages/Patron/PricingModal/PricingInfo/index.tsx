import React from 'react';
import { Feature } from './Feature';
import { Title } from '../elements';
import { Container, CenteredHeader } from './elements';

export const PricingInfo = () => (
  <Container>
    <Title>Lifted Limits</Title>
    <table style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <th />
          <CenteredHeader>Free</CenteredHeader>
          <CenteredHeader supporter>Patron</CenteredHeader>
        </tr>
      </thead>
      <tbody>
        <Feature feature="Teams" free="Enabled" supporter="Patron Features" />
        <Feature feature="Private Sandboxes" free="No" supporter="Yes" />
        <Feature feature="Sandbox Limit" free="50" supporter="Unlimited" />
        <Feature feature="Server Sandbox Limit" free="15" supporter="50" />
        <Feature feature="Static File Hosting" free="20Mb" supporter="500Mb" />
        <Feature
          feature="GitHub Private Repositories"
          free="No"
          supporter="Yes"
        />
      </tbody>
    </table>
  </Container>
);
