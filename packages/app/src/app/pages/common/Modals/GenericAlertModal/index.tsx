import React from 'react';
import { useOvermind } from 'app/overmind';
import Modal from 'app/components/Modal';
import { Alert } from '../Common/Alert';

export const GenericAlertModal = () => {
  const { state, actions } = useOvermind();
  const { title, message, isCurrent } = state.modals.alertModal;

  return (
    <Modal
      isOpen={isCurrent}
      width={450}
      onClose={() => actions.modals.alertModal.close(false)}
    >
      <Alert
        title={title}
        description={message}
        confirmMessage="Confirm"
        cancelMessage="Cancel"
        onPrimaryAction={() => {
          actions.modals.alertModal.close(true);
        }}
        onCancel={() => {
          actions.modals.alertModal.close(false);
        }}
      />
    </Modal>
  );
};
