import { useOvermind } from 'app/overmind';
import React, { FunctionComponent, useState } from 'react';
import { Alert } from '../Common/Alert';

export const AccountDeletionModal: FunctionComponent = () => {
  const {
    actions: { modalClosed, dashboard },
  } = useOvermind();

  const [loading, setLoading] = useState(false);

  return (
    <Alert
      title="Account Deletion"
      description="Are you sure you want to delete your account?"
      onCancel={modalClosed}
      onPrimaryAction={async () => {
        setLoading(true);
        await dashboard.deleteAccount();
        setLoading(false);
      }}
      confirmMessage={loading ? 'Loading' : 'Delete'}
      type="danger"
    />
  );
};
