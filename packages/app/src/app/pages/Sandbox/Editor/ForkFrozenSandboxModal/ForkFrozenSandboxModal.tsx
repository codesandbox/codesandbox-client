import Modal from 'app/components/Modal';
import { withTheme } from 'styled-components';
import { ThemeProvider, Stack, Text } from '@codesandbox/components';
import { Alert } from 'app/pages/common/Modals/Common/Alert';
import { useAppState, useActions } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import useKeyPressEvent from 'react-use/lib/useKeyPressEvent';
import ReturnIcon from 'react-icons/lib/md/keyboard-return';

const ModalContent: React.FC = () => {
  const {
    currentSandbox: { customTemplate },
  } = useAppState().editor;
  const { modals: modalsActions } = useActions();
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
    <Alert
      title={`Protected ${type}`}
      description={
        <>
          <p>
            This {type} is protected, which means you can’t make edits unless
            you fork it.
          </p>
          <p>
            Do you want to remove the protection for the {type} for this session
            or make a fork?
          </p>
        </>
      }
      onCancel={unlock}
      cancelMessage="Remove protection"
      onPrimaryAction={fork}
      confirmMessage={
        <Stack gap={2} align="center">
          <Text size={3}>Fork</Text>
          <ReturnIcon />
        </Stack>
      }
    />
  );
};

const ForkFrozenSandboxModalComponent: FunctionComponent<{ theme: any }> = ({
  theme,
}) => {
  const { modals } = useAppState();
  const { forkFrozenModal } = useActions().modals;

  return (
    <ThemeProvider theme={theme.vscodeTheme}>
      <Modal
        isOpen={modals.forkFrozenModal.isCurrent}
        width={450}
        onClose={() => forkFrozenModal.close('cancel')}
      >
        <ModalContent />
      </Modal>
    </ThemeProvider>
  );
};

export const ForkFrozenSandboxModal = withTheme(
  ForkFrozenSandboxModalComponent
);
