import { Stack, Text, ThemeProvider } from '@codesandbox/components';
import Modal from 'app/components/Modal';
import { useOvermind } from 'app/overmind';
import { Alert } from 'app/pages/common/Modals/Common/Alert';
import React, { FunctionComponent } from 'react';
import { MdKeyboardReturn } from 'react-icons/md';
import useKeyPressEvent from 'react-use/lib/useKeyPressEvent';
import { withTheme } from 'styled-components';

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
    <Alert
      title={`Frozen ${customTemplate ? 'Template' : 'Sandbox'}`}
      description={
        <>
          <p>
            This {type} is frozen, which means you can’t make edits without
            unfreezing it.
          </p>
          <p>
            Do you want to unfreeze the {type} for this session or make a fork?
          </p>
        </>
      }
      onCancel={unlock}
      cancelMessage="Unfreeze"
      onPrimaryAction={fork}
      confirmMessage={
        <Stack gap={2} align="center">
          <Text size={3}>Fork</Text>
          <MdKeyboardReturn />
        </Stack>
      }
    />
  );
};

const ForkFrozenSandboxModalComponent: FunctionComponent<{ theme: any }> = ({
  theme,
}) => {
  const {
    state: { modals },
    actions: { modals: modalsActions },
  } = useOvermind();

  return (
    <ThemeProvider theme={theme.vscodeTheme}>
      <Modal
        isOpen={modals.forkFrozenModal.isCurrent}
        width={450}
        onClose={() => modalsActions.forkFrozenModal.close('cancel')}
      >
        <ModalContent />
      </Modal>
    </ThemeProvider>
  );
};

export const ForkFrozenSandboxModal = withTheme(
  ForkFrozenSandboxModalComponent
);
