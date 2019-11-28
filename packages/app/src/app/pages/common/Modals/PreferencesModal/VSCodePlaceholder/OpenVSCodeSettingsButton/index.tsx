import { Button } from '@codesandbox/common/lib/components/Button';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';
import { vscode } from 'app/vscode';

import { Container } from './elements';

export const OpenVSCodeSettingsButton: FunctionComponent = () => {
  const {
    actions: { modalClosed },
  } = useOvermind();

  const openCommand = () => {
    vscode
      .runCommand('workbench.action.openSettings2')
      .then(() => modalClosed());
  };

  return (
    <Container>
      <Button onClick={openCommand} small>
        Open VSCode Settings
      </Button>
    </Container>
  );
};
