import React from 'react';
import { useOvermind } from 'app/overmind';
import { Alert } from 'app/components/Alert';

export const DeleteDeploymentModal: React.FC = () => {
  const { actions } = useOvermind();
  return (
    <Alert
      title="Delete Deployment"
      body="Are you sure you want to delete this Deployment?"
      onCancel={() => actions.modalClosed()}
      onConfirm={() => actions.deployment.deleteDeployment()}
    />
  );
};
