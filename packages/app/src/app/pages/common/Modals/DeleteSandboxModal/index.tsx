import React, { FunctionComponent } from 'react';

import { Alert } from 'app/components/Alert';
import { useOvermind } from 'app/overmind';

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
      body={<span>Are you sure you want to delete this sandbox?</span>}
      onCancel={() => modalClosed()}
      onConfirm={() => sandboxDeleted()}
    />
  );
};

export default DeleteSandboxModal;
