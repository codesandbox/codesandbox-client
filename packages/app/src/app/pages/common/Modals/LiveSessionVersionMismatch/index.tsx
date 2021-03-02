import React, { FunctionComponent } from 'react';
import { Alert } from '../Common/Alert';

export const LiveVersionMismatch: FunctionComponent = () => (
  <Alert
    title="Version Mismatch"
    description={
      "You are running an older version of CodeSandbox. Refresh to get the latest version. If refreshing doesn't work, you can try to clear your storage and unregister the service worker."
    }
  />
);
