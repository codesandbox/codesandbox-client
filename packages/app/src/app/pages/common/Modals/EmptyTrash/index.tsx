import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { Alert } from '../Common/Alert';

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
      title=" Empty Trash"
      description="Are you sure you want to permanently delete all the sandboxes in the trash?"
      onCancel={modalClosed}
      onPrimaryAction={async () => {
        await permanentlyDeleteSandboxes(trashSandboxIds);

        modalClosed();
      }}
      confirmMessage="Delete"
      type="danger"
    />
  );
};
