import { Button } from '@codesandbox/common/lib/components/Button';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Fullscreen from '@codesandbox/common/lib/components/flex/Fullscreen';
import Padding from '@codesandbox/common/lib/components/spacing/Padding';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { Title } from 'app/components/Title';
import { useOvermind } from 'app/overmind';
import { GithubIntegration } from 'app/pages/common/GithubIntegration';
import { Navigation } from 'app/pages/common/Navigation';
import { NotFound } from 'app/pages/common/NotFound';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
// @ts-ignore
import { Link, useLocation } from 'react-router-dom';

import Editor from './Editor';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface Props {
  match: {
    params: {
      id: string;
    };
  };
}

export const Sandbox: React.FC<Props> = ({ match }) => {
  const { state, actions } = useOvermind();
  const query = useQuery();

  useEffect(() => {
    const id = query.get('comment');
    const comments = state.comments.comments;
    const sandboxID =
      state.editor.currentSandbox && state.editor.currentSandbox.id;
    const commentsLoaded = Object.keys(comments).length;
    const commentExists = comments[sandboxID] && comments[sandboxID][id];
    if (id && commentsLoaded && commentExists) {
      actions.comments.selectComment(id);
      actions.workspace.setWorkspaceItem({ item: 'comments' });
    }
    // I don't want a run if the url changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.comments.comments,
    actions.comments,
    actions.workspace,
    state.editor.currentSandbox,
  ]);

  useEffect(() => {
    if (window.screen.availWidth < 800) {
      if (!query.get('from-embed')) {
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

    // I don't want a run if the url changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    actions.live,
    actions.editor,
    actions.preferences,
    match.params,
    match.params.id,
  ]);

  useEffect(
    () => () => {
      actions.live.onNavigateAway();
    },
    [actions.live]
  );

  function getContent() {
    const { hasLogIn, isLoggedIn } = state;

    if (state.editor.error) {
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
            {state.editor.error}
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
          {isLoggedIn && isGithub && (
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

    if (state.editor.notFound) {
      return <NotFound />;
    }

    return null;
  }

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
};
