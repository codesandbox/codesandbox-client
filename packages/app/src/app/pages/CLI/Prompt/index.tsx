import { Button } from '@codesandbox/common/lib/components/Button';
import React, { FunctionComponent, useRef } from 'react';

import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import { useOvermind } from 'app/overmind';

import { Buttons, Container, TokenInput } from './elements';

export const Prompt: FunctionComponent = () => {
  const {
    actions: { signInCliClicked },
    state: { authToken, error, isLoadingCLI, user },
  } = useOvermind();
  const tokenInputRef = useRef<HTMLInputElement>(null);

  if (error) {
    return (
      <Container>
        <Title>An error occured:</Title>

        <SubTitle>{error}</SubTitle>

        <Buttons>
          <Button href="/?from-app=1">Go to homepage</Button>
        </Buttons>
      </Container>
    );
  }

  if (!user?.username) {
    return (
      <Container>
        <Title>Welcome to CodeSandbox!</Title>

        <SubTitle>
          You need to sign in with your GitHub account to use the CLI.
        </SubTitle>

        <Buttons>
          <Button onClick={() => signInCliClicked()}>
            Sign in with GitHub
          </Button>
        </Buttons>
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
