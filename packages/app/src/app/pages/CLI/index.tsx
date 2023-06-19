import React, { FunctionComponent, useEffect, useState } from 'react';
import css from '@styled-system/css';
import { withTheme } from 'styled-components';
import { Element, ThemeProvider } from '@codesandbox/components';

import { useActions, useAppState } from 'app/overmind';
import { Container, Buttons, ContentContainer } from './elements';
import { PostToken } from './PostToken';
import { Prompt } from './Prompt';
import { Button } from '@codesandbox/components';

import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';

import { SignIn } from 'app/pages/SignIn/SignIn';
import { LogoFull } from '@codesandbox/common/lib/components/Logo';

export const CLI: FunctionComponent = withTheme(({ theme }) => {
  const {
    authToken,
    error,
    isLoadingAuthToken,
    user,
    isLoggedIn,
  } = useAppState();
  const actions = useActions();
  const postTokenToParent = window.location.search.includes('post=true');
  const [hasRequestedAuthorization, setHasRequestedAuthorization] = useState(
    false
  );

  useEffect(() => {
    // We want to reauthorize when we change logged in state
    if (isLoggedIn) {
      actions.internal.authorize();
      setHasRequestedAuthorization(true);
    }
  }, [isLoggedIn]);

  const render = () => {
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

    if (!user?.username) {
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
    }

    if (isLoadingAuthToken || !hasRequestedAuthorization) {
      return <Title>Fetching authorization key...</Title>;
    }

    return postTokenToParent ? (
      <PostToken authToken={authToken} />
    ) : (
      <Prompt authToken={authToken} />
    );
  };

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
          <ContentContainer>{render()}</ContentContainer>
        </Container>
      </Element>
    </ThemeProvider>
  );
});
