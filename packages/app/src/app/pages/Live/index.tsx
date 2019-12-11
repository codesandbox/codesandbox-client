import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import Helmet from 'react-helmet';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import Fullscreen from '@codesandbox/common/lib/components/flex/Fullscreen';

import { Title } from 'app/components/Title';
import { SubTitle } from 'app/components/SubTitle';
import { Skeleton } from 'app/components/Skeleton';
import { Navigation } from 'app/pages/common/Navigation';
import { SignInButton } from 'app/pages/common/SignInButton';
import { QuickActions } from 'app/pages/Sandbox/QuickActions';
import { hasAuthToken } from 'app/utils/user';

import Editor from '../Sandbox/Editor';
import { BlinkingDot } from './BlinkingDot';
import { Container, Wrapper, Content } from './elements';

export const LivePage: React.FunctionComponent<{ match: any }> = ({
  match,
}) => {
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
          <Container>Sign in required</Container>
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
            <Container>Something went wrong</Container>
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
        <Wrapper margin={1}>
          <Navigation title="Live Session" />
          <Content horizontal vertical>
            {content}
          </Content>
        </Wrapper>
      </Fullscreen>
    );
  }

  return (
    <>
      {currentSandbox && (
        // @ts-ignore
        <Helmet title={`${getSandboxName(currentSandbox)} - CodeSandbox`} />
      )}
      <Editor />
      <QuickActions />
    </>
  );
};
