import React from 'react';
import { inject, hooksObserver } from 'app/componentConnectors';

import ZeitLogo from 'app/components/ZeitLogo';
import Integration from 'app/components/Integration';

interface Props {
  small: boolean;
  store: any;
  signals: any;
}

const ZeitIntegration = inject('store', 'signals')(
  hooksObserver(
    ({
      small,
      signals: { signInZeitClicked, signOutZeitClicked },
      store: { user, isLoadingZeit },
    }: Props) => (
      <Integration
        name="ZEIT"
        small={small}
        color="black"
        description="Deployments"
        Icon={ZeitLogo}
        userInfo={user.integrations.zeit}
        signIn={signInZeitClicked}
        signOut={signOutZeitClicked}
        loading={isLoadingZeit}
      />
    )
  )
);

export default ZeitIntegration;
