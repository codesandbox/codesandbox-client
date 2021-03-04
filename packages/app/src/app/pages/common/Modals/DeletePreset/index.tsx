import React, { FunctionComponent } from 'react';
import { useActions } from 'app/overmind';
import { Alert } from '../Common/Alert';

export const DeletePreset: FunctionComponent = () => {
  const { modalClosed, preview } = useActions();

  return (
    <Alert
      title="Delete Preset"
      description="Are you sure you want to to delete this preset?"
      onCancel={modalClosed}
      onPrimaryAction={() => {
        modalClosed();
        preview.deletePreset();
      }}
      confirmMessage="Delete"
      type="danger"
    />
  );
};
