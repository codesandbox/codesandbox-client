import { Button } from '@codesandbox/common/lib/components/Button';
import Row from '@codesandbox/common/lib/components/flex/Row';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import { Explanation, Heading } from '../elements';
import { Container } from './elements';
export const LiveModeEnded: FunctionComponent = () => {
  const {
    state: {
      editor: {
        currentSandbox: { owned },
      },
      currentModalMessage,
    },
    actions: {
      modalClosed,
      editor: { forkSandboxClicked },
    },
  } = useOvermind();

  const suggestion = owned
    ? 'you can continue working on the current sandbox.'
    : 'you can continue working by forking the sandbox or by creating a new sandbox.';

  return (
    <Container>
      <Heading>The live session has ended</Heading>
      <Explanation style={{ marginBottom: '1rem' }}>
        {currentModalMessage || 'The session has ended due to inactivity'},{' '}
        {suggestion}
      </Explanation>

      <Row justifyContent="space-around">
        <Button small href="/s">
          Create Sandbox
        </Button>

        {owned ? (
          <Button
            small
            onClick={() => {
              modalClosed();
            }}
          >
            Close Modal
          </Button>
        ) : (
          <Button
            small
            onClick={() => {
              forkSandboxClicked();
              modalClosed();
            }}
          >
            Fork Sandbox
          </Button>
        )}
      </Row>
    </Container>
  );
};
