import { inject, hooksObserver } from 'app/componentConnectors';
import React from 'react';
import useKeyPressEvent from 'react-use/lib/useKeyPressEvent';
import { Button } from '@codesandbox/common/lib/components/Button';
import {
  Container,
  Title,
  Close,
  Actions,
  UnlockButton,
  Enter,
} from './elements';

export const ForkFrozenSandboxModal = inject('store', 'signals')(
  hooksObserver(
    ({
      store: {
        editor: {
          currentSandbox: { customTemplate },
        },
      },
      signals: { modalClosed, editor },
    }) => {
      const type = customTemplate ? 'template' : 'sandbox';

      const unlock = () => {
        editor.sessionFreezeOverride({
          frozen: false,
        });
        modalClosed();
      };

      const fork = (event?: { defaultPrevented: boolean }) => {
        if (event && !event.defaultPrevented) {
          editor.forkSandboxOnDemand();
          modalClosed();
        }
      };

      useKeyPressEvent('Enter', fork);

      return (
        <Container>
          <Close onClick={() => modalClosed()} />
          <Title>Frozen {customTemplate ? 'Template' : 'Sandbox'}</Title>
          <p>
            This {type} is frozen, which means you can’t make edits without
            unfreezing it.
          </p>
          <p>
            Do you want to unfreeze the {type} for this session or make a fork?
          </p>
          <Actions>
            <UnlockButton onClick={unlock}>Unfreeze</UnlockButton>
            <Button small onClick={fork}>
              Fork
              <Enter />
            </Button>
          </Actions>
        </Container>
      );
    }
  )
);
