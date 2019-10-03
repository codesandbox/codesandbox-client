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

import {
  SubTitle,
  TasksContainer,
  Port,
  MainBadge,
  ActionButton,
  Power as PowerIcon,
} from './elements';
import { EnvironmentVariables } from './EnvVars';
import { Status } from './Status';
import { Tasks } from './Tasks';

export const Server: FunctionComponent = () => {
  const {
    actions: {
      server: {
        onBrowserTabOpened,
        onBrowserFromPortOpened,
        restartContainer,
        restartSandbox,
      },
    },
    state: {
      server,
      editor: { currentSandbox: sandbox, parsedConfigurations },
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
            <Tasks
              package={
                parsedConfigurations.package &&
                parsedConfigurations.package.parsed
              }
            />
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

      <Margin top={1} bottom={0.5}>
        <SubTitle style={{ marginBottom: '.5rem' }}>Control Container</SubTitle>

        <WorkspaceInputContainer>
          <ActionButton
            small
            block
            disabled={
              disconnected || server.containerStatus !== 'sandbox-started'
            }
            onClick={() => restartSandbox()}
          >
            <>
              <PowerIcon /> Restart Sandbox
            </>
          </ActionButton>
        </WorkspaceInputContainer>

        <WorkspaceInputContainer>
          <ActionButton
            small
            block
            disabled={disconnected || server.containerStatus === 'initializing'}
            onClick={() => restartContainer()}
          >
            <>
              <PowerIcon /> Restart Server
            </>
          </ActionButton>
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
};
