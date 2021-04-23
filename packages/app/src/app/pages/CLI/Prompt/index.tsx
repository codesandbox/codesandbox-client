import { Button } from '@codesandbox/components';
import React, { FunctionComponent, useRef } from 'react';

import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import { useAppState } from 'app/overmind';

import { SignInModalElement } from 'app/pages/SignIn/Modal';
import { Buttons, Container, TokenInput } from './elements';

export const Prompt: FunctionComponent = () => {
  const { authToken, error, isLoadingCLI, user } = useAppState();
  const tokenInputRef = useRef<HTMLInputElement>(null);

  if (error) {
    return (
      <Container>
        <Title>An error occured:</Title>

        <SubTitle>{error}</SubTitle>

        <Buttons>
          <Button autoWidth href="/?from-app=1">
            Go to homepage
          </Button>
        </Buttons>
      </Container>
    );
  }

  if (!user?.username) {
    return (
      <Container>
        <Title>Welcome to CodeSandbox!</Title>

        <SubTitle style={{ paddingBottom: 16 }}>
          You need to sign in to use the CLI.
        </SubTitle>

        <SignInModalElement />
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
      <Title>Hello {user.username}!</Title>

      <SubTitle>
        The CLI needs authorization to work.
        <br />
        Please paste the following code in the CLI:
      </SubTitle>

      <TokenInput
        onClick={() => tokenInputRef.current.select()}
        ref={tokenInputRef}
        value={authToken}
      />
    </Container>
  );
};
