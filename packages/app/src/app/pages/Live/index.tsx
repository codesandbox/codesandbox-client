import CodeSandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { Element, Stack, ThemeProvider } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { FunctionComponent, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

import { useAppState, useActions } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';

import { Editor } from '../Sandbox/Editor';

import { Error } from './Error';
import { NotAuthenticated } from './NotAuthenticated';

export const Live: FunctionComponent = () => {
  const { onNavigateAway, roomJoined } = useActions().live;
  const {
    editor: { currentSandbox },
    isAuthenticating,
    live: { error },
    user,
  } = useAppState();
  const { roomId } = useParams<{ roomId: string }>();

  useEffect(() => {
    roomJoined(roomId);
  }, [roomJoined, roomId]);

  useEffect(() => () => onNavigateAway(), [onNavigateAway]);

  const getContent = () => {
    if (!isAuthenticating && !user) {
      return <NotAuthenticated />;
    }

    if (error) {
      return <Error />;
    }

    return null;
  };

  const content = getContent();
  if (content) {
    return (
      <ThemeProvider theme={CodeSandboxBlack}>
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
          <Element
            css={css({ width: '100%', height: '100vh', overflow: 'hidden' })}
          >
            <Navigation title="Live Session" />

            <Stack
              align="center"
              css={css({ width: '100%', height: '100%' })}
              direction="vertical"
              justify="center"
            >
              {content}
            </Stack>
          </Element>
        </Element>
      </ThemeProvider>
    );
  }

  return (
    <>
      {currentSandbox ? (
        <Helmet>
          <title>{getSandboxName(currentSandbox)} - CodeSandbox</title>
        </Helmet>
      ) : null}

      <Editor />
    </>
  );
};
