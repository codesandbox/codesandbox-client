import React, { useEffect, useCallback } from 'react';
import Helmet from 'react-helmet';
import { useOvermind } from 'app/overmind';
import { Link, RouteProps } from 'react-router-dom';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { Button } from '@codesandbox/common/lib/components/Button';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Fullscreen from '@codesandbox/common/lib/components/flex/Fullscreen';
import Padding from '@codesandbox/common/lib/components/spacing/Padding';
import { Title } from 'app/components/Title';
import { Skeleton } from 'app/components/Skeleton';
import { QuickActions } from 'app/pages/Sandbox/QuickActions';
import { NotFound } from 'app/pages/common/NotFound';
import { Navigation } from 'app/pages/common/Navigation';
import { GithubIntegration } from 'app/pages/common/GithubIntegration';
import Editor from './Editor';

const Sandbox: React.FunctionComponent<RouteProps> = ({ match }) => {
  const {
    state: {
      live: { isLive, isTeam, isLoading: isLiveLoading },
      hasLogIn,
      editor: { error, currentSandbox, notFound, isLoading: isEditorLoading },
      user,
    },
    actions: { preferences, editor, live },
  } = useOvermind();

  if (window.screen.availWidth < 800) {
    if (!document.location.search.includes('from-embed')) {
      const addedSign = document.location.search ? '&' : '?';
      document.location.href =
        document.location.href.replace('/s/', '/embed/') +
        addedSign +
        'codemirror=1';
    } else {
      preferences.codeMirrorForced();
    }
  }

  const fetchSandbox = useCallback(() => {
    const { id } = match.params;

    editor.sandboxChanged({ id });
  }, [editor, match.params]);

  fetchSandbox();

  const disconnectLive = () => {
    if (isLive) {
      live.onNavigateAway();
    }
  };

  useEffect(() => {
    disconnectLive();
    fetchSandbox();

    return () => {
      disconnectLive();
      editor.onNavigateAway();
    };
  }, [disconnectLive, editor, fetchSandbox, match.params.id]);

  const getContent = () => {
    if (error) {
      const isGithub = match.params.id.includes('github');
      const hasPrivateAccess = user && user.integrations.github;

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
            {error}
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
          {hasLogIn && isGithub && !hasPrivateAccess && (
            <div style={{ maxWidth: 400, marginTop: '2.5rem', width: '100%' }}>
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
                <Link to="/patron">patron</Link>? Then you might need to get
                private access:
              </div>
              <GithubIntegration small />
            </div>
          )}
        </>
      );
    }

    if (notFound) {
      return <NotFound />;
    }

    if (
      isEditorLoading ||
      (isTeam && isLiveLoading) ||
      currentSandbox == null
    ) {
      return (
        <>
          <Skeleton
            titles={[
              {
                content: 'Loading Sandbox',
                delay: 0.6,
              },
              {
                content: 'Fetching git repository...',
                delay: 2,
              },
            ]}
          />
        </>
      );
    }

    return null;
  };

  const content = getContent();

  if (content) {
    return (
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
    );
  }

  const sandbox = currentSandbox;

  return (
    <>
      <Helmet>
        <title>{getSandboxName(sandbox)} - CodeSandbox</title>
      </Helmet>
      <Editor match={match} />
      <QuickActions />
    </>
  );
};

export default Sandbox;
