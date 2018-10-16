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
      <WorkspaceInputContainer style={{ marginTop: '1rem' }}>
        <Button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          small
          block
          disabled={disconnected}
          onClick={() =>
            dispatch({ type: 'socket:message', channel: 'sandbox:restart' })
          }
        >
          <PowerIcon style={{ fontSize: '1.125em', marginRight: '.25rem ' }} />{' '}
          Restart Sandbox
        </Button>
      </WorkspaceInputContainer>
    </div>
  );
};

export default inject('store')(observer(Server));
