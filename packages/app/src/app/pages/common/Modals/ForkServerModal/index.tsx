import getTemplateDefinition from '@codesandbox/common/lib/templates';
import React, { FunctionComponent, useEffect } from 'react';

import { useAppState, useActions } from 'app/overmind';
import { Alert } from '../Common/Alert';

export const ForkServerModal: FunctionComponent = () => {
  const {
    editor: { forkSandboxClicked },
    modalClosed,
    toggleSignInModal,
  } = useActions();
  const {
    editor: {
      currentSandbox: { template },
    },
    isLoggedIn,
  } = useAppState();

  useEffect(() => {
    // Which means that the user signed in in the meantime with the intention to fork
    if (isLoggedIn) {
      forkSandboxClicked({});

      modalClosed();
    }
  }, [forkSandboxClicked, isLoggedIn, modalClosed]);

  const { niceName } = getTemplateDefinition(template);

  return (
    <Alert
      title={`Fork ${niceName} Sandbox`}
      description={`We execute ${niceName} sandboxes in a server container. This is still in beta, so we require you to sign in before you can fork a ${niceName}${' '} sandbox.`}
      onPrimaryAction={() => toggleSignInModal()}
      confirmMessage="Sign in"
    />
  );
};
