import React from 'react';
import Alert from 'app/components/Alert';
import { inject } from 'mobx-react';

function DeleteDeploymentModal({ signals }) {
  return (
    <Alert
      title="Delete Deployment"
      body={<span>Are you sure you want to delete this Deployment?</span>}
      onCancel={() => signals.modalClosed()}
      onDelete={() => signals.deployment.deleteDeployment()}
    />
  );
}

export default inject('signals')(DeleteDeploymentModal);
