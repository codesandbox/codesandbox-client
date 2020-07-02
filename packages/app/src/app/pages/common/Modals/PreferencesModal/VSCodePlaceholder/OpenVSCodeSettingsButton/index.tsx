import { Button } from '@codesandbox/components';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

export const OpenVSCodeSettingsButton: FunctionComponent = () => {
  const {
    actions: { modalClosed },
    effects: { vscode },
  } = useOvermind();

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
