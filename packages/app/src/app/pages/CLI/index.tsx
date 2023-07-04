import React, { FunctionComponent, useEffect, useState } from 'react';
import css from '@styled-system/css';
import { withTheme } from 'styled-components';
import { Element, ThemeProvider, Button } from '@codesandbox/components';

import { useActions, useAppState } from 'app/overmind';

import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';

import { SignIn } from 'app/pages/SignIn/SignIn';
import { LogoFull } from '@codesandbox/common/lib/components/Logo';
import { Prompt } from './Prompt';
import { PreviewToken } from './PreviewToken';
import { DevToken } from './DevToken';
import { Container, Buttons, ContentContainer } from './elements';

/**
 * This component renders the CLI token page. It has three modes:
 * - No queries: The user needs to copy paste the CLI token to some other place
 * - Preview: The CLI token is written to local storage so that the "same domain" inline preview devtool can read it from the iFrame
 * - Dev: Automatically post the CLI token to the parent frame, only available on stream where only CodeSandbox users are allowed
 */
const AuthorizedCLI: FunctionComponent = () => {
  const { authToken, error, isLoadingAuthToken, isLoggedIn } = useAppState();
  const actions = useActions();
  const previewToken = window.location.search.includes('preview=true');
  const devToken =
    window.location.search.includes('dev=true') &&
    window.location.origin === 'https://codesandbox.stream';

  useEffect(() => {
    // We want to reauthorize when we change logged in state. To properly identify, as
    // we might already be logged in with a token, we do not run this again if we already
    // have a token
    if (!authToken && isLoggedIn) {
      actions.internal.authorize();
    }
  }, [authToken, isLoggedIn]);

  if (error) {
    return (
      <>
        <LogoFull style={{ paddingBottom: 32 }} />

        <Title>An error occurred:</Title>
        <SubTitle>{error}</SubTitle>

        <Buttons>
          <Button
            autoWidth
            href="/?from-app=1"
            style={{
              fontSize: 16,
              height: 40,
              width: '100%',
              marginTop: '1rem',
            }}
          >
            Go to homepage
          </Button>
        </Buttons>
      </>
    );
  }

  if (isLoadingAuthToken) {
    return <Title>Fetching authorization key...</Title>;
  }

  if (authToken && devToken) {
    return <DevToken authToken={authToken} />;
  }

  if (authToken && previewToken) {
    return <PreviewToken authToken={authToken} />;
  }

  if (authToken) {
    return <Prompt authToken={authToken} />;
  }

  return (
    <>
      <LogoFull style={{ paddingBottom: 32 }} />
      <Title>
        Welcome to <br />
        CodeSandbox!
      </Title>

      <SubTitle style={{ paddingBottom: 16 }}>
        You need to sign in to use the CLI.
      </SubTitle>

      <SignIn />
    </>
  );
};

/**
 * This component does the initial authorization of the user, which leads to being logged in or not
 */
export const CLI: FunctionComponent = withTheme(({ theme }) => {
  const actions = useActions();

  // Because we need to run `authorize` (given we are logged in) before evaluating what to render,
  // we have to wait until the effect has run before showing any UI
  const [hasRunInitialAuthorization, setHasRunInitialAuthorization] = useState(
    false
  );

  useEffect(() => {
    actions.cliMounted().then(() => {
      setHasRunInitialAuthorization(true);
    });
  }, []);

  return (
    <ThemeProvider theme={theme.vsCode}>
      <Element
        css={css({
          width: '100vw',
          overflow: 'hidden',
          backgroundColor: 'sideBar.background',
        })}
      >
        <Container>
          <ContentContainer>
            {hasRunInitialAuthorization ? (
              <AuthorizedCLI />
            ) : (
              <>
                <LogoFull style={{ paddingBottom: 32 }} />
                <Title>
                  Welcome to <br />
                  CodeSandbox!
                </Title>

                <SubTitle style={{ paddingBottom: 16 }}>
                  Authorizing....
                </SubTitle>
              </>
            )}
          </ContentContainer>
        </Container>
      </Element>
    </ThemeProvider>
  );
});
