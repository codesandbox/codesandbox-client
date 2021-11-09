import { Button } from '@codesandbox/components';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import { useAppState } from 'app/overmind';

import { SignInModalElement } from 'app/pages/SignIn/Modal';
import { Buttons, Container } from './elements';
import Logo from '../../../logo.svg';

export const Prompt: FunctionComponent = () => {
  const { authToken, error, user } = useAppState();

  const [deepLink, setDeepLink] = useState('');

  useEffect(() => {
    const deeplinkUrl = `vscode://CodeSandbox.codesandbox/auth-completion?token=${authToken}`;

    if (authToken) {
      setDeepLink(deeplinkUrl);
      window.open(deeplinkUrl);
    }
  }, [authToken]);

  if (error) {
    return (
      <Container>
        <img
          src={Logo}
          width="32"
          alt="CodeSandbox Logo"
          style={{ paddingBottom: 32 }}
        />

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
        <img
          src={Logo}
          width="32"
          alt="CodeSandbox Logo"
          style={{ paddingBottom: 32 }}
        />
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
        <img
          src={Logo}
          width="32"
          alt="CodeSandbox Logo"
          style={{ paddingBottom: 32 }}
        />
        <SubTitle>Fetching authorization key...</SubTitle>
      </Container>
    );
  }

  return (
    <Container>
      <img
        src={Logo}
        width="32"
        alt="CodeSandbox Logo"
        style={{ paddingBottom: 32 }}
      />

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
          Open VSCode
        </Button>
      </Buttons>
    </Container>
  );
};
