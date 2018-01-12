import React from 'react';
import { inject, observer } from 'mobx-react';

import ZeitLogo from 'app/components/ZeitLogo';
import Integration from 'app/components/Integration';

function ZeitIntegration({ store, signals, small }) {
  return (
    <Integration
      name="ZEIT"
      small={small}
      color="black"
      description="Deployments"
      Icon={ZeitLogo}
      userInfo={store.user.integrations.zeit}
      signIn={() => signals.signInZeitClicked()}
      signOut={() => signals.signOutZeitClicked()}
      loading={store.isLoadingZeit}
    />
  );
}

export default inject('store', 'signals')(observer(ZeitIntegration));
