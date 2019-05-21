import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Fullscreen from '@codesandbox/common/lib/components/flex/Fullscreen';
import Padding from '@codesandbox/common/lib/components/spacing/Padding';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import Skeleton from 'app/components/Skeleton';
import SubTitle from 'app/components/SubTitle';
import Title from 'app/components/Title';
import Navigation from 'app/pages/common/Navigation';
import SignInButton from 'app/pages/common/SignInButton';
import QuickActions from 'app/pages/Sandbox/QuickActions';
import { useSignals, useStore } from 'app/store';

import Editor from '../Sandbox/Editor';

import BlinkingDot from './BlinkingDot';

const LivePage = ({ match }) => {
  const {
    editor: { onNavigateAway: onEditorNavigateAway },
    live: { onNavigateAway: onLiveNavigateAway, roomJoined },
  } = useSignals();
  const {
    editor: { currentSandbox },
    hasLogIn,
    live: { error, isLive, isLoading },
  } = useStore();

  const loggedIn = useRef(hasLogIn);

  useEffect(() => {
    if (currentSandbox) {
      document.title = `${getSandboxName(currentSandbox)} - CodeSandbox`;
    }
  }, [currentSandbox]);

  const initializeLive = useCallback(() => {
    if (hasLogIn) {
      loggedIn.current = true;

      roomJoined({ roomId: match.params.id });
    }
  }, [hasLogIn, match.params.id, roomJoined]);
  const disconnectLive = useCallback(() => {
    if (isLive) {
      onLiveNavigateAway({});
    }
  }, [isLive, onLiveNavigateAway]);
  useEffect(() => {
    initializeLive();

    return () => {
      disconnectLive();

      onEditorNavigateAway({});
    };
  }, [disconnectLive, initializeLive, onEditorNavigateAway]);

  const getContent = useCallback(() => {
    if (!hasLogIn) {
      return (
        <React.Fragment>
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '1.5rem',
              fontWeight: 300,
              marginBottom: '1rem',
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
        </React.Fragment>
      );
    }

    if (error) {
      if (error === 'room not found') {
        return (
          <React.Fragment>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '1.5rem',
                fontWeight: 300,
                marginBottom: '1rem',
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
          </React.Fragment>
        );
      }

      return (
        <React.Fragment>
          <Title>An error occured while connecting to the live session:</Title>

          <SubTitle>{error}</SubTitle>

          <br />

          <br />

          <Link to="/s">Create Sandbox</Link>
        </React.Fragment>
      );
    }

    if (isLoading || !currentSandbox) {
      return (
        <Skeleton
          titles={[
            { content: <BlinkingDot />, delay: 0 },
            { content: 'Joining Live Session...', delay: 0.5 },
          ]}
        />
      );
    }

    return null;
  }, [currentSandbox, hasLogIn, error, isLoading]);

  // eslint-disable-next-line
  store.user; // Force observer call

  const content = getContent();

  if (content) {
    return (
      <Fullscreen>
        <Padding
          margin={1}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
          }}
        >
          <Navigation title="Live Session" />

          <Centered
            horizontal
            style={{ flex: 1, height: '100%', width: '100%' }}
            vertical
          >
            {content}
          </Centered>
        </Padding>
      </Fullscreen>
    );
  }

  return (
    <React.Fragment>
      <Editor match={match} />

      <QuickActions />
    </React.Fragment>
  );
};

export default observer(LivePage);
