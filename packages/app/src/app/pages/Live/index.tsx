import css from '@styled-system/css';
import {
  ThemeProvider,
  Button,
  Text,
  Element,
  Stack,
} from '@codesandbox/components';
import codesandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GithubIcon from 'react-icons/lib/go/mark-github';
import { Link } from 'react-router-dom';

import Editor from '../Sandbox/Editor';

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
    if (!state.isAuthenticating && !state.user) {
      return (
        <>
          <Text weight="bold" size={6}>
            Sign in required
          </Text>
          <Text block marginTop={4} size={4}>
            You need to sign in to join this session
          </Text>
          <Element marginTop={4}>
            <Button
              onClick={() =>
                actions.live.signInToRoom({ roomId: match.params.id })
              }
              autoWidth
            >
              <Stack gap={2}>
                <GithubIcon /> <Text>Sign in with GitHub</Text>
              </Stack>
            </Button>
          </Element>
        </>
      );
    }

    if (state.live.error) {
      if (state.live.error === 'room not found') {
        return (
          <>
            <Text weight="bold" size={6}>
              Something went wrong
            </Text>
            <Text block marginTop={4} size={4}>
              It seems like this session doesn
              {"'"}t exist or has been closed
            </Text>
            <Link to="/s" css={css({ textDecoration: 'none' })}>
              <Button marginTop={5}>Create Sandbox</Button>
            </Link>
          </>
        );
      }

      return (
        <>
          <Text weight="bold" size={6}>
            An error occurred while connecting to the live session:
          </Text>
          <Text block marginTop={4} size={4}>
            {state.live.error}
          </Text>
          <Link to="/s" css={css({ textDecoration: 'none' })}>
            <Button marginTop={5}>Create Sandbox</Button>
          </Link>
        </>
      );
    }

    return null;
  }

  const content = getContent();

  if (content) {
    return (
      <ThemeProvider theme={codesandboxBlack}>
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
              direction="vertical"
              align="center"
              justify="center"
              css={css({ width: '100%', height: '100%' })}
            >
              {content}
            </Stack>
          </Element>
        </Element>
      </ThemeProvider>
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
    </>
  );
};
