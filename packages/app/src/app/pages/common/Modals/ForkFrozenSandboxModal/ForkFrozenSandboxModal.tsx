import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from '@codesandbox/common/lib/components/Button';
import { useStore, useSignals } from 'app/store';
import {
  Container,
  Title,
  Close,
  Actions,
  ForkButton,
  Unlock,
} from './elements';

export const ForkFrozenSandboxModal = observer(() => {
  const {
    editor: {
      currentSandbox: { customTemplate },
    },
  } = useStore();
  const { modalClosed, editor } = useSignals();
  const type = customTemplate ? 'template ' : 'sandbox ';

  return (
    <Container>
      <Close onClick={() => modalClosed()} />
      <Title>Frozen Sandbox</Title>
      <p>
        This {type} is frozen, which means you can{"'"}t make edits without
        unlocking it.
      </p>
      <p>Do you want to unlock the {type} for this session?</p>
      <Actions>
        <ForkButton
          onClick={() => {
            editor.forkSandboxOnDemand();
            modalClosed();
          }}
        >
          Fork
        </ForkButton>
        <Button
          small
          onClick={() => {
            editor.sessionFreezeOverride({
              frozen: false,
            });
            modalClosed();
          }}
        >
          <>
            Unlock
            <Unlock />
          </>
        </Button>
      </Actions>
    </Container>
  );
});
