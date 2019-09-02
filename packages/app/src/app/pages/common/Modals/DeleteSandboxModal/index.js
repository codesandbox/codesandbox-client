import React from 'react';
import { Alert } from 'app/components/Alert';
import { inject, hooksObserver } from 'app/componentConnectors';

function DeleteSandboxModal({ signals }) {
  return (
    <Alert
      title="Delete Sandbox"
      body={<span>Are you sure you want to delete this sandbox?</span>}
      onCancel={() => signals.modalClosed()}
      onConfirm={() => signals.workspace.sandboxDeleted()}
    />
  );
}

export default inject('signals')(hooksObserver(DeleteSandboxModal));
