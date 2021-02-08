import React from 'react';
import { useOvermind } from 'app/overmind';
import Modal from 'app/components/Modal';
import { Alert } from '../Common/Alert';
import { MemberPaymentConfirmation } from '../MemberPaymentConfirmation';

export const AlertModalComponents = { MemberPaymentConfirmation };

export const GenericAlertModal = () => {
  const { state, actions } = useOvermind();
  const {
    title,
    message,
    type,
    isCurrent,
    customComponent,
  } = state.modals.alertModal;

  if (customComponent) {
    const Component = AlertModalComponents[customComponent];
    return (
      <Modal
        isOpen={isCurrent}
        width={450}
        onClose={() => actions.modals.alertModal.close(false)}
      >
        <Component title={title} />
      </Modal>
    );
  }

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
        type={type}
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
