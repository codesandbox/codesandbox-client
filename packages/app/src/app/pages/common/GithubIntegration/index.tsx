import { observer } from 'mobx-react-lite';
import React from 'react';
import GithubLogo from 'react-icons/lib/go/mark-github';

import Integration from 'app/components/Integration';
import { useSignals, useStore } from 'app/store';

type Props = {
  small?: boolean;
};
const GithubIntegration = ({ small = false }: Props) => {
  const { signInGithubClicked, signOutGithubIntegration } = useSignals();
  const {
    isLoadingGithub,
    user: {
      integrations: { github },
    },
  } = useStore();

  return (
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
  );
};

export default observer(GithubIntegration);
