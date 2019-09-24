import React from 'react';
import GoHome from 'react-icons/lib/go/home';
import GoIssueOpened from 'react-icons/lib/go/issue-opened';
import { useOvermind } from 'app/overmind';
import { Button } from '@codesandbox/common/lib/components/Button';
import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Navigation } from 'app/pages/common/Navigation';
// @ts-ignore
import Dashboard from '-!svg-react-loader!@codesandbox/common/lib/icons/dashboard.svg';
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

export const CodeSadbox: React.FC<IFallbackComponentProps> = ({
  error,
  trace,
}) => {
  const {
    state: { isLoggedIn },
  } = useOvermind();

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
          {isLoggedIn ? (
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
};
