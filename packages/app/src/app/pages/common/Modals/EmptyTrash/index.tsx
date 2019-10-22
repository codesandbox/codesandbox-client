import React, { FunctionComponent } from 'react';

import { Alert } from 'app/components/Alert';
import { useOvermind } from 'app/overmind';

import { permanentlyDeleteSandboxes } from '../../../Dashboard/queries';

export const EmptyTrash: FunctionComponent = () => {
  const {
    actions: { modalClosed },
    state: {
      dashboard: { trashSandboxIds },
    },
  } = useOvermind();

  return (
    <Alert
      body="Are you sure you want to permanently delete all the sandboxes in the trash?"
      onCancel={() => modalClosed()}
      onConfirm={async () => {
        await permanentlyDeleteSandboxes(trashSandboxIds);

        modalClosed();
      }}
      title="Empty Trash"
    />
  );
};
