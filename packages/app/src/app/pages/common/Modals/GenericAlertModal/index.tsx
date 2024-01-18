import React from 'react';
import { useActions, useAppState } from 'app/overmind';
import Modal from 'app/components/Modal';
import { Alert } from '../Common/Alert';

export const AlertModalComponents = {};

export const GenericAlertModal = () => {
  const { alertModal } = useActions().modals;
  const {
    title,
    message,
    cancelMessage,
    confirmMessage,
    type,
    isCurrent,
  } = useAppState().modals.alertModal;

  return (
    <Modal
      isOpen={isCurrent}
      width={450}
      onClose={() => alertModal.close(false)}
    >
      <Alert
        title={title}
        description={message}
        confirmMessage={confirmMessage || 'Confirm'}
        type={type}
        cancelMessage={cancelMessage || 'Cancel'}
        onPrimaryAction={() => {
          alertModal.close(true);
        }}
        onCancel={() => {
          alertModal.close(false);
        }}
      />
    </Modal>
  );
};
