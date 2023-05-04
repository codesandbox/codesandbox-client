import { useActions } from 'app/overmind';
import React, { FunctionComponent, useState } from 'react';
import { Alert } from '../Common/Alert';

export const UndoAccountDeletionModal: FunctionComponent = () => {
  const { modalClosed, dashboard } = useActions();

  const [loading, setLoading] = useState(false);

  return (
    <Alert
      title="Undo Account Deletion"
      description="Would you like to keep your account?"
      onCancel={modalClosed}
      onPrimaryAction={async () => {
        setLoading(true);
        await dashboard.undoDeleteAccount();
        setLoading(false);
      }}
      confirmMessage={loading ? 'Loading' : 'Confirm'}
      type="primary"
    />
  );
};
