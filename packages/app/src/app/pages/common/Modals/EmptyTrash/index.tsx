import { Alert } from 'app/components/Alert';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import { permanentlyDeleteSandboxes } from '../../../Dashboard/queries';

const EmptyTrash: FunctionComponent = () => {
  const {
    state: {
      dashboard: { trashSandboxIds },
    },
    actions: { modalClosed },
  } = useOvermind();
  return (
    <Alert
      title="Empty Trash"
      body="Are you sure you want to permanently delete all the sandboxes in the trash?"
      onCancel={() => modalClosed()}
      onConfirm={async () => {
        await permanentlyDeleteSandboxes(trashSandboxIds);
        modalClosed();
      }}
    />
  );
};

export default EmptyTrash;
