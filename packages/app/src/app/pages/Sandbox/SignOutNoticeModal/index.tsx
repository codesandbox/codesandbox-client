import Row from '@codesandbox/common/lib/components/flex/Row';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Button, Container, Explanation, Heading } from './elements';

export const SignOutNoticeModal: FunctionComponent = () => {
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
        <Button block onClick={() => modalClosed()} red>
          Close
        </Button>

        <Button block onClick={() => signInClicked({ useExtraScopes: false })}>
          Sign in
        </Button>
      </Row>
    </Container>
  );
};
