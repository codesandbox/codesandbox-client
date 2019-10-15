import { Alert } from 'app/components/Alert';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

const DeleteDeploymentModal: FunctionComponent = () => {
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

export default DeleteDeploymentModal;
