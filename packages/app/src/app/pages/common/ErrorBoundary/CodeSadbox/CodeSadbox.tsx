import { Button } from '@codesandbox/common/lib/components/Button';
import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import React, { useEffect } from 'react';
import GoHome from 'react-icons/lib/go/home';
import { Element } from '@codesandbox/components';
import GoIssueOpened from 'react-icons/lib/go/issue-opened';
import { captureException } from '@codesandbox/common/lib/utils/analytics/sentry';
// @ts-ignore
import Dashboard from '-!svg-react-loader!@codesandbox/common/lib/icons/dashboard.svg';

import { IFallbackComponentProps } from '../types';
import { buildCrashReport } from './buildCrashReport';
import {
  Actions,
  ButtonIcon,
  Container,
  Content,
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
  const [errorCode, setErrorCode] = React.useState<string | null>(null);

  useEffect(() => {
    codesadboxMounted();

    const sentryCode = captureException(error);
    setErrorCode(sentryCode);
  }, [codesadboxMounted, error]);

  return (
    <Element
      style={{ width: '100vw', height: '100vh', background: 'rgb(17,21,24)' }}
    >
      <Navigation title="CodeSadbox" />
      <Container>
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

            <Button
              small
              target="_blank"
              rel="noopener"
              href={buildCrashReport({ error, trace, errorCode })}
            >
              <ButtonIcon>
                <GoIssueOpened />
              </ButtonIcon>
              Report Crash
            </Button>
          </Actions>
        </Content>
      </Container>
    </Element>
  );
};
