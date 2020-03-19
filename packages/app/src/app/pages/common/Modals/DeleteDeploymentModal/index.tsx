import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { Alert } from '../Common/Alert';

export const DeleteDeploymentModal: FunctionComponent = () => {
  const {
    actions: {
      deployment: { deleteDeployment },
      modalClosed,
    },
  } = useOvermind();

  return (
    <Alert
      title="Delete Deployment"
      description="Are you sure you want to delete this deployment?"
      onCancel={modalClosed}
      onPrimaryAction={deleteDeployment}
      confirmMessage="Delete"
      type="danger"
    />
  );
};
