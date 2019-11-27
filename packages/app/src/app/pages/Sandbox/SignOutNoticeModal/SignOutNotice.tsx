import React from 'react';
import { useOvermind } from 'app/overmind';
import Row from '@codesandbox/common/lib/components/flex/Row';
import { Container, Heading, Explanation, Close, SignIn } from './elements';

export const SignOutNotice: React.FC = () => {
  const {
    actions: { modalClosed, signInClicked },
  } = useOvermind();

  return (
    <Container>
      <Heading>You have been signed out</Heading>
      <Explanation>
        CodeSandbox has migrated to a system where authorization tokens can be
        managed and revoked, and we had to sign everyone out for this.
        <br />
        <br />
        But don
        {"'"}t worry, you can sign in right again!
      </Explanation>

      <Row justifyContent="space-around">
        <Close
          red
          onClick={() => {
            modalClosed();
          }}
        >
          Close
        </Close>
        <SignIn onClick={() => signInClicked({ useExtraScopes: false })}>
          Sign in
        </SignIn>
      </Row>
    </Container>
  );
};
