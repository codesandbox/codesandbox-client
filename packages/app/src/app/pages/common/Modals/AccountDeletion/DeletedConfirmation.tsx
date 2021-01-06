import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import { Alert } from '../Common/Alert';

export const AccountDeletionConfirmationModal: FunctionComponent = () => {
  const {
    actions: { modalClosed, signOutClicked },
  } = useOvermind();

  return (
    <Alert
      title="Request for account deletion sent"
      description="Your account will be deleted by our support team in one working day."
      onPrimaryAction={async () => {
        await signOutClicked();

        modalClosed();
      }}
      confirmMessage="Close"
    />
  );
};
