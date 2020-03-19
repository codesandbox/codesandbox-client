import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { Alert } from '../Common/Alert';

const DeleteSandboxModal: FunctionComponent = () => {
  const {
    actions: {
      modalClosed,
      workspace: { sandboxDeleted },
    },
  } = useOvermind();

  return (
    <Alert
      title="Delete Sandbox"
      description="Are you sure you want to delete this sandbox?"
      onCancel={modalClosed}
      onPrimaryAction={sandboxDeleted}
      confirmMessage="Delete"
      type="danger"
    />
  );
};

export default DeleteSandboxModal;
