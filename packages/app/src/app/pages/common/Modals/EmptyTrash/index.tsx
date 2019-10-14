import { Alert } from 'app/components/Alert';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import { permanentlyDeleteSandboxes } from '../../../Dashboard/queries';

const EmptyTrash: FunctionComponent = () => {
  const {
    state: { dashboard },
    actions: { modalClosed },
  } = useOvermind();

  return (
    <Alert
      title="Empty Trash"
      body={
        <span>
          Are you sure you want to permanently delete all the sandboxes in the
          trash?
        </span>
      }
      onCancel={() => modalClosed()}
      onConfirm={async () => {
        await permanentlyDeleteSandboxes(dashboard.trashSandboxIds);
        modalClosed();
      }}
    />
  );
};

export default EmptyTrash;
