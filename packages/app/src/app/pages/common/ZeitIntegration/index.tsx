import React, { FunctionComponent } from 'react';

import { Integration } from 'app/components/Integration';
import { ZeitLogo } from 'app/components/ZeitLogo';
import { useOvermind } from 'app/overmind';

type Props = {
  small: boolean;
};
export const ZeitIntegration: FunctionComponent<Props> = ({ small }) => {
  const {
    actions: { signInZeitClicked, signOutZeitClicked },
    state: { user, isLoadingZeit },
  } = useOvermind();

  return (
    <Integration
      name="ZEIT"
      small={small}
      bgColor="black"
      description="Deployments"
      Icon={ZeitLogo}
      userInfo={user.integrations.zeit}
      onSignIn={signInZeitClicked}
      onSignOut={signOutZeitClicked}
      loading={isLoadingZeit}
    />
  );
};
