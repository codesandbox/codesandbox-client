import React from 'react';
import { useOvermind } from 'app/overmind';

import { Button } from '@codesandbox/common/lib/components/Button';
import Row from '@codesandbox/common/lib/components/flex/Row';

import { Container, Heading, Explanation } from './elements';

export const SignOutNotice = () => {
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
        <Button
          block
          style={{ marginRight: '.5rem' }}
          red
          onClick={() => {
            modalClosed();
          }}
        >
          Close
        </Button>
        <Button
          block
          style={{ marginLeft: '.5rem' }}
          onClick={() => signInClicked({ useExtraScopes: false })}
        >
          Sign in
        </Button>
      </Row>
    </Container>
  );
};
