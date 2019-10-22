import React, { FunctionComponent } from 'react';

import { Alert } from 'app/components/Alert';
import { useOvermind } from 'app/overmind';

export const DeleteDeploymentModal: FunctionComponent = () => {
  const {
    actions: {
      deployment: { deleteDeployment },
      modalClosed,
    },
  } = useOvermind();

  return (
    <Alert
      body="Are you sure you want to delete this Deployment?"
      onCancel={() => modalClosed()}
      onConfirm={() => deleteDeployment()}
      title="Delete Deployment"
    />
  );
};
