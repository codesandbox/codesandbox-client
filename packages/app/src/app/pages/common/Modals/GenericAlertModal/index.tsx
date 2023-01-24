import React from 'react';
import { useActions, useAppState } from 'app/overmind';
import Modal from 'app/components/Modal';
import { Alert } from '../Common/Alert';
import { MemberPaymentConfirmation } from '../MemberPaymentConfirmation';

export const AlertModalComponents = {
  MemberPaymentConfirmation,
};

export const GenericAlertModal = () => {
  const { alertModal } = useActions().modals;
  const {
    title,
    message,
    type,
    isCurrent,
    customComponent,
  } = useAppState().modals.alertModal;

  if (customComponent) {
    const Component = AlertModalComponents[customComponent];
    return (
      <Modal
        isOpen={isCurrent}
        width={450}
        onClose={() => alertModal.close(false)}
      >
        <Component title={title} />
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isCurrent}
      width={450}
      onClose={() => alertModal.close(false)}
    >
      <Alert
        title={title}
        description={message}
        confirmMessage="Confirm"
        type={type}
        cancelMessage="Cancel"
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
