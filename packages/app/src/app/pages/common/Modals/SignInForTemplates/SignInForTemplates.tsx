import React from 'react';

import { useSignals } from 'app/store';

import SignInButton from '../../SignInButton';

import { Heading, Explanation } from '../elements';
import { Container } from '../LiveSessionEnded/elements';

import { Close, Buttons } from './elements';

export const SignInForTemplates = () => {
  const { modalClosed } = useSignals();

  return (
    <Container>
      <Close onClick={() => modalClosed()} />

      <Heading>Sign in to create templates</Heading>

      <Explanation>
        You can only create templates as a logged in user.
      </Explanation>

      <Buttons>
        <SignInButton />
      </Buttons>
    </Container>
  );
};
