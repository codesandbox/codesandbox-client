import { Button } from '@codesandbox/common/lib/components/Button';
import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import React, { useEffect } from 'react';
import GoHome from 'react-icons/lib/go/home';
import GoIssueOpened from 'react-icons/lib/go/issue-opened';
// @ts-ignore
import Dashboard from '-!svg-react-loader!@codesandbox/common/lib/icons/dashboard.svg';

import { IFallbackComponentProps } from '../types';
import { buildCrashReport } from './buildCrashReport';
import {
  Actions,
  ButtonIcon,
  Container,
  Content,
  Header,
  Nav,
  Subtitle,
  Title,
} from './elements';
import { Sadbox } from './Sadbox';

export const CodeSadbox: React.FC<IFallbackComponentProps> = ({
  error,
  trace,
}) => {
  const {
    actions: { codesadboxMounted },
    state: { isLoggedIn },
  } = useOvermind();

  useEffect(() => {
    codesadboxMounted();
  }, [codesadboxMounted]);

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
