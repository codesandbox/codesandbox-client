import { Button } from '@codesandbox/components';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import { useAppState } from 'app/overmind';

import { SignInModalElement } from 'app/pages/SignIn/Modal';
import { Buttons, Container } from './elements';

export const Prompt: FunctionComponent = () => {
  const { authToken, error, isLoadingCLI, user } = useAppState();

  const [deepLink, setDeepLink] = useState('');

  useEffect(() => {
    setDeepLink(`codesandbox://auth-completion/?nonce=${authToken}`);
  }, [authToken]);

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

        <SubTitle style={{ paddingBottom: 16 }}>You need to sign in.</SubTitle>

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
        <br />
        Click the button below to continue and finish signing in.
      </SubTitle>

      <Buttons>
        <Button
          as="a"
          autoWidth
          href={deepLink}
          style={{ fontSize: 13, height: 40 }}
        >
          Open Client
        </Button>
      </Buttons>
    </Container>
  );
};
