import React from 'react';
import Alert from 'app/components/Alert';
import { inject } from 'mobx-react';

function DeleteProfileSandboxModal({ signals }) {
  return (
    <Alert
      title="Delete Sandbox"
      body={<span>Are you sure you want to delete this sandbox?</span>}
      onCancel={() => signals.modalClosed()}
      onDelete={() => signals.profile.sandboxDeleted()}
    />
  );
}

export default inject('signals')(DeleteProfileSandboxModal);
