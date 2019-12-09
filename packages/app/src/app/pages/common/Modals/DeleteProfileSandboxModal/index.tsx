import React, { FunctionComponent } from 'react';

import { Alert } from 'app/components/Alert';
import { useOvermind } from 'app/overmind';

export const DeleteProfileSandboxModal: FunctionComponent = () => {
  const {
    actions: {
      modalClosed,
      profile: { sandboxDeleted },
    },
  } = useOvermind();

  return (
    <Alert
      body="Are you sure you want to delete this sandbox?"
      onCancel={() => modalClosed()}
      onConfirm={() => sandboxDeleted()}
      title="Delete Sandbox"
    />
  );
};
