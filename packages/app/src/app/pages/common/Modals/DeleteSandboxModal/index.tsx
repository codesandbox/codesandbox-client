import React, { FunctionComponent } from 'react';
import { useActions } from 'app/overmind';
import { Alert } from '../Common/Alert';

export const DeleteSandboxModal: FunctionComponent = () => {
  const {
    modalClosed,
    workspace: { sandboxDeleted },
  } = useActions();

  return (
    <Alert
      title="Archive Sandbox"
      description="Are you sure you want to archive this sandbox?"
      onCancel={modalClosed}
      onPrimaryAction={sandboxDeleted}
      confirmMessage="Archive"
      type="danger"
    />
  );
};
