import React from 'react';
import { observer } from 'mobx-react-lite';

import ZeitLogo from 'app/components/ZeitLogo';
import Integration from 'app/components/Integration';
import { useStore, useSignals } from 'app/store';

interface Props {
  small: boolean;
}

const ZeitIntegration = observer<Props>(({ small }) => {
  const { signInZeitClicked, signOutZeitClicked } = useSignals();
  const { user, isLoadingZeit } = useStore();

  return (
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
  );
});

export default ZeitIntegration;
