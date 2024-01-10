import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import React, { useEffect } from 'react';
import GoHome from 'react-icons/lib/go/home';
import { Element, Button, ThemeProvider, Stack } from '@codesandbox/components';
import GoIssueOpened from 'react-icons/lib/go/issue-opened';
import { captureException } from '@codesandbox/common/lib/utils/analytics/sentry';
// @ts-ignore
import { withTheme } from 'styled-components';
import Dashboard from '-!svg-react-loader!@codesandbox/common/lib/icons/dashboard.svg';

import { IFallbackComponentProps } from '../types';
import { buildCrashReport } from './buildCrashReport';
import { ButtonIcon, Container, Content, Subtitle, Title } from './elements';
import { Sadbox } from './Sadbox';

export const CodeSadbox: React.FC<IFallbackComponentProps> = withTheme(
  ({ error, trace, theme }) => {
    const { codesadboxMounted } = useActions();
    const { isLoggedIn } = useAppState();
    const [errorCode, setErrorCode] = React.useState<string | null>(null);

    useEffect(() => {
      codesadboxMounted();

      const sentryCode = captureException(error);
      setErrorCode(sentryCode);
    }, [codesadboxMounted, error]);

    return (
      <ThemeProvider theme={theme.vsCode}>
        <Element
          css={css({
            width: '100vw',
            overflow: 'hidden',
            backgroundColor: 'sideBar.background',

            a: {
              textDecoration: 'none',
            },
          })}
        >
          <Navigation title="CodeSadbox" />
          <Container>
            <Content>
              <Title>Oh no! Something broke!</Title>
              <Sadbox scale={3} />
              <Subtitle>CodeSadbox</Subtitle>
              <Stack gap={2}>
                {isLoggedIn ? (
                  <a href={dashboardUrl()}>
                    <Button autoWidth variant="secondary">
                      <ButtonIcon>
                        <Dashboard />
                      </ButtonIcon>
                      Go to Dashboard
                    </Button>
                  </a>
                ) : (
                  <a href="/">
                    <Button autoWidth variant="secondary">
                      <ButtonIcon>
                        <GoHome />
                      </ButtonIcon>
                      Back to Home
                    </Button>
                  </a>
                )}
                <a href={buildCrashReport({ error, trace, errorCode })}>
                  <Button
                    autoWidth
                    target="_blank"
                    // @ts-ignore
                    rel="noopener"
                  >
                    <ButtonIcon>
                      <GoIssueOpened />
                    </ButtonIcon>
                    Report Crash
                  </Button>
                </a>
              </Stack>
            </Content>
          </Container>
        </Element>
      </ThemeProvider>
    );
  }
);
