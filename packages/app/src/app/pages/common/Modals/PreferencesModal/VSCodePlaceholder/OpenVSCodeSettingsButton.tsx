import { Button } from '@codesandbox/components';
import React, { FunctionComponent } from 'react';

import { useActions, useEffects } from 'app/overmind';

export const OpenVSCodeSettingsButton: FunctionComponent = () => {
  const { vscode } = useEffects();
  const { modalClosed } = useActions();

  const openCommand = () => {
    vscode
      .runCommand('workbench.action.openSettings2')
      .then(() => modalClosed());
  };

  return (
    <Button marginTop={4} onClick={openCommand} autoWidth>
      Open VSCode Settings
    </Button>
  );
};
