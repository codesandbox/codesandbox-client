import React, { FunctionComponent } from 'react';
import { useActions } from 'app/overmind';
import { Alert } from '../Common/Alert';

export const SignInForTemplates: FunctionComponent = () => {
  const { modalClosed, toggleSignInModal } = useActions();

  return (
    <Alert
      title="Sign in to create templates"
      description="You can only create templates as a logged in user."
      onCancel={modalClosed}
      onPrimaryAction={() => toggleSignInModal()}
      confirmMessage="Sign in"
    />
  );
};
