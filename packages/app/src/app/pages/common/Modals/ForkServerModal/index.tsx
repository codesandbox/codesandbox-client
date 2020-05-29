import getTemplateDefinition from '@codesandbox/common/es/templates';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent, useEffect } from 'react';

import { Alert } from '../Common/Alert';

export const ForkServerModal: FunctionComponent = () => {
  const {
    actions: {
      editor: { forkSandboxClicked },
      modalClosed,
      signInClicked,
    },
    state: {
      editor: {
        currentSandbox: { template },
      },
      isLoggedIn,
    },
  } = useOvermind();

  useEffect(() => {
    // Which means that the user signed in in the meantime with the intention to fork
    if (isLoggedIn) {
      forkSandboxClicked();

      modalClosed();
    }
  }, [forkSandboxClicked, isLoggedIn, modalClosed]);

  const { niceName } = getTemplateDefinition(template);

  return (
    <Alert
      title={`Fork ${niceName} Sandbox`}
      description={`We execute ${niceName} sandboxes in a server container. This is still in beta, so we require you to sign in before you can fork a ${niceName}${' '} sandbox.`}
      onPrimaryAction={() => signInClicked()}
      confirmMessage="Sign in with GitHub"
    />
  );
};
