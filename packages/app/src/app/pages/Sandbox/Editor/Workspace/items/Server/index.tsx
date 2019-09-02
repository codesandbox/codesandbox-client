import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { inject, hooksObserver } from 'app/componentConnectors';

import PowerIcon from 'react-icons/lib/md/power-settings-new';

import BrowserIcon from 'react-icons/lib/go/browser';

import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { Button } from '@codesandbox/common/lib/components/Button';
import {
  Description,
  WorkspaceInputContainer,
  EntryContainer,
} from '../../elements';

import { Status } from './Status';
import { Tasks } from './Tasks';
import { EnvironmentVariables } from './EnvVars';

const SubTitle = styled.div`
  text-transform: uppercase;
  font-weight: 700;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'};

  padding-left: 1rem;
  font-size: 0.875rem;
`;

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
            <WorkspaceInputContainer
              style={{
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: disconnected ? 'none' : 'initial',
                opacity: disconnected ? 0.5 : 1,
              }}
            >
              <Tasks
                package={
                  editor.parsedConfigurations.package &&
                  editor.parsedConfigurations.package.parsed
                }
              />
            </WorkspaceInputContainer>
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
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: '0.5rem',
                    }}
                  >
                    <BrowserIcon />
                    <div style={{ marginLeft: '0.75rem' }}>
                      {port.name || port.port}
                    </div>
                  </div>
                  {port.main && (
                    <div
                      style={{
                        fontWeight: 600,
                        position: 'absolute',
                        right: '2rem',
                      }}
                    >
                      main
                    </div>
                  )}
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
            <Button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              small
              block
              disabled={
                disconnected || server.containerStatus !== 'sandbox-started'
              }
              onClick={() => {
                signals.server.restartSandbox({});
              }}
            >
              <React.Fragment>
                <PowerIcon
                  style={{ fontSize: '1.125em', marginRight: '.25rem ' }}
                />{' '}
                Restart Sandbox
              </React.Fragment>
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
                disconnected || server.containerStatus === 'initializing'
              }
              onClick={() => {
                signals.server.restartContainer({});
              }}
            >
              <React.Fragment>
                <PowerIcon
                  style={{ fontSize: '1.125em', marginRight: '.25rem ' }}
                />{' '}
                Restart Server
              </React.Fragment>
            </Button>
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
