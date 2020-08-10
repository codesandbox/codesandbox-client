import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { Alert } from '../Common/Alert';

const SignInForTemplates: FunctionComponent = () => {
  const {
    actions: { modalClosed, toggleSignInModal },
  } = useOvermind();

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

export default SignInForTemplates;
