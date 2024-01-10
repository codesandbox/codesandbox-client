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
  const { isLoadingGithub, user } = useAppState();
  const userInfo =
    user?.githubProfile.data && user?.integrations.github
      ? {
          ...user.githubProfile.data,
          email: user.integrations.github.email,
        }
      : undefined;

  return (
    <Integration
      description={small ? 'Commits & PRs' : 'Committing & Pull Requests'}
      Icon={GitHubLogo}
      loading={isLoadingGithub}
      name="GitHub"
      onSignIn={() => signInGithubClicked()}
      onSignOut={() => signOutGithubIntegration()}
      small={small}
      userInfo={userInfo}
    />
  );
};
