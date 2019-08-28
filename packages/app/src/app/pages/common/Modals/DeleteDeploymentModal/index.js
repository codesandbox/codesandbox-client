import React from 'react';
import { Alert } from 'app/components/Alert';
import { inject, hooksObserver } from 'app/componentConnectors';

function DeleteDeploymentModal({ signals }) {
  return (
    <Alert
      title="Delete Deployment"
      body={<span>Are you sure you want to delete this Deployment?</span>}
      onCancel={() => signals.modalClosed()}
      onConfirm={() => signals.deployment.deleteDeployment()}
    />
  );
}

export default inject('signals')(hooksObserver(DeleteDeploymentModal));
