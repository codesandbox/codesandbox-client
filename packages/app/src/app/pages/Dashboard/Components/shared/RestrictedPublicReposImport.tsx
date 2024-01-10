import { MessageStripe } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import React from 'react';

export const RestrictedPublicReposImport: React.FC<{
  onDismiss?: () => void;
}> = ({ onDismiss }) => {
  const { signInGithubClicked } = useActions();
  const { isLoadingGithub } = useAppState();

  return (
    <MessageStripe
      justify="space-between"
      onDismiss={onDismiss}
      variant="warning"
    >
      Adjust your GitHub permissions to access your repositories.
      <MessageStripe.Action
        disabled={isLoadingGithub}
        onClick={() => signInGithubClicked('public_repos')}
      >
        Allow public repositories
      </MessageStripe.Action>
      <MessageStripe.Action
        onClick={() => signInGithubClicked('private_repos')}
        disabled={isLoadingGithub}
      >
        Allow all repositories
      </MessageStripe.Action>
    </MessageStripe>
  );
};
