import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { Alert } from 'app/components/Alert';

export const DeleteDeploymentModal: FunctionComponent = () => {
  const {
    actions: {
      modalClosed,
      deployment: { deleteDeployment },
    },
  } = useOvermind();

  return (
    <Alert
      title="Delete Deployment"
      body="Are you sure you want to delete this Deployment?"
      onCancel={() => modalClosed()}
      onConfirm={() => deleteDeployment()}
    />
  );
};
