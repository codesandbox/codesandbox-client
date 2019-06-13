import React from 'react';
import { observer } from 'mobx-react-lite';

import Row from '@codesandbox/common/lib/components/flex/Row';
import { Button } from '@codesandbox/common/lib/components/Button';
import { useStore, useSignals } from 'app/store';
import { Container } from '../LiveSessionEnded/elements';
import { Heading, Explanation } from '../elements';
import { Close } from './elements';

const ForkFrozenSandboxModal = () => {
  const {
    editor: {
      currentSandbox: { customTemplate },
    },
  } = useStore();
  const { modalClosed, editor } = useSignals();

  return (
    <Container>
      <Close onClick={() => modalClosed()} />
      <Heading>Frozen Sandbox</Heading>
      <Explanation>
        This {customTemplate ? 'Template ' : 'Sandbox '} is frozen, do you want
        to unfreeze it for this session or fork it?
      </Explanation>
      <Row
        css={`
          margin-top: 1rem;
        `}
        justifyContent="space-between"
      >
        <Button
          small
          secondary
          onClick={() => {
            editor.sessionFreezeOverride({
              frozen: false,
            });
            modalClosed();
          }}
        >
          Allow edits
        </Button>
        <Button
          small
          danger
          onClick={() => {
            editor.forkSandboxOnDemand();
            modalClosed();
          }}
        >
          Fork
        </Button>
        <Button
          small
          onClick={() => {
            modalClosed();
          }}
        >
          Cancel
        </Button>
      </Row>
    </Container>
  );
};

export default observer(ForkFrozenSandboxModal);
