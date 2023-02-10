import React, { FunctionComponent } from 'react';

import { Integration } from 'app/components/Integration';
import { VercelLogo } from 'app/components/VercelLogo';
import { useAppState, useActions } from 'app/overmind';

type Props = {
  small?: boolean;
};
export const VercelIntegration: FunctionComponent<Props> = ({
  small = false,
}) => {
  const { user, isLoadingVercel } = useAppState();
  const { signInVercelClicked, signOutVercelClicked } = useActions();

  return (
    <Integration
      name="Vercel"
      small={small}
      description="Deployments"
      Icon={VercelLogo}
      userInfo={user.integrations.zeit}
      onSignIn={signInVercelClicked}
      onSignOut={signOutVercelClicked}
      loading={isLoadingVercel}
    />
  );
};
