import React, { useEffect, useState } from 'react';
import { inject, hooksObserver } from 'app/componentConnectors';
import BrowserIcon from 'react-icons/lib/go/browser';

import Margin from '@codesandbox/common/lib/components/spacing/Margin';

import {
  Description,
  WorkspaceInputContainer,
  EntryContainer,
} from '../../elements';

import { Status } from './Status';
import { Tasks } from './Tasks';
import { EnvironmentVariables } from './EnvVars';
import {
  SubTitle,
  TasksContainer,
  Port,
  MainBadge,
  ActionButton,
  Power as PowerIcon,
} from './elements';

type Port = {
  main: boolean;
  port: number;
  hostname: string;
  name?: string;
};

export const Server = inject('store', 'signals')(
  hooksObserver(({ store: { server, editor }, signals }) => {
    const [ports, setPorts] = useState(server.ports);
    const disconnected = server.status !== 'connected';
    const sandbox = editor.currentSandbox;

    const openPort = (port: Port) => {
      signals.server.onBrowserFromPortOpened({ port });
    };

    useEffect(() => {
      if (sandbox.template === 'gatsby') {
        const mainPort = server.ports.find((port: Port) => port.main);
        setPorts((p: Port[]) =>
          p.concat({
            ...mainPort,
            main: false,
            hostname: mainPort.hostname + '/___graphql',
            name: 'GraphiQL',
          })
        );
      }
    }, [sandbox.template, server.ports]);

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
                  editor.parsedConfigurations.package &&
                  editor.parsedConfigurations.package.parsed
                }
              />
            </TasksContainer>
          </Margin>
        </Margin>

        <Margin top={1} bottom={0.5}>
          <SubTitle>Open Ports</SubTitle>
          <Margin top={0.5}>
            {ports.length ? (
              ports.map(port => (
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
                doesn't open any ports.
              </Description>
            )}
          </Margin>
        </Margin>

        <Margin top={1} bottom={0.5}>
          <SubTitle style={{ marginBottom: '.5rem' }}>
            Control Container
          </SubTitle>
          <WorkspaceInputContainer>
            <ActionButton
              small
              block
              disabled={
                disconnected || server.containerStatus !== 'sandbox-started'
              }
              onClick={() => signals.server.restartSandbox({})}
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
              disabled={
                disconnected || server.containerStatus === 'initializing'
              }
              onClick={() => signals.server.restartContainer({})}
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
            Secrets are available as environment variables. They are kept
            private and will not be transferred between forks.
          </Description>
          <Margin top={0.5}>
            <EnvironmentVariables />
          </Margin>
        </Margin>
      </div>
    );
  })
);
