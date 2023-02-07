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
      <MessageStripe.MultiActions
        onClick={() => signInGithubClicked('private_repos')}
        loading={isLoadingGithub}
        options={
          <MessageStripe.MultiActionsItem
            disabled={isLoadingGithub}
            onSelect={() => signInGithubClicked('public_repos')}
          >
            Access only public repositories
          </MessageStripe.MultiActionsItem>
        }
      >
        Access all repositories
      </MessageStripe.MultiActions>
    </MessageStripe>
  );
};
