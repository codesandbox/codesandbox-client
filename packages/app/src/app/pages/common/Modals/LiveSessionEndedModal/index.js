import React from 'react';
import { inject } from 'mobx-react';

import Button from 'app/components/Button';
import Row from 'common/components/flex/Row';

import { Container, Heading, Explanation } from './elements';

function LiveModeEnded({ signals }) {
  return (
    <Container>
      <Heading>The Live session has ended</Heading>
      <Explanation>
        The host has ended the live session, you can continue working by forking
        the sandbox or by creating a new sandbox.
      </Explanation>

      <Row justifyContent="space-around">
        <Button href="/s">Create Sandbox</Button>
        <Button
          onClick={() => {
            signals.editor.forkSandboxClicked();
            signals.modalClosed();
          }}
        >
          Fork Sandbox
        </Button>
      </Row>
    </Container>
  );
}

export default inject('signals')(LiveModeEnded);
