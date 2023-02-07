import React, { FunctionComponent } from 'react';
import GitHubLogo from 'react-icons/lib/go/mark-github';

import { Integration } from 'app/components/Integration';
import { useAppState, useActions } from 'app/overmind';

type Props = {
  small?: boolean;
};
export const GithubIntegration: FunctionComponent<Props> = ({
  small = false,
}) => {
  const { signInGithubClicked, signOutGithubIntegration } = useActions();
  const {
    isLoadingGithub,
    user: {
      integrations: { github },
    },
  } = useAppState();

  return (
    <Integration
      description={small ? 'Commits & PRs' : 'Committing & Pull Requests'}
      Icon={GitHubLogo}
      loading={isLoadingGithub}
      name="GitHub"
      onSignIn={() => signInGithubClicked('private_repos')}
      onSignOut={() => signOutGithubIntegration()}
      small={small}
      userInfo={github}
    />
  );
};
