import React, { useEffect, useCallback } from 'react';
import { Link, RouteProps } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import Helmet from 'react-helmet';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import Fullscreen from '@codesandbox/common/lib/components/flex/Fullscreen';
import Padding from '@codesandbox/common/lib/components/spacing/Padding';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import { Title } from 'app/components/Title';
import { SubTitle } from 'app/components/SubTitle';
import { Skeleton } from 'app/components/Skeleton';
import { Navigation } from 'app/pages/common/Navigation';
import { SignInButton } from 'app/pages/common/SignInButton';
import { QuickActions } from 'app/pages/Sandbox/QuickActions';
import { hasAuthToken } from 'app/utils/user';
import Editor from '../Sandbox/Editor';
import { BlinkingDot } from './BlinkingDot';

export const LivePage: React.FunctionComponent<RouteProps> = ({ match }) => {
  const {
    state: {
      hasLogIn,
      live: { isLive, error, isLoading },
      editor: { currentSandbox },
      user,
    },
    actions: { live, editor },
  } = useOvermind();
  let loggedIn = hasLogIn;

  const initializeLive = useCallback(() => {
    if (hasAuthToken()) {
      loggedIn = true;
      live.roomJoined({
        roomId: match.params.id,
      });
    }
  }, [match.params.id]);

  initializeLive();

  const disconnectLive = () => {
    if (isLive) {
      live.onNavigateAway();
    }
  };

  useEffect(() => {
    if (hasAuthToken() && !loggedIn) {
      disconnectLive();
      initializeLive();
    }

    return () => {
      disconnectLive();
      editor.onNavigateAway();
    };
  }, [disconnectLive, editor, initializeLive, loggedIn, match.params.id]);

  const getContent = () => {
    if (!hasAuthToken()) {
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
            <SignInButton />
          </div>
        </>
      );
    }

    if (error) {
      if (error === 'room not found') {
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
          <SubTitle>{error}</SubTitle>
          <br />
          <br />
          <Link to="/s">Create Sandbox</Link>
        </>
      );
    }

    if (isLoading || !currentSandbox) {
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
  };

  // eslint-disable-next-line
  user; // Force observer call

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

  return (
    <>
      {currentSandbox && (
        <Helmet>
          <title>{getSandboxName(currentSandbox)} - CodeSandbox</title>
        </Helmet>
      )}
      <Editor match={match} />
      <QuickActions />
    </>
  );
};
