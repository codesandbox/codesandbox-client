import React from 'react';
import { inject, hooksObserver } from 'app/componentConnectors';

import SignInButton from '../../SignInButton';
import { Heading, Explanation } from '../elements';
import { Container } from '../LiveSessionEnded/elements';
import { Close, Buttons } from './elements';

export const SignInForTemplates = inject('signals')(
  hooksObserver(({ signals: { modalClosed } }) => (
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
  ))
);
