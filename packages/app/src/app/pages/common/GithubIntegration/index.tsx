import { inject, hooksObserver } from 'app/componentConnectors';
import React from 'react';
import GithubLogo from 'react-icons/lib/go/mark-github';

import Integration from 'app/components/Integration';

type Props = {
  small?: boolean;
  store: any;
  signals: any;
};
const GithubIntegration = inject('store', 'signals')(
  hooksObserver(
    ({
      small = false,
      signals: { signInGithubClicked, signOutGithubIntegration },
      store: {
        isLoadingGithub,
        user: {
          integrations: { github },
        },
      },
    }: Props) => (
      <Integration
        color="#4078c0"
        description={small ? 'Commits & PRs' : 'Committing & Pull Requests'}
        Icon={GithubLogo}
        loading={isLoadingGithub}
        name="GitHub"
        signIn={() => signInGithubClicked({ useExtraScopes: true })}
        signOut={signOutGithubIntegration}
        small={small}
        userInfo={github}
      />
    )
  )
);

export default GithubIntegration;
