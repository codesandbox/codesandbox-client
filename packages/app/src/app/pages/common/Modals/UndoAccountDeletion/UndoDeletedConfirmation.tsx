import { useActions } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import { Alert } from '../Common/Alert';

export const UndoAccountDeletionConfirmationModal: FunctionComponent = () => {
  const { modalClosed } = useActions();
  return (
    <Alert
      title="Request for account deletion undone"
      description={
        <>
          Thanks for sticking around. <br />
          Your account will not be deleted! <br />
        </>
      }
      onPrimaryAction={async () => {
        modalClosed();
      }}
      confirmMessage="Close"
    />
  );
};
