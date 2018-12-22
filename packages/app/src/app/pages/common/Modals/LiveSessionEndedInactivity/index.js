import React from 'react';
import { inject } from 'mobx-react';

import Button from 'app/components/Button';
import Row from 'common/components/flex/Row';

import { Container } from './elements';
import { Heading, Explanation } from '../elements';

function LiveModeEnded({ signals }) {
  return (
    <Container>
      <Heading>The Live session has ended</Heading>
      <Explanation css={{ marginBottom: '1rem' }}>
        The session has ended due to inactivity, you can continue working by
        forking the sandbox or by creating a new sandbox.
      </Explanation>

      <Row justifyContent="space-around">
        <Button small href="/s">
          Create Sandbox
        </Button>
        <Button
          small
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
