import { Integration } from 'app/components/Integration';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import { GoMarkGithub } from 'react-icons/go';

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
      Icon={GoMarkGithub}
      loading={isLoadingGithub}
      name="GitHub"
      onSignIn={() => signInGithubClicked()}
      onSignOut={() => signOutGithubIntegration()}
      small={small}
      userInfo={github}
    />
  );
};
