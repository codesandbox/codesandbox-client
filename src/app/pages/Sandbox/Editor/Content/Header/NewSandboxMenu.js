import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import delayEffect from 'app/utils/animation/delay-effect';
import MenuItem from 'app/components/MenuItem';

import {
  newSandboxUrl,
  newPreactSandboxUrl,
  newVueSandboxUrl,
  importFromGitHubUrl,
  uploadFromCliUrl,
  newReactTypeScriptSandboxUrl,
} from 'app/utils/url-generator';

const Container = styled.div`
  position: absolute;
  background-color: ${props => props.theme.background2};
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.75);

  ${delayEffect(0)};
  top: 40px;
  right: 0;

  min-width: 200px;

  z-index: 20;
`;

export default () => (
  <Container>
    <Link style={{ textDecoration: 'none' }} to={newSandboxUrl()}>
      <MenuItem>New React Sandbox</MenuItem>
    </Link>
    <Link
      style={{ textDecoration: 'none' }}
      to={newReactTypeScriptSandboxUrl()}
    >
      <MenuItem>New React TypeScript Sandbox</MenuItem>
    </Link>
    <Link style={{ textDecoration: 'none' }} to={newPreactSandboxUrl()}>
      <MenuItem>New Preact Sandbox</MenuItem>
    </Link>
    <Link style={{ textDecoration: 'none' }} to={newVueSandboxUrl()}>
      <MenuItem>New Vue Sandbox</MenuItem>
    </Link>
    <Link style={{ textDecoration: 'none' }} to={importFromGitHubUrl()}>
      <MenuItem>Import from Github</MenuItem>
    </Link>
    <Link style={{ textDecoration: 'none' }} to={uploadFromCliUrl()}>
      <MenuItem>Upload from CLI</MenuItem>
    </Link>
  </Container>
);
