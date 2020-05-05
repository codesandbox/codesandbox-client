import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { Alert } from '../Common/Alert';

const SignInForTemplates: FunctionComponent = () => {
  const {
    actions: { modalClosed, signInClicked },
  } = useOvermind();

  return (
    <Alert
      title="Sign in to create templates"
      description="You can only create templates as a logged in user."
      onCancel={modalClosed}
      onPrimaryAction={() => signInClicked({})}
      confirmMessage="Sign in with GitHub"
    />
  );
};

export default SignInForTemplates;
