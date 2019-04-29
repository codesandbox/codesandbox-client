import React from 'react';
import styled from 'styled-components';
import { dispatch } from 'codesandbox-api';

import { inject, observer } from 'mobx-react';
import PowerIcon from 'react-icons/lib/md/power-settings-new';

import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { Button } from '@codesandbox/common/lib/components/Button';

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

function Server({ store }) {
  const { parsed } = store.editor.parsedConfigurations.package;
  const disconnected = store.server.status !== 'connected';

  return (
    <div>
      <Description>
        This sandbox is executed on a server. You can control the server from
        this panel.
      </Description>

      <Margin top={1}>
        <SubTitle>Status</SubTitle>
        <WorkspaceInputContainer>
          <Status
            managerStatus={store.server.status}
            containerStatus={store.server.containerStatus}
          />
        </WorkspaceInputContainer>
      </Margin>

      <Margin top={1.5}>
        <SubTitle>Run Scripts</SubTitle>
        <Margin top={0.5}>
          <WorkspaceInputContainer
            style={{
              display: 'flex',
              flexDirection: 'column',
              pointerEvents: disconnected ? 'none' : 'initial',
              opacity: disconnected ? 0.5 : 1,
            }}
          >
            <Tasks package={parsed} />
          </WorkspaceInputContainer>
        </Margin>
      </Margin>

      <Margin top={1} bottom={0.5}>
        <SubTitle style={{ marginBottom: '.5rem' }}>Control Container</SubTitle>
        <WorkspaceInputContainer>
          <Button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            small
            block
            disabled={
              disconnected || store.server.containerStatus !== 'sandbox-started'
            }
            onClick={() => {
              dispatch({ type: 'socket:message', channel: 'sandbox:restart' });
            }}
          >
            <PowerIcon
              style={{ fontSize: '1.125em', marginRight: '.25rem ' }}
            />{' '}
            Restart Sandbox
          </Button>
        </WorkspaceInputContainer>
        <WorkspaceInputContainer>
          <Button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            small
            block
            disabled={
              disconnected || store.server.containerStatus === 'initializing'
            }
            onClick={() => {
              this.props.signals.server.containerStatusChanged({
                status: 'initializing',
              });
              dispatch({
                type: 'socket:message',
                channel: 'sandbox:restart-container',
              });
            }}
          >
            <PowerIcon
              style={{ fontSize: '1.125em', marginRight: '.25rem ' }}
            />{' '}
            Restart Server
          </Button>
        </WorkspaceInputContainer>
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
    </div>
  );
}

export default inject('store', 'signals')(observer(Server));
