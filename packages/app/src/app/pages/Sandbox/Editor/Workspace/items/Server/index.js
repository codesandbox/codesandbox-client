import React from 'react';
import styled from 'styled-components';
import { dispatch } from 'codesandbox-api';

import { inject, observer } from 'mobx-react';
import PowerIcon from 'react-icons/lib/md/power-settings-new';

import Margin from 'common/components/spacing/Margin';
import Button from 'app/components/Button';

import { Description, WorkspaceInputContainer } from '../../elements';

import Status from './Status';
import Tasks from './Tasks';
import EnvironmentVariables from './EnvVars';

const SubTitle = styled.div`
  text-transform: uppercase;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);

  padding-left: 1rem;
  font-size: 0.875rem;
`;

const Server = ({ store }) => {
  const { parsed } = store.editor.parsedConfigurations.package;

  const disconnected = store.server.status !== 'connected';

  return (
    <div>
      <Description>
        This sandbox is executed on a server. You can control the server from
        this panel.
      </Description>
      <Description>
        This functionality is in <strong>beta</strong>. It can behave
        differently than you expect, handle with care!
      </Description>

      <Margin top={1}>
        <SubTitle>Status</SubTitle>
        <WorkspaceInputContainer>
          <Status status={store.server.status} />
        </WorkspaceInputContainer>
      </Margin>

      <Margin top={1.5}>
        <SubTitle>Run Scripts</SubTitle>
        <Margin top={0.5}>
          <WorkspaceInputContainer
            css={`
              display: flex;
              flex-direction: column;
              pointer-events: ${disconnected ? 'none' : 'initial'};
              opacity: ${disconnected ? 0.5 : 1};
            `}
          >
            <Tasks package={parsed} />
          </WorkspaceInputContainer>
        </Margin>
      </Margin>

      <Margin top={1}>
        <SubTitle>Secret Keys</SubTitle>
        <Description>
          Secrets are available as environment variables. They are kept private
          and will not be transferred between forks.
        </Description>
        <Margin top={0.5}>
          <EnvironmentVariables />
        </Margin>
      </Margin>

      <Margin top={1} bottom={0.5}>
        <SubTitle style={{ marginBottom: '.5rem' }}>Control Container</SubTitle>
        <WorkspaceInputContainer>
          <Button
            css={`
              display: flex;
              align-items: center;
              justify-content: center;
            `}
            small
            block
            disabled={disconnected}
            onClick={() =>
              dispatch({ type: 'socket:message', channel: 'sandbox:restart' })
            }
          >
            <PowerIcon
              css={`
                font-size: 1.125em;
                margin-right: 0.25rem;
              `}
            />{' '}
            Restart Sandbox
          </Button>
        </WorkspaceInputContainer>
      </Margin>
    </div>
  );
};

export default inject('store')(observer(Server));
