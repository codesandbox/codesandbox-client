import { Button } from '@codesandbox/common/lib/components/Button';
import Row from '@codesandbox/common/lib/components/flex/Row';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Heading } from '../elements';

import { Container, Explanation } from './elements';

export const LiveSessionEnded: FunctionComponent = () => {
  const {
    actions: {
      editor: { forkSandboxClicked },
      modalClosed,
    },
    state: {
      currentModalMessage,
      editor: {
        currentSandbox: { owned },
      },
    },
  } = useOvermind();

  const suggestion = owned
    ? 'you can continue working on the current sandbox.'
    : 'you can continue working by forking the sandbox or by creating a new sandbox.';

  return (
    <Container>
      <Heading>The live session has ended</Heading>

      <Explanation>
        {currentModalMessage || 'The session has ended due to inactivity'},{' '}
        {suggestion}
      </Explanation>

      <Row justifyContent="space-around">
        <Button href="/s" small>
          Create Sandbox
        </Button>

        {owned ? (
          <Button onClick={() => modalClosed()} small>
            Close Modal
          </Button>
        ) : (
          <Button
            onClick={() => {
              forkSandboxClicked();

              modalClosed();
            }}
            small
          >
            Fork Sandbox
          </Button>
        )}
      </Row>
    </Container>
  );
};
