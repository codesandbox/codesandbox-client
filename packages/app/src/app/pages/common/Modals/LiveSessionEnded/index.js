import React from 'react';
import { Button } from '@codesandbox/common/lib/components/Button';
import Row from '@codesandbox/common/lib/components/flex/Row';
import { useOvermind } from 'app/overmind';
import { Container } from './elements';
import { Heading, Explanation } from '../elements';

const LiveModeEnded = () => {
  const { state, actions } = useOvermind();

  const suggestion = state.editor.currentSandbox.owned
    ? 'you can continue working on the current sandbox.'
    : 'you can continue working by forking the sandbox or by creating a new sandbox.';
  return (
    <Container>
      <Heading>The live session has ended</Heading>
      <Explanation css={{ marginBottom: '1rem' }}>
        {state.currentModalMessage || 'The session has ended due to inactivity'}
        , {suggestion}
      </Explanation>

      <Row justifyContent="space-around">
        <Button small href="/s">
          Create Sandbox
        </Button>

        {state.editor.currentSandbox.owned ? (
          <Button
            small
            onClick={() => {
              actions.modalClosed();
            }}
          >
            Close Modal
          </Button>
        ) : (
          <Button
            small
            onClick={() => {
              actions.editor.forkSandboxClicked();
              actions.modalClosed();
            }}
          >
            Fork Sandbox
          </Button>
        )}
      </Row>
    </Container>
  );
};

export default LiveModeEnded;
