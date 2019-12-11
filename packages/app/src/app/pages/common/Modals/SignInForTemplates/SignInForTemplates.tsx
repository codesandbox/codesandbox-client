import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { SignInButton } from '../../SignInButton';
import { Heading, Explanation } from '../elements';
import { Container } from '../LiveSessionEnded/elements';

import { Close, Buttons } from './elements';

export const SignInForTemplates: FunctionComponent = () => {
  const {
    actions: { modalClosed },
  } = useOvermind();

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
