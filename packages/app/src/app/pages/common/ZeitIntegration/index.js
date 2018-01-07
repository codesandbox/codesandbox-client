import React from 'react';
import { inject, observer } from 'mobx-react';

import ZeitLogo from 'app/components/ZeitLogo';
import Integration from 'app/components/Integration';

function ZeitIntegration({ store, signals }) {
  return (
    <Integration
      name="ZEIT"
      color="black"
      description="Deployments"
      Icon={ZeitLogo}
      userInfo={store.zeitInfo}
      signIn={() => signals.signInZeitClicked()}
      signOut={() => signals.signOutZeitClicked()}
      loading={store.isLoadingZeit}
    />
  );
}

export default inject('store', 'signals')(observer(ZeitIntegration));
