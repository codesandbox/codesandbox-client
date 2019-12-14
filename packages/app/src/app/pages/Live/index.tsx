import { Button } from '@codesandbox/common/lib/components/Button';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Fullscreen from '@codesandbox/common/lib/components/flex/Fullscreen';
import Row from '@codesandbox/common/lib/components/flex/Row';
import Padding from '@codesandbox/common/lib/components/spacing/Padding';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { Skeleton } from 'app/components/Skeleton';
import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import { QuickActions } from 'app/pages/Sandbox/QuickActions';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GithubIcon from 'react-icons/lib/go/mark-github';
import { Link } from 'react-router-dom';

import Editor from '../Sandbox/Editor';
import { BlinkingDot } from './BlinkingDot';

interface Props {
  match: {
    params: {
      id: string;
    };
  };
}

export const LivePage: React.FC<Props> = ({ match }) => {
  const { state, actions } = useOvermind();

  useEffect(() => {
    actions.live.roomJoined({ roomId: match.params.id });
  }, [actions.live, match.params.id]);

  useEffect(
    () => () => {
      actions.live.onNavigateAway();
    },
    [actions.live]
  );

  function getContent() {
    if (!state.user) {
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
            Sign in required
          </div>
          <Title style={{ fontSize: '1.25rem' }}>
            You need to sign in to join this session
          </Title>
          <br />
          <div>
            <Button
              onClick={() =>
                actions.live.signInToRoom({ roomId: match.params.id })
              }
              small
            >
              <Row>
                <GithubIcon style={{ marginRight: '0.5rem' }} /> Sign in with
                GitHub
              </Row>
            </Button>
          </div>
        </>
      );
    }

    if (state.live.error) {
      if (state.live.error === 'room not found') {
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
            <Title style={{ fontSize: '1.25rem' }}>
              It seems like this session doesn
              {"'"}t exist or has been closed
            </Title>
            <br />
            <Link to="/s">Create Sandbox</Link>
          </>
        );
      }

      return (
        <>
          <Title>An error occured while connecting to the live session:</Title>
          <SubTitle>{state.live.error}</SubTitle>
          <br />
          <br />
          <Link to="/s">Create Sandbox</Link>
        </>
      );
    }

    if (
      state.isAuthenticating ||
      state.editor.isLoading ||
      state.live.isLoading ||
      !state.editor.currentSandbox
    ) {
      return (
        <>
          <Skeleton
            titles={[
              {
                content: <BlinkingDot />,
                delay: 0,
              },
              {
                content: 'Joining Live Session...',
                delay: 0.5,
              },
            ]}
          />
        </>
      );
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
          <Navigation title="Live Session" />
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
      {sandbox && (
        <Helmet>
          <title>{getSandboxName(sandbox)} - CodeSandbox</title>
        </Helmet>
      )}
      <Editor />
      <QuickActions />
    </>
  );
};
