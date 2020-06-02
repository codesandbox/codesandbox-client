import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import React, { useEffect } from 'react';
import GoHome from 'react-icons/lib/go/home';
import { Element, Button, ThemeProvider, Stack } from '@codesandbox/components';
import GoIssueOpened from 'react-icons/lib/go/issue-opened';
// @ts-ignore
import { withTheme } from 'styled-components';
import Dashboard from '-!svg-react-loader!@codesandbox/common/lib/icons/dashboard.svg';

import { IFallbackComponentProps } from '../types';
import { buildCrashReport } from './buildCrashReport';
import { ButtonIcon, Container, Content, Subtitle, Title } from './elements';
import { Sadbox } from './Sadbox';

export const CodeSadbox: React.FC<IFallbackComponentProps> = withTheme(
  ({ error, trace, theme }) => {
    const {
      actions: { codesadboxMounted },
      state: { isLoggedIn },
    } = useOvermind();

    useEffect(() => {
      codesadboxMounted();
    }, [codesadboxMounted]);

    return (
      <ThemeProvider theme={theme.vsCode}>
        <Element
          css={css({
            width: '100vw',
            overflow: 'hidden',
            backgroundColor: 'sideBar.background',
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
                  <Button autoWidth variant="secondary" href={dashboardUrl()}>
                    <ButtonIcon>
                      <Dashboard />
                    </ButtonIcon>
                    Go to Dashboard
                  </Button>
                ) : (
                  <Button autoWidth variant="secondary" href="/">
                    <ButtonIcon>
                      <GoHome />
                    </ButtonIcon>
                    Back to Home
                  </Button>
                )}

                <Button
                  autoWidth
                  target="_blank"
                  // @ts-ignore
                  rel="noopener"
                  href={buildCrashReport({ error, trace })}
                >
                  <ButtonIcon>
                    <GoIssueOpened />
                  </ButtonIcon>
                  Report Crash
                </Button>
              </Stack>
            </Content>
          </Container>
        </Element>
      </ThemeProvider>
    );
  }
);
