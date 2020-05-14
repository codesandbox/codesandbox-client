import React, { FunctionComponent } from 'react';
import GitHubLogo from 'react-icons/lib/go/mark-github';

import { Integration } from 'app/components/Integration';
import { useOvermind } from 'app/overmind';

type Props = {
  small?: boolean;
};
export const GithubIntegration: FunctionComponent<Props> = ({
  small = false,
}) => {
  const {
    actions: { signInGithubClicked, signOutGithubIntegration },
    state: {
      isLoadingGithub,
      user: {
        integrations: { github },
      },
    },
  } = useOvermind();

  return (
    <Integration
      bgColor="#0971f1"
      description={small ? 'Commits & PRs' : 'Committing & Pull Requests'}
      Icon={GitHubLogo}
      loading={isLoadingGithub}
      name="GitHub"
      onSignIn={() => signInGithubClicked()}
      onSignOut={() => signOutGithubIntegration()}
      small={small}
      userInfo={github}
    />
  );
};
