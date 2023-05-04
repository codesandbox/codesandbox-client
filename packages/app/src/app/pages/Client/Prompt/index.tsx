import { Button } from '@codesandbox/components';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import { useAppState } from 'app/overmind';

import { SignInModalElement } from 'app/pages/SignIn/Modal';
import { LogoFull } from '@codesandbox/common/lib/components/Logo';
import { Buttons, Container } from './elements';

export const Prompt: FunctionComponent = () => {
  const { authToken, error, user } = useAppState();

  const [deepLink, setDeepLink] = useState('');

  useEffect(() => {
    setDeepLink(`codesandbox://auth-completion/?nonce=${authToken}`);
  }, [authToken]);

  if (error) {
    return (
      <Container>
        <LogoFull style={{ paddingBottom: 32 }} />

        <Title>An error occured:</Title>
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

        <SubTitle style={{ paddingBottom: 16 }}>You need to sign in.</SubTitle>

        <SignInModalElement />
      </Container>
    );
  }

  if (!authToken) {
    return (
      <Container>
        <LogoFull style={{ paddingBottom: 32 }} />
        <SubTitle>Fetching authorization key...</SubTitle>
      </Container>
    );
  }

  return (
    <Container>
      <LogoFull style={{ paddingBottom: 32 }} />

      <Title style={{ paddingBottom: 4 }}>
        Hello <br />
        {user.username}!
      </Title>

      <SubTitle>
        Click the button below to continue and finish signing in.
      </SubTitle>

      <Buttons>
        <Button
          as="a"
          autoWidth
          href={deepLink}
          style={{ fontSize: 16, height: 40, width: '100%', marginTop: '1rem' }}
        >
          Open play.js
        </Button>
      </Buttons>
    </Container>
  );
};
