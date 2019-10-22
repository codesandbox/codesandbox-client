import React from 'react';
import useKeyPressEvent from 'react-use/lib/useKeyPressEvent';
import { useOvermind } from 'app/overmind';
import { Button } from '@codesandbox/common/lib/components/Button';
import { Modal } from '@codesandbox/common/lib/components/Modal';
import {
  Actions,
  Close,
  Container,
  Enter,
  Title,
  UnlockButton,
} from './elements';

const ModalContent: React.FC = () => {
  const {
    state: {
      editor: {
        currentSandbox: { customTemplate },
      },
    },
    actions: { modals: modalsActions },
  } = useOvermind();
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
    <Container>
      <Close onClick={() => modalsActions.forkFrozenModal.close('cancel')} />
      <Title>Frozen {customTemplate ? 'Template' : 'Sandbox'}</Title>
      <p>
        This {type} is frozen, which means you can’t make edits without
        unfreezing it.
      </p>
      <p>Do you want to unfreeze the {type} for this session or make a fork?</p>
      <Actions>
        <UnlockButton onClick={unlock}>Unfreeze</UnlockButton>
        <Button small onClick={fork}>
          Fork
          <Enter />
        </Button>
      </Actions>
    </Container>
  );
};

export const ForkFrozenSandboxModal: React.FC = () => {
  const {
    state: { modals },
    actions: { modals: modalsActions },
  } = useOvermind();
  return (
    <Modal
      isOpen={modals.forkFrozenModal.isCurrent}
      onClose={() => modalsActions.forkFrozenModal.close('cancel')}
    >
      <ModalContent />
    </Modal>
  );
};
