import React, { FunctionComponent } from 'react';
import { useAppState, useActions } from 'app/overmind';
import { Alert } from '../Common/Alert';

import { permanentlyDeleteSandboxes } from '../../../Dashboard/queries';

export const EmptyTrash: FunctionComponent = () => {
  const { trashSandboxIds } = useAppState().dashboard;
  const { modalClosed } = useActions();

  return (
    <Alert
      title=" Empty Trash"
      description="Are you sure you want to permanently delete all the items in the trash?"
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
