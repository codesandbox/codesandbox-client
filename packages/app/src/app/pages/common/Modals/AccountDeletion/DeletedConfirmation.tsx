import { useActions } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import { Alert } from '../Common/Alert';

export const AccountDeletionConfirmationModal: FunctionComponent = () => {
  const { modalClosed, signOutClicked } = useActions();

  return (
    <Alert
      title="Request for account deletion sent"
      description={
        <>
          Thanks for your request. <br />
          Your account will be deleted within 3 working days. <br />
          <br />
          If you{"'"}ve changed your mind, please email us at{' '}
          <a href="mailto:support@codesandbox.io">support@codesandbox.io</a>{' '}
          with your username.
        </>
      }
      onPrimaryAction={async () => {
        await signOutClicked();

        modalClosed();
      }}
      confirmMessage="Close"
    />
  );
};
