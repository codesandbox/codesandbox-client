import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { Alert } from 'app/components/Alert';

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

// eslint-disable-next-line import/no-default-export
export default DeleteDeploymentModal;
