import React from 'react';

import { Button } from '@codesandbox/common/lib/components/Button';
import { useSignals } from 'app/store';
import { Container } from '../LiveSessionEnded/elements';
import SignInButton from '../../SignInButton';
import { Heading, Explanation } from '../elements';
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
