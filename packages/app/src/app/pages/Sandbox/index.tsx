import { Button } from '@codesandbox/common/lib/components/Button';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Fullscreen from '@codesandbox/common/lib/components/flex/Fullscreen';
import Padding from '@codesandbox/common/lib/components/spacing/Padding';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { Title } from 'app/components/Title';
import { useOvermind } from 'app/overmind';
import { ThemeProvider } from '@codesandbox/components';
import codesandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';
import { GithubIntegration } from 'app/pages/common/GithubIntegration';
import { Navigation } from 'app/pages/common/Navigation';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import Editor from './Editor';

interface Props {
  match: {
    params: {
      id: string;
    };
  };
}

export const Sandbox = React.memo<Props>(
  ({ match }) => {
    const { state, actions } = useOvermind();

    useEffect(() => {
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

      actions.live.onNavigateAway();

      actions.editor.sandboxChanged({ id: match.params.id });
    }, [actions.live, actions.editor, actions.preferences, match.params.id]);

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
        const isGithub = match.params.id.includes('github');

        return (
          <>
            <div
              style={{
                fontWeight: 300,
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '1rem',
                fontSize: '1.5rem',
              }}
            >
              Something went wrong
            </div>
            <Title style={{ fontSize: '1.25rem', marginBottom: 0 }}>
              {error.message}
            </Title>
            <br />
            <div style={{ display: 'flex', maxWidth: 400, width: '100%' }}>
              <Button block small style={{ margin: '.5rem' }} href="/s">
                Create Sandbox
              </Button>
              <Button block small style={{ margin: '.5rem' }} href="/">
                {hasLogIn ? 'Dashboard' : 'Homepage'}
              </Button>
            </div>
            {isLoggedIn && isGithub && error.status !== 422 && (
              <div
                style={{ maxWidth: 400, marginTop: '2.5rem', width: '100%' }}
              >
                <div
                  style={{
                    fontWeight: 300,
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '1rem',
                    fontSize: '1rem',
                    textAlign: 'center',
                    lineHeight: 1.6,
                  }}
                >
                  Did you try to open a private GitHub repository and are you a{' '}
                  <Link to="/pro">pro</Link>? Then you might need to get private
                  access:
                </div>
                <GithubIntegration small />
                <div
                  style={{
                    fontWeight: 300,
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginTop: '1rem',
                    fontSize: '1rem',
                    textAlign: 'center',
                    lineHeight: 1.6,
                  }}
                >
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
                </div>
              </div>
            )}
          </>
        );
      }

      return null;
    }

    const content = getContent();

    if (content) {
      return (
        <ThemeProvider theme={codesandboxBlack}>
          <Fullscreen>
            <Padding
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100vw',
                height: '100vh',
              }}
              margin={1}
            >
              <Navigation title="Sandbox Editor" />
              <Centered
                style={{ flex: 1, width: '100%', height: '100%' }}
                horizontal
                vertical
              >
                {content}
              </Centered>
            </Padding>
          </Fullscreen>
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
        <Editor />
      </>
    );
  },
  (prev, next) => prev.match.params.id === next.match.params.id
);
