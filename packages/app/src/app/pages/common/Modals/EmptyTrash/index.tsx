import React, { FunctionComponent } from 'react';
import { useAppState, useActions } from 'app/overmind';
import { Alert } from '../Common/Alert';

export const EmptyTrash: FunctionComponent = () => {
  const { trashSandboxIds } = useAppState().dashboard;
  const { modalClosed, dashboard } = useActions();

  return (
    <Alert
      title=" Empty Trash"
      description="Are you sure you want to permanently delete all the items in the trash?"
      onCancel={modalClosed}
      onPrimaryAction={async () => {
        await dashboard.permanentlyDeleteSandboxes(trashSandboxIds);

        modalClosed();
      }}
      confirmMessage="Delete"
      type="danger"
    />
  );
};
