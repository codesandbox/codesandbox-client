import React from 'react';
import GoHome from 'react-icons/lib/go/home';

import GoIssueOpened from 'react-icons/lib/go/issue-opened';
import { observer } from 'mobx-react-lite';
import { useStore } from 'app/store';
import { Button } from '@codesandbox/common/lib/components/Button';
import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import Dashboard from '-!svg-react-loader!@codesandbox/common/lib/icons/dashboard.svg';
import Navigation from '../../Navigation';
import { Sadbox } from './Sadbox';
import { IFallbackComponentProps } from '../types';
import { buildCrashReport } from './buildCrashReport';
import {
  Container,
  Header,
  Nav,
  Content,
  Title,
  Subtitle,
  Actions,
  ButtonIcon,
} from './elements';

export const CodeSadbox: React.FC<IFallbackComponentProps> = observer(
  ({ error, trace }) => {
    const store = useStore();

    return (
      <Container>
        <Header>
          <Nav>
            <Navigation title="CodeSadbox" />
          </Nav>
        </Header>
        <Content>
          <Title>Oh no! Something broke!</Title>
          <Sadbox scale={3} />
          <Subtitle>CodeSadbox</Subtitle>
          <Actions>
            {store.isLoggedIn ? (
              <Button small secondary href={dashboardUrl()}>
                <ButtonIcon>
                  <Dashboard />
                </ButtonIcon>
                Go to Dashboard
              </Button>
            ) : (
              <Button small secondary href="/">
                <ButtonIcon>
                  <GoHome />
                </ButtonIcon>
                Back to Home
              </Button>
            )}
            {/*
          // @ts-ignore */}
            <Button
              small
              target="_blank"
              rel="noopener"
              href={buildCrashReport({ error, trace })}
            >
              <ButtonIcon>
                <GoIssueOpened />
              </ButtonIcon>
              Report Crash
            </Button>
          </Actions>
        </Content>
      </Container>
    );
  }
);

CodeSadbox.displayName = `CodeSadbox`;
