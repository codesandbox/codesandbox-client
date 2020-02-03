import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { ServerPort } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';
import BrowserIcon from 'react-icons/lib/go/browser';

import { useOvermind } from 'app/overmind';

import {
  Description,
  WorkspaceInputContainer,
  EntryContainer,
} from '../../elements';

import { ControlContainer } from './ControlContainer';
import { SubTitle, TasksContainer, Port, MainBadge } from './elements';
import { SecretKeys } from './SecretKeys';
import { Status } from './Status';
import { Tasks } from './Tasks';

export const Server: FunctionComponent = () => {
  const {
    actions: {
      server: { onBrowserTabOpened, onBrowserFromPortOpened },
    },
    state: {
      editor: { currentSandbox: sandbox, parsedConfigurations },
      server,
    },
  } = useOvermind();
  const disconnected = server.status !== 'connected';

  const openPort = (port: ServerPort) => {
    onBrowserFromPortOpened({ port });
  };

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
            managerStatus={server.status}
            containerStatus={server.containerStatus}
          />
        </WorkspaceInputContainer>
      </Margin>

      <Margin top={1.5}>
        <SubTitle>Run Scripts</SubTitle>
        <Margin top={0.5}>
          <TasksContainer disconnected={disconnected}>
            <Tasks package={parsedConfigurations?.package?.parsed} />
          </TasksContainer>
        </Margin>
      </Margin>

      <Margin top={1} bottom={0.5}>
        <SubTitle>Open Ports</SubTitle>

        <Margin top={0.5}>
          {server.ports.length ? (
            server.ports.map((port: ServerPort) => (
              <EntryContainer
                style={{ position: 'relative' }}
                onClick={() => openPort(port)}
              >
                <Port>
                  <BrowserIcon />

                  <div>{port.name || port.port}</div>
                </Port>

                {port.main && <MainBadge>main</MainBadge>}
              </EntryContainer>
            ))
          ) : (
            <Description>
              No ports are opened. Maybe the server is still starting or it
              doesn{"'"}t open any ports.
            </Description>
          )}

          {['gatsby', 'gridsome'].includes(sandbox.template) &&
          server.ports.length ? (
            <EntryContainer
              style={{ position: 'relative' }}
              onClick={() =>
                onBrowserTabOpened({
                  closeable: true,
                  options: {
                    url:
                      sandbox.template === 'gridsome'
                        ? '/___explore'
                        : '/___graphql',
                    title: 'GraphiQL',
                  },
                })
              }
            >
              <Port>
                <BrowserIcon />

                <div>GraphiQL</div>
              </Port>
            </EntryContainer>
          ) : null}
        </Margin>
      </Margin>

      <ControlContainer />

      <SecretKeys />
    </div>
  );
};
