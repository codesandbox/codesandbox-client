import * as React from 'react';
import Alert from 'app/components/Alert';
import { connect } from 'app/fluent';

export default connect()
  .with(({ signals }) => ({
    modalClosed: signals.modalClosed,
    sandboxDeleted: signals.workspace.sandboxDeleted
  }))
  .to(
    function DeleteSandboxModal({ modalClosed, sandboxDeleted }) {
      return (
        <Alert
          title="Delete Sandbox"
          body={<span>Are you sure you want to delete this sandbox?</span>}
          onCancel={() => modalClosed()}
          onDelete={() => sandboxDeleted()}
        />
      );
    }
  )
