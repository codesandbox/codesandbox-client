import * as React from 'react';
import { connect } from 'app/fluent';

import ZeitLogo from 'app/components/ZeitLogo';
import Integration from 'app/components/Integration';

export type Props = {
  small?: boolean
}

export default connect<Props>()
  .with(({ state, signals }) => ({
    zeitIntegration: state.user.integrations.zeit,
    isLoading: state.isLoadingZeit,
    signInZeitClicked: signals.signInZeitClicked,
    signOutZeitClicked: signals.signOutZeitClicked
  }))
  .to(
    function ZeitIntegration({ isLoading, zeitIntegration, small, signInZeitClicked, signOutZeitClicked }) {
      return (
        <Integration
          name="ZEIT"
          small={small}
          color="black"
          description="Deployments"
          Icon={ZeitLogo}
          userInfo={zeitIntegration}
          signIn={() => signInZeitClicked()}
          signOut={() => signOutZeitClicked()}
          loading={isLoading}
        />
      );
    }
  )
