import css from '@styled-system/css';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { useOvermind } from 'app/overmind';
import {
  ThemeProvider,
  Button,
  Grid,
  Text,
  Element,
  Stack,
} from '@codesandbox/components';
import { GithubIntegration } from 'app/pages/common/GithubIntegration';
import { Navigation } from 'app/pages/common/Navigation';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import Editor from './Editor';

interface Props {
  showNewSandboxModal?: boolean;
  match?: {
    params: {
      id: string;
    };
  };
}

export const Sandbox = React.memo<Props>(
  ({ match, showNewSandboxModal }) => {
    const { state, actions } = useOvermind();

    useEffect(() => {
      if (!showNewSandboxModal) {
        if (window.screen.availWidth < 800) {
          if (!document.location.search.includes('from-embed')) {
            const addedSign = document.location.search ? '&' : '?';
            document.location.href =
              document.location.href.replace('/s/', '/embed/') +
              addedSign +
              'codemirror=1';
          } else {
            actions.preferences.codeMirrorForced();
          }
        }
      }

      actions.live.onNavigateAway();
      if (match?.params) {
        actions.editor.sandboxChanged({ id: match.params.id });
      }
    }, [
      actions.live,
      actions.editor,
      actions.preferences,
      match.params,
      showNewSandboxModal,
    ]);

    useEffect(
      () => () => {
        actions.live.onNavigateAway();
      },
      [actions.live]
    );

    function getContent() {
      const {
        hasLogIn,
        isLoggedIn,
        editor: { error },
      } = state;

      if (error) {
        const isGithub = match?.params?.id.includes('github');

        return (
          <>
            <Text weight="bold" size={6} marginBottom={4}>
              Something went wrong
            </Text>
            <Text size={4}>{error.message}</Text>
            <Grid
              marginTop={4}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                maxWidth: 400,
                width: '100%',
                gridGap: 8,
              }}
            >
              <a href="/s" style={{ textDecoration: 'none' }}>
                <Button>Create Sandbox</Button>
              </a>
              <a href="/" style={{ textDecoration: 'none' }}>
                <Button>{hasLogIn ? 'Dashboard' : 'Homepage'}</Button>
              </a>
            </Grid>
            {isLoggedIn && isGithub && error.status !== 422 && (
              <Element marginTop={9} style={{ maxWidth: 400, width: '100%' }}>
                <Text size={4} block align="center" marginBottom={4}>
                  Did you try to open a private GitHub repository and are you a{' '}
                  <Link to="/pro">pro</Link>? Then you might need to get private
                  access:
                </Text>
                <GithubIntegration small />
                <Text size={4} block align="center" marginTop={4}>
                  If you{"'"}re importing a sandbox from an organization, make
                  sure to enable organization access{' '}
                  <a
                    href="https://github.com/settings/connections/applications/c07a89833b557afc7be2"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    here
                  </a>
                  .
                </Text>
              </Element>
            )}
          </>
        );
      }

      return null;
    }

    const content = getContent();

    if (content) {
      return (
        <ThemeProvider>
          <Element
            css={css({
              display: 'flex',
              flex: 'auto',
              width: '100%',
              height: '100%',
              backgroundColor: 'sideBar.background',
              fontFamily: 'Inter',
            })}
          >
            <Stack
              style={{
                flexDirection: 'column',
                width: '100vw',
                height: '100vh',
              }}
              margin={1}
            >
              <Navigation title="Sandbox Editor" />
              <Stack
                align="center"
                justify="center"
                style={{
                  flexDirection: 'column',
                  width: '100%',
                  height: '100%',
                }}
              >
                {content}
              </Stack>
            </Stack>
          </Element>
        </ThemeProvider>
      );
    }

    const sandbox = state.editor.currentSandbox;

    return (
      <>
        <Helmet>
          <title>
            {sandbox ? getSandboxName(sandbox) : 'Loading...'} - CodeSandbox
          </title>
        </Helmet>
        <Editor showNewSandboxModal={showNewSandboxModal} />
      </>
    );
  },
  (prev, next) => prev.match.params.id === next.match.params.id
);
