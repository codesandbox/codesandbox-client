import React from 'react';
import styled, { css } from 'styled-components';

import Feature from './Feature';

const CenteredHeader = styled.th`
  font-size: 1.25rem;
  font-weight: 400;
  text-align: center;
  padding: 1rem 0;

  ${props =>
    props.supporter &&
    css`
    background-color: rgba(0, 0, 0, 0.3);
  `};
`;

export default () =>
  <div>
    <table style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th />
          <CenteredHeader>Free</CenteredHeader>
          <CenteredHeader supporter>Supporter</CenteredHeader>
        </tr>
      </thead>
      <tbody>
        <Feature feature="Sandbox Limit" free="100" supporter="Unlimited" />
        <Feature feature="Dependency Limit" free="20" supporter="40" />
        <Feature feature="Private Sandboxes" free="No" supporter="Yes" />
        <Feature feature="Static File Hosting" free="10Mb" supporter="1Gb" />
      </tbody>
    </table>
  </div>;
