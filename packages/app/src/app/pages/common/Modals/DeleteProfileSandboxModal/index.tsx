import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { Alert } from 'app/components/Alert';

const DeleteProfileSandboxModal: FunctionComponent = () => {
  const {
    actions: {
      modalClosed,
      profile: { sandboxDeleted },
    },
  } = useOvermind();

  return (
    <Alert
      title="Delete Sandbox"
      body="Are you sure you want to delete this sandbox?"
      onCancel={() => modalClosed()}
      onConfirm={() => sandboxDeleted()}
    />
  );
};

// eslint-disable-next-line import/no-default-export
export default DeleteProfileSandboxModal;
