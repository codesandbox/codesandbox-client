import React from 'react';

import ZeitLogo from 'app/components/ZeitLogo';

import Integration from './Integration';

export default () => (
  <div>
    <Integration
      name="ZEIT"
      color="black"
      description="Deployments"
      Icon={ZeitLogo}
    />
  </div>
);
