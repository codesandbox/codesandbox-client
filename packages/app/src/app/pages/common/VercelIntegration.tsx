import React, { FunctionComponent } from 'react';

import { Integration } from 'app/components/Integration';
import { VercelLogo } from 'app/components/VercelLogo';
import { useOvermind } from 'app/overmind';

type Props = {
  small?: boolean;
};
export const VercelIntegration: FunctionComponent<Props> = ({
  small = false,
}) => {
  const {
    actions: { signInVercelClicked, signOutVercelClicked },
    state: { user, isLoadingVercel },
  } = useOvermind();

  return (
    <Integration
      name="Vercel"
      small={small}
      bgColor="black"
      description="Deployments"
      Icon={VercelLogo}
      userInfo={user.integrations.zeit}
      onSignIn={signInVercelClicked}
      onSignOut={signOutVercelClicked}
      loading={isLoadingVercel}
    />
  );
};
