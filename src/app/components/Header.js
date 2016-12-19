// @flow
import React from 'react';
import { Match } from 'react-router';
import styled from 'styled-components';

import CloudIcon from 'react-icons/lib/md/cloud';
import DownloadIcon from 'react-icons/lib/md/file-download';
import RefreshIcon from 'react-icons/lib/md/refresh';
import ForkIcon from 'react-icons/lib/go/repo-clone';

const Container = styled.div`
  position: relative;
  display: flex;
  background-color: ${props => props.theme.background};
  font-size: 1.2rem;
  color: ${props => props.theme.white};
  border-bottom: 1px solid ${props => props.theme.background.darken(0.2)};
  // box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.2);
  z-index: 40;
  margin: 0;
  font-weight: 400;
  height: 3rem;
`;

const Actions = styled.div`
  height: 100%;
`;

const Action = styled.div`
  transition: 0.3s ease all;
  display: inline-block;
  font-size: 1rem;
  color: ${props => props.theme.background.lighten(2.5)};
  border-right: 1px solid ${props => props.theme.background.darken(0.2)};
  vertical-align: middle;
  cursor: pointer;

  height: 100%;
  line-height: 3rem;
  padding: 0 2rem;
  margin: 0rem;
  svg {
    font-size: 1.1rem;
  }
  span {
    padding-left: 0.5rem;
    vertical-align: middle;
  }

  &:hover {
    box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.2);
    color: white;
    border-right: 1px solid ${props => props.theme.secondary.darken(0.2)};
    background-color: ${props => props.theme.secondary};
  }
`;

const Username = styled.div`
  position: absolute;
  right: 0;
  padding: 0 1rem;
  line-height: 3rem;
  border-left: 1px solid ${props => props.theme.background.darken(0.2)};
`;

const Logo = styled.span`
  display: inline-block;
  background-color: ${props => props.theme.primary};
  padding: 0 1rem;
  line-height: 3rem;
  vertical-align: middle;
  width: 14rem;
  font-weight: 400;
  color: ${props => props.theme.primaryText};
`;

export default ({ username }: { username: ?string }) => (
  <Container>
    <Logo>CodeSandbox</Logo>
    <Match
      pattern="/:username/:slug/module"
      render={() => (
        <Actions>
          <Action>
            <CloudIcon />
            <span>Save Project</span>
          </Action>
          <Action>
            <DownloadIcon />
            <span>Download</span>
          </Action>
          <Action>
            <RefreshIcon />
            <span>Refresh</span>
          </Action>
          <Action>
            <ForkIcon />
            <span>Fork</span>
          </Action>
        </Actions>
      )}
    />

    {username && <Username>{username}</Username>}
  </Container>
);

