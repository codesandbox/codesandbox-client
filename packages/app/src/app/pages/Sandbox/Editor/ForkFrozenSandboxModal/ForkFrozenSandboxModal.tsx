import { inject, hooksObserver } from 'app/componentConnectors';
import React from 'react';
import Modal from 'app/components/Modal';
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
        modals,
        editor: {
          currentSandbox: { customTemplate },
        },
      },
      signals: { modals: modalsActions, editor },
    }) => {
      const type = customTemplate ? 'template' : 'sandbox';

      const unlock = () => {
        modalsActions.forkFrozenModal.close('unfreeze');
      };

      const fork = (event?: { defaultPrevented: boolean }) => {
        if (event && !event.defaultPrevented) {
          modalsActions.forkFrozenModal.close('fork');
        }
      };

      useKeyPressEvent('Enter', fork);

      return (
        <Modal
          isOpen={modals.forkFrozenModal.isCurrent}
          width={450}
          onClose={() => modalsActions.forkFrozenModal.close()}
        >
          <Container>
            <Close
              onClick={() => modalsActions.forkFrozenModal.close('cancel')}
            />
            <Title>Frozen {customTemplate ? 'Template' : 'Sandbox'}</Title>
            <p>
              This {type} is frozen, which means you can’t make edits without
              unfreezing it.
            </p>
            <p>
              Do you want to unfreeze the {type} for this session or make a
              fork?
            </p>
            <Actions>
              <UnlockButton onClick={unlock}>Unfreeze</UnlockButton>
              <Button small onClick={fork}>
                Fork
                <Enter />
              </Button>
            </Actions>
          </Container>
        </Modal>
      );
    }
  )
);
