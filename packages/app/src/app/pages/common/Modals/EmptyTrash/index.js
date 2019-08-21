import React from 'react';
import { Alert } from 'app/components/Alert';
import { inject } from 'app/componentConnectors';
import { permanentlyDeleteSandboxes } from '../../../Dashboard/queries';

function EmptyTrash({ signals, store }) {
  return (
    <Alert
      title="Empty Trash"
      body={
        <span>
          Are you sure you want to permanently delete all the sandboxes in the
          trash?
        </span>
      }
      onCancel={() => signals.modalClosed()}
      onDelete={async () => {
        await permanentlyDeleteSandboxes(store.dashboard.trashSandboxIds);
        signals.modalClosed();
      }}
    />
  );
}

export default inject('signals', 'store')(EmptyTrash);
