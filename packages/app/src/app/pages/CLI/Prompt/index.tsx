import { Button } from '@codesandbox/components';
import React, { FunctionComponent, useEffect, useRef } from 'react';

import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import { useActions, useAppState } from 'app/overmind';

import { SignIn } from 'app/pages/SignIn/SignIn';
import { LogoFull } from '@codesandbox/common/lib/components/Logo';
import { Buttons, Container, TokenInput } from './elements';

export const Prompt: FunctionComponent = () => {
  const {
    authToken,
    isLoadingAuthToken,
    error,
    isLoadingCLI,
    user,
    isLoggedIn,
  } = useAppState();
  const tokenInputRef = useRef<HTMLInputElement>(null);

  const actions = useActions();
  useEffect(() => {
    if (isLoggedIn && !authToken && !isLoadingAuthToken) {
      actions.internal.authorize();
    }
  }, [isLoggedIn]);

  if (error) {
    return (
      <Container>
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
      </Container>
    );
  }

  if (!user?.username) {
    return (
      <Container>
        <LogoFull style={{ paddingBottom: 32 }} />
        <Title>
          Welcome to <br />
          CodeSandbox!
        </Title>

        <SubTitle style={{ paddingBottom: 16 }}>
          You need to sign in to use the CLI.
        </SubTitle>

        <SignIn />
      </Container>
    );
  }

  if (isLoadingCLI) {
    return (
      <Container>
        <Title>Fetching authorization key...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <LogoFull style={{ paddingBottom: 32 }} />
      {/* <Title>Hello <br/>{user.username}!</Title> */}

      <SubTitle style={{ paddingBottom: 16 }}>
        The CLI needs authorization to work.
        <br />
        Please paste the following code in the CLI:
      </SubTitle>

      <TokenInput
        onClick={() => tokenInputRef.current.select()}
        ref={tokenInputRef}
        value={authToken}
        style={{ width: '100%' }}
      />
    </Container>
  );
};
